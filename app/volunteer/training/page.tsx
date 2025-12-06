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
  Button,
  Badge,
  Progress,
  Card,
  CardBody,
  CardHeader,
  List,
  ListItem,
  ListIcon,
  Divider,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react'
import {
  FaGraduationCap,
  FaCheckCircle,
  FaClock,
  FaUsers,
  FaCertificate,
  FaHandsHelping,
  FaBook,
  FaVideo,
  FaComments,
  FaAward,
  FaArrowRight,
  FaHeart,
} from 'react-icons/fa'
import Link from 'next/link'

export default function VolunteerTrainingPage() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const cardBg = useColorModeValue('white', 'gray.700')
  const pageBg = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const heroGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

  const trainingModules = [
    {
      id: 1,
      title: 'Introduction to Roots and Wings',
      description: 'Learn about our mission, values, and the impact you can make as a volunteer.',
      duration: '30 min',
      icon: FaHeart,
      status: 'completed',
      topics: [
        'Our mission and vision',
        'Understanding the Roots and Wings philosophy',
        'The role of volunteers',
        'Success stories and impact',
      ],
    },
    {
      id: 2,
      title: 'Communication Skills',
      description: 'Master patient, clear communication techniques for working with seniors.',
      duration: '45 min',
      icon: FaComments,
      status: 'completed',
      topics: [
        'Active listening techniques',
        'Speaking clearly and patiently',
        'Non-verbal communication',
        'Building trust and rapport',
      ],
    },
    {
      id: 3,
      title: 'Technology Fundamentals',
      description: 'Essential tech skills to help seniors with common devices and applications.',
      duration: '60 min',
      icon: FaBook,
      status: 'in-progress',
      topics: [
        'Smartphones and tablets basics',
        'Email and messaging apps',
        'Video calling platforms',
        'Online safety and security',
      ],
    },
    {
      id: 4,
      title: 'Financial Literacy Support',
      description: 'Learn how to guide seniors through online banking and financial tools safely.',
      duration: '45 min',
      icon: FaHandsHelping,
      status: 'locked',
      topics: [
        'Online banking basics',
        'Recognizing scams and fraud',
        'Budgeting tools',
        'Privacy and security best practices',
      ],
    },
    {
      id: 5,
      title: 'Session Management',
      description: 'Best practices for conducting effective one-on-one support sessions.',
      duration: '30 min',
      icon: FaVideo,
      status: 'locked',
      topics: [
        'Session preparation',
        'Setting clear goals',
        'Documenting progress',
        'Follow-up strategies',
      ],
    },
    {
      id: 6,
      title: 'Certification Exam',
      description: 'Complete the final assessment to become a certified Roots and Wings volunteer.',
      duration: '30 min',
      icon: FaCertificate,
      status: 'locked',
      topics: [
        'Comprehensive knowledge test',
        'Scenario-based questions',
        'Ethics and best practices',
        'Final certification',
      ],
    },
  ]

  const benefits = [
    {
      icon: FaAward,
      title: 'Certification',
      description: 'Earn a recognized certificate upon completion',
    },
    {
      icon: FaUsers,
      title: 'Community',
      description: 'Join a supportive network of volunteers',
    },
    {
      icon: FaHeart,
      title: 'Impact',
      description: 'Make a meaningful difference in seniors\' lives',
    },
    {
      icon: FaGraduationCap,
      title: 'Skills',
      description: 'Develop valuable communication and teaching skills',
    },
  ]

  const requirements = [
    'Must be 16 years or older',
    'Commit to at least 2 hours per week',
    'Complete all training modules',
    'Pass the certification exam with 80% or higher',
    'Pass a background check (if required)',
    'Have access to a computer with internet',
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green'
      case 'in-progress':
        return 'blue'
      case 'locked':
        return 'gray'
      default:
        return 'gray'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'in-progress':
        return 'In Progress'
      case 'locked':
        return 'Locked'
      default:
        return 'Not Started'
    }
  }

  return (
    <Box minH="100vh" bg={pageBg}>
      {/* Hero Section */}
      <Box
        bgGradient={heroGradient}
        color="white"
        py={20}
        px={8}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl">
          <VStack spacing={6} align="start" maxW="3xl">
            <Badge
              bg="whiteAlpha.200"
              color="white"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
            >
              Volunteer Training Program
            </Badge>
            <Heading size="3xl" fontWeight="800" lineHeight="1.1">
              Become a Certified
              <Text as="span" display="block" color="orange.200">
                Roots and Wings Volunteer
              </Text>
            </Heading>
            <Text fontSize="xl" opacity={0.95} lineHeight="1.6">
              Join our comprehensive training program designed to equip you with the skills,
              knowledge, and confidence to help seniors navigate technology with patience and care.
              As a wing, you'll empower the roots of our community.
            </Text>
            <HStack spacing={4} pt={4}>
              <Button
                size="lg"
                bg="white"
                color="purple.600"
                _hover={{ bg: 'gray.100', transform: 'translateY(-2px)' }}
                rightIcon={<FaArrowRight />}
                as={Link}
                href="/register"
              >
                Start Training
              </Button>
              <Button
                size="lg"
                variant="outline"
                borderColor="white"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                as={Link}
                href="/volunteer"
              >
                Learn More
              </Button>
            </HStack>
          </VStack>
        </Container>

        {/* Decorative elements */}
        <Box
          position="absolute"
          top="-100px"
          right="-100px"
          w="400px"
          h="400px"
          borderRadius="full"
          bg="whiteAlpha.100"
        />
        <Box
          position="absolute"
          bottom="-50px"
          left="-50px"
          w="300px"
          h="300px"
          borderRadius="full"
          bg="whiteAlpha.150"
        />
      </Box>

      <Container maxW="container.xl" py={16}>
        <VStack spacing={16} align="stretch">
          {/* Training Progress Overview */}
          <Box>
            <VStack spacing={6} align="stretch">
              <Heading size="xl" color={useColorModeValue('gray.800', 'white')}>
                Your Training Progress
              </Heading>
              <Box bg={cardBg} p={8} rounded="xl" shadow="lg">
                <VStack spacing={6}>
                  <HStack w="full" justify="space-between">
                    <Text fontSize="lg" fontWeight="600" color={textColor}>
                      Overall Progress
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="orange.500">
                      33%
                    </Text>
                  </HStack>
                  <Progress
                    value={33}
                    colorScheme="orange"
                    size="lg"
                    borderRadius="full"
                    w="full"
                  />
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
                    <Stat textAlign="center">
                      <StatNumber fontSize="2xl" color="green.500">
                        2
                      </StatNumber>
                      <StatLabel>Completed</StatLabel>
                    </Stat>
                    <Stat textAlign="center">
                      <StatNumber fontSize="2xl" color="blue.500">
                        1
                      </StatNumber>
                      <StatLabel>In Progress</StatLabel>
                    </Stat>
                    <Stat textAlign="center">
                      <StatNumber fontSize="2xl" color="gray.500">
                        3
                      </StatNumber>
                      <StatLabel>Remaining</StatLabel>
                    </Stat>
                  </SimpleGrid>
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* Training Modules */}
          <Box>
            <VStack spacing={6} align="stretch" mb={8}>
              <Heading size="xl" color={useColorModeValue('gray.800', 'white')}>
                Training Curriculum
              </Heading>
              <Text fontSize="lg" color={textColor}>
                Complete all modules to become a certified volunteer. Each module builds on the
                previous one, ensuring you're fully prepared to help seniors with confidence.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              {trainingModules.map((module) => (
                <Card
                  key={module.id}
                  bg={cardBg}
                  shadow="lg"
                  borderRadius="xl"
                  overflow="hidden"
                  borderLeft="4px"
                  borderLeftColor={
                    module.status === 'completed'
                      ? 'green.500'
                      : module.status === 'in-progress'
                      ? 'blue.500'
                      : 'gray.300'
                  }
                  opacity={module.status === 'locked' ? 0.7 : 1}
                >
                  <CardHeader>
                    <Flex justify="space-between" align="start">
                      <HStack spacing={4}>
                        <Box
                          p={3}
                          bg={
                            module.status === 'completed'
                              ? 'green.100'
                              : module.status === 'in-progress'
                              ? 'blue.100'
                              : 'gray.100'
                          }
                          borderRadius="lg"
                        >
                          <Icon
                            as={module.icon}
                            w={6}
                            h={6}
                            color={
                              module.status === 'completed'
                                ? 'green.600'
                                : module.status === 'in-progress'
                                ? 'blue.600'
                                : 'gray.400'
                            }
                          />
                        </Box>
                        <VStack align="start" spacing={1}>
                          <Heading size="md">{module.title}</Heading>
                          <HStack spacing={3}>
                            <Badge colorScheme={getStatusColor(module.status)}>
                              {getStatusText(module.status)}
                            </Badge>
                            <HStack spacing={1} color={textColor}>
                              <Icon as={FaClock} w={3} h={3} />
                              <Text fontSize="sm">{module.duration}</Text>
                            </HStack>
                          </HStack>
                        </VStack>
                      </HStack>
                    </Flex>
                  </CardHeader>
                  <CardBody pt={0}>
                    <Text color={textColor} mb={4}>
                      {module.description}
                    </Text>
                    <Divider mb={4} />
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" fontWeight="600" color={textColor}>
                        Topics Covered:
                      </Text>
                      <List spacing={2}>
                        {module.topics.map((topic, index) => (
                          <ListItem key={index}>
                            <HStack align="start" spacing={2}>
                              <ListIcon
                                as={FaCheckCircle}
                                color={
                                  module.status === 'completed'
                                    ? 'green.500'
                                    : module.status === 'in-progress'
                                    ? 'blue.500'
                                    : 'gray.400'
                                }
                                mt={1}
                              />
                              <Text fontSize="sm" color={textColor}>
                                {topic}
                              </Text>
                            </HStack>
                          </ListItem>
                        ))}
                      </List>
                    </VStack>
                    {module.status !== 'locked' && (
                      <Button
                        mt={6}
                        w="full"
                        colorScheme={
                          module.status === 'completed' ? 'green' : 'blue'
                        }
                        rightIcon={<FaArrowRight />}
                        isDisabled={module.status === 'locked'}
                      >
                        {module.status === 'completed'
                          ? 'Review Module'
                          : 'Continue Learning'}
                      </Button>
                    )}
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Benefits Section */}
          <Box bg={cardBg} p={10} rounded="xl" shadow="lg">
            <VStack spacing={8}>
              <Heading size="xl" textAlign="center" color={useColorModeValue('gray.800', 'white')}>
                Why Complete Training?
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
                {benefits.map((benefit, index) => (
                  <VStack key={index} spacing={4} textAlign="center">
                    <Box
                      p={4}
                      bg="orange.100"
                      borderRadius="full"
                      color="orange.600"
                    >
                      <Icon as={benefit.icon} w={8} h={8} />
                    </Box>
                    <Heading size="md">{benefit.title}</Heading>
                    <Text color={textColor}>{benefit.description}</Text>
                  </VStack>
                ))}
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Requirements Section */}
          <Box>
            <VStack spacing={6} align="stretch">
              <Heading size="xl" color={useColorModeValue('gray.800', 'white')}>
                Requirements to Volunteer
              </Heading>
              <Box bg={cardBg} p={8} rounded="xl" shadow="lg">
                <List spacing={4}>
                  {requirements.map((requirement, index) => (
                    <ListItem key={index}>
                      <HStack align="start" spacing={3}>
                        <Icon
                          as={FaCheckCircle}
                          color="green.500"
                          mt={1}
                          w={5}
                          h={5}
                        />
                        <Text fontSize="lg" color={textColor}>
                          {requirement}
                        </Text>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </VStack>
          </Box>

          {/* Call to Action */}
          <Box
            bgGradient="linear(to-r, orange.400, orange.600)"
            color="white"
            p={12}
            rounded="xl"
            textAlign="center"
            shadow="xl"
          >
            <VStack spacing={6}>
              <Heading size="xl">Ready to Make a Difference?</Heading>
              <Text fontSize="lg" maxW="2xl" opacity={0.95}>
                Start your journey as a Roots and Wings volunteer today. Complete the training
                program and begin helping seniors navigate technology with confidence and care.
              </Text>
              <HStack spacing={4} pt={4}>
                <Button
                  size="lg"
                  bg="white"
                  color="orange.600"
                  _hover={{ bg: 'gray.100', transform: 'translateY(-2px)' }}
                  rightIcon={<FaArrowRight />}
                  as={Link}
                  href="/register"
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  borderColor="white"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  as={Link}
                  href="/volunteer"
                >
                  Learn More
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

