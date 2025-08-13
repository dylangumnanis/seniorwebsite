'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Card,
  CardBody,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { FaVideo, FaPlus } from 'react-icons/fa'

export default function SeniorDashboard() {
  const router = useRouter()
  const bgColor = useColorModeValue('white', 'gray.800')
  
  // Mock session data
  const activeSessions = [
    {
      id: 'session-123',
      volunteerName: 'Alex Chen',
      topic: 'Email Basics',
      status: 'WAITING'
    }
  ]
  
  const handleJoinSession = (sessionId: string) => {
    router.push(`/session/${sessionId}`)
  }
  
  const handleRequestSession = () => {
    // This would normally go to a request form
    // For testing, create a mock session
    const sessionId = `session-${Date.now()}`
    router.push(`/session/${sessionId}`)
  }
  
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" color="orange.500">
            Senior Dashboard
          </Heading>
          <Text color="gray.600" mt={2}>
            Welcome! Here you can request help or join active sessions.
          </Text>
        </Box>
        
        {/* Active Sessions */}
        <Box>
          <Heading size="md" mb={4}>
            Your Sessions
          </Heading>
          
          {activeSessions.length > 0 ? (
            <VStack spacing={4}>
              {activeSessions.map((session) => (
                <Card key={session.id} w="full" bg={bgColor}>
                  <CardBody>
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">
                          Help with {session.topic}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Volunteer: {session.volunteerName}
                        </Text>
                        <Badge colorScheme="green">
                          {session.status === 'WAITING' ? 'Ready to Join' : session.status}
                        </Badge>
                      </VStack>
                      
                      <Button
                        colorScheme="green"
                        size="lg"
                        leftIcon={<FaVideo />}
                        onClick={() => handleJoinSession(session.id)}
                      >
                        Join Session
                      </Button>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          ) : (
            <Card bg={bgColor}>
              <CardBody textAlign="center">
                <Text color="gray.500">No active sessions</Text>
              </CardBody>
            </Card>
          )}
        </Box>
        
        {/* Request New Session */}
        <Box>
          <Heading size="md" mb={4}>
            Request Help
          </Heading>
          
          <Card bg={bgColor}>
            <CardBody textAlign="center">
              <VStack spacing={4}>
                <Text>
                  Need help with technology? Request a session with one of our volunteers.
                </Text>
                <Button
                  colorScheme="orange"
                  size="lg"
                  leftIcon={<FaPlus />}
                  onClick={handleRequestSession}
                >
                  Request Help Session
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </VStack>
    </Container>
  )
}