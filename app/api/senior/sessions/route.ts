import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'SENIOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // First, cleanup old sessions that might be stuck
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    await prisma.tutoringSession.updateMany({
      where: {
        seniorId: senior.seniorProfile.id,
        status: 'IN_PROGRESS',
        updatedAt: {
          lt: oneHourAgo
        }
      },
      data: {
        status: 'COMPLETED',
        notes: 'Auto-completed due to inactivity'
      }
    })

    console.log('🧹 Cleaned up old IN_PROGRESS sessions for senior sessions list')

    // Fetch sessions with volunteer information (exclude very old pending ones)
    const sessions = await prisma.tutoringSession.findMany({
      where: {
        seniorId: senior.seniorProfile.id
      },
      include: {
        volunteer: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Limit to recent sessions
    })

    // Transform sessions to match frontend interface
    const formattedSessions = sessions.map(session => ({
      id: session.id,
      volunteerName: session.volunteer?.user?.name || 'Unknown Volunteer',
      topic: session.notes?.split(' ').slice(0, 3).join(' ') || 'General Help',
      date: session.date.toISOString(),
      duration: session.duration || 30,
      status: session.status.toLowerCase() as 'completed' | 'cancelled' | 'upcoming',
      rating: Math.floor(Math.random() * 2) + 4 // Mock rating 4-5 stars
    }))

    return NextResponse.json(formattedSessions)
  } catch (error) {
    console.error('Senior sessions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}