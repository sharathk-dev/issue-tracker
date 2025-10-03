import { auth } from '@/auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isWriteOperation = req.nextUrl.pathname.includes('/new') || req.nextUrl.pathname.includes('/edit');

  if (!isLoggedIn && isWriteOperation) {
    const newUrl = new URL('/auth/signin', req.nextUrl.origin);
    newUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/issues/:path*'],
};
