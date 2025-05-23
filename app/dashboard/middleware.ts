import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function middleware(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  const path = new URL(request.url).pathname
  const isProviderPath = path.startsWith('/dashboard/provider')
  const isSeekerPath = path.startsWith('/dashboard/seeker')

  if (isProviderPath && session.user.role !== 'JOB_PROVIDER') {
    return NextResponse.redirect(new URL('/dashboard/seeker', request.url))
  }

  if (isSeekerPath && session.user.role !== 'JOB_SEEKER') {
    return NextResponse.redirect(new URL('/dashboard/provider', request.url))
  }

  return NextResponse.next()
} 