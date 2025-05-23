import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import SaveJobButton from './SaveJobButton'

async function getJob(id: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            name: true,
          },
        },
      },
    })
    return job
  } catch (error) {
    console.error('Error fetching job:', error)
    return null
  }
}

async function checkIfJobIsSaved(jobId: string, userId: string) {
  try {
    const savedJob = await prisma.savedJob.findFirst({
      where: {
        jobId,
        userId,
      },
    })
    return !!savedJob
  } catch (error) {
    console.error('Error checking saved job:', error)
    return false
  }
}

export default async function JobPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const job = await getJob(params.id)

  if (!job) {
    notFound()
  }

  const isJobSaved = session?.user?.role === 'JOB_SEEKER' 
    ? await checkIfJobIsSaved(job.id, session.user.id)
    : false

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <p className="mt-1 text-sm text-gray-500">{job.company}</p>
            </div>
            {session?.user?.role === 'JOB_SEEKER' && (
              <SaveJobButton jobId={job.id} isSaved={isJobSaved} />
            )}
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.location}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Job Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.type.replace('_', ' ')}</dd>
            </div>
            {job.salary && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Salary</dt>
                <dd className="mt-1 text-sm text-gray-900">{job.salary}</dd>
              </div>
            )}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Posted By</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.provider.name}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Posted Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(job.createdAt).toLocaleDateString()}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Job Description</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{job.description}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
} 