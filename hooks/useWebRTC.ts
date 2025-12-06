import { useState, useEffect, useRef, useCallback } from 'react'

export interface MediaState {
  isCameraOn: boolean
  isMicOn: boolean
  isScreenSharing: boolean
  isHandRaised: boolean
  hasPermissions: boolean
  hasScreenSharePermission: boolean
  permissionError: string | null
  screenShareError: string | null
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'failed'
  hasRemoteVideo?: boolean
  hasRemoteAudio?: boolean
  hasRemoteScreenShare?: boolean
  remoteIsHandRaised?: boolean
  remoteAutoplayBlocked?: boolean
}

export type LayoutMode = 'camera-priority' | 'screen-priority' | 'camera-only'

export interface LayoutState {
  mode: LayoutMode
  canSwitchToScreenPriority: boolean
  canSwitchToCameraPriority: boolean
}

export interface WebRTCControls {
  localVideoRef: React.RefObject<HTMLVideoElement>
  localScreenShareRef: React.RefObject<HTMLVideoElement>
  remoteVideoRef: React.RefObject<HTMLVideoElement>
  remoteScreenShareRef: React.RefObject<HTMLVideoElement>
  mediaState: MediaState
  layoutState: LayoutState
  // Media controls
  toggleCamera: () => Promise<void>
  toggleMicrophone: () => Promise<void>
  startScreenShare: () => Promise<void>
  stopScreenShare: () => Promise<void>
  toggleHandRaise: () => void
  // Layout controls
  switchToScreenPriority: () => void
  switchToCameraPriority: () => void
  // Session management
  initializeMedia: () => Promise<void>
  initializePeerConnectionOnly: () => void
  cleanup: () => void
  setInitiator: (isInitiator: boolean) => void
  resumeRemotePlayback: () => Promise<void>
}

