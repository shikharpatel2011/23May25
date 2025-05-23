import Link from 'next/link'
import { redirect } from 'next/navigation'
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
    })
    return jobs
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return []
  }
}

export default async function JobsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login?callbackUrl=/jobs')
  }

  const jobs = await getJobs()

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Available Jobs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse through all available job opportunities.
          </p>
        </div>

        {jobs.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
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
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{job.description}</p>
                  
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Check back later for new job opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 