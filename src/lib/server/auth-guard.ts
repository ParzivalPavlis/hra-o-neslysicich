import { redirect, type Handle } from '@sveltejs/kit';
import { safeGetSession } from './services';

const PUBLIC_ROUTES = ['/(auth)', '/api/v1/auth'] as const;

const isPublicRoute = (routeId: string | null): boolean => {
	return PUBLIC_ROUTES.some((route) => routeId?.startsWith(route));
};

export const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await safeGetSession(event.locals.supabase);

	event.locals.session = session;
	event.locals.user = user;

	const isPublic = isPublicRoute(event.route.id);

	// Redirect unauthenticated users to login for protected routes
	if (!isPublic && !session) {
		throw redirect(302, '/login');
	}

	return resolve(event);
};
