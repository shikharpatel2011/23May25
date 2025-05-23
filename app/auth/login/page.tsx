import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import LoginForm from '@/components/auth/LoginForm'

export default async function LoginPage(props: any) {
  const session = await getServerSession(authOptions)
  const callbackUrl = props.searchParams?.callbackUrl || '/'

  if (session) {
    // Redirect to the callback URL if it exists, otherwise to the appropriate dashboard
    if (callbackUrl && callbackUrl !== '/') {
      redirect(callbackUrl)
    } else {
      redirect(session.user.role === 'JOB_PROVIDER' ? '/dashboard/provider' : '/dashboard/seeker')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <a href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm callbackUrl={callbackUrl} />
        </div>
      </div>
    </div>
  )
} 