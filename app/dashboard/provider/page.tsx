import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { JobType } from '@prisma/client'

async function getProviderStats(userId: string) {
  const totalJobs = await prisma.job.count({
    where: {
      providerId: userId,
    },
  })

  const activeJobs = await prisma.job.count({
    where: {
      providerId: userId,
    },
  })

  const totalSavedJobs = await prisma.savedJob.count({
    where: {
      job: {
        providerId: userId,
      },
    },
  })

  return {
    totalJobs,
    activeJobs,
    totalSavedJobs,
  }
}

async function getProviderJobs(userId: string) {
  return prisma.job.findMany({
    where: {
      providerId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      savedBy: true,
    },
  })
}

export default async function ProviderDashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'JOB_PROVIDER') {
    redirect('/')
  }

  const [stats, jobs] = await Promise.all([
    getProviderStats(session.user.id),
    getProviderJobs(session.user.id),
  ])

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Stats Section */}
      <div className="px-4 py-6 sm:px-0">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Jobs Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Jobs Posted</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalJobs}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Active Jobs Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Jobs</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.activeJobs}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Total Applications Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Saved</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalSavedJobs}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List Section */}
      <div className="px-4 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Your Job Listings</h1>
          <Link
            href="/dashboard/provider/jobs/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Post New Job
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {jobs.map((job) => (
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
                      <p className="mt-1 text-sm text-gray-500">
                        {job.company} • {job.location}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Saved by {job.savedBy.length} job seekers
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${job.type === JobType.FULL_TIME ? 'bg-green-100 text-green-800' :
                          job.type === JobType.PART_TIME ? 'bg-blue-100 text-blue-800' :
                          job.type === JobType.CONTRACT ? 'bg-yellow-100 text-yellow-800' :
                          job.type === JobType.INTERNSHIP ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {job.type.replace('_', ' ')}
                      </span>
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/provider/jobs/${job.id}/edit`}
                          className="text-sm text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/dashboard/provider/jobs/${job.id}/saved`}
                          className="text-sm text-gray-600 hover:text-gray-900"
                        >
                          View Saved
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {jobs.length === 0 && (
              <li>
                <div className="px-4 py-12 text-center">
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
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs posted</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new job posting.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/dashboard/provider/jobs/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Post New Job
                    </Link>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
} 