import { NextResponse, NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { JobType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (session.user.role !== 'JOB_PROVIDER') {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const { title, company, location, type, salary, description } = await request.json()

    if (!title || !company || !location || !type || !description) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Validate job type
    if (!Object.values(JobType).includes(type as JobType)) {
      return new NextResponse('Invalid job type', { status: 400 })
    }

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type: type as JobType,
        salary: salary || null,
        description,
        providerId: session.user.id,
      },
    })

    return NextResponse.json(job)
  } catch (error) {
    console.error('Error creating job:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 