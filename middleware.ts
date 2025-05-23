import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isAuthCallback = req.nextUrl.pathname.startsWith('/api/auth')
    const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard')
    const isJobsPage = req.nextUrl.pathname.startsWith('/jobs')
    const isJobProviderPage = req.nextUrl.pathname.startsWith('/dashboard/provider')
    const isJobSeekerPage = req.nextUrl.pathname.startsWith('/dashboard/seeker')

    // Allow auth callback routes to pass through
    if (isAuthCallback) {
      return null
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPage) {
      if (isAuth) {
        const redirectUrl = token.role === 'JOB_PROVIDER' 
          ? '/dashboard/provider'
          : '/dashboard/seeker'
        return NextResponse.redirect(new URL(redirectUrl, req.url))
      }
      return null
    }

    // Handle protected routes access
    if (isDashboardPage || isJobsPage) {
      if (!isAuth) {
        const callbackUrl = encodeURIComponent(req.nextUrl.pathname)
        return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.url))
      }

      // Redirect to appropriate dashboard if trying to access wrong role's dashboard
      if (isJobProviderPage && token.role !== 'JOB_PROVIDER') {
        return NextResponse.redirect(new URL('/dashboard/seeker', req.url))
      }

      if (isJobSeekerPage && token.role !== 'JOB_SEEKER') {
        return NextResponse.redirect(new URL('/dashboard/provider', req.url))
      }
    }

    return null
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public access to auth pages and callbacks
        if (req.nextUrl.pathname.startsWith('/auth') || 
            req.nextUrl.pathname.startsWith('/api/auth')) {
          return true
        }
        // Require authentication for protected routes
        if (req.nextUrl.pathname.startsWith('/dashboard') ||
            req.nextUrl.pathname.startsWith('/jobs')) {
          return !!token
        }
        // Allow public access to other pages
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/api/auth/:path*',
    '/jobs/:path*'
  ],
} 