import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'SENIOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.user.id) {
      return NextResponse.json({ error: 'User ID missing from session' }, { status: 401 })
    }

    const { topicId, topicTitle, description, urgency, volunteerId, estimatedDuration } = await req.json()

    if (!topicId || !topicTitle) {
      return NextResponse.json(
        { error: 'Topic information is required' },
        { status: 400 }
      )
    }

    // Get senior profile
    const senior = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { seniorProfile: true }
    })

    if (!senior?.seniorProfile) {
      return NextResponse.json(
        { error: 'Senior profile not found' },
        { status: 404 }
      )
    }

    let targetVolunteerId = null

    if (volunteerId) {
      // Verify the volunteer exists
      const volunteer = await prisma.user.findFirst({
        where: {
          id: volunteerId,
          role: 'VOLUNTEER'
        },
        include: { volunteerProfile: true }
      })

      if (volunteer?.volunteerProfile) {
        targetVolunteerId = volunteer.volunteerProfile.id
      }
    }

    // Create a session request
    const sessionRequest = await prisma.tutoringSession.create({
      data: {
        seniorId: senior.seniorProfile.id,
        volunteerId: targetVolunteerId, // Can be null for auto-matching
        status: 'SCHEDULED', // Use SCHEDULED instead of PENDING
        date: new Date(),
        duration: estimatedDuration || 30,
        notes: `${topicTitle}: ${description || 'No additional description provided'}`,
        // Store additional metadata as JSON in a future field if needed
      }
    })

    // In a real application, you would:
    // 1. Send notifications to the specific volunteer or all available volunteers
    // 2. Create a separate SessionRequest table with more detailed information
    // 3. Implement a matching algorithm based on volunteer expertise and availability

    return NextResponse.json({
      sessionId: sessionRequest.id,
      message: 'Session request created successfully',
      volunteerId: targetVolunteerId ? volunteerId : null
    })
  } catch (error) {
    console.error('Session request API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}