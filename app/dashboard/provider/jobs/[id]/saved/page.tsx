import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

async function getJobWithSavedUsers(jobId: string, providerId: string) {
  try {
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
        providerId: providerId,
      },
      include: {
        savedBy: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })
    return job
  } catch (error) {
    console.error('Error fetching job with saved users:', error)
    return null
  }
}

export default async function SavedJobPage(props: any) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'JOB_PROVIDER') {
    redirect('/')
  }

  const job = await getJobWithSavedUsers(props.params.id, session.user.id)

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Job not found</h3>
            <p className="mt-1 text-sm text-gray-500">
              The job you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Saved By Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Users who have saved &quot;{job.title}&quot;
          </p>
        </div>

        {job.savedBy.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {job.savedBy.map(({ user, savedAt }) => (
                <li key={user.email} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Saved on {new Date(savedAt).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No saved users</h3>
            <p className="mt-1 text-sm text-gray-500">
              No one has saved this job yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 