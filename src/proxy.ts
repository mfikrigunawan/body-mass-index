import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // kecualikan /api, _next, _vercel, dan file statis (yang mengandung titik)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
