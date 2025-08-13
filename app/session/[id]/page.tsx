'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Flex,
  Button,
  Icon,
  Text,
  VStack,
  HStack,
  Badge,
  Alert,
  AlertIcon,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react'
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaDesktop,
  FaPhoneSlash,
  FaClock,
} from 'react-icons/fa'
import { useWebRTC } from '../../../hooks/useWebRTC'

interface SessionData {
  id: string
  seniorName: string
  volunteerName: string
  topic: string
  startTime: Date
  status: string
}

export default function SessionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string
  
  // Mock data - replace with actual API calls
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [isVolunteer, setIsVolunteer] = useState(false) // This should come from auth
  const [startTime] = useState(new Date())
  const [elapsedTime, setElapsedTime] = useState(0)
  
  // WebRTC hook
  const {
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    mediaState,
    toggleCamera,
    toggleMicrophone,
    startScreenShare,
    stopScreenShare,
    isConnected,
    error,
    cleanup
  } = useWebRTC({ sessionId, isVolunteer })
  
  // Timer for elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000))
    }, 1000)
    
    return () => clearInterval(timer)
  }, [startTime])
  
  // Mock session data
  useEffect(() => {
    // Simulate fetching session data
    setSessionData({
      id: sessionId,
      seniorName: 'Mary Johnson',
      volunteerName: 'Alex Chen',
      topic: 'Email Basics',
      startTime: startTime,
      status: 'ACTIVE'
    })
    
    // Simulate determining user role
    setIsVolunteer(Math.random() > 0.5) // This should come from actual auth
  }, [sessionId, startTime])
  
  // Format elapsed time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // End session
  const handleEndSession = async () => {
    try {
      // Cleanup WebRTC resources
      cleanup()
      
      // Call API to end session
      // await fetch(`/api/session/${sessionId}/end`, { method: 'POST' })
      
      // Navigate back to dashboard
      router.push(isVolunteer ? '/volunteer' : '/senior')
    } catch (err) {
      console.error('Error ending session:', err)
    }
  }
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  
  if (!sessionData) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading session...</Text>
      </Container>
    )
  }
  
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Session Header - Fixed positioning to avoid blocking end button */}
      <Box
        position="fixed"
        top={4}
        right={4}
        bg={bgColor}
        p={3}
        rounded="lg"
        shadow="md"
        border="1px"
        borderColor={borderColor}
        zIndex={10}
        maxW="250px"
      >
        <VStack spacing={2} align="start">
          <HStack spacing={2}>
            <Icon as={FaClock} color="orange.500" />
            <Text fontSize="sm" fontWeight="medium">
              Duration: {formatTime(elapsedTime)}
            </Text>
          </HStack>
          <Text fontSize="xs" color="gray.600">
            Help Topic: {sessionData.topic}
          </Text>
          <Badge colorScheme="green" size="sm">
            {isConnected ? 'Connected' : 'Connecting...'}
          </Badge>
        </VStack>
      </Box>
      
      {/* Main Video Container */}
      <Container maxW="container.xl" py={4} h="100vh">
        <Flex direction="column" h="full">
          {/* Error Alert */}
          {error && (
            <Alert status="error" mb={4} rounded="md">
              <AlertIcon />
              {error}
            </Alert>
          )}
          
          {/* Video Area */}
          <Flex flex={1} position="relative" bg="black" rounded="lg" overflow="hidden">
            {/* Remote Video (Main Area) */}
            <Box flex={1} position="relative">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  backgroundColor: '#000'
                }}
              />
              
              {/* No Remote Video Placeholder */}
              {!remoteStream && (
                <Flex
                  position="absolute"
                  inset={0}
                  align="center"
                  justify="center"
                  bg="gray.800"
                  color="white"
                >
                  <VStack spacing={2}>
                    <Icon as={FaVideo} w={12} h={12} color="gray.500" />
                    <Text>
                      Waiting for {isVolunteer ? sessionData.seniorName : sessionData.volunteerName} to join...
                    </Text>
                  </VStack>
                </Flex>
              )}
            </Box>
            
            {/* Local Video (Picture-in-Picture) */}
            <Box
              position="absolute"
              bottom={4}
              right={4}
              w="200px"
              h="150px"
              bg="gray.900"
              rounded="md"
              overflow="hidden"
              border="2px"
              borderColor="white"
              shadow="lg"
            >
              <video
                ref={localVideoRef}
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
              
              {/* Local Video Placeholder */}
              {!localStream && (
                <Flex
                  position="absolute"
                  inset={0}
                  align="center"
                  justify="center"
                  bg="gray.700"
                  color="white"
                >
                  <Icon as={FaVideoSlash} w={6} h={6} color="gray.400" />
                </Flex>
              )}
              
              {/* You Label */}
              <Box
                position="absolute"
                bottom={1}
                left={1}
                bg="blackAlpha.700"
                color="white"
                px={2}
                py={1}
                rounded="sm"
                fontSize="xs"
              >
                You
              </Box>
            </Box>
          </Flex>
          
          {/* Controls Bar */}
          <Box
            bg={bgColor}
            p={4}
            mt={4}
            rounded="lg"
            border="1px"
            borderColor={borderColor}
          >
            <Flex justify="space-between" align="center">
              {/* Media Controls */}
              <HStack spacing={4}>
                {/* Camera Toggle */}
                <Tooltip label={mediaState.cameraEnabled ? 'Turn off camera' : 'Turn on camera'}>
                  <Button
                    size="lg"
                    colorScheme={mediaState.cameraEnabled ? 'blue' : 'gray'}
                    variant={mediaState.cameraEnabled ? 'solid' : 'outline'}
                    onClick={toggleCamera}
                    leftIcon={<Icon as={mediaState.cameraEnabled ? FaVideo : FaVideoSlash} />}
                  >
                    Camera
                  </Button>
                </Tooltip>
                
                {/* Microphone Toggle */}
                <Tooltip label={mediaState.microphoneEnabled ? 'Mute microphone' : 'Unmute microphone'}>
                  <Button
                    size="lg"
                    colorScheme={mediaState.microphoneEnabled ? 'green' : 'gray'}
                    variant={mediaState.microphoneEnabled ? 'solid' : 'outline'}
                    onClick={toggleMicrophone}
                    leftIcon={<Icon as={mediaState.microphoneEnabled ? FaMicrophone : FaMicrophoneSlash} />}
                  >
                    Microphone
                  </Button>
                </Tooltip>
                
                {/* Screen Share */}
                <Tooltip label={mediaState.screenSharing ? 'Stop sharing screen' : 'Share screen'}>
                  <Button
                    size="lg"
                    colorScheme={mediaState.screenSharing ? 'purple' : 'gray'}
                    variant={mediaState.screenSharing ? 'solid' : 'outline'}
                    onClick={mediaState.screenSharing ? stopScreenShare : startScreenShare}
                    leftIcon={<Icon as={FaDesktop} />}
                  >
                    {mediaState.screenSharing ? 'Stop Share' : 'Share Screen'}
                  </Button>
                </Tooltip>
              </HStack>
              
              {/* Session Info & End Button */}
              <HStack spacing={4}>
                <VStack spacing={0} align="end">
                  <Text fontSize="sm" fontWeight="medium">
                    {isVolunteer ? `Helping ${sessionData.seniorName}` : `Learning with ${sessionData.volunteerName}`}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Session Duration: {formatTime(elapsedTime)}
                  </Text>
                </VStack>
                
                {/* End Session Button - Now clearly visible */}
                <Button
                  size="lg"
                  colorScheme="red"
                  variant="solid"
                  onClick={handleEndSession}
                  leftIcon={<Icon as={FaPhoneSlash} />}
                >
                  End Session
                </Button>
              </HStack>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}