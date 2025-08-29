import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { PUBLIC_ROUTES } from '@/lib/routes'

// Create matcher from our centralized routes
const publicRoutesList = [
  ...PUBLIC_ROUTES,
  '/api/webhooks(.*)', // Webhook routes should always be public
]

const isPublicRoute = createRouteMatcher(publicRoutesList)

export default clerkMiddleware(async (auth, req) => {
  // Check if it's a handshake callback
  const url = new URL(req.url)
  if (url.searchParams.has('__clerk_handshake')) {
    // Let Clerk handle the handshake
    return NextResponse.next()
  }

  // Protect non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}