import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { JobType } from '@prisma/client'

async function getJobs() {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        provider: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6, // Only take the 6 most recent jobs for the homepage
    })
    return jobs
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return []
  }
}

export default async function Home() {
  const [session, jobs] = await Promise.all([
    getServerSession(authOptions),
    getJobs()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            {session ? 'Find Your Next Opportunity' : 'Welcome to Job Board'}
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            {session
              ? 'Browse through hundreds of job opportunities and find the perfect match for your career.'
              : 'Connect with top employers and find your dream job. Join our platform to start your journey.'}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {session ? (
              <>
                {session.user.role === 'JOB_SEEKER' ? (
                  <Link
                    href="/dashboard/seeker"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/provider"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Go to Dashboard
                  </Link>
                )}
                <Link
                  href="/jobs"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse All Jobs
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Get Started
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Section for Non-authenticated Users */}
        {!session && (
          <div className="mt-24">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Find Jobs</h3>
                <p className="mt-2 text-base text-gray-500">
                  Browse through hundreds of job listings from top companies.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Save Jobs</h3>
                <p className="mt-2 text-base text-gray-500">
                  Save interesting jobs and track your applications in one place.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Connect</h3>
                <p className="mt-2 text-base text-gray-500">
                  Connect directly with employers and grow your career.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Featured Jobs Section - Only shown to authenticated users */}
        {session && jobs.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">Featured Jobs</h2>
              <p className="mt-4 text-lg text-gray-500">
                Latest opportunities from top companies
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {job.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full
                        ${job.type === JobType.FULL_TIME ? 'bg-green-100 text-green-800' :
                          job.type === JobType.PART_TIME ? 'bg-blue-100 text-blue-800' :
                          job.type === JobType.CONTRACT ? 'bg-yellow-100 text-yellow-800' :
                          job.type === JobType.INTERNSHIP ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {job.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <p className="text-sm text-gray-500 mt-1">{job.location}</p>
                    {job.salary && (
                      <p className="text-sm text-gray-500 mt-1">Salary: {job.salary}</p>
                    )}
                    
                    <div className="mt-4">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Details
                        <svg 
                          className="ml-2 -mr-1 h-4 w-4" 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Posted by {job.provider.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/jobs"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View All Jobs
                <svg
                  className="ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
