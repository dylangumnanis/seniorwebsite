'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Badge,
  Icon,
  Avatar,
  useColorModeValue,
  Alert,
  AlertIcon,
  Divider,
  Stack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  Select
} from '@chakra-ui/react'
import { FaVideo, FaClock, FaUser, FaCalendarAlt, FaPlus, FaPlay, FaHandPaper } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PendingSession {
  id: string
  status: 'SCHEDULED' | 'IN_PROGRESS'
  notes: string
  date: string
  volunteerName?: string
  canJoin: boolean
}

interface SessionStats {
  totalSessions: number
  completedSessions: number
  averageRating: number
  hoursLearned: number
}

export default function SeniorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const [pendingSessions, setPendingSessions] = useState<PendingSession[]>([])
  const [stats, setStats] = useState<SessionStats | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Request session form state
  const [requestForm, setRequestForm] = useState({
    topicTitle: '',
    description: '',
    urgency: 'medium',
    estimatedDuration: 30
  })

  const cardBg = useColorModeValue('white', 'gray.700')
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const heroGradient = 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/login')
      return
    }

    // Security: Only seniors can access senior dashboard
    if (session.user?.role !== 'SENIOR') {
      if (session.user?.role === 'VOLUNTEER') {
        router.push('/volunteer')
      } else if (session.user?.role === 'ADMIN') {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
      return
    }

    fetchDashboardData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      // Fetch pending sessions
      const sessionsResponse = await fetch('/api/senior/pending-sessions')
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json()
        setPendingSessions(sessionsData)
      }

      // Fetch session stats
      const statsResponse = await fetch('/api/senior/sessions')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        // Calculate stats from sessions data
        const totalSessions = statsData.length
        const completedSessions = statsData.filter((s: any) => s.status === 'COMPLETED').length
        setStats({
          totalSessions,
          completedSessions,
          averageRating: 4.5, // Placeholder
          hoursLearned: Math.round(completedSessions * 0.75) // Estimate
        })
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestSession = async () => {
    try {
      const response = await fetch('/api/senior/request-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: Date.now().toString(),
          topicTitle: requestForm.topicTitle,
          description: requestForm.description,
          urgency: requestForm.urgency,
          estimatedDuration: requestForm.estimatedDuration
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: 'Session Requested!',
          description: 'A volunteer will be matched with you shortly.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        onClose()
        setRequestForm({
          topicTitle: '',
          description: '',
          urgency: 'medium',
          estimatedDuration: 30
        })
        fetchDashboardData() // Refresh data
      } else {
        const errorData = await response.json()
        toast({
          title: 'Request Failed',
          description: errorData.error || 'Failed to request session',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (error) {
      toast({
        title: 'Request Failed',
        description: 'An error occurred while requesting the session',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const joinSession = (sessionId: string) => {
    router.push(`/session/${sessionId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'green'
      case 'SCHEDULED': return 'blue'
      default: return 'gray'
    }
  }

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading your dashboard...</Text>
      </Container>
    )
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Hero Section */}
      <Box
        bg={heroGradient}
        color="white"
        py={16}
        px={4}
      >
        <Container maxW="container.xl">
          <VStack spacing={4} textAlign="center">
            <Avatar size="xl" name={session?.user?.name || 'Senior'} />
            <Heading size="xl">Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}!</Heading>
            <Text fontSize="lg" opacity={0.9}>
              Ready to learn something new today?
            </Text>
            <Button
              size="lg"
              colorScheme="white"
              variant="outline"
              leftIcon={<Icon as={FaPlus} />}
              onClick={onOpen}
              _hover={{ bg: 'white', color: 'blue.500' }}
            >
              Request Help Session
            </Button>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Quick Stats */}
          {stats && (
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Card bg={cardBg}>
                <CardBody textAlign="center">
                  <Icon as={FaVideo} boxSize={8} color="blue.500" mb={2} />
                  <Text fontSize="2xl" fontWeight="bold">{stats.totalSessions}</Text>
                  <Text color="gray.500">Total Sessions</Text>
                </CardBody>
              </Card>
              <Card bg={cardBg}>
                <CardBody textAlign="center">
                  <Icon as={FaCalendarAlt} boxSize={8} color="green.500" mb={2} />
                  <Text fontSize="2xl" fontWeight="bold">{stats.completedSessions}</Text>
                  <Text color="gray.500">Completed</Text>
                </CardBody>
              </Card>
              <Card bg={cardBg}>
                <CardBody textAlign="center">
                  <Icon as={FaClock} boxSize={8} color="purple.500" mb={2} />
                  <Text fontSize="2xl" fontWeight="bold">{stats.hoursLearned}h</Text>
                  <Text color="gray.500">Hours Learned</Text>
                </CardBody>
              </Card>
              <Card bg={cardBg}>
                <CardBody textAlign="center">
                  <Icon as={FaHandPaper} boxSize={8} color="orange.500" mb={2} />
                  <Text fontSize="2xl" fontWeight="bold">{stats.averageRating}</Text>
                  <Text color="gray.500">Avg Rating</Text>
                </CardBody>
              </Card>
            </SimpleGrid>
          )}

          {/* Pending Sessions */}
          <Card bg={cardBg}>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">Active & Scheduled Sessions</Heading>
                <Button
                  size="sm"
                  colorScheme="blue"
                  leftIcon={<Icon as={FaPlus} />}
                  onClick={onOpen}
                >
                  Request New Session
                </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              {pendingSessions.length === 0 ? (
                <VStack py={8} spacing={4}>
                  <Icon as={FaVideo} boxSize={12} color="gray.300" />
                  <Text color="gray.500" textAlign="center">
                    No active sessions. Request help to get started!
                  </Text>
                  <Button colorScheme="blue" onClick={onOpen}>
                    Request Your First Session
                  </Button>
                </VStack>
              ) : (
                <VStack spacing={4} align="stretch">
                  {pendingSessions.map((session) => (
                    <Box
                      key={session.id}
                      p={4}
                      borderWidth={1}
                      borderRadius="md"
                      borderColor="gray.200"
                    >
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={2} flex={1}>
                          <HStack>
                            <Badge colorScheme={getStatusColor(session.status)}>
                              {session.status === 'IN_PROGRESS' ? 'Live Now' : 'Scheduled'}
                            </Badge>
                            <Text fontSize="sm" color="gray.500">
                              {new Date(session.date).toLocaleString()}
                            </Text>
                          </HStack>
                          <Text fontWeight="semibold">{session.notes || 'Help Session'}</Text>
                          {session.volunteerName && (
                            <HStack>
                              <Icon as={FaUser} color="gray.400" />
                              <Text fontSize="sm" color="gray.600">
                                Volunteer: {session.volunteerName}
                              </Text>
                            </HStack>
                          )}
                        </VStack>
                        {session.canJoin && (
                          <Button
                            colorScheme="green"
                            size="sm"
                            leftIcon={<Icon as={FaPlay} />}
                            onClick={() => joinSession(session.id)}
                          >
                            {session.status === 'IN_PROGRESS' ? 'Rejoin' : 'Join'}
                          </Button>
                        )}
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </CardBody>
          </Card>

          {/* Quick Links */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Link href="/blog">
              <Card bg={cardBg} _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }} transition="all 0.2s">
                <CardBody textAlign="center">
                  <Icon as={FaVideo} boxSize={8} color="blue.500" mb={4} />
                  <Heading size="sm" mb={2}>Learning Resources</Heading>
                  <Text fontSize="sm" color="gray.500">
                    Browse tutorials and guides
                  </Text>
                </CardBody>
              </Card>
            </Link>
            <Link href="/session">
              <Card bg={cardBg} _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }} transition="all 0.2s">
                <CardBody textAlign="center">
                  <Icon as={FaCalendarAlt} boxSize={8} color="green.500" mb={4} />
                  <Heading size="sm" mb={2}>Past Sessions</Heading>
                  <Text fontSize="sm" color="gray.500">
                    Review your learning history
                  </Text>
                </CardBody>
              </Card>
            </Link>
            <Card bg={cardBg} _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }} transition="all 0.2s">
              <CardBody textAlign="center">
                <Icon as={FaUser} boxSize={8} color="purple.500" mb={4} />
                <Heading size="sm" mb={2}>Profile Settings</Heading>
                <Text fontSize="sm" color="gray.500">
                  Update your preferences
                </Text>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Request Session Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request Help Session</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>What do you need help with?</FormLabel>
                <Textarea
                  placeholder="e.g., Setting up email, Using video calls, Online shopping..."
                  value={requestForm.topicTitle}
                  onChange={(e) => setRequestForm({...requestForm, topicTitle: e.target.value})}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Additional Details</FormLabel>
                <Textarea
                  placeholder="Any specific details or questions you have..."
                  value={requestForm.description}
                  onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                />
              </FormControl>
              
              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    value={requestForm.urgency}
                    onChange={(e) => setRequestForm({...requestForm, urgency: e.target.value})}
                  >
                    <option value="low">Low - I can wait</option>
                    <option value="medium">Medium - Soon</option>
                    <option value="high">High - Urgent</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Estimated Time</FormLabel>
                  <Select
                    value={requestForm.estimatedDuration}
                    onChange={(e) => setRequestForm({...requestForm, estimatedDuration: parseInt(e.target.value)})}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              
              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleRequestSession}
                isDisabled={!requestForm.topicTitle.trim()}
              >
                Request Session
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