export const useWebRTC = (sessionId: string, options?: { isInitiator?: boolean }): WebRTCControls => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const localScreenShareRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const remoteScreenShareRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteStreamRef = useRef<MediaStream | null>(null)
  const remoteScreenShareStreamRef = useRef<MediaStream | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const screenStreamRef = useRef<MediaStream | null>(null)
  const pendingIceCandidatesRef = useRef<RTCIceCandidate[]>([]) // Queue for early ICE candidates
  const isInitiatorRef = useRef<boolean>(!!options?.isInitiator)

  const [mediaState, setMediaState] = useState<MediaState>({
    isCameraOn: false,
    isMicOn: false,
    isScreenSharing: false,
    isHandRaised: false,
    hasPermissions: false,
    hasScreenSharePermission: false,
    permissionError: null,
    screenShareError: null,
    connectionState: 'disconnected'
  })

  const [layoutState, setLayoutState] = useState<LayoutState>({
    mode: 'camera-only',
    canSwitchToScreenPriority: false,
    canSwitchToCameraPriority: false
  })

  // Send signaling data to other peer
  const sendSignal = useCallback(async (type: string, data: any) => {
    try {
      await fetch(`/api/session/${sessionId}/signal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data })
      })
      console.log(`📤 Sent signal: ${type}`)
    } catch (error) {
      console.error('❌ Failed to send signal:', error)
    }
  }, [sessionId])

  // Process queued ICE candidates after remote description is set
  const processQueuedIceCandidates = useCallback(async () => {
    const peerConnection = peerConnectionRef.current
    if (!peerConnection || !peerConnection.remoteDescription) return

    console.log(`🧊 Processing ${pendingIceCandidatesRef.current.length} queued ICE candidates`)
    
    for (const candidate of pendingIceCandidatesRef.current) {
      try {
        await peerConnection.addIceCandidate(candidate)
        console.log('✅ Added queued ICE candidate')
      } catch (error) {
        console.error('❌ Failed to add queued ICE candidate:', error)
      }
    }
    
    // Clear the queue
    pendingIceCandidatesRef.current = []
  }, [])

  // Handle incoming signaling messages
  const handleSignal = useCallback(async (signal: any) => {
    const peerConnection = peerConnectionRef.current
    if (!peerConnection) return

    console.log(`📥 Received signal: ${signal.type}`)

    try {
      switch (signal.type) {
        case 'offer':
          console.log('📞 Setting remote description (offer)')
          await peerConnection.setRemoteDescription(signal.data)
          const answer = await peerConnection.createAnswer()
          await peerConnection.setLocalDescription(answer)
          await sendSignal('answer', answer)
          
          // Process any queued ICE candidates now that remote description is set
          await processQueuedIceCandidates()
          break

        case 'answer':
          console.log('📞 Setting remote description (answer)')
          await peerConnection.setRemoteDescription(signal.data)
          
          // Process any queued ICE candidates now that remote description is set
          await processQueuedIceCandidates()
          break

        case 'ice-candidate':
          if (signal.data.candidate) {
            // Check if remote description is set before adding ICE candidate
            if (peerConnection.remoteDescription) {
              console.log('🧊 Adding ICE candidate immediately')
              await peerConnection.addIceCandidate(signal.data.candidate)
            } else {
              console.log('🧊 Queuing ICE candidate (remote description not set yet)')
              pendingIceCandidatesRef.current.push(signal.data.candidate)
            }
          }
          break

        case 'audio-state':
          console.log('🎤 Remote peer audio state:', signal.data.isMicOn)
          setMediaState(prev => ({ 
            ...prev, 
            hasRemoteAudio: signal.data.isMicOn 
          }))
          break

        case 'video-state':
          console.log('📹 Remote peer video state:', signal.data.isCameraOn)
          setMediaState(prev => ({ 
            ...prev, 
            hasRemoteVideo: signal.data.isCameraOn 
          }))
          
          // Force remote video element to refresh if video is turned on
          if (signal.data.isCameraOn && remoteVideoRef.current && remoteStreamRef.current) {
            setTimeout(() => {
              if (remoteVideoRef.current && remoteStreamRef.current) {
                remoteVideoRef.current.srcObject = null
                setTimeout(() => {
                  remoteVideoRef.current!.srcObject = remoteStreamRef.current
                }, 50)
              }
            }, 100)
          }
          break

        case 'screen-share-state':
          console.log('🖥️ Remote peer screen share state:', signal.data.isScreenSharing)
          setMediaState(prev => ({ 
            ...prev, 
            hasRemoteScreenShare: signal.data.isScreenSharing 
          }))
          
          // Auto-switch layout when screen sharing changes
          if (signal.data.isScreenSharing) {
            setLayoutState(prev => ({ 
              ...prev, 
              mode: 'screen-priority',
              canSwitchToScreenPriority: true,
              canSwitchToCameraPriority: true
            }))
            console.log('📋 Auto-switched to screen priority mode')
          } else {
            // If no local or remote screen share, go back to camera-only
            setTimeout(() => {
              if (!mediaState.isScreenSharing) {
                setLayoutState(prev => ({ 
                  ...prev, 
                  mode: 'camera-only',
                  canSwitchToScreenPriority: false
                }))
                console.log('📋 Auto-switched to camera-only mode')
              }
            }, 100)
          }
          break

        case 'hand-raise-state':
          console.log('✋ Remote peer hand raise state:', signal.data.isHandRaised)
          setMediaState(prev => ({ 
            ...prev, 
            remoteIsHandRaised: signal.data.isHandRaised 
          }))
          break

        case 'screen-share-start':
          console.log('🖥️ Remote peer started screen sharing')
          setMediaState(prev => ({ 
            ...prev, 
            hasRemoteVideo: true 
          }))
          break

        case 'screen-share-stop':
          console.log('🖥️ Remote peer stopped screen sharing')
          setMediaState(prev => ({ 
            ...prev, 
            hasRemoteVideo: false 
          }))
          break
      }
    } catch (error) {
      console.error('❌ Error handling signal:', error)
    }
  }, [sendSignal, processQueuedIceCandidates])

  // Initialize WebRTC peer connection
  const initializePeerConnection = useCallback(() => {
    const configuration: RTCConfiguration = {
      iceServers: [
        // STUN
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        // Public TURN (for testing). Replace with your own for production.
        {
          urls: 'turn:openrelay.metered.ca:80',
          username: 'openrelayproject',
          credential: 'openrelayproject'
        },
        {
          urls: 'turn:openrelay.metered.ca:443',
          username: 'openrelayproject',
          credential: 'openrelayproject'
        },
        {
          urls: 'turn:openrelay.metered.ca:443?transport=tcp',
          username: 'openrelayproject',
          credential: 'openrelayproject'
        }
      ]
    }

    const peerConnection = new RTCPeerConnection(configuration)

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🧊 Sending ICE candidate')
        sendSignal('ice-candidate', { candidate: event.candidate })
      }
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      console.log('📡 Received remote track:', event.track.kind, event.track.label)
      console.log('📡 Event streams:', event.streams.length)
      
      const [remoteStream] = event.streams
      const track = event.track
      
      if (remoteStream) {
        // Determine if this is a screen share or camera stream based on track label
        const isScreenShare = track.label.includes('screen') || track.label.includes('Screen') || 
                             track.label.includes('monitor') || track.label.includes('window')
        
        console.log('📺 Track type:', isScreenShare ? 'Screen Share' : 'Camera', track.label)
        
        if (isScreenShare && track.kind === 'video') {
          // Handle screen share video
          remoteScreenShareStreamRef.current = remoteStream
          
          if (remoteScreenShareRef.current) {
            remoteScreenShareRef.current.srcObject = remoteStream
            remoteScreenShareRef.current.autoplay = true
            remoteScreenShareRef.current.playsInline = true
            
            const playPromise = remoteScreenShareRef.current.play()
            if (playPromise && typeof playPromise.then === 'function') {
              playPromise
                .then(() => console.log('✅ Remote screen share playback started'))
                .catch((err) => console.warn('🔇 Screen share autoplay blocked', err))
            }
          }
          
          setMediaState(prev => ({ ...prev, isScreenSharing: true }))
        } else {
          // Handle camera video/audio
          remoteStreamRef.current = remoteStream
          
          console.log('📺 Remote camera stream tracks:', {
            video: remoteStream.getVideoTracks().length,
            audio: remoteStream.getAudioTracks().length
          })
          
          // Update remote video element immediately
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream
            remoteVideoRef.current.autoplay = true
            remoteVideoRef.current.playsInline = true
        
            // Attempt to start playback immediately
            const playPromise = remoteVideoRef.current.play()
            if (playPromise && typeof playPromise.then === 'function') {
              playPromise
                .then(() => {
                  console.log('✅ Remote video playback started')
                  setMediaState(prev => ({ ...prev, remoteAutoplayBlocked: false }))
                })
                .catch((err: any) => {
                  console.warn('🔇 Autoplay blocked for remote media, user must click to play', err)
                  setMediaState(prev => ({ ...prev, remoteAutoplayBlocked: true }))
                })
            }
          }
          
          // Update media state with track info for camera
          const hasVideo = remoteStream.getVideoTracks().some(t => t.readyState === 'live')
          const hasAudio = remoteStream.getAudioTracks().some(t => t.readyState === 'live')
          
          console.log('📊 Remote camera media status:', { hasVideo, hasAudio })
          
          setMediaState(prev => ({ 
            ...prev, 
            hasRemoteVideo: hasVideo, 
            hasRemoteAudio: hasAudio,
            connectionState: 'connected'
          }))

          // Set up track event listeners for real-time updates
          remoteStream.getTracks().forEach(track => {
            track.addEventListener('unmute', () => {
              console.log(`📡 Remote ${track.kind} track unmuted`)
              const currentStream = remoteStreamRef.current
              if (currentStream) {
                const hasVideo = currentStream.getVideoTracks().some(t => t.readyState === 'live')
                const hasAudio = currentStream.getAudioTracks().some(t => t.readyState === 'live')
                setMediaState(prev => ({ ...prev, hasRemoteVideo: hasVideo, hasRemoteAudio: hasAudio }))
              }
            })
            
            track.addEventListener('mute', () => {
              console.log(`📡 Remote ${track.kind} track muted`)
              const currentStream = remoteStreamRef.current
              if (currentStream) {
                const hasVideo = currentStream.getVideoTracks().some(t => t.readyState === 'live')
                const hasAudio = currentStream.getAudioTracks().some(t => t.readyState === 'live')
                setMediaState(prev => ({ ...prev, hasRemoteVideo: hasVideo, hasRemoteAudio: hasAudio }))
              }
            })
          })
        }
      }
    }

    // Handle connection state changes
    peerConnection.oniceconnectionstatechange = () => {
      console.log('🔗 ICE connection state:', peerConnection.iceConnectionState)
      setMediaState(prev => ({
        ...prev,
        connectionState: peerConnection.iceConnectionState === 'connected' ? 'connected' : 
                        peerConnection.iceConnectionState === 'failed' ? 'failed' : 'connecting'
      }))
    }

    peerConnection.onconnectionstatechange = () => {
      console.log('🌐 Connection state:', peerConnection.connectionState)
      
      setMediaState(prev => ({
        ...prev,
        connectionState: 
          peerConnection.connectionState === 'connected' ? 'connected' :
          peerConnection.connectionState === 'failed' ? 'failed' :
          peerConnection.connectionState === 'disconnected' ? 'disconnected' :
          'connecting'
      }))

      if (peerConnection.connectionState === 'connected') {
        console.log('🎉 Peer-to-peer connection established!')
      } else if (peerConnection.connectionState === 'failed') {
        console.log('❌ WebRTC connection failed')
      } else if (peerConnection.connectionState === 'disconnected') {
        console.log('🔌 WebRTC connection disconnected')
      }
    }

    peerConnectionRef.current = peerConnection
    return peerConnection
  }, [sendSignal])

  // Sync UI state with actual track state
  const syncMediaState = useCallback(() => {
    if (!localStreamRef.current) {
      console.log('📊 No stream to sync state with')
      return
    }

    const videoTrack = localStreamRef.current.getVideoTracks()[0]
    const audioTrack = localStreamRef.current.getAudioTracks()[0]
    
    const actualCameraState = videoTrack?.enabled || false
    const actualMicState = audioTrack?.enabled || false
    
    console.log('📊 Syncing media state:', {
      camera: actualCameraState,
      microphone: actualMicState
    })
    
    setMediaState(prev => ({
      ...prev,
      isCameraOn: actualCameraState,
      isMicOn: actualMicState
    }))
  }, [])

  // Layout management functions
  const updateLayoutCapabilities = useCallback((localScreenSharing: boolean, remoteScreenSharing: boolean) => {
    const hasAnyScreenShare = localScreenSharing || remoteScreenSharing
    const hasBothFeeds = mediaState.hasRemoteVideo || remoteScreenSharing

    setLayoutState(prev => ({
      ...prev,
      canSwitchToScreenPriority: hasAnyScreenShare,
      canSwitchToCameraPriority: hasBothFeeds,
      mode: hasAnyScreenShare && prev.mode === 'camera-only' ? 'screen-priority' : prev.mode
    }))

    console.log('📋 Layout capabilities updated:', {
      hasAnyScreenShare,
      hasBothFeeds,
      mode: hasAnyScreenShare && layoutState.mode === 'camera-only' ? 'screen-priority' : layoutState.mode
    })
  }, [mediaState.hasRemoteVideo, layoutState.mode])

  const switchToScreenPriority = useCallback(() => {
    if (layoutState.canSwitchToScreenPriority) {
      setLayoutState(prev => ({ ...prev, mode: 'screen-priority' }))
      console.log('🖥️ Switched to screen priority mode')
    }
  }, [layoutState.canSwitchToScreenPriority])

  const switchToCameraPriority = useCallback(() => {
    if (layoutState.canSwitchToCameraPriority) {
      setLayoutState(prev => ({ ...prev, mode: 'camera-priority' }))
      console.log('📹 Switched to camera priority mode')
    }
  }, [layoutState.canSwitchToCameraPriority])

  const toggleHandRaise = useCallback(() => {
    const newHandState = !mediaState.isHandRaised
    setMediaState(prev => ({ ...prev, isHandRaised: newHandState }))
    
    // Send hand raise state to peer
    if (peerConnectionRef.current) {
      sendSignal('hand-raise-state', { isHandRaised: newHandState })
    }
    
    console.log(`✋ Hand ${newHandState ? 'RAISED' : 'LOWERED'}`)
  }, [mediaState.isHandRaised, sendSignal])

  // Request camera and microphone permissions
  const initializeMedia = useCallback(async () => {
    try {
      setMediaState(prev => ({ ...prev, permissionError: null }))

      console.log('🎥 Requesting media permissions...')
      
      // Request permissions for camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      console.log('✅ Media permissions granted:', {
        video: stream.getVideoTracks().length,
        audio: stream.getAudioTracks().length
      })

      localStreamRef.current = stream

      // Display local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
        localVideoRef.current.muted = true
        localVideoRef.current.playsInline = true
        localVideoRef.current.autoplay = true
        // Kick off playback to ensure local preview starts without interaction
        const playPromise = localVideoRef.current.play()
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.catch(() => console.warn('Local video autoplay failed'))
        }
      }

      // Initialize peer connection FIRST, then add tracks
      if (!peerConnectionRef.current) {
        console.log('🔗 Initializing peer connection...')
        initializePeerConnection()
      }

      // Wait a moment for peer connection to be ready
      await new Promise(resolve => setTimeout(resolve, 100))

      const pc = peerConnectionRef.current
      if (pc) {
        console.log('📡 Adding tracks to peer connection...')
        
        // Add tracks directly to avoid sender confusion
        stream.getTracks().forEach(track => {
          console.log(`➕ Adding ${track.kind} track:`, track.label)
          pc.addTrack(track, stream)
        })
        
        console.log('📊 Peer connection senders:', pc.getSenders().length)

        // Force renegotiation to ensure both peers exchange tracks
        if (isInitiatorRef.current) {
          setTimeout(async () => {
            try {
              console.log('🔄 Creating offer to exchange new tracks')
              const offer = await pc.createOffer()
              await pc.setLocalDescription(offer)
              await sendSignal('offer', offer)
            } catch (error) {
              console.error('Failed to renegotiate after adding tracks:', error)
            }
          }, 1000)
        }
      }

      // GOOGLE MEET BEHAVIOR: Start with camera and microphone enabled by default
      console.log('🎥 Starting with camera and microphone enabled (Google Meet style)')
      stream.getVideoTracks().forEach(track => {
        track.enabled = true
        console.log(`📹 Video track enabled: ${track.label}`)
      })
      stream.getAudioTracks().forEach(track => {
        track.enabled = true
        console.log(`🎤 Audio track enabled: ${track.label}`)
      })

      setMediaState(prev => ({
        ...prev,
        hasPermissions: true,
        isCameraOn: true,  // Start with camera ON (Google Meet style)
        isMicOn: true,     // Start with microphone ON (Google Meet style)
        connectionState: 'connecting'
      }))

      // Sync UI state with actual track state to prevent drift
      syncMediaState()

      console.log('🎯 Media initialization complete - Google Meet style defaults applied')

    } catch (error: any) {
      console.error('❌ Error accessing media devices:', error)
      
      let errorMessage = 'Failed to access camera and microphone'
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera and microphone access denied. Please allow permissions and try again.'
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera or microphone found on this device.'
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Your browser does not support video calling.'
      }

      setMediaState(prev => ({
        ...prev,
        hasPermissions: false,
        permissionError: errorMessage,
        connectionState: 'failed'
      }))
    }
  }, [initializePeerConnection])

  // Initialize only peer connection without requesting media permissions
  const initializePeerConnectionOnly = useCallback(() => {
    if (!peerConnectionRef.current) {
      console.log('🔗 Initializing peer connection without media...')
      initializePeerConnection()
      setMediaState(prev => ({
        ...prev,
        connectionState: 'connecting'
      }))
    }
  }, [initializePeerConnection])

  // Toggle camera on/off - Use enabled/disabled for instant response
  const toggleCamera = useCallback(async () => {
    try {
      console.log('📹 Toggle camera requested')
      
      if (!localStreamRef.current) {
        console.log('⚠️ No local stream - requesting media first')
        await initializeMedia()
        return
      }

      const currentVideoTrack = localStreamRef.current.getVideoTracks()[0]

      if (currentVideoTrack) {
        const currentEnabled = currentVideoTrack.enabled
        const nextEnabled = !currentEnabled
        
        console.log(`📹 Current camera state: ${currentEnabled}, toggling to: ${nextEnabled}`)
        
        // Toggle the actual track
        currentVideoTrack.enabled = nextEnabled
        
        // Verify the change took effect
        const actualState = currentVideoTrack.enabled
        console.log(`📹 Camera track after toggle: ${actualState}`)
        
        // Update state to match actual track state
        setMediaState(prev => ({ 
          ...prev, 
          isCameraOn: actualState 
        }))
        
        // Send video state update to peer immediately
        if (peerConnectionRef.current) {
          sendSignal('video-state', { isCameraOn: actualState })
        }
        
        console.log(`✅ Camera ${actualState ? 'ENABLED' : 'DISABLED'}`)
        
        // Double-check state sync after a brief delay
        setTimeout(() => syncMediaState(), 100)
        return
      }

      console.log('⚠️ No video track found - requesting media permissions')
      await initializeMedia()
      // After initializing media, do NOT auto-enable - user must click again to enable
      return
    } catch (error) {
      console.error('❌ Error toggling camera:', error)
      setMediaState(prev => ({
        ...prev,
        permissionError: 'Failed to toggle camera. Please check permissions.'
      }))
    }
  }, [sendSignal, syncMediaState])

  // Toggle microphone on/off - Use enabled/disabled for instant response  
  const toggleMicrophone = useCallback(async () => {
    try {
      console.log('🎤 Toggle microphone requested')
      
      if (!localStreamRef.current) {
        console.log('⚠️ No local stream - requesting media first')
        await initializeMedia()
        return
      }

      const currentAudioTrack = localStreamRef.current.getAudioTracks()[0]

      if (currentAudioTrack) {
        const currentEnabled = currentAudioTrack.enabled
        const nextEnabled = !currentEnabled
        
        console.log(`🎤 Current microphone state: ${currentEnabled}, toggling to: ${nextEnabled}`)
        
        // Toggle the actual track
        currentAudioTrack.enabled = nextEnabled
        
        // Verify the change took effect
        const actualState = currentAudioTrack.enabled
        console.log(`🎤 Microphone track after toggle: ${actualState}`)
        
        // Update state to match actual track state
        setMediaState(prev => ({ 
          ...prev, 
          isMicOn: actualState 
        }))
        
        // Send audio state update to peer immediately
        if (peerConnectionRef.current) {
          sendSignal('audio-state', { isMicOn: actualState })
        }
        
        console.log(`✅ Microphone ${actualState ? 'ENABLED' : 'MUTED'}`)
        
        // Double-check state sync after a brief delay
        setTimeout(() => syncMediaState(), 100)
        return
      }

      console.log('⚠️ No audio track found - requesting media permissions')
      await initializeMedia()
      // After initializing media, do NOT auto-enable - user must click again to enable
      return
    } catch (error) {
      console.error('❌ Error toggling microphone:', error)
      setMediaState(prev => ({
        ...prev,
        permissionError: 'Failed to toggle microphone. Please check permissions.'
      }))
    }
  }, [sendSignal, syncMediaState])

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      setMediaState(prev => ({ ...prev, screenShareError: null }))

      // Check if getDisplayMedia is supported
      if (!navigator.mediaDevices?.getDisplayMedia) {
        throw new Error('Screen sharing is not supported in your browser')
      }

      // Request screen sharing permissions
      // iOS Safari does not support getDisplayMedia — detect and show clear error
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                    (navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1)
      if (isIOS && !(navigator.mediaDevices as any).getDisplayMedia) {
        throw Object.assign(new Error('Screen sharing is not supported on iOS Safari.'), { name: 'NotSupportedError' })
      }

      const screenStream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      screenStreamRef.current = screenStream

      // Add screen sharing as separate tracks (DON'T replace camera)
      if (peerConnectionRef.current) {
        const screenVideoTrack = screenStream.getVideoTracks()[0]
        const screenAudioTrack = screenStream.getAudioTracks()[0] // Screen audio if available
        
        // Add screen sharing tracks as ADDITIONAL tracks
        if (screenVideoTrack) {
          console.log('🖥️ Adding screen share video track as separate stream')
          peerConnectionRef.current.addTrack(screenVideoTrack, screenStream)
        }

        // Add screen audio if available
        if (screenAudioTrack) {
          console.log('🔊 Adding screen share audio track')
          peerConnectionRef.current.addTrack(screenAudioTrack, screenStream)
        }

        // Notify peer that screen sharing started
        sendSignal('screen-share-start', { hasScreenShare: true })
        
        // Force renegotiation to ensure new tracks are sent
        setTimeout(async () => {
          try {
            const offer = await peerConnectionRef.current!.createOffer()
            await peerConnectionRef.current!.setLocalDescription(offer)
            await sendSignal('offer', offer)
            console.log('🔄 Re-negotiated connection for screen share')
          } catch (error) {
            console.error('Failed to renegotiate for screen share:', error)
          }
        }, 500)
      }

      // Display local screen share in its own element (for user's preview)
      if (localScreenShareRef.current) {
        localScreenShareRef.current.srcObject = screenStream
      }

      // Listen for screen share end (user clicks "Stop sharing" in browser)
      screenStream.getVideoTracks()[0].onended = () => {
        stopScreenShare()
      }

      setMediaState(prev => ({
        ...prev,
        isScreenSharing: true,
        hasScreenSharePermission: true
      }))

      // Send screen share state to peer
      if (peerConnectionRef.current) {
        sendSignal('screen-share-state', { isScreenSharing: true })
      }

      // Update layout capabilities and auto-switch to screen priority mode
      updateLayoutCapabilities(true, mediaState.hasRemoteScreenShare || false)
      setLayoutState(prev => ({ 
        ...prev, 
        mode: 'screen-priority',
        canSwitchToScreenPriority: true,
        canSwitchToCameraPriority: true
      }))
      console.log('📋 Auto-switched to screen priority mode (local screen share started)')

    } catch (error: any) {
      console.error('Error starting screen share:', error)
      
      let errorMessage = 'Failed to start screen sharing'
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Screen sharing access denied. Please click "Share" when prompted.'
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Screen sharing is not supported in your browser.'
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No screen or window available to share.'
      } else if (error.name === 'AbortError') {
        errorMessage = 'Screen sharing was cancelled.'
      } else if (error.message) {
        errorMessage = error.message
      }

      setMediaState(prev => ({
        ...prev,
        screenShareError: errorMessage,
        hasScreenSharePermission: false
      }))
    }
  }, [sendSignal, syncMediaState, updateLayoutCapabilities, mediaState.hasRemoteScreenShare])

  // Stop screen sharing
  const stopScreenShare = useCallback(async () => {
    console.log('🛑 Stopping screen share...')
    
    // Store reference to screen tracks before nulling the stream
    const screenTracks = screenStreamRef.current?.getTracks() || []
    
    // Stop all screen share tracks
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop())
      screenStreamRef.current = null
    }

    // Remove screen share tracks from peer connection
    if (peerConnectionRef.current) {
      const senders = peerConnectionRef.current.getSenders()
      
      // Remove screen share senders by comparing track IDs
      for (const sender of senders) {
        if (sender.track) {
          const isScreenTrack = screenTracks.some(screenTrack => screenTrack.id === sender.track!.id)
          if (isScreenTrack) {
            console.log('🖥️ Removing screen share track:', sender.track.kind)
            try {
              peerConnectionRef.current!.removeTrack(sender)
            } catch (error) {
              console.warn('Failed to remove screen track:', error)
            }
          }
        }
      }

      // Notify peer that screen sharing stopped
      sendSignal('screen-share-stop', { hasScreenShare: false })
      
      // Force renegotiation to update connection
      setTimeout(async () => {
        try {
          const offer = await peerConnectionRef.current!.createOffer()
          await peerConnectionRef.current!.setLocalDescription(offer)
          await sendSignal('offer', offer)
          console.log('🔄 Re-negotiated connection after stopping screen share')
        } catch (error) {
          console.error('Failed to renegotiate after stopping screen share:', error)
        }
      }, 500)
    }

    // Clear remote screen share display
    if (remoteScreenShareRef.current) {
      remoteScreenShareRef.current.srcObject = null
    }

    // Clear local screen share display
    if (localScreenShareRef.current) {
      localScreenShareRef.current.srcObject = null
    }

    // Camera feed should remain in localVideoRef (no need to restore since we didn't hijack it)
    console.log('✅ Screen share stopped, camera feed preserved')

    setMediaState(prev => ({
      ...prev,
      isScreenSharing: false
    }))

    // Send screen share state to peer
    if (peerConnectionRef.current) {
      sendSignal('screen-share-state', { isScreenSharing: false })
    }

    // Update layout capabilities and potentially switch back to camera-only
    updateLayoutCapabilities(false, mediaState.hasRemoteScreenShare || false)
    
    // Auto-switch back to camera-only if no screen sharing is active
    setTimeout(() => {
      if (!mediaState.hasRemoteScreenShare) {
        setLayoutState(prev => ({ 
          ...prev, 
          mode: 'camera-only',
          canSwitchToScreenPriority: false
        }))
        console.log('📹 Auto-switched to camera-only mode (local screen share stopped)')
      } else {
        // If remote is still sharing, switch to screen priority for remote feed
        setLayoutState(prev => ({ 
          ...prev, 
          mode: 'screen-priority'
        }))
        console.log('📋 Switched to screen priority for remote screen share')
      }
    }, 100)
  }, [sendSignal, syncMediaState, updateLayoutCapabilities, mediaState.hasRemoteScreenShare, layoutState.mode])

  // Cleanup function - CRITICAL for privacy
  const cleanup = useCallback(() => {
    console.log('🔒 Starting media cleanup to protect user privacy...')
    
    // Stop all local media tracks (camera and microphone)
    if (localStreamRef.current) {
      console.log('🎥 Stopping camera and microphone tracks...')
      localStreamRef.current.getTracks().forEach(track => {
        console.log(`🛑 Stopping ${track.kind} track (${track.label})`)
        track.stop()
      })
      
      // Clear the video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null
      }
    }
    
    // Stop all screen sharing tracks
    if (screenStreamRef.current) {
      console.log('🖥️ Stopping screen share tracks...')
      screenStreamRef.current.getTracks().forEach(track => {
        console.log(`🛑 Stopping screen share ${track.kind} track`)
        track.stop()
      })
    }

    // Stop all remote streams
    if (remoteStreamRef.current) {
      console.log('📹 Stopping remote stream tracks...')
      remoteStreamRef.current.getTracks().forEach(track => {
        track.stop()
      })
      
      // Clear the remote video element
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null
      }
    }

    // Close peer connection and stop transceivers to ensure capture stops at source
    if (peerConnectionRef.current) {
      console.log('🔌 Closing WebRTC peer connection...')
      try {
        peerConnectionRef.current.getSenders().forEach(sender => {
          try { sender.replaceTrack(null) } catch {}
          const transceiver = (sender as any).transport ? (sender as any).transport : null
          if (transceiver && transceiver.stop) { try { transceiver.stop() } catch {} }
        })
        peerConnectionRef.current.getTransceivers?.().forEach((t: RTCRtpTransceiver) => {
          try { t.stop() } catch {}
        })
      } catch {}
      try { peerConnectionRef.current.close() } catch {}
    }

    // Clear all references
    localStreamRef.current = null
    screenStreamRef.current = null
    remoteStreamRef.current = null
    peerConnectionRef.current = null
    pendingIceCandidatesRef.current = [] // Clear ICE candidate queue

    // Reset media state to ensure UI reflects that everything is off
    setMediaState({
      isCameraOn: false,
      isMicOn: false,
      isScreenSharing: false,
      isHandRaised: false,
      hasPermissions: false,
      hasScreenSharePermission: false,
      permissionError: null,
      screenShareError: null,
      connectionState: 'disconnected'
    })

    console.log('✅ Media cleanup completed - all devices released')
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  // Cleanup on browser events (tab close / navigation). Do NOT cleanup on backgrounding
  // so camera/mic stay on when switching tabs.
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('🔒 Page unloading - ensuring media cleanup for privacy')
      cleanup()
    }

    const handlePageHide = () => {
      console.log('🔒 Page hide event - cleaning up media for privacy')
      cleanup()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('pagehide', handlePageHide)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [cleanup])

  // Poll for signaling messages from other peer
  const pollSignals = useCallback(async () => {
    try {
      const response = await fetch(`/api/session/${sessionId}/signal`)
      if (response.ok) {
        const signals = await response.json()
        for (const signal of signals) {
          await handleSignal(signal)
        }
      }
    } catch (error) {
      console.error('❌ Failed to poll signals:', error)
    }
  }, [sessionId, handleSignal])

  // Create and send offer (first user to join initiates)
  const createOffer = useCallback(async () => {
    const peerConnection = peerConnectionRef.current
    if (!peerConnection) return

    try {
      console.log('📞 Creating WebRTC offer...')
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      })
      await peerConnection.setLocalDescription(offer)
      await sendSignal('offer', offer)
      console.log('📤 Offer sent to peer')
    } catch (error) {
      console.error('❌ Error creating offer:', error)
    }
  }, [sendSignal, syncMediaState])

  // Enhanced initialization with signaling
  useEffect(() => {
    if (mediaState.hasPermissions && peerConnectionRef.current) {
      console.log('🚀 Starting WebRTC signaling process...')
      
      // Start polling for signals with adaptive frequency
      const pollFrequency = mediaState.connectionState === 'connected' ? 5000 : 1500
      const pollInterval = setInterval(pollSignals, pollFrequency)

      // Create offer after a short delay to ensure both users are ready
      const offerTimeout = setTimeout(() => {
        if (isInitiatorRef.current) {
          console.log('📞 This peer is initiator — creating offer')
          createOffer()
        } else {
          console.log('⏳ Not initiator — waiting for remote offer')
        }
      }, 2000)

      return () => {
        clearInterval(pollInterval)
        clearTimeout(offerTimeout)
      }
    }
  }, [mediaState.hasPermissions, mediaState.connectionState, pollSignals, createOffer])

  const setInitiator = useCallback((isInitiator: boolean) => {
    isInitiatorRef.current = isInitiator
    // If media and peer connection are ready and this peer becomes initiator, create an offer
    if (isInitiator && mediaState.hasPermissions && peerConnectionRef.current) {
      // small delay to ensure tracks are attached
      setTimeout(() => {
        if (isInitiatorRef.current) {
          console.log('📞 Initiator set at runtime — creating offer')
          createOffer()
        }
      }, 500)
    }
  }, [mediaState.hasPermissions, createOffer])

  const resumeRemotePlayback = useCallback(async () => {
    if (remoteVideoRef.current) {
      try {
        await remoteVideoRef.current.play()
        setMediaState(prev => ({ ...prev, remoteAutoplayBlocked: false }))
      } catch (e) {
        // Ignore if still blocked
      }
    }
  }, [])

  return {
    localVideoRef,
    localScreenShareRef,
    remoteVideoRef,
    remoteScreenShareRef,
    mediaState,
    layoutState,
    // Media controls
    toggleCamera,
    toggleMicrophone,
    startScreenShare,
    stopScreenShare,
    toggleHandRaise,
    // Layout controls
    switchToScreenPriority,
    switchToCameraPriority,
    // Session management
    initializeMedia,
    initializePeerConnectionOnly,
    cleanup,
    setInitiator,
    resumeRemotePlayback
  }
}
