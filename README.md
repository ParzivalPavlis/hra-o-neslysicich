# Deafio - Educational Game

**Deafio** is an interactive educational game built to teach players about deaf communication and culture through engaging mini-games and quizzes. The game features multiple levels with increasing difficulty, character interactions, and progress tracking.

## About the Project

Deafio is designed to help users learn and understand deaf perspectives through gamified learning experiences. Players progress through 6 levels, each with themed questions and conversations, earning stars based on their performance.

### Features

- 🎮 **Multi-level gameplay** - 6 progressive levels with increasing difficulty
- 👥 **Character interactions** - Animated characters guide players through conversations
- 🎯 **Quiz system** - Interactive multiple-choice questions with immediate feedback
- 💾 **Progress tracking** - User accounts with password reset and authentication
- 📊 **Star rating system** - Achievement-based progression (1-3 stars per level)
- 🎨 **Responsive design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Svelte 5 with SvelteKit
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository

```sh
git clone <repository-url>
cd hra-o-neslysicich
```

2. Install dependencies

```sh
npm install
```

3. Set up environment variables
   Create a `.env.local` file with your Supabase credentials:

```
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key
```

### Development

Start the development server:

```sh
npm run dev

npm run dev -- --open
```

The app will be available at `https://hra-o-neslysicich.vercel.app`

### Building

Create a production build:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typegen` - Generate types from Supabase schema
