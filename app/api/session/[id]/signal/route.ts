import { NextRequest, NextResponse } from 'next/server';

// In-memory store for session signals (in production, use Redis or database)
const sessionSignals = new Map<string, any[]>();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const signal = await request.json();

    console.log(`📡 Received signal for session ${sessionId}:`, signal.type);

    // Store signal for the session
    if (!sessionSignals.has(sessionId)) {
      sessionSignals.set(sessionId, []);
    }
    
    const signals = sessionSignals.get(sessionId)!;
    signals.push({
      ...signal,
      timestamp: new Date().toISOString()
    });

    // Keep only recent signals (last 50)
    if (signals.length > 50) {
      signals.splice(0, signals.length - 50);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Signal API error:', error);
    return NextResponse.json(
      { error: 'Failed to process signal' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const url = new URL(request.url);
    const lastTimestamp = url.searchParams.get('since');

    const signals = sessionSignals.get(sessionId) || [];
    
    // Filter signals newer than lastTimestamp if provided
    const filteredSignals = lastTimestamp 
      ? signals.filter(signal => signal.timestamp > lastTimestamp)
      : signals;

    return NextResponse.json({ signals: filteredSignals });
  } catch (error) {
    console.error('❌ Signal fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signals' },
      { status: 500 }
    );
  }
}