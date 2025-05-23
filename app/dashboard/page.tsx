import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login?callbackUrl=/dashboard')
  }

  // Redirect based on user role
  if (session.user.role === 'JOB_PROVIDER') {
    redirect('/dashboard/provider')
  } else if (session.user.role === 'JOB_SEEKER') {
    redirect('/dashboard/seeker')
  }

  // Fallback redirect if role is not recognized
  redirect('/')
} 