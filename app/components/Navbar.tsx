'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Job Board
            </Link>
            <div className="ml-10 flex items-center space-x-4">
              <Link href="/jobs" className="text-gray-600 hover:text-gray-900">
                Browse Jobs
              </Link>
              {session?.user?.role === 'JOB_PROVIDER' && (
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Provider Dashboard
                </Link>
              )}
              {session?.user?.role === 'JOB_SEEKER' && (
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Seeker Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {status === 'authenticated' ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  Welcome, {session.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 