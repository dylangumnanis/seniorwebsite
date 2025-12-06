import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: sessionId } = await params

    // Fetch session data with related user information
    const sessionData = await prisma.tutoringSession.findUnique({
      where: { id: sessionId },
      include: {
        volunteer: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        senior: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    })

    if (!sessionData) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Block access to completed/cancelled sessions
    if (sessionData.status === 'COMPLETED' || sessionData.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'This session has ended and is no longer accessible' },
        { status: 410 } // 410 Gone - resource no longer available
      )
    }

    // Check if user is authorized to view this session
    const isVolunteer = session.user?.role === 'VOLUNTEER' && 
                       sessionData.volunteer?.user.id === session.user.id
    const isSenior = session.user?.role === 'SENIOR' && 
                     sessionData.senior?.user.id === session.user.id
    const isAdmin = session.user?.role === 'ADMIN'

    if (!isVolunteer && !isSenior && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized to view this session' },
        { status: 403 }
      )
    }

    // Calculate duration if session is in progress
    const startTime = new Date(sessionData.date)
    const currentTime = new Date()
    const elapsedMinutes = Math.floor((currentTime.getTime() - startTime.getTime()) / (1000 * 60))

    const responseData = {
      id: sessionData.id,
      status: sessionData.status,
      startTime: sessionData.date.toISOString(),
      duration: sessionData.status === 'IN_PROGRESS' ? elapsedMinutes : sessionData.duration,
      notes: sessionData.notes || '',
      volunteerName: sessionData.volunteer?.user.name || 'Unknown Volunteer',
      seniorName: sessionData.senior?.user.name || 'Unknown Senior',
      helpTopic: sessionData.notes?.includes('topic:') 
        ? sessionData.notes.split('topic:')[1]?.split('\n')[0]?.trim() 
        : 'General Help',
      isVolunteer,
      isSenior
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Session fetch API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: sessionId } = await params
    const { status, notes, duration } = await request.json()

    console.log(`🔄 Updating session ${sessionId}:`, { status, notes, duration })

    // Verify session exists and user has permission to update it
    const existingSession = await prisma.tutoringSession.findUnique({
      where: { id: sessionId },
      include: {
        senior: { include: { user: true } },
        volunteer: { include: { user: true } }
      }
    })

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Check if user is authorized to update this session
    const isAuthorized = 
      existingSession.senior.user.id === session.user.id ||
      existingSession.volunteer?.user.id === session.user.id

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Not authorized to update this session' },
        { status: 403 }
      )
    }

    // Update session with additional metadata
    const updateData: any = {}
    if (status) updateData.status = status
    if (notes) updateData.notes = notes
    if (duration) updateData.duration = duration
    
    // Add completion timestamp if completing session
    if (status === 'COMPLETED') {
      updateData.updatedAt = new Date()
      console.log(`✅ Marking session ${sessionId} as COMPLETED`)
    }

    const updatedSession = await prisma.tutoringSession.update({
      where: { id: sessionId },
      data: updateData
    })

    console.log(`✅ Session ${sessionId} updated successfully`)

    return NextResponse.json({
      message: 'Session updated successfully',
      session: updatedSession
    })

  } catch (error) {
    console.error('Session update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
