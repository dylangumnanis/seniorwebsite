'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface WebRTCOptions {
  sessionId: string
  isVolunteer: boolean
}

interface MediaState {
  cameraEnabled: boolean
  microphoneEnabled: boolean
  screenSharing: boolean
}

export function useWebRTC({ sessionId, isVolunteer }: WebRTCOptions) {
  // Video refs for local and remote streams
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  
  // Media streams
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  
  // Media state (only controls local user's devices)
  const [mediaState, setMediaState] = useState<MediaState>({
    cameraEnabled: false,
    microphoneEnabled: false,
    screenSharing: false
  })
  
  // Connection state
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // WebRTC objects
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastSignalTimestamp = useRef<string | null>(null)
  
  // Initialize media devices
  const initializeMedia = useCallback(async () => {
    try {
      console.log('🎥 Initializing local media...')
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      // Start with devices off
      stream.getVideoTracks().forEach(track => track.enabled = false)
      stream.getAudioTracks().forEach(track => track.enabled = false)
      
      setLocalStream(stream)
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      console.log('📹 Local media initialized successfully')
      return stream
    } catch (err) {
      console.error('❌ Error accessing media devices:', err)
      setError('Could not access camera or microphone')
      return null
    }
  }, [])
  
  // Toggle camera (only affects local user)
  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks()
      if (videoTracks.length > 0) {
        const newState = !mediaState.cameraEnabled
        videoTracks[0].enabled = newState
        
        setMediaState(prev => ({ ...prev, cameraEnabled: newState }))
        console.log(`📹 Camera ${newState ? 'enabled' : 'disabled'} locally`)
      }
    }
  }, [localStream, mediaState.cameraEnabled])
  
  // Toggle microphone (only affects local user)
  const toggleMicrophone = useCallback(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks()
      if (audioTracks.length > 0) {
        const newState = !mediaState.microphoneEnabled
        audioTracks[0].enabled = newState
        
        setMediaState(prev => ({ ...prev, microphoneEnabled: newState }))
        console.log(`🎤 Microphone ${newState ? 'enabled' : 'disabled'} locally`)
      }
    }
  }, [localStream, mediaState.microphoneEnabled])
  
  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      console.log('🖥️ Starting screen share...')
      
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      })
      
      // Replace video track in peer connection
      if (peerConnectionRef.current && localStream) {
        const videoTrack = screenStream.getVideoTracks()[0]
        const sender = peerConnectionRef.current.getSenders().find(s => 
          s.track?.kind === 'video'
        )
        
        if (sender) {
          await sender.replaceTrack(videoTrack)
        }
        
        // Handle screen share ending
        videoTrack.onended = () => {
          stopScreenShare()
        }
      }
      
      setMediaState(prev => ({ ...prev, screenSharing: true }))
      console.log('🖥️ Screen sharing started')
    } catch (err) {
      console.error('❌ Error starting screen share:', err)
      setError('Could not start screen sharing')
    }
  }, [localStream])
  
  // Stop screen sharing
  const stopScreenShare = useCallback(async () => {
    try {
      console.log('🖥️ Stopping screen share...')
      
      if (peerConnectionRef.current && localStream) {
        const videoTrack = localStream.getVideoTracks()[0]
        const sender = peerConnectionRef.current.getSenders().find(s => 
          s.track?.kind === 'video'
        )
        
        if (sender && videoTrack) {
          await sender.replaceTrack(videoTrack)
        }
      }
      
      setMediaState(prev => ({ ...prev, screenSharing: false }))
      console.log('🖥️ Screen sharing stopped')
    } catch (err) {
      console.error('❌ Error stopping screen share:', err)
    }
  }, [localStream])
  
  // Initialize WebRTC connection
  const initializeWebRTC = useCallback(async () => {
    try {
      console.log('🚀 Initializing WebRTC connection...')
      
      // Create peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      })
      
      peerConnectionRef.current = peerConnection
      
      // Add local stream to peer connection
      if (localStream) {
        localStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, localStream)
        })
      }
      
      // Handle remote stream
      peerConnection.ontrack = (event) => {
        console.log('📡 Received remote stream')
        const [stream] = event.streams
        setRemoteStream(stream)
        
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream
        }
      }
      
      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log('🔗 Connection state:', peerConnection.connectionState)
        setIsConnected(peerConnection.connectionState === 'connected')
      }
      
      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignal({
            type: 'ice-candidate',
            candidate: event.candidate
          })
        }
      }
      
      // Create offer if volunteer
      if (isVolunteer) {
        const offer = await peerConnection.createOffer()
        await peerConnection.setLocalDescription(offer)
        sendSignal({
          type: 'offer',
          offer: offer
        })
      }
      
      // Start polling for signals
      startSignalPolling()
      
      console.log('✅ WebRTC peer connection initialized')
    } catch (err) {
      console.error('❌ Error initializing WebRTC:', err)
      setError('Failed to initialize video connection')
    }
  }, [localStream, sessionId, isVolunteer])
  
  // Send signal to other peer
  const sendSignal = useCallback(async (data: any) => {
    try {
      await fetch(`/api/session/${sessionId}/signal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    } catch (err) {
      console.error('❌ Error sending signal:', err)
    }
  }, [sessionId])
  
  // Handle incoming signals
  const handleSignal = useCallback(async (signal: any) => {
    const peerConnection = peerConnectionRef.current
    if (!peerConnection) return
    
    try {
      switch (signal.type) {
        case 'offer':
          console.log('📥 Received offer')
          await peerConnection.setRemoteDescription(signal.offer)
          const answer = await peerConnection.createAnswer()
          await peerConnection.setLocalDescription(answer)
          sendSignal({
            type: 'answer',
            answer: answer
          })
          break
          
        case 'answer':
          console.log('📥 Received answer')
          await peerConnection.setRemoteDescription(signal.answer)
          break
          
        case 'ice-candidate':
          console.log('📥 Received ICE candidate')
          await peerConnection.addIceCandidate(signal.candidate)
          break
      }
    } catch (err) {
      console.error('❌ Error handling signal:', err)
    }
  }, [sendSignal])
  
  // Poll for signals
  const startSignalPolling = useCallback(() => {
    const pollSignals = async () => {
      try {
        const url = `/api/session/${sessionId}/signal${
          lastSignalTimestamp.current ? `?since=${lastSignalTimestamp.current}` : ''
        }`
        
        const response = await fetch(url)
        const data = await response.json()
        
        if (data.signals && data.signals.length > 0) {
          for (const signal of data.signals) {
            await handleSignal(signal)
            lastSignalTimestamp.current = signal.timestamp
          }
        }
      } catch (err) {
        console.error('❌ Error polling signals:', err)
      }
    }
    
    // Poll every 1 second
    pollingIntervalRef.current = setInterval(pollSignals, 1000)
    
    // Poll immediately
    pollSignals()
  }, [sessionId, handleSignal])
  
  // Clean up media and connections
  const cleanup = useCallback(() => {
    console.log('🧹 Cleaning up WebRTC resources...')
    
    // Stop all local stream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop()
        console.log(`🛑 Stopped ${track.kind} track`)
      })
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    
    // Stop polling
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    
    // Reset state
    setLocalStream(null)
    setRemoteStream(null)
    setIsConnected(false)
    setMediaState({
      cameraEnabled: false,
      microphoneEnabled: false,
      screenSharing: false
    })
    
    console.log('✅ Cleanup completed')
  }, [localStream])
  
  // Initialize everything on mount
  useEffect(() => {
    const init = async () => {
      const stream = await initializeMedia()
      if (stream) {
        await initializeWebRTC()
      }
    }
    
    init()
    
    // Cleanup on unmount
    return () => {
      cleanup()
    }
  }, [initializeMedia, initializeWebRTC, cleanup])
  
  return {
    // Video refs
    localVideoRef,
    remoteVideoRef,
    
    // Streams
    localStream,
    remoteStream,
    
    // Media controls (only affect local user)
    mediaState,
    toggleCamera,
    toggleMicrophone,
    startScreenShare,
    stopScreenShare,
    
    // Connection state
    isConnected,
    error,
    
    // Cleanup
    cleanup
  }
}