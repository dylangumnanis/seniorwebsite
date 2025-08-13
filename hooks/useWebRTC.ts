import { useState, useEffect, useRef, useCallback } from 'react';

interface MediaState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  connectionState: RTCPeerConnectionState;
  isConnected: boolean;
}

interface WebRTCHookReturn extends MediaState {
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  toggleVideo: () => Promise<void>;
  toggleAudio: () => Promise<void>;
  toggleScreenShare: () => Promise<void>;
  startCall: () => Promise<void>;
  endCall: () => void;
  sendSignal: (signal: any) => void;
  receiveSignal: (signal: any) => void;
}

export const useWebRTC = (sessionId: string): WebRTCHookReturn => {
  const [mediaState, setMediaState] = useState<MediaState>({
    localStream: null,
    remoteStream: null,
    isVideoEnabled: false,
    isAudioEnabled: false,
    isScreenSharing: false,
    connectionState: 'new',
    isConnected: false
  });

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const iceCandidatesBuffer = useRef<RTCIceCandidate[]>([]);

  // ICE configuration for better connectivity
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  // Initialize peer connection
  const initializePeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const pc = new RTCPeerConnection(iceServers);
    peerConnectionRef.current = pc;

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('🔗 Connection state:', pc.connectionState);
      setMediaState(prev => ({
        ...prev,
        connectionState: pc.connectionState,
        isConnected: pc.connectionState === 'connected'
      }));
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log('📡 Received remote stream!', event.streams[0]);
      const remoteStream = event.streams[0];
      setMediaState(prev => ({ ...prev, remoteStream }));
      
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🧊 Sending ICE candidate');
        sendSignalToServer({
          type: 'ice-candidate',
          candidate: event.candidate,
          sessionId
        });
      }
    };

    return pc;
  }, [sessionId]);

  // Get user media with proper error handling
  const getUserMedia = useCallback(async (constraints: MediaStreamConstraints): Promise<MediaStream | null> => {
    try {
      console.log('🎥 Requesting user media:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('✅ User media granted');
      return stream;
    } catch (error) {
      console.error('❌ Failed to get user media:', error);
      return null;
    }
  }, []);

  // Start call with proper media setup
  const startCall = useCallback(async () => {
    try {
      console.log('🚀 Starting WebRTC call...');
      
      // Get user media
      const stream = await getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (!stream) {
        throw new Error('Failed to get user media');
      }

      localStreamRef.current = stream;
      setMediaState(prev => ({
        ...prev,
        localStream: stream,
        isVideoEnabled: true,
        isAudioEnabled: true
      }));

      // Display local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize peer connection
      const pc = initializePeerConnection();
      
      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      console.log('✅ WebRTC initialization complete');
    } catch (error) {
      console.error('❌ Failed to start call:', error);
    }
  }, [getUserMedia, initializePeerConnection]);

  // Toggle video with proper track management
  const toggleVideo = useCallback(async () => {
    try {
      const currentStream = localStreamRef.current;
      if (!currentStream) return;

      const videoTrack = currentStream.getVideoTracks()[0];
      
      if (videoTrack) {
        // Toggle existing track
        videoTrack.enabled = !videoTrack.enabled;
        setMediaState(prev => ({ ...prev, isVideoEnabled: videoTrack.enabled }));
        console.log(`📹 Video ${videoTrack.enabled ? 'enabled' : 'disabled'}`);
      } else if (!mediaState.isVideoEnabled) {
        // Get new video track if none exists
        const newStream = await getUserMedia({ video: true, audio: false });
        if (newStream) {
          const newVideoTrack = newStream.getVideoTracks()[0];
          currentStream.addTrack(newVideoTrack);
          
          // Update peer connection
          if (peerConnectionRef.current) {
            const sender = peerConnectionRef.current.getSenders().find(s => 
              s.track && s.track.kind === 'video'
            );
            if (sender) {
              await sender.replaceTrack(newVideoTrack);
            } else {
              peerConnectionRef.current.addTrack(newVideoTrack, currentStream);
            }
          }
          
          setMediaState(prev => ({ ...prev, isVideoEnabled: true }));
          console.log('📹 Video track added and enabled');
        }
      }
    } catch (error) {
      console.error('❌ Failed to toggle video:', error);
    }
  }, [mediaState.isVideoEnabled, getUserMedia]);

  // Toggle audio with proper track management
  const toggleAudio = useCallback(async () => {
    try {
      const currentStream = localStreamRef.current;
      if (!currentStream) return;

      const audioTrack = currentStream.getAudioTracks()[0];
      
      if (audioTrack) {
        // Toggle existing track
        audioTrack.enabled = !audioTrack.enabled;
        setMediaState(prev => ({ ...prev, isAudioEnabled: audioTrack.enabled }));
        console.log(`🎤 Audio ${audioTrack.enabled ? 'enabled' : 'disabled'}`);
      } else if (!mediaState.isAudioEnabled) {
        // Get new audio track if none exists
        const newStream = await getUserMedia({ video: false, audio: true });
        if (newStream) {
          const newAudioTrack = newStream.getAudioTracks()[0];
          currentStream.addTrack(newAudioTrack);
          
          // Update peer connection
          if (peerConnectionRef.current) {
            const sender = peerConnectionRef.current.getSenders().find(s => 
              s.track && s.track.kind === 'audio'
            );
            if (sender) {
              await sender.replaceTrack(newAudioTrack);
            } else {
              peerConnectionRef.current.addTrack(newAudioTrack, currentStream);
            }
          }
          
          setMediaState(prev => ({ ...prev, isAudioEnabled: true }));
          console.log('🎤 Audio track added and enabled');
        }
      }
    } catch (error) {
      console.error('❌ Failed to toggle audio:', error);
    }
  }, [mediaState.isAudioEnabled, getUserMedia]);

  // Toggle screen sharing
  const toggleScreenShare = useCallback(async () => {
    try {
      if (mediaState.isScreenSharing) {
        // Stop screen sharing, return to camera
        const stream = await getUserMedia({ video: true, audio: false });
        if (stream && peerConnectionRef.current) {
          const videoTrack = stream.getVideoTracks()[0];
          const sender = peerConnectionRef.current.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            await sender.replaceTrack(videoTrack);
          }
          
          // Update local stream
          if (localStreamRef.current) {
            const oldVideoTrack = localStreamRef.current.getVideoTracks()[0];
            if (oldVideoTrack) {
              localStreamRef.current.removeTrack(oldVideoTrack);
              oldVideoTrack.stop();
            }
            localStreamRef.current.addTrack(videoTrack);
          }
          
          // Update local video display
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
          }
          
          setMediaState(prev => ({ 
            ...prev, 
            isScreenSharing: false, 
            isVideoEnabled: true 
          }));
          console.log('📺 Screen sharing stopped, returned to camera');
        }
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        if (screenStream && peerConnectionRef.current) {
          const videoTrack = screenStream.getVideoTracks()[0];
          const sender = peerConnectionRef.current.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          
          if (sender) {
            await sender.replaceTrack(videoTrack);
          }
          
          // Handle screen share ending
          videoTrack.onended = () => {
            toggleScreenShare(); // This will switch back to camera
          };
          
          setMediaState(prev => ({ 
            ...prev, 
            isScreenSharing: true, 
            isVideoEnabled: true 
          }));
          console.log('📺 Screen sharing started');
        }
      }
    } catch (error) {
      console.error('❌ Failed to toggle screen share:', error);
    }
  }, [mediaState.isScreenSharing, getUserMedia]);

  // Send signal to server (WebSocket or API)
  const sendSignalToServer = useCallback(async (signal: any) => {
    try {
      const response = await fetch(`/api/session/${sessionId}/signal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signal)
      });
      if (!response.ok) {
        throw new Error('Failed to send signal');
      }
    } catch (error) {
      console.error('❌ Failed to send signal:', error);
    }
  }, [sessionId]);

  // Send signal (create offer/answer)
  const sendSignal = useCallback(async (signal: any) => {
    if (!peerConnectionRef.current) return;

    try {
      if (signal.type === 'offer') {
        console.log('📞 Creating answer for received offer');
        await peerConnectionRef.current.setRemoteDescription(signal);
        
        // Process buffered ICE candidates
        for (const candidate of iceCandidatesBuffer.current) {
          await peerConnectionRef.current.addIceCandidate(candidate);
        }
        iceCandidatesBuffer.current = [];
        
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        
        sendSignalToServer({
          type: 'answer',
          ...answer,
          sessionId
        });
      } else if (signal.type === 'answer') {
        console.log('📞 Receiving answer');
        await peerConnectionRef.current.setRemoteDescription(signal);
      } else if (signal.type === 'ice-candidate') {
        if (peerConnectionRef.current.remoteDescription) {
          await peerConnectionRef.current.addIceCandidate(signal.candidate);
        } else {
          iceCandidatesBuffer.current.push(signal.candidate);
        }
      }
    } catch (error) {
      console.error('❌ Failed to handle signal:', error);
    }
  }, [sessionId, sendSignalToServer]);

  // Receive signal (handle incoming offer/answer/ice)
  const receiveSignal = useCallback(async (signal: any) => {
    if (!peerConnectionRef.current) return;

    try {
      if (signal.type === 'offer') {
        await sendSignal(signal);
      } else if (signal.type === 'answer') {
        await peerConnectionRef.current.setRemoteDescription(signal);
      } else if (signal.type === 'ice-candidate') {
        if (peerConnectionRef.current.remoteDescription) {
          await peerConnectionRef.current.addIceCandidate(signal.candidate);
        } else {
          iceCandidatesBuffer.current.push(signal.candidate);
        }
      }
    } catch (error) {
      console.error('❌ Failed to receive signal:', error);
    }
  }, [sendSignal]);

  // End call with proper cleanup
  const endCall = useCallback(() => {
    console.log('🛑 Ending call and cleaning up...');
    
    // Stop all local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`🛑 Stopped ${track.kind} track`);
      });
      localStreamRef.current = null;
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    
    // Reset state
    setMediaState({
      localStream: null,
      remoteStream: null,
      isVideoEnabled: false,
      isAudioEnabled: false,
      isScreenSharing: false,
      connectionState: 'closed',
      isConnected: false
    });
    
    console.log('✅ Call cleanup complete - all devices stopped');
  }, []);

  // Signal polling for real-time communication
  useEffect(() => {
    if (!sessionId) return;

    let lastTimestamp = '';
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/session/${sessionId}/signal?since=${lastTimestamp}`
        );
        if (response.ok) {
          const { signals } = await response.json();
          
          for (const signal of signals) {
            if (signal.timestamp > lastTimestamp) {
              await receiveSignal(signal);
              lastTimestamp = signal.timestamp;
            }
          }
        }
      } catch (error) {
        console.error('❌ Signal polling error:', error);
      }
    }, 1000); // Poll every second

    return () => {
      clearInterval(pollInterval);
    };
  }, [sessionId, receiveSignal]);

  // Create offer when starting call
  useEffect(() => {
    const createOffer = async () => {
      if (peerConnectionRef.current && mediaState.localStream) {
        try {
          console.log('📞 Creating offer...');
          const offer = await peerConnectionRef.current.createOffer();
          await peerConnectionRef.current.setLocalDescription(offer);
          
          await sendSignalToServer({
            type: 'offer',
            ...offer,
            sessionId
          });
          console.log('📤 Offer sent');
        } catch (error) {
          console.error('❌ Failed to create offer:', error);
        }
      }
    };

    // Small delay to ensure both users are ready
    const timer = setTimeout(createOffer, 2000);
    return () => clearTimeout(timer);
  }, [mediaState.localStream, sessionId, sendSignalToServer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, [endCall]);

  return {
    ...mediaState,
    localVideoRef,
    remoteVideoRef,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    startCall,
    endCall,
    sendSignal,
    receiveSignal
  };
};