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
  CardHeader,
} from '@chakra-ui/react'
import { 
  FaCheckCircle, 
  FaLaptop, 
  FaMobileAlt, 
  FaVideo, 
  FaEnvelope, 
  FaShoppingCart,
  FaShieldAlt,
  FaCloud,
  FaUsers,
  FaClock,
  FaGraduationCap
} from 'react-icons/fa'
import Link from 'next/link'

export default function TechLiteracyPage() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const cardBg = useColorModeValue('gray.50', 'gray.700')

  const topics = [
    {
      icon: FaLaptop,
      title: 'Computer Basics',
      description: 'Learn to navigate your computer, use the mouse and keyboard, and understand the desktop.',
    },
    {
      icon: FaMobileAlt,
      title: 'Smartphone & Tablet',
      description: 'Master your mobile device - from making calls to downloading apps and managing settings.',
    },
    {
      icon: FaVideo,
      title: 'Video Calls',
      description: 'Connect with family and friends through Zoom, FaceTime, Skype, and other video platforms.',
    },
    {
      icon: FaEnvelope,
      title: 'Email & Messaging',
      description: 'Send and receive emails, organize your inbox, and use messaging apps like WhatsApp.',
    },
    {
      icon: FaShoppingCart,
      title: 'Online Shopping',
      description: 'Shop safely online, compare prices, read reviews, and make secure purchases.',
    },
    {
      icon: FaShieldAlt,
      title: 'Online Safety',
      description: 'Protect yourself from scams, create strong passwords, and recognize phishing attempts.',
    },
    {
      icon: FaCloud,
      title: 'Cloud Storage',
      description: 'Store and access your photos, documents, and files from anywhere using cloud services.',
    },
    {
      icon: FaUsers,
      title: 'Social Media',
      description: 'Connect on Facebook, Instagram, and other platforms to stay in touch with loved ones.',
    },
  ]

  const benefits = [
    'One-on-one personalized instruction',
    'Patient, trained student volunteers',
    'Flexible scheduling to fit your needs',
    'Step-by-step guidance at your pace',
    'Safe, judgment-free learning environment',
    'Ongoing support and follow-up sessions',
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        bg={useColorModeValue('orange.50', 'gray.900')}
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
          bg="orange.100"
          opacity="0.3"
        />
        <Container maxW="container.xl" position="relative">
          <VStack spacing={6} align="start" maxW="3xl">
            <Badge colorScheme="orange" px={3} py={1} rounded="full" fontSize="sm">
              Technology Literacy Program
            </Badge>
            <Heading as="h1" size="3xl" fontWeight="800" color={useColorModeValue('gray.800', 'white')}>
              Master Technology at Your Own Pace
            </Heading>
            <Text fontSize="xl" color={textColor} lineHeight="1.7">
              Our Technology Literacy program empowers seniors to confidently navigate the digital world. 
              Learn essential tech skills with patient, one-on-one guidance from trained student volunteers.
            </Text>
            <HStack spacing={4} pt={4}>
              <Button
                as={Link}
                href="/register"
                size="lg"
                bg="orange.500"
                color="white"
                px={8}
                rounded="full"
                _hover={{ bg: 'orange.600', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                Get Started
              </Button>
              <Button
                as={Link}
                href="/volunteer/become"
                size="lg"
                variant="outline"
                colorScheme="orange"
                px={8}
                rounded="full"
              >
                Become a Volunteer
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* What You'll Learn */}
      <Box py={16} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center" maxW="2xl">
              <Heading size="xl" color={useColorModeValue('gray.800', 'white')}>
                What You'll Learn
              </Heading>
              <Text fontSize="lg" color={textColor}>
                Our comprehensive curriculum covers everything you need to feel confident using technology in your daily life.
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {topics.map((topic, index) => (
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
                      <Icon as={topic.icon} w={8} h={8} color="orange.500" />
                      <Heading as="h3" size="md" color={useColorModeValue('gray.800', 'white')}>
                        {topic.title}
                      </Heading>
                      <Text color={textColor} fontSize="sm">
                        {topic.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Program Benefits */}
      <Box py={16} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
            <VStack align="start" spacing={6}>
              <Heading size="xl" color={useColorModeValue('gray.800', 'white')}>
                Why Choose Our Program?
              </Heading>
              <Text fontSize="lg" color={textColor} lineHeight="1.7">
                We understand that learning technology can feel overwhelming. That's why we've designed 
                our program to be patient, personalized, and supportive every step of the way.
              </Text>
              <List spacing={4}>
                {benefits.map((benefit, index) => (
                  <ListItem key={index}>
                    <HStack align="start">
                      <ListIcon as={FaCheckCircle} color="orange.500" mt={1} />
                      <Text color={textColor} fontSize="md">
                        {benefit}
                      </Text>
                    </HStack>
                  </ListItem>
                ))}
              </List>
            </VStack>
            <Box
              bg={bgColor}
              p={8}
              rounded="xl"
              shadow="xl"
              borderTop="4px"
              borderTopColor="orange.500"
            >
              <VStack spacing={6} align="start">
                <HStack spacing={4}>
                  <Icon as={FaUsers} w={10} h={10} color="orange.500" />
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
                      70+
                    </Text>
                    <Text color={textColor}>Seniors Helped</Text>
                  </Box>
                </HStack>
                <HStack spacing={4}>
                  <Icon as={FaGraduationCap} w={10} h={10} color="orange.500" />
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
                      100+
                    </Text>
                    <Text color={textColor}>Trained Volunteers</Text>
                  </Box>
                </HStack>
                <HStack spacing={4}>
                  <Icon as={FaClock} w={10} h={10} color="orange.500" />
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
                      2,500+
                    </Text>
                    <Text color={textColor}>Hours of Support</Text>
                  </Box>
                </HStack>
              </VStack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box py={16} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading size="xl" color={useColorModeValue('gray.800', 'white')}>
                How It Works
              </Heading>
              <Text fontSize="lg" color={textColor} maxW="2xl">
                Getting started is simple. Follow these easy steps to begin your technology journey.
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              <VStack spacing={4} align="start">
                <Box
                  bg="orange.500"
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
                  Sign Up
                </Heading>
                <Text color={textColor}>
                  Create a free account and tell us about your technology learning goals and interests.
                </Text>
              </VStack>
              <VStack spacing={4} align="start">
                <Box
                  bg="orange.500"
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
                  Get Matched
                </Heading>
                <Text color={textColor}>
                  We'll match you with a trained student volunteer who specializes in the topics you want to learn.
                </Text>
              </VStack>
              <VStack spacing={4} align="start">
                <Box
                  bg="orange.500"
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
                  Start Learning
                </Heading>
                <Text color={textColor}>
                  Schedule your first session and begin learning at your own pace with personalized guidance.
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box py={20} bg="orange.500">
        <Container maxW="container.xl">
          <VStack spacing={8} align="center" textAlign="center">
            <Heading size="xl" color="white">
              Ready to Start Your Technology Journey?
            </Heading>
            <Text fontSize="lg" color="orange.100" maxW="2xl">
              Join hundreds of seniors who have gained confidence and independence through our Technology Literacy program.
            </Text>
            <Button
              size="lg"
              bg="white"
              color="orange.500"
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
              Get Started Today
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}

