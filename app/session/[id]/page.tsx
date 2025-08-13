'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWebRTC } from '../../../hooks/useWebRTC';

interface SessionData {
  id: string;
  seniorName: string;
  volunteerName: string;
  topic: string;
  status: string;
  startTime: Date;
}

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isVolunteer, setIsVolunteer] = useState<boolean>(false);
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [elapsedTime, setElapsedTime] = useState<string>('00:00');

  const {
    localVideoRef,
    remoteVideoRef,
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    isConnected,
    connectionState,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    startCall,
    endCall,
    sendSignal,
    receiveSignal
  } = useWebRTC(sessionId);

  // Timer for elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const elapsed = now.getTime() - startTime.getTime();
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setElapsedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Load session data
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const response = await fetch(`/api/session/${sessionId}`);
        if (!response.ok) throw new Error('Failed to load session');
        
        const data = await response.json();
        setSessionData(data);
        setIsVolunteer(data.userRole === 'volunteer');
        setStartTime(new Date(data.startTime));
        setIsLoading(false);
        
        // Auto-start WebRTC
        await startCall();
      } catch (error) {
        console.error('❌ Failed to load session:', error);
        setIsLoading(false);
      }
    };

    if (sessionId) {
      loadSessionData();
    }
  }, [sessionId, startCall]);

  // Handle ending session
  const handleEndSession = async () => {
    try {
      // Clean up WebRTC
      endCall();
      
      // Update session status
      await fetch(`/api/session/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'COMPLETED',
          notes: sessionNotes,
          endTime: new Date().toISOString()
        })
      });
      
      // Redirect based on role
      if (isVolunteer) {
        router.push('/volunteer');
      } else {
        router.push('/senior');
      }
    } catch (error) {
      console.error('❌ Failed to end session:', error);
    }
  };

  // Handle saving notes
  const handleSaveNotes = async () => {
    try {
      await fetch(`/api/session/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: sessionNotes })
      });
      console.log('✅ Notes saved');
    } catch (error) {
      console.error('❌ Failed to save notes:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading session...</div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Session not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Fixed Header with Session Info - Repositioned to avoid blocking End Session */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 z-20">
        <div className="text-sm text-gray-300">Help Topic:</div>
        <div className="font-semibold">{sessionData.topic}</div>
        <div className="text-sm text-gray-300 mt-1">Duration:</div>
        <div className="font-mono text-lg text-green-400">{elapsedTime}</div>
        <div className="text-sm text-gray-300 mt-1">Status:</div>
        <div className={`text-sm font-semibold ${isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
          {isConnected ? 'CONNECTED' : 'CONNECTING...'}
        </div>
      </div>

      {/* End Session Button - Moved to top right corner, clear of other elements */}
      <button
        onClick={handleEndSession}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors z-30"
      >
        End Session
      </button>

      {/* Main Video Area */}
      <div className="flex flex-col h-screen pt-16 pb-4">
        {/* Remote Video (Main Display) */}
        <div className="flex-1 relative bg-gray-800 rounded-lg mx-4 mb-4 overflow-hidden">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Remote User Info Overlay */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="text-sm text-gray-300">
              {isVolunteer ? 'Senior' : 'Volunteer'}:
            </div>
            <div className="font-semibold">
              {isVolunteer ? sessionData.seniorName : sessionData.volunteerName}
            </div>
          </div>

          {/* Connection Status Indicator */}
          <div className="absolute top-4 left-4">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
          </div>

          {/* No Remote Video Message */}
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-semibold mb-2">Waiting for connection...</div>
                <div className="text-gray-400">Connection State: {connectionState}</div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Panel with Local Video and Controls */}
        <div className="flex items-end gap-4 px-4">
          {/* Local Video (Small Corner Preview) */}
          <div className="relative bg-gray-700 rounded-lg overflow-hidden" style={{ width: '200px', height: '150px' }}>
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Local User Label */}
            <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-xs">
              You ({isVolunteer ? 'Volunteer' : 'Senior'})
            </div>

            {/* Video Status Indicators */}
            <div className="absolute top-2 right-2 flex gap-1">
              {!isVideoEnabled && (
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A2 2 0 0017 14V6a2 2 0 00-2-2h-6.586l-1-1H5a2 2 0 00-2 2v6c0 .554.226 1.056.59 1.415L3.707 2.293zM9 4h6v8.586l-2-2V6a1 1 0 00-1-1H9.414L9 4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Control Panel */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-3 bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3">
              {/* Camera Toggle */}
              <button
                onClick={toggleVideo}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isVideoEnabled 
                    ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
                title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  {isVideoEnabled ? (
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  ) : (
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A2 2 0 0017 14V6a2 2 0 00-2-2h-6.586l-1-1H5a2 2 0 00-2 2v6c0 .554.226 1.056.59 1.415L3.707 2.293zM9 4h6v8.586l-2-2V6a1 1 0 00-1-1H9.414L9 4z" clipRule="evenodd" />
                  )}
                </svg>
              </button>

              {/* Microphone Toggle */}
              <button
                onClick={toggleAudio}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isAudioEnabled 
                    ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
                title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  {isAudioEnabled ? (
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0L18.485 7.757a1 1 0 010 1.414L17.071 10.585a1 1 0 11-1.414-1.414L16.899 8 15.657 6.757a1 1 0 010-1.414z" clipRule="evenodd" />
                  )}
                </svg>
              </button>

              {/* Screen Share Toggle */}
              <button
                onClick={toggleScreenShare}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isScreenSharing 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                    : 'bg-gray-600 hover:bg-gray-500 text-white'
                }`}
                title={isScreenSharing ? 'Stop screen sharing' : 'Start screen sharing'}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1v6h10V5H5z" clipRule="evenodd" />
                  <path d="M2 17a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" />
                  {isScreenSharing && (
                    <circle cx="10" cy="8" r="2" className="fill-blue-400" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Session Notes */}
          <div className="w-80">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Session Notes</h3>
                <button
                  onClick={handleSaveNotes}
                  className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
                >
                  Save
                </button>
              </div>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Add notes about the session..."
                className="w-full h-24 bg-gray-700 border border-gray-600 rounded p-2 text-sm resize-none focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}