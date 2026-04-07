import { redirect, type Handle } from '@sveltejs/kit';
import { safeGetSession } from './services';

const PUBLIC_ROUTES = [
	'/login',
	'/register',
	'/forgot-password',
	'/reset-password',
	'/api/v1/auth'
] as const;

const isPublicRoute = (pathname: string): boolean => {
	return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'));
};

export const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await safeGetSession(event.locals.supabase);

	event.locals.session = session;
	event.locals.user = user;

	const isPublic = isPublicRoute(event.url.pathname);

	// Redirect unauthenticated users to login for protected routes
	if (!isPublic && !session) {
		throw redirect(302, '/login');
	}

	return resolve(event);
};
