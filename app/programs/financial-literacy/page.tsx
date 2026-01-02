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
  FaCreditCard, 
  FaPiggyBank, 
  FaChartLine, 
  FaShieldAlt,
  FaMobileAlt,
  FaFileInvoiceDollar,
  FaUniversity,
  FaUsers,
  FaClock,
  FaGraduationCap
} from 'react-icons/fa'
import Link from 'next/link'

export default function FinancialLiteracyPage() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const cardBg = useColorModeValue('gray.50', 'gray.700')

  const topics = [
    {
      icon: FaCreditCard,
      title: 'Banking Basics',
      description: 'Understand checking and savings accounts, online banking, and ATM usage.',
    },
    {
      icon: FaMobileAlt,
      title: 'Mobile Banking',
      description: 'Learn to safely manage your finances using banking apps on your smartphone.',
    },
    {
      icon: FaChartLine,
      title: 'Budgeting & Planning',
      description: 'Create and maintain a budget, track expenses, and plan for the future.',
    },
    {
      icon: FaPiggyBank,
      title: 'Saving Strategies',
      description: 'Discover effective ways to save money and build your financial security.',
    },
    {
      icon: FaShieldAlt,
      title: 'Fraud Prevention',
      description: 'Protect yourself from financial scams, identity theft, and fraudulent schemes.',
    },
    {
      icon: FaFileInvoiceDollar,
      title: 'Bill Management',
      description: 'Set up automatic payments, organize bills, and avoid late fees.',
    },
    {
      icon: FaUniversity,
      title: 'Retirement Planning',
      description: 'Understand Social Security, retirement accounts, and financial planning for seniors.',
    },
    {
      icon: FaCreditCard,
      title: 'Credit & Debt',
      description: 'Learn about credit scores, managing debt, and using credit cards wisely.',
    },
  ]

  const benefits = [
    'Confidential, one-on-one financial guidance',
    'Expert volunteers trained in financial literacy',
    'Learn at your own comfortable pace',
    'Practical, real-world financial skills',
    'Protection against common financial scams',
    'Tools and resources to manage your money',
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        bg={useColorModeValue('blue.50', 'gray.900')}
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
          bg="blue.100"
          opacity="0.3"
        />
        <Container maxW="container.xl" position="relative">
          <VStack spacing={6} align="start" maxW="3xl">
            <Badge colorScheme="blue" px={3} py={1} rounded="full" fontSize="sm">
              Financial Literacy Program
            </Badge>
            <Heading as="h1" size="3xl" fontWeight="800" color={useColorModeValue('gray.800', 'white')}>
              Build Financial Confidence & Security
            </Heading>
            <Text fontSize="xl" color={textColor} lineHeight="1.7">
              Our Financial Literacy program helps seniors navigate the modern financial world with confidence. 
              Learn essential money management skills and protect yourself from financial scams with expert guidance.
            </Text>
            <HStack spacing={4} pt={4}>
              <Button
                as={Link}
                href="/register"
                size="lg"
                bg="blue.500"
                color="white"
                px={8}
                rounded="full"
                _hover={{ bg: 'blue.600', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                Get Started
              </Button>
              <Button
                as={Link}
                href="/volunteer/become"
                size="lg"
                variant="outline"
                colorScheme="blue"
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
                Master essential financial skills to manage your money safely and confidently in today's digital world.
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
                      <Icon as={topic.icon} w={8} h={8} color="blue.500" />
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
                Why Financial Literacy Matters
              </Heading>
              <Text fontSize="lg" color={textColor} lineHeight="1.7">
                Financial scams targeting seniors are on the rise. Our program equips you with the knowledge 
                and skills to protect your hard-earned money and make informed financial decisions.
              </Text>
              <List spacing={4}>
                {benefits.map((benefit, index) => (
                  <ListItem key={index}>
                    <HStack align="start">
                      <ListIcon as={FaCheckCircle} color="blue.500" mt={1} />
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
              borderTopColor="blue.500"
            >
              <VStack spacing={6} align="start">
                <HStack spacing={4}>
                  <Icon as={FaShieldAlt} w={10} h={10} color="blue.500" />
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
                      Safe & Secure
                    </Text>
                    <Text color={textColor}>100% Confidential</Text>
                  </Box>
                </HStack>
                <HStack spacing={4}>
                  <Icon as={FaUsers} w={10} h={10} color="blue.500" />
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
                      40+
                    </Text>
                    <Text color={textColor}>Seniors Protected</Text>
                  </Box>
                </HStack>
                <HStack spacing={4}>
                  <Icon as={FaGraduationCap} w={10} h={10} color="blue.500" />
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
                      Expert
                    </Text>
                    <Text color={textColor}>Trained Volunteers</Text>
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
                Start your journey to financial confidence with these simple steps.
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              <VStack spacing={4} align="start">
                <Box
                  bg="blue.500"
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
                  Create a free account and let us know what financial topics you'd like to learn about.
                </Text>
              </VStack>
              <VStack spacing={4} align="start">
                <Box
                  bg="blue.500"
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
                  We'll connect you with a trained volunteer who specializes in financial literacy education.
                </Text>
              </VStack>
              <VStack spacing={4} align="start">
                <Box
                  bg="blue.500"
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
                  Learn & Protect
                </Heading>
                <Text color={textColor}>
                  Start learning essential financial skills and how to protect yourself from scams in a safe, confidential environment.
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Security Notice */}
      <Box py={12} bg={useColorModeValue('blue.50', 'gray.800')}>
        <Container maxW="container.xl">
          <Box
            bg={bgColor}
            p={8}
            rounded="xl"
            borderLeft="4px"
            borderLeftColor="blue.500"
          >
            <HStack spacing={4} align="start">
              <Icon as={FaShieldAlt} w={8} h={8} color="blue.500" flexShrink={0} />
              <VStack align="start" spacing={2}>
                <Heading as="h3" size="md" color={useColorModeValue('gray.800', 'white')}>
                  Your Privacy is Protected
                </Heading>
                <Text color={textColor}>
                  All financial literacy sessions are completely confidential. Our volunteers are trained to never ask for 
                  personal financial information like account numbers, passwords, or Social Security numbers. 
                  We focus on education and empowerment, not accessing your accounts.
                </Text>
              </VStack>
            </HStack>
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box py={20} bg="blue.500">
        <Container maxW="container.xl">
          <VStack spacing={8} align="center" textAlign="center">
            <Heading size="xl" color="white">
              Take Control of Your Financial Future
            </Heading>
            <Text fontSize="lg" color="blue.100" maxW="2xl">
              Join hundreds of seniors who have gained financial confidence and security through our Financial Literacy program.
            </Text>
            <Button
              size="lg"
              bg="white"
              color="blue.500"
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

