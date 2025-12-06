import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    console.log('🧹 Starting comprehensive session cleanup...')

    // Cleanup old IN_PROGRESS sessions (over 2 hours old)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    const completedOldSessions = await prisma.tutoringSession.updateMany({
      where: {
        status: 'IN_PROGRESS',
        updatedAt: {
          lt: twoHoursAgo
        }
      },
      data: {
        status: 'COMPLETED',
        notes: 'Auto-completed due to timeout'
      }
    })

    // Cleanup old SCHEDULED sessions (over 3 hours old)
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000)
    const cancelledOldSessions = await prisma.tutoringSession.updateMany({
      where: {
        status: 'SCHEDULED',
        date: {
          lt: threeHoursAgo
        }
      },
      data: {
        status: 'CANCELLED',
        notes: 'Auto-cancelled due to timeout - no volunteer joined'
      }
    })

    // Get current session counts by status
    const sessionCounts = await prisma.tutoringSession.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    console.log('✅ Session cleanup completed')

    return NextResponse.json({
      message: 'Session cleanup completed successfully',
      cleaned: {
        completedSessions: completedOldSessions.count,
        cancelledSessions: cancelledOldSessions.count
      },
      currentCounts: sessionCounts.reduce((acc, item) => {
        acc[item.status] = item._count.status
        return acc
      }, {} as Record<string, number>)
    })

  } catch (error) {
    console.error('Session cleanup API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Allow GET requests to see current session status
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    // Get session counts by status
    const sessionCounts = await prisma.tutoringSession.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    // Get old sessions that need cleanup
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000)

    const staleInProgress = await prisma.tutoringSession.count({
      where: {
        status: 'IN_PROGRESS',
        updatedAt: {
          lt: twoHoursAgo
        }
      }
    })

    const staleScheduled = await prisma.tutoringSession.count({
      where: {
        status: 'SCHEDULED',
        date: {
          lt: threeHoursAgo
        }
      }
    })

    return NextResponse.json({
      currentCounts: sessionCounts.reduce((acc, item) => {
        acc[item.status] = item._count.status
        return acc
      }, {} as Record<string, number>),
      needsCleanup: {
        staleInProgress,
        staleScheduled,
        total: staleInProgress + staleScheduled
      }
    })

  } catch (error) {
    console.error('Session status API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
