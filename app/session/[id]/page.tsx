'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useColorModeValue,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  Badge,
  Divider,
  SimpleGrid,
  Icon,
  Avatar,
  Flex,
} from '@chakra-ui/react'
import { FaVideo, FaPhoneAlt, FaComments, FaNotesMedical, FaSignOutAlt, FaCheckCircle, FaMicrophone, FaMicrophoneSlash, FaVideoSlash, FaDesktop, FaStop } from 'react-icons/fa'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useWebRTC } from '../../../hooks/useWebRTC'
import MediaPermissionGuide from '../../../components/MediaPermissionGuide'
import ScreenShareGuide from '../../../components/ScreenShareGuide'

interface SessionData {
  id: string
  seniorName: string
  volunteerName: string
  helpTopic: string
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  startTime: string
  duration: number
  notes: string
  isVolunteer: boolean
  isSenior: boolean
}

export default function SessionPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [sessionStatus, setSessionStatus] = useState<'connecting' | 'active' | 'completed'>('connecting')
  const [elapsedTime, setElapsedTime] = useState(0)

  const cardBg = useColorModeValue('white', 'gray.700')
  const bgColor = useColorModeValue('gray.100', 'gray.900')
  
  // Initialize WebRTC with default settings for Google Meet-style behavior
  const webRTC = useWebRTC(params.id as string, { isInitiator: false })

  useEffect(() => {
    if (params.id) {
      fetchSessionData()
    }
  }, [params.id])

  // Initialize peer connection without media permissions
  useEffect(() => {
    if (sessionData) {
      initializeConnection()
    }
  }, [sessionData])

  const initializeConnection = async () => {
    try {
      // Initialize WebRTC peer connection without requesting media permissions
      webRTC.initializePeerConnectionOnly()
      // Set session to active without media
      setTimeout(() => setSessionStatus('active'), 1000)
    } catch (error) {
      console.error('Failed to initialize connection:', error)
      setSessionStatus('active') // Continue anyway
    }
  }

  const requestMediaPermissions = async () => {
    try {
      await webRTC.initializeMedia()
    } catch (error) {
      console.error('Failed to get media permissions:', error)
    }
  }

  // Timer effect for live sessions
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (sessionStatus === 'active' && sessionData) {
      interval = setInterval(() => {
        const startTime = new Date(sessionData.startTime)
        const currentTime = new Date()
        const elapsed = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000)
        setElapsedTime(elapsed)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [sessionStatus, sessionData])

  const fetchSessionData = async () => {
    try {
      const response = await fetch(`/api/session/${params.id}`)
      
      if (response.ok) {
        const data = await response.json()
        setSessionData(data)
        setNotes(data.notes || '')
        
        // Set initial elapsed time
        const startTime = new Date(data.startTime)
        const currentTime = new Date()
        const elapsed = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000)
        setElapsedTime(elapsed)

        // Decide initiator based on role for more reliable offer/answer
        // Volunteers initiate by default; seniors wait for offer
        if (data.isVolunteer) {
          webRTC.setInitiator(true)
        } else {
          webRTC.setInitiator(false)
        }
        
      } else if (response.status === 404) {
        console.error('Session not found')
        router.push('/volunteer')
      } else {
        console.error('Failed to fetch session data')
      }
    } catch (error) {
      console.error('Failed to fetch session data:', error)
      router.push('/volunteer')
    } finally {
      setLoading(false)
    }
  }

  const handleEndSession = useCallback(async () => {
    try {
      console.log('🔒 User ended session - starting privacy cleanup...')
      
      // CRITICAL: Immediately cleanup WebRTC connections for privacy
      webRTC.cleanup()
      
      // Update session status and save notes
      await fetch(`/api/session/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'COMPLETED',
          notes: notes,
          duration: Math.floor(elapsedTime / 60) // Convert to minutes
        })
      })
      
      setSessionStatus('completed')
      
      // Redirect back to appropriate dashboard after showing privacy confirmation
      setTimeout(() => {
        if (sessionData?.isVolunteer) {
          router.push('/volunteer')
        } else if (sessionData?.isSenior) {
          router.push('/senior')
        } else {
          router.push('/')
        }
      }, 3000) // Slightly longer to show privacy message
    } catch (error) {
      console.error('Failed to end session:', error)
      // CRITICAL: Always cleanup even if API call fails
      console.log('🔒 API failed but still cleaning up media for privacy')
      webRTC.cleanup()
      setSessionStatus('completed')
      setTimeout(() => router.push('/volunteer'), 3000)
    }
  }, [params.id, notes, elapsedTime, sessionData?.isVolunteer, sessionData?.isSenior, webRTC, router])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading session...</Text>
      </Container>
    )
  }

  if (sessionStatus === 'completed') {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="center">
          <Icon as={FaCheckCircle} w={16} h={16} color="green.500" />
          <Heading size="lg" color="green.600">Session Completed!</Heading>
          <Text textAlign="center" color="gray.600">
            {sessionData?.isVolunteer 
              ? `Thank you for helping ${sessionData?.seniorName}. Your impact makes a difference!`
              : `Thank you for learning with ${sessionData?.volunteerName}. Keep up the great progress!`}
          </Text>
          
          {/* Privacy Confirmation */}
          <Alert status="success" borderRadius="md" maxW="md">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold" fontSize="sm">Privacy Protected</Text>
              <Text fontSize="xs">
                Camera and microphone have been safely turned off and disconnected.
              </Text>
            </Box>
          </Alert>
          
          <Button onClick={() => router.push('/volunteer')} colorScheme="green">
            Return to Dashboard
          </Button>
        </VStack>
      </Container>
    )
  }

  return (
    <Box minH="100vh" bg="gray.900" color="white">
      {/* Session Header */}
      <Box bg="gray.800" py={4} borderBottom="1px solid" borderColor="gray.700">
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <Avatar name={sessionData?.seniorName} size="md" />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" fontSize="lg">{sessionData?.seniorName}</Text>
                <HStack>
                  <Badge colorScheme={sessionStatus === 'active' ? 'green' : 'orange'}>
                    {sessionStatus === 'active' ? 'Active Session' : 'Connecting...'}
                  </Badge>
                  <Text fontSize="sm" color="gray.400">{sessionData?.helpTopic}</Text>
                </HStack>
              </VStack>
            </HStack>

            <HStack spacing={3}>
              <Button colorScheme="red" leftIcon={<FaSignOutAlt />} onClick={handleEndSession}>
                End Session
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        {sessionStatus === 'connecting' && (
          <Alert status="info" mb={6} borderRadius="lg">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">
                {sessionData?.isVolunteer 
                  ? `Connecting to ${sessionData?.seniorName}...`
                  : `Connecting to ${sessionData?.volunteerName}...`}
              </Text>
              <Text fontSize="sm">
                {sessionData?.isVolunteer 
                  ? "Please wait while we establish the connection. The senior will be notified you're joining."
                  : "Please wait while we establish the connection. Your volunteer is getting ready to help you."}
              </Text>
            </Box>
          </Alert>
        )}

        {/* If the browser blocked remote audio autoplay, prompt user to enable */}
        {webRTC.mediaState.remoteAutoplayBlocked && (
          <Alert status="warning" mb={6} borderRadius="lg">
            <AlertIcon />
            <HStack justify="space-between" w="full">
              <Text>Audio is paused by your browser. Tap "Enable Sound" to hear the other participant.</Text>
              <Button size="sm" colorScheme="blue" onClick={webRTC.resumeRemotePlayback}>Enable Sound</Button>
            </HStack>
          </Alert>
        )}

        {/* Google Meet-Style Video Conferencing Layout */}
        <Box h="calc(100vh - 200px)" bg={bgColor} position="relative">
          {/* Main Video Container */}
          <Box h="full" position="relative" overflow="hidden">
            {/* Main Display Area */}
            <Box h="full" w="full" position="relative" bg="gray.900">
                  {/* Permission Error Display */}
                  {webRTC.mediaState.permissionError && (
                    <Box
                      position="absolute"
                      top={4}
                      left={4}
                      right={4}
                      zIndex={10}
                    >
                      <Alert status="warning" borderRadius="md">
                        <AlertIcon />
                        <Box>
                          <Text fontWeight="bold">Media Access Issue</Text>
                          <Text fontSize="sm">{webRTC.mediaState.permissionError}</Text>
                        </Box>
                      </Alert>
                    </Box>
                  )}

              {/* Dynamic Main Display based on Layout Mode */}
              {webRTC.layoutState.mode === 'camera-only' && (
                /* Camera Only Mode - Default state */
                <Box h="full" w="full" position="relative">
                    <video
                      ref={webRTC.remoteVideoRef}
                      autoPlay
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      backgroundColor: '#1a202c',
                      display: webRTC.mediaState.hasRemoteVideo ? 'block' : 'none'
                      }}
                    />

                  {/* Camera Only Placeholder */}
                  {!webRTC.mediaState.hasRemoteVideo && (
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexDirection="column"
                      bg="gray.800"
                    >
                      <VStack spacing={4}>
                        <Avatar 
                          name={sessionData?.isVolunteer ? sessionData?.seniorName : sessionData?.volunteerName} 
                          size="2xl" 
                        />
                        <Text fontSize="xl" color="white" fontWeight="bold">
                          {sessionData?.isVolunteer ? sessionData?.seniorName : sessionData?.volunteerName}
                        </Text>
                        <Text color="gray.400" fontSize="sm">
                          {webRTC.mediaState.connectionState === 'connected' ? 'Camera off' : 'Connecting...'}
                        </Text>
                      </VStack>
                    </Box>
                  )}
                </Box>
              )}

              {webRTC.layoutState.mode === 'screen-priority' && (
                /* Screen Priority Mode - Large screen share, small camera */
                <Box h="full" w="full" position="relative">
                  {/* Main Screen Share Display */}
                  <video
                    ref={webRTC.remoteScreenShareRef}
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      backgroundColor: '#1a202c'
                    }}
                  />
                  
                  {/* Small Camera Thumbnail (Top Right) */}
                  <Box
                    position="absolute"
                    top={4}
                    right={4}
                    w="200px"
                    h="150px"
                    borderRadius="lg"
                    overflow="hidden"
                    border="2px solid"
                    borderColor="blue.400"
                    bg="gray.800"
                    cursor="pointer"
                    onClick={webRTC.switchToCameraPriority}
                    title="Click to switch to camera view"
                    transition="all 0.3s ease"
                    _hover={{ transform: 'scale(1.05)', borderColor: 'blue.300' }}
                  >
                    <video
                      ref={webRTC.remoteVideoRef}
                      autoPlay
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    
                    {/* Camera Off Overlay */}
                    {!webRTC.mediaState.hasRemoteVideo && (
                      <Box
                        position="absolute"
                        top="0"
                        left="0"
                        right="0"
                        bottom="0"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bg="gray.800"
                      >
                        <Avatar name={sessionData?.isVolunteer ? sessionData?.seniorName : sessionData?.volunteerName} size="sm" />
                      </Box>
                    )}
                    
                    {/* Thumbnail Label */}
                    <Box
                      position="absolute"
                      bottom={1}
                      left={1}
                      right={1}
                      bg="blackAlpha.800"
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      <Text fontSize="xs" color="white" textAlign="center">
                        {sessionData?.isVolunteer ? sessionData?.seniorName : sessionData?.volunteerName}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              )}

              {webRTC.layoutState.mode === 'camera-priority' && (
                /* Camera Priority Mode - Large camera, small screen share */
                <Box h="full" w="full" position="relative">
                  {/* Main Camera Display */}
                  <video
                    ref={webRTC.remoteVideoRef}
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      backgroundColor: '#1a202c'
                    }}
                  />
                  
                  {/* Small Screen Share Thumbnail (Top Right) */}
                  {(webRTC.mediaState.isScreenSharing || webRTC.mediaState.hasRemoteScreenShare) && (
                    <Box
                      position="absolute"
                      top={4}
                      right={4}
                      w="200px"
                      h="150px"
                      borderRadius="lg"
                      overflow="hidden"
                      border="2px solid"
                      borderColor="orange.400"
                      bg="gray.800"
                      cursor="pointer"
                      onClick={webRTC.switchToScreenPriority}
                      title="Click to switch to screen share view"
                      transition="all 0.3s ease"
                      _hover={{ transform: 'scale(1.05)', borderColor: 'orange.300' }}
                    >
                      <video
                        ref={webRTC.remoteScreenShareRef}
                        autoPlay
                        playsInline
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                      
                      {/* Thumbnail Label */}
                      <Box
                        position="absolute"
                        bottom={1}
                        left={1}
                        right={1}
                        bg="blackAlpha.800"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        <Text fontSize="xs" color="white" textAlign="center">
                          Screen Share
                        </Text>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {/* Local Video Preview (Bottom Left) - Always visible when camera is on */}
              {webRTC.mediaState.isCameraOn && (
                <Box
                  position="absolute"
                  bottom={4}
                  left={4}
                  w="160px"
                  h="120px"
                  borderRadius="lg"
                  overflow="hidden"
                  border="2px solid"
                  borderColor="green.400"
                    bg="gray.800"
                  >
                    <video
                      ref={webRTC.localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scaleX(-1)' // Mirror effect for local video
                      }}
                    />
                    
                  {/* Local Video Label */}
                      <Box
                        position="absolute"
                    bottom={1}
                    left={1}
                    right={1}
                    bg="blackAlpha.800"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    <Text fontSize="xs" color="white" textAlign="center">
                      You
                          </Text>
                      </Box>
                        </Box>
                      )}
                      
              {/* Connection Status Indicator */}
                  <Box
                    position="absolute"
                    top={4}
                    left={4}
                    bg="blackAlpha.700"
                    px={3}
                    py={1}
                    borderRadius="md"
                  >
                    <HStack spacing={2}>
                      <Box
                        w={2}
                        h={2}
                        borderRadius="full"
                        bg={
                          webRTC.mediaState.connectionState === 'connected' ? 'green.400' :
                          webRTC.mediaState.connectionState === 'connecting' ? 'yellow.400' : 'red.400'
                        }
                      />
                      <Text fontSize="xs" color="white" textTransform="capitalize">
                        {webRTC.mediaState.connectionState}
                      </Text>
                    </HStack>
                  </Box>

              {/* Hand Raise Indicator */}
              {webRTC.mediaState.remoteIsHandRaised && (
                    <Box
                      position="absolute"
                      top={4}
                  right={webRTC.layoutState.mode === 'camera-only' ? 4 : 220}
                  bg="yellow.500"
                      px={3}
                      py={1}
                      borderRadius="md"
                  animation="bounce 1s infinite"
                    >
                      <HStack spacing={2}>
                    <Text fontSize="lg">✋</Text>
                    <Text fontSize="xs" color="white" fontWeight="bold">
                      {sessionData?.isVolunteer ? sessionData?.seniorName : sessionData?.volunteerName} raised hand
                        </Text>
                      </HStack>
                    </Box>
                  )}

              {/* Session State Overlays */}
              {sessionStatus === 'connecting' && (
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  bg="blackAlpha.700"
                  zIndex={5}
                >
                  <VStack spacing={4}>
                    <Box className="animate-pulse">
                      <FaVideo size={48} color="gray" />
                    </Box>
                    <Text color="gray.400" fontSize="lg">Connecting to video call...</Text>
                  </VStack>
                </Box>
              )}

              {!webRTC.mediaState.hasPermissions && sessionStatus === 'active' && (
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  bg="blackAlpha.700"
                  zIndex={5}
                >
                  <VStack spacing={4}>
                    <Box className="animate-pulse">
                      <FaVideo size={48} color="gray" />
                    </Box>
                    <Text color="gray.400" fontSize="lg">Ready to join the video call</Text>
                    <Button 
                      colorScheme="blue" 
                      onClick={requestMediaPermissions}
                      leftIcon={<FaVideo />}
                      size="lg"
                    >
                      Join Video Call
                    </Button>
                    {webRTC.mediaState.permissionError && (
                      <Text color="red.400" fontSize="sm" textAlign="center">
                        {webRTC.mediaState.permissionError}
                      </Text>
                    )}
                  </VStack>
                </Box>
              )}
            </Box>

            {/* Google Meet-Style Control Bar */}
            <Box
                    position="absolute"
              bottom={6}
                    left="50%"
                    transform="translateX(-50%)"
                    bg="blackAlpha.800"
                    px={6}
              py={4}
                    borderRadius="full"
              backdropFilter="blur(10px)"
                  >
              <HStack spacing={4}>
                    {/* Microphone Toggle */}
                    <Button
                  colorScheme={webRTC.mediaState.isMicOn ? "gray" : "red"}
                      variant="solid"
                  size="lg"
                      onClick={webRTC.toggleMicrophone}
                      isDisabled={!webRTC.mediaState.hasPermissions}
                  borderRadius="full"
                  title={webRTC.mediaState.isMicOn ? "Mute microphone" : "Unmute microphone"}
                  _hover={{ transform: 'scale(1.1)' }}
                  transition="all 0.2s ease"
                    >
                      <Icon as={webRTC.mediaState.isMicOn ? FaMicrophone : FaMicrophoneSlash} />
                    </Button>

                    {/* Camera Toggle */}
                    <Button
                  colorScheme={webRTC.mediaState.isCameraOn ? "gray" : "red"}
                      variant="solid"
                  size="lg"
                      onClick={webRTC.toggleCamera}
                      isDisabled={!webRTC.mediaState.hasPermissions}
                  borderRadius="full"
                  title={webRTC.mediaState.isCameraOn ? "Turn camera off" : "Turn camera on"}
                  _hover={{ transform: 'scale(1.1)' }}
                  transition="all 0.2s ease"
                    >
                      <Icon as={webRTC.mediaState.isCameraOn ? FaVideo : FaVideoSlash} />
                    </Button>

                    {/* Screen Share Toggle */}
                    <Button
                      colorScheme={webRTC.mediaState.isScreenSharing ? "orange" : "blue"}
                      variant="solid"
                  size="lg"
                      onClick={webRTC.mediaState.isScreenSharing ? webRTC.stopScreenShare : webRTC.startScreenShare}
                      isDisabled={!webRTC.mediaState.hasPermissions}
                  borderRadius="full"
                  title={webRTC.mediaState.isScreenSharing ? "Stop screen sharing" : "Start screen sharing"}
                  _hover={{ transform: 'scale(1.1)' }}
                  transition="all 0.2s ease"
                    >
                      <Icon as={webRTC.mediaState.isScreenSharing ? FaStop : FaDesktop} />
                    </Button>

                {/* Raise Hand Toggle */}
                <Button
                  colorScheme={webRTC.mediaState.isHandRaised ? "yellow" : "gray"}
                  variant="solid"
                  size="lg"
                  onClick={webRTC.toggleHandRaise}
                  borderRadius="full"
                  title={webRTC.mediaState.isHandRaised ? "Lower hand" : "Raise hand"}
                  _hover={{ transform: 'scale(1.1)' }}
                  transition="all 0.2s ease"
                >
                  <Text fontSize="lg">✋</Text>
                </Button>

                {/* End Call Button */}
                <Button
                  colorScheme="red"
                  variant="solid"
                  size="lg"
                  onClick={handleEndSession}
                  borderRadius="full"
                  title="End call"
                  _hover={{ transform: 'scale(1.1)' }}
                  transition="all 0.2s ease"
                >
                  <Icon as={FaPhoneAlt} />
                </Button>
              </HStack>
                    </Box>
                  </Box>
          </Box>

        {/* Compact Session Info Sidebar */}
        <Box position="fixed" top={4} right={4} maxW="300px" zIndex={20}>
          <VStack spacing={3} align="stretch">
            {/* Session Info */}
            <Card bg={cardBg} size="sm">
              <CardBody>
                <VStack spacing={3} align="stretch">
                  <Text fontWeight="bold" color="gray.800">Session Details</Text>
                  <Divider />
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">Help Topic:</Text>
                    <Text fontSize="sm" fontWeight="medium" color="gray.800">
                      {sessionData?.helpTopic}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">Duration:</Text>
                    <Text fontSize="sm" fontWeight="medium" color="gray.800">
                      {sessionStatus === 'active' ? formatTime(elapsedTime) : '00:00'}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">Status:</Text>
                    <Badge colorScheme={sessionStatus === 'active' ? 'green' : 'orange'}>
                      {sessionStatus === 'active' ? 'Active' : 'Connecting'}
                    </Badge>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

                </VStack>
        </Box>
      </Container>
    </Box>
  )
}