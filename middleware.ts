import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/app/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // First, refresh the Supabase session cookie if needed.
  const response = await updateSession(request)

  // Then gate /dashboard/* and /admin pages.
  const pathname = request.nextUrl.pathname
  const needsAuth = pathname.startsWith('/dashboard')

  if (needsAuth) {
    // Build a server-side Supabase client to read the session out of cookies.
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {
            // Read-only here; updateSession() above handles writes.
          },
        },
      }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.searchParams.set('signin_required', '1')
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public asset files (svg/png/jpg/jpeg/gif/webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
