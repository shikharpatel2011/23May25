import { NextResponse, NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  // context: { params: { id: string } }
) {
  // const id = context.params.id
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return new NextResponse('Job ID not found in URL', { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const job = await prisma.job.findUnique({
      where: {
        id,
      },
    })

    if (!job) {
      return new NextResponse('Job not found', { status: 404 })
    }

    // Check if the user is the job provider
    if (session.user.role === 'JOB_PROVIDER' && job.providerId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error('Error fetching job:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  // context: { params: { id: string } }
) {
  // const id = context.params.id
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return new NextResponse('Job ID not found in URL', { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'JOB_PROVIDER') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const job = await prisma.job.findUnique({
      where: {
        id,
      },
    })

    if (!job) {
      return new NextResponse('Job not found', { status: 404 })
    }

    // Check if the user is the job provider
    if (job.providerId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const updatedJob = await prisma.job.update({
      where: {
        id,
      },
      data: {
        title: body.title,
        company: body.company,
        location: body.location,
        type: body.type,
        description: body.description,
        salary: body.salary,
      },
    })

    return NextResponse.json(updatedJob)
  } catch (error) {
    console.error('Error updating job:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 