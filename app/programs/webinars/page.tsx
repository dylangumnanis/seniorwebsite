'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  useColorModeValue,
  Icon,
  List,
  ListItem,
  ListIcon,
  Button,
  Badge,
  Card,
  CardBody,
  Flex,
  Avatar,
  AvatarGroup,
} from '@chakra-ui/react'
import { 
  FaCheckCircle, 
  FaVideo, 
  FaUsers, 
  FaCalendarAlt,
  FaClock,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideoSlash,
  FaDesktop,
  FaComments,
  FaShare,
  FaTimes,
  FaPlay,
  FaGraduationCap,
  FaHandPaper
} from 'react-icons/fa'
import Link from 'next/link'

// Video Call Graphic Component
const VideoCallGraphic = () => {
  const bgColor = useColorModeValue('gray.800', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.700')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  
  return (
    <Box
      position="relative"
      w="100%"
      maxW="600px"
      mx="auto"
    >
      {/* Main Video Call Window */}
      <Box
        bg={bgColor}
        rounded="xl"
        shadow="2xl"
        overflow="hidden"
        position="relative"
        border="2px solid"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
      >
        {/* Top Bar */}
        <Box
          bg={useColorModeValue('gray.700', 'gray.800')}
          px={4}
          py={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack spacing={2}>
            <Box w={3} h={3} bg="red.400" rounded="full" />
            <Box w={3} h={3} bg="yellow.400" rounded="full" />
            <Box w={3} h={3} bg="green.400" rounded="full" />
          </HStack>
          <Text color="white" fontSize="sm" fontWeight="500">
            Live Webinar Session
          </Text>
          <Box w={12} />
        </Box>

        {/* Video Grid Area */}
        <Box
          bg={useColorModeValue('gray.900', 'black')}
          p={4}
          minH="300px"
          position="relative"
        >
          <SimpleGrid columns={2} spacing={2} h="full">
            {/* Main Speaker */}
            <Box
              bg={useColorModeValue('gray.700', 'gray.800')}
              rounded="lg"
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="2px solid"
              borderColor="orange.400"
            >
              <VStack spacing={2}>
                <Avatar size="lg" bg="orange.500" name="Speaker" />
                <Text color="white" fontSize="xs" fontWeight="500">
                  Dr. Sarah Johnson
                </Text>
                <Badge colorScheme="orange" fontSize="xs">Host</Badge>
              </VStack>
              {/* Speaking indicator */}
              <Box
                position="absolute"
                bottom={2}
                left={2}
                bg="green.500"
                color="white"
                px={2}
                py={1}
                rounded="md"
                fontSize="xs"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Box w={2} h={2} bg="white" rounded="full" />
                Speaking
              </Box>
            </Box>

            {/* Participant 1 */}
            <Box
              bg={useColorModeValue('gray.700', 'gray.800')}
              rounded="lg"
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <VStack spacing={2}>
                <Avatar size="md" bg="blue.500" name="Participant" />
                <Text color="white" fontSize="xs">Maria</Text>
              </VStack>
            </Box>

            {/* Participant 2 */}
            <Box
              bg={useColorModeValue('gray.700', 'gray.800')}
              rounded="lg"
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <VStack spacing={2}>
                <Avatar size="md" bg="purple.500" name="Participant" />
                <Text color="white" fontSize="xs">Robert</Text>
              </VStack>
            </Box>

            {/* Participant 3 */}
            <Box
              bg={useColorModeValue('gray.700', 'gray.800')}
              rounded="lg"
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <VStack spacing={2}>
                <Avatar size="md" bg="green.500" name="Participant" />
                <Text color="white" fontSize="xs">Linda</Text>
              </VStack>
            </Box>
          </SimpleGrid>

          {/* Timer */}
          <Box
            position="absolute"
            top={4}
            right={4}
            bg="blackAlpha.700"
            color="white"
            px={3}
            py={1}
            rounded="md"
            fontSize="sm"
            fontWeight="600"
          >
            01:23:45
          </Box>

          {/* Participant Count */}
          <Box
            position="absolute"
            top={4}
            left={4}
            bg="blackAlpha.700"
            color="white"
            px={3}
            py={1}
            rounded="md"
            fontSize="sm"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Icon as={FaUsers} w={3} h={3} />
            24 participants
          </Box>
        </Box>

        {/* Controls Bar */}
        <Box
          bg={useColorModeValue('gray.700', 'gray.800')}
          px={6}
          py={4}
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={3}
        >
          <Button
            size="sm"
            bg="gray.600"
            color="white"
            _hover={{ bg: 'gray.500' }}
            rounded="full"
            px={4}
          >
            <Icon as={FaMicrophone} mr={2} />
            Mute
          </Button>
          <Button
            size="sm"
            bg="gray.600"
            color="white"
            _hover={{ bg: 'gray.500' }}
            rounded="full"
            px={4}
          >
            <Icon as={FaVideo} mr={2} />
            Video
          </Button>
          <Button
            size="sm"
            bg="gray.600"
            color="white"
            _hover={{ bg: 'gray.500' }}
            rounded="full"
            px={4}
          >
            <Icon as={FaShare} mr={2} />
            Share
          </Button>
          <Button
            size="sm"
            bg="red.500"
            color="white"
            _hover={{ bg: 'red.600' }}
            rounded="full"
            px={4}
          >
            <Icon as={FaTimes} mr={2} />
            Leave
          </Button>
        </Box>
      </Box>

      {/* Chat Panel (floating on the right) */}
      <Box
        position="absolute"
        right="-120px"
        top="20%"
        bg={cardBg}
        rounded="xl"
        shadow="xl"
        w="280px"
        border="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
        display={{ base: 'none', lg: 'block' }}
      >
        <Box
          bg={useColorModeValue('gray.50', 'gray.800')}
          px={4}
          py={3}
          borderBottom="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontWeight="600" fontSize="sm" color={useColorModeValue('gray.800', 'white')}>
            Chat
          </Text>
          <Icon as={FaComments} color="orange.500" />
        </Box>
        <Box p={4} maxH="200px" overflowY="auto">
          <VStack spacing={3} align="start">
            <Box>
              <Text fontSize="xs" fontWeight="600" color={useColorModeValue('gray.800', 'white')}>
                Maria
              </Text>
              <Text fontSize="xs" color={textColor}>
                Great presentation!
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" fontWeight="600" color={useColorModeValue('gray.800', 'white')}>
                Robert
              </Text>
              <Text fontSize="xs" color={textColor}>
                Very helpful, thank you!
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" fontWeight="600" color={useColorModeValue('gray.800', 'white')}>
                Linda
              </Text>
              <Text fontSize="xs" color={textColor}>
                Can you repeat that?
              </Text>
            </Box>
          </VStack>
        </Box>
        <Box
          px={4}
          py={3}
          borderTop="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
        >
          <HStack>
            <Box
              flex={1}
              px={3}
              py={2}
              bg={useColorModeValue('gray.100', 'gray.700')}
              rounded="md"
              fontSize="xs"
              color={textColor}
            >
              Type a message...
            </Box>
            <Button size="sm" colorScheme="orange" rounded="md">
              Send
            </Button>
          </HStack>
        </Box>
      </Box>

      {/* Floating elements for visual interest */}
      <Box
        position="absolute"
        top="-20px"
        right="-20px"
        bg="orange.500"
        color="white"
        p={3}
        rounded="full"
        shadow="lg"
        display={{ base: 'none', md: 'flex' }}
        alignItems="center"
        justifyContent="center"
        zIndex={2}
      >
        <Icon as={FaVideo} w={5} h={5} />
      </Box>
    </Box>
  )
}

export default function WebinarsPage() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const cardBg = useColorModeValue('gray.50', 'gray.700')

  const features = [
    {
      icon: FaVideo,
      title: 'Live Interactive Sessions',
      description: 'Join real-time webinars with expert instructors and fellow learners.',
    },
    {
      icon: FaUsers,
      title: 'Community Learning',
      description: 'Learn alongside other seniors in a supportive group environment.',
    },
    {
      icon: FaCalendarAlt,
      title: 'Flexible Scheduling',
      description: 'Choose from multiple weekly sessions that fit your schedule.',
    },
    {
      icon: FaComments,
      title: 'Q&A Sessions',
      description: 'Ask questions and get immediate answers from our expert hosts.',
    },
    {
      icon: FaPlay,
      title: 'Recorded Sessions',
      description: 'Access recordings of past webinars to review at your convenience.',
    },
    {
      icon: FaGraduationCap,
      title: 'Expert Instructors',
      description: 'Learn from experienced professionals and trained volunteers.',
    },
  ]

  const upcomingTopics = [
    'Introduction to Online Banking',
    'Video Calling with Family',
    'Safe Online Shopping Practices',
    'Managing Your Digital Photos',
    'Understanding Social Media',
    'Protecting Yourself from Scams',
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        bg={useColorModeValue('purple.50', 'gray.900')}
        py={20}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-50px"
          right="-50px"
          width="300px"
          height="300px"
          borderRadius="full"
          bg="purple.100"
          opacity="0.3"
        />
        <Container maxW="container.xl" position="relative">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
            {/* Left side - Content */}
            <VStack spacing={6} align="start" maxW="2xl">
              <Badge colorScheme="purple" px={3} py={1} rounded="full" fontSize="sm">
                Live Webinars Program
              </Badge>
              <Heading as="h1" size="3xl" fontWeight="800" color={useColorModeValue('gray.800', 'white')}>
                Learn Together in Live Interactive Sessions
              </Heading>
              <Text fontSize="xl" color={textColor} lineHeight="1.7">
                Join our engaging live webinars where you can learn new skills, ask questions in real-time, 
                and connect with a community of learners. No experience needed - we'll guide you every step of the way.
              </Text>
              <HStack spacing={4} pt={4}>
                <Button
                  as={Link}
                  href="/register"
                  size="lg"
                  bg="purple.500"
                  color="white"
                  px={8}
                  rounded="full"
                  _hover={{ bg: 'purple.600', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  Join a Webinar
                </Button>
                <Button
                  as={Link}
                  href="/volunteer/become"
                  size="lg"
                  variant="outline"
                  colorScheme="purple"
                  px={8}
                  rounded="full"
                >
                  Host a Webinar
                </Button>
              </HStack>
            </VStack>

            {/* Right side - Video Call Graphic */}
            <Box position="relative">
              <VideoCallGraphic />
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features */}
      <Box py={16} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center" maxW="2xl">
              <Heading size="xl" color={useColorModeValue('gray.800', 'white')}>
                Why Join Our Webinars?
              </Heading>
              <Text fontSize="lg" color={textColor}>
                Our live webinars offer an interactive, supportive learning environment designed specifically for seniors.
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {features.map((feature, index) => (
                <Card
                  key={index}
                  bg={cardBg}
                  _hover={{
                    transform: 'translateY(-4px)',
                    shadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  <CardBody>
                    <VStack spacing={4} align="start">
                      <Icon as={feature.icon} w={8} h={8} color="purple.500" />
                      <Heading as="h3" size="md" color={useColorModeValue('gray.800', 'white')}>
                        {feature.title}
                      </Heading>
                      <Text color={textColor} fontSize="sm">
                        {feature.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* How It Works */}
      <Box py={16} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading size="xl" color={useColorModeValue('gray.800', 'white')}>
                How It Works
              </Heading>
              <Text fontSize="lg" color={textColor} maxW="2xl">
                Joining a webinar is simple and free. Follow these easy steps to get started.
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              <VStack spacing={4} align="start">
                <Box
                  bg="purple.500"
                  color="white"
                  w={12}
                  h={12}
                  rounded="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="bold"
                  fontSize="xl"
                >
                  1
                </Box>
                <Heading as="h3" size="md" color={useColorModeValue('gray.800', 'white')}>
                  Browse Sessions
                </Heading>
                <Text color={textColor}>
                  View our calendar of upcoming webinars and choose topics that interest you.
                </Text>
              </VStack>
              <VStack spacing={4} align="start">
                <Box
                  bg="purple.500"
                  color="white"
                  w={12}
                  h={12}
                  rounded="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="bold"
                  fontSize="xl"
                >
                  2
                </Box>
                <Heading as="h3" size="md" color={useColorModeValue('gray.800', 'white')}>
                  Register Free
                </Heading>
                <Text color={textColor}>
                  Sign up for the webinar with just a few clicks. You'll receive a reminder email before the session.
                </Text>
              </VStack>
              <VStack spacing={4} align="start">
                <Box
                  bg="purple.500"
                  color="white"
                  w={12}
                  h={12}
                  rounded="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="bold"
                  fontSize="xl"
                >
                  3
                </Box>
                <Heading as="h3" size="md" color={useColorModeValue('gray.800', 'white')}>
                  Join & Learn
                </Heading>
                <Text color={textColor}>
                  Click the link in your email to join the live session. Participate, ask questions, and learn!
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Upcoming Topics */}
      <Box py={16} bg={bgColor}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
            <VStack align="start" spacing={6}>
              <Heading size="xl" color={useColorModeValue('gray.800', 'white')}>
                Popular Webinar Topics
              </Heading>
              <Text fontSize="lg" color={textColor} lineHeight="1.7">
                We cover a wide range of topics designed to help you navigate the digital world with confidence.
              </Text>
              <List spacing={3}>
                {upcomingTopics.map((topic, index) => (
                  <ListItem key={index}>
                    <HStack align="start">
                      <ListIcon as={FaCheckCircle} color="purple.500" mt={1} />
                      <Text color={textColor} fontSize="md">
                        {topic}
                      </Text>
                    </HStack>
                  </ListItem>
                ))}
              </List>
              <Button
                as={Link}
                href="/register"
                colorScheme="purple"
                size="lg"
                rounded="full"
                px={8}
              >
                View Full Schedule
              </Button>
            </VStack>
            <Box
              bg={cardBg}
              p={8}
              rounded="xl"
              shadow="xl"
              borderTop="4px"
              borderTopColor="purple.500"
            >
              <VStack spacing={6} align="start">
                <HStack spacing={4}>
                  <Icon as={FaCalendarAlt} w={10} h={10} color="purple.500" />
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
                      3-5 Sessions
                    </Text>
                    <Text color={textColor}>Per Week</Text>
                  </Box>
                </HStack>
                <HStack spacing={4}>
                  <Icon as={FaClock} w={10} h={10} color="purple.500" />
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
                      60 Minutes
                    </Text>
                    <Text color={textColor}>Average Duration</Text>
                  </Box>
                </HStack>
                <HStack spacing={4}>
                  <Icon as={FaUsers} w={10} h={10} color="purple.500" />
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
                      20-50
                    </Text>
                    <Text color={textColor}>Participants Per Session</Text>
                  </Box>
                </HStack>
              </VStack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box py={20} bg="purple.500">
        <Container maxW="container.xl">
          <VStack spacing={8} align="center" textAlign="center">
            <Heading size="xl" color="white">
              Ready to Join Your First Webinar?
            </Heading>
            <Text fontSize="lg" color="purple.100" maxW="2xl">
              Connect with our community, learn new skills, and ask questions in real-time. 
              All webinars are free and designed specifically for seniors.
            </Text>
            <Button
              size="lg"
              bg="white"
              color="purple.500"
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="600"
              rounded="full"
              shadow="lg"
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'xl',
              }}
              as={Link}
              href="/register"
            >
              Browse Upcoming Webinars
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}

