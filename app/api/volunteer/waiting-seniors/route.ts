import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is a volunteer
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'VOLUNTEER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // First, cleanup old SCHEDULED sessions (over 2 hours old)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    await prisma.tutoringSession.updateMany({
      where: {
        status: 'SCHEDULED',
        date: {
          lt: twoHoursAgo
        }
      },
      data: {
        status: 'CANCELLED',
        notes: 'Auto-cancelled due to timeout - no volunteer joined'
      }
    })

    console.log('🧹 Cleaned up old SCHEDULED sessions')

    // Get actual pending sessions from database (only recent ones)
    const pendingSessions = await prisma.tutoringSession.findMany({
      where: {
        status: 'SCHEDULED', // Sessions waiting for volunteers
        // Only show sessions from the last 2 hours
        date: {
          gte: twoHoursAgo
        },
        OR: [
          { volunteerId: null }, // Auto-matching sessions (any volunteer can join)
          // Could add volunteer-specific requests here in the future
        ]
      },
      include: {
        senior: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
      orderBy: {
        date: 'asc' // Oldest requests first
      }
    })

    // Transform to expected frontend format
    const formattedSeniors = pendingSessions.map((session) => {
      const waitMinutes = Math.floor((new Date().getTime() - new Date(session.date).getTime()) / (1000 * 60))
      
      // Extract topic from notes (format: "TopicTitle: Description")
      const topic = session.notes?.split(':')[0] || 'General Help'
      
      // Determine urgency based on wait time
      let urgency: 'low' | 'medium' | 'high' = 'low'
      if (waitMinutes > 30) urgency = 'high'
      else if (waitMinutes > 10) urgency = 'medium'

      return {
        id: session.senior?.user.id || session.seniorId, // Use senior's User ID for startSession
        name: session.senior?.user.name || 'Senior User',
        helpTopic: topic,
        waitTime: waitMinutes < 60 
          ? `${waitMinutes} minutes` 
          : `${Math.floor(waitMinutes / 60)} hours`,
        urgency: urgency,
        sessionId: session.id // Include session ID for reference
      }
    })

    return NextResponse.json(formattedSeniors)

  } catch (error) {
    console.error('Waiting seniors API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}