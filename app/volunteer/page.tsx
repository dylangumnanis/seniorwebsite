'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Badge,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Flex,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react'
import { FaClock, FaGraduationCap, FaHandsHelping, FaUsers, FaPhoneAlt, FaCalendarAlt } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface VolunteerStats {
  totalHours: number
  completedSessions: number
  waitingSeniors: number
  upcomingSessions: number
  rating: number
  quizzesPassed: number
  requestsFilled: number
}

interface WaitingSenior {
  id: string
  name: string
  helpTopic: string
  waitTime: string
  urgency: 'low' | 'medium' | 'high'
}

export default function VolunteerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<VolunteerStats | null>(null)
  const [waitingSeniors, setWaitingSeniors] = useState<WaitingSenior[]>([])
  const [loading, setLoading] = useState(true)

  // Move all useColorModeValue calls to top level
  const cardBg = useColorModeValue('white', 'gray.700')
  const grayBg = useColorModeValue('gray.50', 'gray.600')
  const pageBg = useColorModeValue('gray.50', 'gray.900')
  const heroGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/login')
      return
    }

    // SECURITY: Only volunteers can access volunteer dashboard
    if (session.user?.role !== 'VOLUNTEER') {
      // Redirect based on actual user role
      if (session.user.role === 'ADMIN') {
        router.push('/admin')
      } else if (session.user.role === 'SENIOR') {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
      return
    }

    fetchVolunteerData()
    fetchWaitingSeniors()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchVolunteerData()
      fetchWaitingSeniors()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [session, status, router])

  const fetchVolunteerData = async () => {
    try {
      const response = await fetch('/api/volunteer/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch volunteer data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWaitingSeniors = async () => {
    try {
      const response = await fetch('/api/volunteer/waiting-seniors')
      if (response.ok) {
        const data = await response.json()
        setWaitingSeniors(data)
      }
    } catch (error) {
      console.error('Failed to fetch waiting seniors:', error)
    }
  }

  const startSession = async (seniorId: string) => {
    try {
      console.log('Starting session for senior:', seniorId)
      const response = await fetch('/api/volunteer/start-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seniorId })
      })
      
      console.log('Session API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Session API response data:', data)
        const { sessionId } = data
        
        if (sessionId) {
          console.log('Redirecting to session:', sessionId)
          // Redirect to live session
          router.push(`/session/${sessionId}`)
        } else {
          console.error('No sessionId received from API')
        }
      } else {
        const errorData = await response.json()
        console.error('Session API error response:', errorData)
      }
    } catch (error) {
      console.error('Failed to start session:', error)
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'red'
      case 'medium': return 'orange'
      case 'low': return 'green'
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
    <Box minH="100vh" bg={pageBg}>
      {/* Hero Section */}
      <Box
        bgGradient={heroGradient}
        color="white"
        py={16}
        px={8}
        borderRadius="0 0 50px 50px"
        mb={8}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl">
          <VStack spacing={4} align="start">
            <Heading size="2xl" fontWeight="bold">
              Hello, {session?.user?.name?.split(' ')[0] || 'Volunteer'}! 👋
            </Heading>
            <Text fontSize="xl" opacity={0.9}>
              Ready to make a difference today? Here's your impact summary.
            </Text>
          </VStack>
        </Container>
        
        {/* Decorative elements */}
        <Box
          position="absolute"
          top="-50px"
          right="-50px"
          w="200px"
          h="200px"
          borderRadius="full"
          bg="whiteAlpha.100"
        />
        <Box
          position="absolute"
          bottom="-30px"
          left="-30px"
          w="150px"
          h="150px"
          borderRadius="full"
          bg="whiteAlpha.200"
        />
      </Box>

      <Container maxW="container.xl" pb={8}>
        <VStack spacing={8} align="stretch">
          
          {/* Impact Summary Stats */}
          <Box>
            <Heading size="lg" mb={6}>Your Impact Summary</Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
              <Box bg={cardBg} p={6} rounded="xl" shadow="md" textAlign="center">
                <Icon as={FaClock} w={8} h={8} color="blue.500" mb={2} />
                <Stat>
                  <StatNumber fontSize="2xl" fontWeight="bold">
                    {stats?.totalHours || 0}
                  </StatNumber>
                  <StatLabel color="gray.600">Hours Volunteered</StatLabel>
                  <StatHelpText>All time</StatHelpText>
                </Stat>
              </Box>

              <Box bg={cardBg} p={6} rounded="xl" shadow="md" textAlign="center">
                <Icon as={FaGraduationCap} w={8} h={8} color="green.500" mb={2} />
                <Stat>
                  <StatNumber fontSize="2xl" fontWeight="bold">
                    {stats?.quizzesPassed || 8}
                  </StatNumber>
                  <StatLabel color="gray.600">Quizzes Passed</StatLabel>
                  <StatHelpText>Training completed</StatHelpText>
                </Stat>
              </Box>

              <Box bg={cardBg} p={6} rounded="xl" shadow="md" textAlign="center">
                <Icon as={FaHandsHelping} w={8} h={8} color="purple.500" mb={2} />
                <Stat>
                  <StatNumber fontSize="2xl" fontWeight="bold">
                    {stats?.requestsFilled || 4}
                  </StatNumber>
                  <StatLabel color="gray.600">Requests Filled</StatLabel>
                  <StatHelpText>This month</StatHelpText>
                </Stat>
              </Box>

              <Box bg={cardBg} p={6} rounded="xl" shadow="md" textAlign="center">
                <Icon as={FaUsers} w={8} h={8} color="orange.500" mb={2} />
                <Stat>
                  <StatNumber fontSize="2xl" fontWeight="bold">
                    {stats?.completedSessions || 12}
                  </StatNumber>
                  <StatLabel color="gray.600">Sessions Completed</StatLabel>
                  <StatHelpText>Total sessions</StatHelpText>
                </Stat>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Available Hours Selected */}
          <Box bg={cardBg} p={6} rounded="xl" shadow="md">
            <HStack justify="space-between" mb={4}>
              <Heading size="md">Hours of Availability Selected</Heading>
              <Badge colorScheme="blue" fontSize="lg" px={3} py={1}>
                13 hours selected
              </Badge>
            </HStack>
            <Progress value={65} colorScheme="blue" size="lg" rounded="full" />
            <Text fontSize="sm" color="gray.600" mt={2}>
              Great coverage this week! Consider adding weekend morning slots.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Waiting Students */}
            <Box bg={cardBg} p={6} rounded="xl" shadow="md">
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Heading size="md">Waiting Students</Heading>
                  <Badge colorScheme="red" variant="subtle">
                    {waitingSeniors.length} waiting
                  </Badge>
                </HStack>
                <Text color="gray.600" fontSize="sm">
                  Students waiting for help will show up below.
                </Text>

                {waitingSeniors.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Text color="gray.500" fontSize="lg">
                      Currently there are no students waiting for help.
                    </Text>
                    <Text color="gray.400" fontSize="sm" mt={2}>
                      Check back soon or update your availability!
                    </Text>
                  </Box>
                ) : (
                  <VStack spacing={3} align="stretch">
                    {waitingSeniors.map((senior) => (
                      <Flex
                        key={senior.id}
                        p={4}
                        bg={grayBg}
                        rounded="lg"
                        align="center"
                        justify="space-between"
                      >
                        <HStack spacing={3}>
                          <Avatar size="sm" name={senior.name} />
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium">{senior.name}</Text>
                            <Text fontSize="sm" color="gray.600">
                              {senior.helpTopic}
                            </Text>
                            <HStack>
                              <Badge 
                                colorScheme={getUrgencyColor(senior.urgency)}
                                size="sm"
                              >
                                {senior.urgency}
                              </Badge>
                              <Text fontSize="xs" color="gray.500">
                                Waiting {senior.waitTime}
                              </Text>
                            </HStack>
                          </VStack>
                        </HStack>
                        <Button
                          colorScheme="blue"
                          size="sm"
                          leftIcon={<FaPhoneAlt />}
                          onClick={() => startSession(senior.id)}
                        >
                          Join Session
                        </Button>
                      </Flex>
                    ))}
                  </VStack>
                )}
              </VStack>
            </Box>

            {/* Quick Actions */}
            <Box bg={cardBg} p={6} rounded="xl" shadow="md">
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Quick Actions</Heading>
                
                <Button
                  leftIcon={<FaCalendarAlt />}
                  colorScheme="purple"
                  size="lg"
                  w="full"
                  onClick={() => router.push('/volunteer/schedule')}
                >
                  Update My Schedule
                </Button>
                
                <Button
                  leftIcon={<FaUsers />}
                  colorScheme="green"
                  size="lg"
                  w="full"
                  onClick={() => router.push('/volunteer/training')}
                >
                  Continue Training
                </Button>
                
                <Button
                  leftIcon={<FaHandsHelping />}
                  colorScheme="orange"
                  size="lg"
                  w="full"
                  onClick={() => router.push('/volunteer/community')}
                >
                  Join Community Chat
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  w="full"
                  onClick={() => router.push('/volunteer/contact')}
                >
                  Contact Support
                </Button>
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}