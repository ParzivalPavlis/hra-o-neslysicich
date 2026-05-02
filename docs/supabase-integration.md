# Supabase Integrace

Popis toho, jak aplikace **Hra o neslyšících** komunikuje se Supabase databází.

---

## Dva Supabase klienti

Aplikace používá dva klienty, každý pro jiný kontext:

### 1. SSR klient – `src/hooks.server.ts`

Vytváří se při **každém HTTP requestu** pomocí `createServerClient()` z `@supabase/ssr`. Čte a zapisuje session do **HTTP cookies** – nezbytné pro SvelteKit SSR. Uloží se do `event.locals.supabase` a odtud ho přebírají všechny server-side funkce (load funkce, form actions, API routy).

```typescript
const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
  cookies: {
    getAll: () => event.cookies.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach(({ name, value, options }) =>
        event.cookies.set(name, value, { ...options, path: '/' })
      )
    }
  }
})
event.locals.supabase = supabase
```

### 2. Admin klient – `src/lib/server/supabase/index.ts`

Statický singleton s `SERVICE_ROLE_KEY`. Obchází Row Level Security. Používá se jen pro inicializaci herního postupu při registraci a Google OAuth, kde ještě neexistuje session kontext.

```typescript
export const supabaseAdmin = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})
```

---

## Request lifecycle

Každý HTTP request projde dvěma hooks zřetězenými přes `sequence()`:

```
HTTP Request
  │
  ├─ supabaseHandle  →  createServerClient() z cookies → event.locals.supabase
  └─ authGuard       →  safeGetSession() → event.locals.session + event.locals.user
                                         → redirect(302, '/login') pokud není session
```

`safeGetSession()` dekóduje JWT z cookie a vrátí `{ session, user }` nebo `{ null, null }`.

---

## Chráněné vs. veřejné routy

| Chráněné (vyžadují přihlášení) | Veřejné                               |
| ------------------------------ | ------------------------------------- |
| `/levels`, `/profile`          | `/login`, `/register`                 |
| `/api/*`                       | `/forgot-password`, `/reset-password` |
|                                | `/api/v1/auth/*`                      |

---

## Autentizace

### Email / heslo

```
POST /login     →  signInWithPassword({ email, password })  →  redirect /levels
POST /register  →  signUp({ email, password })              →  initializeGameProgress()
```

### Google OAuth

```
POST /login?/loginWithGoogle
  →  signInWithOAuth({ provider: 'google', redirectTo: '/api/v1/auth/callback' })
  →  GET /api/v1/auth/callback?code=<code>
  →  exchangeCodeForSession(code)
  →  initializeGameProgress()
  →  redirect /levels
```

### Reset hesla

```
POST /forgot-password  →  resetPasswordForEmail(email, { redirectTo: '/reset-password' })
GET  /reset-password   →  exchangeCodeForSession(code)
POST /reset-password   →  updateUser({ password })  →  signOut()  →  redirect /login
```

### Odhlášení

```
POST /api/v1/auth/logout  →  signOut()
```

---

## Databáze

### Schéma – jediná tabulka `game_progress`

```sql
game_progress (
  id          bigint PRIMARY KEY,
  user_id     text UNIQUE REFERENCES auth.users(id),
  progress    jsonb,
  created_at  timestamptz
)
```

### Struktura `progress` (JSONB sloupec)

```typescript
{
  levels: {
    level1: { stars: 0|1|2|3, locked: boolean, played?: boolean, lastPlayed?: boolean }
    level2: { ... }
    // ... level3 až level7
  }
}
```

**Výchozí stav po registraci:**

- Levely 1, 3, 4, 5 – odemknuté
- Levely 2, 6, 7 – zamknuté
- Level 1 – `lastPlayed: true`

### Databázové operace – `src/lib/server/services.ts`

Všechny operace fungují jako **read-modify-write**:

1. `getGameProgress()` – načte aktuální JSON z DB
2. Upraví objekt v paměti
3. `updateGameProgress()` – uloží zpět přes `upsert()`

| Funkce                                              | Popis                                                       |
| --------------------------------------------------- | ----------------------------------------------------------- |
| `initializeGameProgress(userId)`                    | Vytvoří výchozí záznam (`upsert` s `onConflict: 'user_id'`) |
| `getGameProgress(userId, client)`                   | Načte celý progress JSON                                    |
| `getLevelProgress(userId, level, client)`           | Vrátí data jednoho levelu                                   |
| `getLastPlayedLevel(userId, client)`                | Najde level s `lastPlayed === true`                         |
| `updateLevelProgress(userId, level, attrs, client)` | Aktualizuje atributy jednoho levelu                         |
| `setPlayedLevel(userId, level, client)`             | Nastaví `played: true`                                      |
| `setLastPlayedLevel(userId, level, client)`         | Nastaví `lastPlayed: true`, ostatním smaže                  |
| `unlockLevel(userId, level, client)`                | Nastaví `locked: false`                                     |

---

## Proměnné prostředí

| Proměnná                          | Klient      | Účel                       |
| --------------------------------- | ----------- | -------------------------- |
| `PUBLIC_SUPABASE_URL`             | oba klienti | URL Supabase projektu      |
| `PUBLIC_SUPABASE_PUBLISHABLE_KEY` | SSR (hooks) | Session přes cookies       |
| `SUPABASE_SECRET_KEY`             | admin       | Obejití RLS, admin operace |

---

## Typová bezpečnost

Supabase generuje TypeScript typy přímo ze schématu. Typy jsou v `src/lib/types/supabase/index.ts`.

```typescript
// App.Locals – dostupné v každém server-side kontextu
interface Locals {
  supabase: SupabaseClient<Database>
  safeGetSession(): Promise<{ session: Session | null; user: User | null }>
  session: Session | null
  user: User | null
}
```

---

## Klíčové soubory

| Soubor                             | Popis                                 |
| ---------------------------------- | ------------------------------------- |
| `src/hooks.server.ts`              | Inicializace SSR klienta + auth guard |
| `src/lib/server/auth-guard.ts`     | Ochrana rout, `safeGetSession()`      |
| `src/lib/server/services.ts`       | Všechny DB operace                    |
| `src/lib/server/supabase/index.ts` | Admin klient                          |
| `src/app.d.ts`                     | Typy pro `App.Locals`                 |
| `src/lib/types/supabase/`          | Generované Supabase typy              |
| `src/routes/(auth)/`               | Login, registrace, reset hesla        |
| `src/routes/api/v1/auth/`          | OAuth callback, odhlášení             |
