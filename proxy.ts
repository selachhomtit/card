import { NextResponse, NextRequest } from "next/server"

export default function proxy(request: NextRequest) {
    console.log('-----proxy-----')
    console.log('request url', request.url)
    console.log('request pathname', request.nextUrl.pathname)
    // if you are not login, redirect to /login
    const isLogined = false
    if (!isLogined) {
        return NextResponse.redirect(new URL("/auth/login", request.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*']
}