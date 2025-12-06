import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is a senior
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'SENIOR') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

    // First, cleanup old IN_PROGRESS sessions (over 3 hours old)
    const threeMoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000)
    await prisma.tutoringSession.updateMany({
      where: {
        seniorId: senior.seniorProfile.id,
        status: 'IN_PROGRESS',
        date: {
          lt: threeMoursAgo
        }
      },
      data: {
        status: 'COMPLETED',
        notes: 'Auto-completed due to timeout'
      }
    })

    console.log('🧹 Cleaned up old IN_PROGRESS sessions for senior:', senior.seniorProfile.id)

    // Get pending and active sessions for this senior (only recent ones)
    const sessions = await prisma.tutoringSession.findMany({
      where: {
        seniorId: senior.seniorProfile.id,
        status: {
          in: ['SCHEDULED', 'IN_PROGRESS']
        },
        // Only show sessions from the last 24 hours
        date: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      include: {
        volunteer: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Format sessions for frontend
    const formattedSessions = sessions.map(session => ({
      id: session.id,
      status: session.status,
      date: session.date.toISOString(),
      duration: session.duration,
      notes: session.notes,
      volunteerName: session.volunteer?.user.name || 'Volunteer',
      volunteerAvatar: session.volunteer?.user.name || '',
      topic: session.notes?.split(':')[0] || 'General Help',
      canJoin: session.status === 'IN_PROGRESS', // Only joinable if volunteer has started it
      waitTime: session.status === 'PENDING' 
        ? Math.floor((new Date().getTime() - new Date(session.date).getTime()) / (1000 * 60))
        : 0
    }))

    return NextResponse.json(formattedSessions)

  } catch (error) {
    console.error('Pending sessions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
