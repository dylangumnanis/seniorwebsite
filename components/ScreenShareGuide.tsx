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
  Image,
} from '@chakra-ui/react'
import { FaDesktop, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaQuestionCircle } from 'react-icons/fa'
import { useState } from 'react'

interface ScreenShareGuideProps {
  onStartScreenShare?: () => void
  onStopScreenShare?: () => void
  isScreenSharing?: boolean
}

export default function ScreenShareGuide({ 
  onStartScreenShare, 
  onStopScreenShare,
  isScreenSharing = false
}: ScreenShareGuideProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [showTroubleshooting, setShowTroubleshooting] = useState(false)

  const cardBg = useColorModeValue('white', 'gray.700')

  const handleScreenShare = async () => {
    if (isScreenSharing) {
      onStopScreenShare?.()
      return
    }

    try {
      // Check if getDisplayMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        alert('Screen sharing is not supported in your browser. Please use Chrome, Firefox, or Edge.')
        return
      }

      onStartScreenShare?.()
    } catch (error) {
      console.error('Screen share error:', error)
      setShowTroubleshooting(true)
      onOpen()
    }
  }

  return (
    <>
      <Alert status={isScreenSharing ? "success" : "info"} borderRadius="md">
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>
            {isScreenSharing ? "Screen Sharing Active" : "Screen Share Available"}
          </AlertTitle>
          <AlertDescription>
            <VStack align="start" spacing={3} mt={2}>
              <Text>
                {isScreenSharing 
                  ? "You are currently sharing your screen. Others can see what's on your screen."
                  : "Share your screen to show your computer to the volunteer for better assistance."
                }
              </Text>
              <HStack spacing={2}>
                <Button 
                  colorScheme={isScreenSharing ? "red" : "blue"}
                  leftIcon={<FaDesktop />}
                  onClick={handleScreenShare}
                  size="sm"
                >
                  {isScreenSharing ? "Stop Sharing" : "Start Screen Share"}
                </Button>
                {!isScreenSharing && (
                  <Button variant="link" size="sm" onClick={onOpen}>
                    Need help?
                  </Button>
                )}
              </HStack>
              {isScreenSharing && (
                <Badge colorScheme="green" variant="subtle">
                  <HStack spacing={1}>
                    <FaDesktop size={12} />
                    <Text>Screen visible to others</Text>
                  </HStack>
                </Badge>
              )}
            </VStack>
          </AlertDescription>
        </Box>
      </Alert>

      {/* Help Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <FaInfoCircle />
              <Text>Screen Sharing Guide</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="start">
              {!showTroubleshooting ? (
                <>
                  <Alert status="info">
                    <AlertIcon />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="600">How Screen Sharing Works</Text>
                      <Text fontSize="sm">
                        When you click "Start Screen Share", your browser will ask you to choose 
                        what to share - your entire screen, a specific window, or a browser tab.
                      </Text>
                    </VStack>
                  </Alert>

                  <Box>
                    <Text fontWeight="600" mb={3}>What you can share:</Text>
                    <List spacing={2}>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color="green.500" />
                        <strong>Entire Screen:</strong> Shows everything on your monitor
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color="green.500" />
                        <strong>Application Window:</strong> Shows only a specific program (recommended)
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color="green.500" />
                        <strong>Browser Tab:</strong> Shows only a specific webpage
                      </ListItem>
                    </List>
                  </Box>

                  <Box>
                    <Text fontWeight="600" mb={3}>Step-by-step:</Text>
                    <List spacing={2}>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color="blue.500" />
                        Click "Start Screen Share" button
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color="blue.500" />
                        Choose what to share from the popup
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color="blue.500" />
                        Click "Share" to begin
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color="blue.500" />
                        Click "Stop Sharing" when done
                      </ListItem>
                    </List>
                  </Box>

                  <Alert status="warning">
                    <AlertIcon />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="600">Privacy Tip</Text>
                      <Text fontSize="sm">
                        Close any sensitive information or personal documents before sharing your screen.
                        Consider sharing just the application window you need help with.
                      </Text>
                    </VStack>
                  </Alert>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowTroubleshooting(true)}
                    leftIcon={<FaQuestionCircle />}
                  >
                    Having trouble? View troubleshooting
                  </Button>
                </>
              ) : (
                <>
                  <Alert status="warning">
                    <AlertIcon />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="600">Screen Sharing Troubleshooting</Text>
                      <Text fontSize="sm">
                        If screen sharing isn't working, try these solutions:
                      </Text>
                    </VStack>
                  </Alert>

                  <Box>
                    <Text fontWeight="600" mb={3}>Common Issues & Solutions:</Text>
                    <List spacing={3}>
                      <ListItem>
                        <ListIcon as={FaExclamationTriangle} color="orange.500" />
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="500">Browser not supported</Text>
                          <Text fontSize="sm" color="gray.600">
                            Use Chrome, Firefox, Edge, or Safari (latest versions)
                          </Text>
                        </VStack>
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaExclamationTriangle} color="orange.500" />
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="500">Permission denied</Text>
                          <Text fontSize="sm" color="gray.600">
                            Click on the camera/screen icon in your address bar and allow screen sharing
                          </Text>
                        </VStack>
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaExclamationTriangle} color="orange.500" />
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="500">Screen share popup doesn't appear</Text>
                          <Text fontSize="sm" color="gray.600">
                            Refresh the page and try again. Make sure popup blockers are disabled.
                          </Text>
                        </VStack>
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaExclamationTriangle} color="orange.500" />
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="500">Black screen or poor quality</Text>
                          <Text fontSize="sm" color="gray.600">
                            Try sharing a specific window instead of entire screen, or check your graphics drivers
                          </Text>
                        </VStack>
                      </ListItem>
                    </List>
                  </Box>

                  <Box>
                    <Text fontWeight="600" mb={3}>Alternative Options:</Text>
                    <List spacing={2}>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color="blue.500" />
                        Use your phone to take photos of your screen and share via chat
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color="blue.500" />
                        Describe the issue verbally - many problems can be solved this way
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color="blue.500" />
                        Try a different browser or device
                      </ListItem>
                    </List>
                  </Box>

                  <HStack>
                    <Button 
                      size="sm" 
                      onClick={() => setShowTroubleshooting(false)}
                    >
                      Back to Guide
                    </Button>
                    <Button 
                      size="sm" 
                      colorScheme="blue"
                      onClick={() => {
                        onClose()
                        handleScreenShare()
                      }}
                    >
                      Try Screen Share Again
                    </Button>
                  </HStack>
                </>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
