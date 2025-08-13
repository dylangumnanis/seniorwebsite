import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for signaling data (use Redis in production)
const sessionSignals = new Map<string, any[]>()

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id
    const signalData = await request.json()
    
    console.log(`📡 Received signal for session ${sessionId}:`, signalData.type)
    
    // Store the signal for the other peer to retrieve
    if (!sessionSignals.has(sessionId)) {
      sessionSignals.set(sessionId, [])
    }
    
    const signals = sessionSignals.get(sessionId)!
    signals.push({
      ...signalData,
      timestamp: new Date().toISOString()
    })
    
    // Keep only the last 10 signals to prevent memory issues
    if (signals.length > 10) {
      signals.splice(0, signals.length - 10)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Signal stored successfully' 
    })
  } catch (error) {
    console.error('❌ Error handling signal:', error)
    return NextResponse.json(
      { error: 'Failed to process signal' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id
    const url = new URL(request.url)
    const lastTimestamp = url.searchParams.get('since')
    
    const signals = sessionSignals.get(sessionId) || []
    
    // Filter signals newer than the last timestamp
    const newSignals = lastTimestamp 
      ? signals.filter(signal => signal.timestamp > lastTimestamp)
      : signals
    
    return NextResponse.json({ 
      signals: newSignals,
      success: true 
    })
  } catch (error) {
    console.error('❌ Error retrieving signals:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve signals' },
      { status: 500 }
    )
  }
}