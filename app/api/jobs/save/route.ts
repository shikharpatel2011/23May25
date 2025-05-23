import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'JOB_SEEKER') {
       return new NextResponse('Unauthorized', { status: 401 })
    }

    const { jobId } = await request.json()

    if (!jobId) {
      return new NextResponse('Job ID is required', { status: 400 })
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      return new NextResponse('Job not found', { status: 404 })
    }

    const existingSave = await prisma.savedJob.findFirst({
      where: {
        jobId,
        userId: session.user.id,
      },
    })

    if (existingSave) {
      return new NextResponse('Job already saved', { status: 400 })
    }

    // Save the saved job
    await prisma.savedJob.create({
      data: {
        jobId,
        userId: session.user.id,
      },
    })

    return new NextResponse('Job saved successfully', { status: 200 })
  } catch (error) {
    console.error('Error saving job:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'JOB_SEEKER') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { jobId } = await request.json()

    if (!jobId) {
      return new NextResponse('Job ID is required', { status: 400 })
    }

    // Delete the saved job
    await prisma.savedJob.deleteMany({
      where: {
        jobId,
        userId: session.user.id,
      },
    })

    return new NextResponse('Job unsaved successfully', { status: 200 })
  } catch (error) {
    console.error('Error unsaving job:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 