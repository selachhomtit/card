import { NextResponse, NextRequest } from "next/server"

export default function proxy(request: NextRequest) {
    console.log('-----proxy-----')
    console.log('request url', request.url)
    console.log('request pathname', request.nextUrl.pathname)

    // Check if user is logged in
    const isLogined = false
    if (!isLogined) {
        // Redirect to /auth/login if not logged in
        return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    // Allow access if logged in
    return NextResponse.next()
}

// Automatically protect all routes under /dashboard and /new
export const config = {
    matcher: ['/dashboards/:path*', '/admin/:path*']
}
