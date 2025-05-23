import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { JobType } from '@prisma/client'

async function getSavedJobs(userId: string) {
  try {
    return await prisma.savedJob.findMany({
      where: {
        userId,
      },
      include: {
        job: {
          include: {
            provider: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        savedAt: 'desc',
      },
    })
  } catch (error) {
    console.error('Error fetching saved jobs:', error)
    return []
  }
}

export default async function SeekerDashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'JOB_SEEKER') {
    redirect('/')
  }

  const savedJobs = await getSavedJobs(session.user.id)

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Welcome Section */}
        <div className="bg-white shadow-lg rounded-lg px-8 py-10 mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Your Job Seeker Dashboard, {session.user.name}!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Find your next opportunity and track your favorite job listings all in one place.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/jobs"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Available Jobs
            </Link>
            {savedJobs.length > 0 && (
              <a
                href="#saved-jobs"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Saved Jobs ({savedJobs.length})
              </a>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg px-6 py-5">
            <div className="text-sm font-medium text-gray-500">Saved Jobs</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">{savedJobs.length}</div>
          </div>
          <div className="bg-white shadow rounded-lg px-6 py-5">
            <div className="text-sm font-medium text-gray-500">Latest Activity</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">
              {savedJobs.length > 0 
                ? new Date(savedJobs[0].savedAt).toLocaleDateString()
                : 'No activity'}
            </div>
          </div>
          <div className="bg-white shadow rounded-lg px-6 py-5">
            <div className="text-sm font-medium text-gray-500">Profile Status</div>
            <div className="mt-1 text-3xl font-semibold text-green-600">Active</div>
          </div>
        </div>

        {/* Saved Jobs Section */}
        {savedJobs.length > 0 && (
          <div id="saved-jobs" className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Saved Jobs</h2>
              <p className="mt-1 text-sm text-gray-500">
                Keep track of opportunities that interest you.
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {savedJobs.map(({ job, savedAt }) => (
                <li key={job.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="text-lg font-medium text-blue-600 hover:text-blue-700 truncate"
                        >
                          {job.title}
                        </Link>
                        <p className="mt-1 text-sm text-gray-600">
                          {job.company} • {job.location}
                        </p>
                        {job.salary && (
                          <p className="mt-1 text-sm text-gray-500">
                            Salary: {job.salary}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          Posted by {job.provider.name}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${job.type === JobType.FULL_TIME ? 'bg-green-100 text-green-800' :
                            job.type === JobType.PART_TIME ? 'bg-blue-100 text-blue-800' :
                            job.type === JobType.CONTRACT ? 'bg-yellow-100 text-yellow-800' :
                            job.type === JobType.INTERNSHIP ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'}`}
                        >
                          {job.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          Saved on {new Date(savedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* No Saved Jobs Message */}
        {savedJobs.length === 0 && (
          <div className="bg-white shadow rounded-lg px-6 py-8 text-center">
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No saved jobs</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start saving jobs that interest you to keep track of opportunities.
            </p>
            <div className="mt-6">
              <Link
                href="/jobs"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 