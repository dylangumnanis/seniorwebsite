import { NextRequest, NextResponse } from 'next/server';

// Mock session data (in production, use database)
const mockSessions = new Map<string, any>();

// Initialize some test sessions
mockSessions.set('test-session-1', {
  id: 'test-session-1',
  seniorName: 'Mary Johnson',
  volunteerName: 'Alex Chen',
  topic: 'Email Basics',
  status: 'IN_PROGRESS',
  startTime: new Date().toISOString(),
  notes: ''
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const session = mockSessions.get(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Determine user role (simplified for demo)
    const url = new URL(request.url);
    const userRole = url.searchParams.get('role') || 'senior';

    return NextResponse.json({
      ...session,
      userRole
    });
  } catch (error) {
    console.error('❌ Session fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const updates = await request.json();
    
    const session = mockSessions.get(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Update session
    const updatedSession = { ...session, ...updates };
    mockSessions.set(sessionId, updatedSession);

    console.log(`✅ Session ${sessionId} updated:`, Object.keys(updates));

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('❌ Session update error:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}