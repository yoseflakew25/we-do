import { pathnames, locales, defaultLocale } from './config';
import { Session } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

// Default export from 'next-auth' middleware to handle authentication.
export { default } from 'next-auth/middleware';

// Middleware to handle internationalization (i18n) with next-intl.
const intlMiddleware = createMiddleware({
  // List of supported locales.
  locales,
  // Default locale if no match is found.
  defaultLocale,
  // Pathname configurations for localization.
  pathnames,
});

// Custom middleware function to handle additional logic.
export async function middleware(request: NextRequest) {
  // Extract the current path from the request URL.
  const { pathname } = request.nextUrl;
  const baseUrl = process.env.NEXTAUTH_URL;

  // Check if the current path contains a valid locale from the `locales` array.
  const foundLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}`) || pathname === `/${locale}`
  );

  // Use the found locale for further logic.
  const locale = foundLocale;

  // Get the current user's session information from the JWT token.
  const user = (await getToken({
    req: request,
  })) as unknown as Session['user'];

  // If the user is logged in and visits the homepage, redirect them based on their role.
  if (user && pathname === `/${locale}`) {
    // Superadmins are redirected to the admin home page.
    if (user.role === 'superadmin') {
      return NextResponse.redirect(
        new URL(`/${locale}/admin/home`, request.url)
      );
    }
    // Regular users are redirected to the volunteer opportunities page.
    if (user.role === 'user') {
      return NextResponse.redirect(
        new URL(`/${locale}/talent/opportunities`, request.url)
      );
    }
    // Organization users are redirected to their opportunities page.
    if (user.role === 'org') {
      return NextResponse.redirect(
        new URL(`/${locale}/organization/opportunities`, request.url)
      );
    }
    // If the user's role is not set, redirect them to a role selection page.
    if (user.role === '') {
      return NextResponse.redirect(
        new URL(`/${locale}/role-selection`, request.url)
      );
    }
  }
  // Redirect superadmin users away from organization routes.
  if (
    user &&
    user.role === 'superadmin' &&
    pathname.startsWith(`/${locale}/organization`)
  ) {
    return NextResponse.redirect(new URL(`/${locale}/admin/home`, request.url));
  }
  // Prevent users with the 'user' role from accessing the role selection page.
  if (
    user &&
    user.role === 'user' &&
    pathname.startsWith(`/${locale}/role-selection`)
  ) {
    return NextResponse.redirect(
      new URL(`/${locale}/talent/opportunities`, request.url)
    );
  }
  // Prevent organizations from accessing the role selection page.
  if (
    user &&
    user.role === 'org' &&
    pathname.startsWith(`/${locale}/role-selection`)
  ) {
    return NextResponse.redirect(
      new URL(`/${locale}/organization/opportunities`, request.url)
    );
  }
  // Block non-superadmin users from accessing admin routes.
  if (
    user &&
    user.role !== 'superadmin' &&
    pathname.startsWith(`/${locale}/admin`)
  ) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }
  // Block non-organization users from accessing organization routes.
  if (
    user &&
    user.role !== 'org' &&
    pathname.startsWith(`/${locale}/organization`)
  ) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }
  // Block non-user roles from accessing volunteer routes.
  if (
    user &&
    user.role !== 'user' &&
    pathname.startsWith(`/${locale}/talent`)
  ) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }
  // Requiring login for admin users before accessing admin routes.
  if (!user && pathname.startsWith(`/${locale}/admin`)) {
    const loginUrl = new URL(`${baseUrl}/${locale}/login`);

    loginUrl.searchParams.append(
      'callbackUrl',
      `${baseUrl}${request.nextUrl.pathname}`
    );
    return NextResponse.redirect(loginUrl);
  }
  // Require login for organization users before accessing organization routes.
  if (
    !user &&
    (pathname.startsWith(`/${locale}/organization`) ||
      pathname.startsWith(`/${locale}/signup/organization`))
  ) {
    const loginUrl = new URL(`${baseUrl}/${locale}/login`);
    loginUrl.searchParams.append(
      'callbackUrl',
      `${baseUrl}${request.nextUrl.pathname}`
    );
    return NextResponse.redirect(loginUrl);
  }
  // Disable access to signup pages after login.
  if (
    user &&
    pathname !== `/${locale}/signup/organization` &&
    (pathname.startsWith(`/${locale}/signup`) ||
      pathname.startsWith(`/${locale}/login`))
  ) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }
  // Require organizations to complete their profile if it is incomplete.
  if (
    user &&
    user.role === 'org' &&
    user.profileStatus === 'incomplete' &&
    pathname.startsWith(`/${locale}/organization`)
  ) {
    return NextResponse.redirect(
      new URL(`/${locale}/signup/organization`, request.url)
    );
  }

  // Prevent organization users with a complete profile from accessing the signup page.
  if (
    user &&
    user.profileStatus !== 'incomplete' &&
    pathname === `/${locale}/signup/organization`
  ) {
    return NextResponse.redirect(
      new URL(`/${locale}/organization/opportunities`, request.url)
    );
  }
  // Default behavior: use the `intlMiddleware` for handling i18n (internationalization).
  return intlMiddleware(request);
}

// Config to exclude certain paths from middleware handling (e.g., API routes, static files).
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|.well-known|favicon.ico).*)',
  ],
};
