/* import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Only these paths are protected
const PRIVATE_PATHS = [
  '/ManageNotification',
  '/projects/AddProject',
  // add more as needed
]

// Public paths (login page, etc)
const PUBLIC_PATHS = ['/login', '/login/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect only if matches any PRIVATE_PATHS, and is not public
  const isProtected = PRIVATE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  )
  const isPublic = PUBLIC_PATHS.includes(pathname)

  if (isProtected && !isPublic) {
    const isAuth = request.cookies.get('admin-login')?.value === 'authenticated'
    if (!isAuth) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  return NextResponse.next()
}
 */