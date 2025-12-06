'use client'

import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  List,
  ListItem,
  ListIcon,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react'
import { FaVideo, FaMicrophone, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa'
import { useState, useEffect } from 'react'

interface MediaPermissionGuideProps {
  onPermissionGranted?: () => void
  onPermissionDenied?: () => void
}

export default function MediaPermissionGuide({ 
  onPermissionGranted, 
  onPermissionDenied 
}: MediaPermissionGuideProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [permissionStatus, setPermissionStatus] = useState<'checking' | 'granted' | 'denied' | 'prompt'>('checking')
  const [hasCamera, setHasCamera] = useState(false)
  const [hasMicrophone, setHasMicrophone] = useState(false)

  const cardBg = useColorModeValue('white', 'gray.700')

  useEffect(() => {
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    try {
      // Check if permissions are already granted
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName })
      const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName })

      if (cameraPermission.state === 'granted' && micPermission.state === 'granted') {
        setPermissionStatus('granted')
        setHasCamera(true)
        setHasMicrophone(true)
        onPermissionGranted?.()
      } else if (cameraPermission.state === 'denied' || micPermission.state === 'denied') {
        setPermissionStatus('denied')
        onPermissionDenied?.()
      } else {
        setPermissionStatus('prompt')
      }
    } catch (error) {
      console.log('Permissions API not supported, will prompt for media access')
      setPermissionStatus('prompt')
    }
  }

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      // Check what we actually got
      const videoTracks = stream.getVideoTracks()
      const audioTracks = stream.getAudioTracks()

      setHasCamera(videoTracks.length > 0)
      setHasMicrophone(audioTracks.length > 0)

      if (videoTracks.length > 0 || audioTracks.length > 0) {
        setPermissionStatus('granted')
        onPermissionGranted?.()
      } else {
        setPermissionStatus('denied')
        onPermissionDenied?.()
      }

      // Stop the stream as this was just for permission check
      stream.getTracks().forEach(track => track.stop())
    } catch (error) {
      console.error('Media permission denied:', error)
      setPermissionStatus('denied')
      onPermissionDenied?.()
    }
  }

  if (permissionStatus === 'granted') {
    return (
      <Alert status="success" borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertTitle>Media Access Granted!</AlertTitle>
          <AlertDescription>
            <HStack spacing={4} mt={2}>
              {hasCamera && (
                <Badge colorScheme="green" variant="subtle">
                  <HStack spacing={1}>
                    <FaVideo size={12} />
                    <Text>Camera Ready</Text>
                  </HStack>
                </Badge>
              )}
              {hasMicrophone && (
                <Badge colorScheme="green" variant="subtle">
                  <HStack spacing={1}>
                    <FaMicrophone size={12} />
                    <Text>Microphone Ready</Text>
                  </HStack>
                </Badge>
              )}
            </HStack>
          </AlertDescription>
        </Box>
      </Alert>
    )
  }

  if (permissionStatus === 'denied') {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>Media Access Denied</AlertTitle>
          <AlertDescription>
            <VStack align="start" spacing={2} mt={2}>
              <Text>
                Camera and microphone access is required for video sessions. 
                Please grant permissions to continue.
              </Text>
              <HStack spacing={2}>
                <Button size="sm" colorScheme="red" onClick={onOpen}>
                  Help Me Fix This
                </Button>
                <Button size="sm" variant="outline" onClick={requestPermissions}>
                  Try Again
                </Button>
              </HStack>
            </VStack>
          </AlertDescription>
        </Box>
      </Alert>
    )
  }

  return (
    <>
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>Media Permissions Needed</AlertTitle>
          <AlertDescription>
            <VStack align="start" spacing={3} mt={2}>
              <Text>
                To join this video session, we need access to your camera and microphone.
              </Text>
              <Button 
                colorScheme="blue" 
                leftIcon={<FaVideo />}
                onClick={requestPermissions}
                isLoading={permissionStatus === 'checking'}
                loadingText="Checking..."
              >
                Grant Camera & Microphone Access
              </Button>
              <Button variant="link" size="sm" onClick={onOpen}>
                Need help with permissions?
              </Button>
            </VStack>
          </AlertDescription>
        </Box>
      </Alert>

      {/* Help Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <FaInfoCircle />
              <Text>How to Enable Camera & Microphone</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="start">
              <Alert status="info">
                <AlertIcon />
                <Text>
                  Your browser will show a popup asking for camera and microphone permissions. 
                  Click "Allow" to continue.
                </Text>
              </Alert>

              <Box>
                <Text fontWeight="600" mb={2}>If you don't see the popup:</Text>
                <List spacing={2}>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    Look for a camera/microphone icon in your browser's address bar
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    Click on it and select "Allow" for camera and microphone
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    Refresh the page if needed
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Text fontWeight="600" mb={2}>Browser-specific instructions:</Text>
                <List spacing={2}>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="blue.500" />
                    <strong>Chrome:</strong> Click the camera icon in the address bar
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="blue.500" />
                    <strong>Firefox:</strong> Click the shield icon and manage permissions
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="blue.500" />
                    <strong>Safari:</strong> Go to Safari → Preferences → Websites → Camera/Microphone
                  </ListItem>
                </List>
              </Box>

              <Alert status="warning">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="600">Still having trouble?</Text>
                  <Text fontSize="sm">
                    Make sure your camera and microphone are not being used by other applications,
                    and that they're properly connected to your computer.
                  </Text>
                </VStack>
              </Alert>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
