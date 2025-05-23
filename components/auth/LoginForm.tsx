'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface LoginFormProps {
  callbackUrl: string
}

export default function LoginForm({ callbackUrl }: LoginFormProps) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
      })

      if (!result?.ok) {
        throw new Error('Invalid credentials')
      }

      // Get the user's role and redirect accordingly
      const userResponse = await fetch('/api/auth/session')
      const userData = await userResponse.json()
      const role = userData?.user?.role

      if (callbackUrl && callbackUrl !== '/') {
        router.push(callbackUrl)
      } else if (role === 'JOB_PROVIDER') {
        router.push('/dashboard/provider')
      } else if (role === 'JOB_SEEKER') {
        router.push('/dashboard/seeker')
      } else {
        router.push('/')
      }
      
      router.refresh()
    } catch (error) {
      setError('Invalid email or password')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Enter your email"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-900">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </form>
  )
} 