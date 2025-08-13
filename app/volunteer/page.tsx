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
import { FaVideo, FaHandHoldingHeart } from 'react-icons/fa'

export default function VolunteerDashboard() {
  const router = useRouter()
  const bgColor = useColorModeValue('white', 'gray.800')
  
  // Mock available sessions
  const waitingSeniors = [
    {
      id: 'session-123',
      seniorName: 'Mary Johnson',
      topic: 'Email Basics',
      requestedAt: '2 minutes ago'
    }
  ]
  
  const handleJoinSession = (sessionId: string) => {
    router.push(`/session/${sessionId}`)
  }
  
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" color="blue.500">
            Volunteer Dashboard
          </Heading>
          <Text color="gray.600" mt={2}>
            Welcome! Here you can help seniors with their technology questions.
          </Text>
        </Box>
        
        {/* Waiting Seniors */}
        <Box>
          <Heading size="md" mb={4}>
            Seniors Waiting for Help
          </Heading>
          
          {waitingSeniors.length > 0 ? (
            <VStack spacing={4}>
              {waitingSeniors.map((session) => (
                <Card key={session.id} w="full" bg={bgColor}>
                  <CardBody>
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">
                          {session.seniorName}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Needs help with: {session.topic}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Requested {session.requestedAt}
                        </Text>
                        <Badge colorScheme="orange">
                          Waiting for Volunteer
                        </Badge>
                      </VStack>
                      
                      <Button
                        colorScheme="blue"
                        size="lg"
                        leftIcon={<FaVideo />}
                        onClick={() => handleJoinSession(session.id)}
                      >
                        Help Now
                      </Button>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          ) : (
            <Card bg={bgColor}>
              <CardBody textAlign="center">
                <VStack spacing={4}>
                  <FaHandHoldingHeart size={48} color="gray.300" />
                  <Text color="gray.500">
                    No seniors waiting for help right now
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    Check back later or wait for new requests
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          )}
        </Box>
        
        {/* Quick Stats */}
        <Box>
          <Heading size="md" mb={4}>
            Your Impact
          </Heading>
          
          <HStack spacing={4}>
            <Card bg={bgColor} flex={1}>
              <CardBody textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  12
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Sessions Completed
                </Text>
              </CardBody>
            </Card>
            
            <Card bg={bgColor} flex={1}>
              <CardBody textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  8.5
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Hours Volunteered
                </Text>
              </CardBody>
            </Card>
            
            <Card bg={bgColor} flex={1}>
              <CardBody textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                  24
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Seniors Helped
                </Text>
              </CardBody>
            </Card>
          </HStack>
        </Box>
      </VStack>
    </Container>
  )
}