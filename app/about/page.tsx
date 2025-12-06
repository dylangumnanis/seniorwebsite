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
  Button,
  Badge,
  Card,
  CardBody,
  Flex,
  Divider,
  Avatar,
  AvatarGroup,
} from '@chakra-ui/react'
import { 
  FaUsers, 
  FaHandshake, 
  FaGraduationCap, 
  FaHeart,
  FaClock,
  FaAward,
  FaLightbulb,
  FaRocket,
  FaQuoteLeft,
  FaStar,
  FaArrowRight,
  FaSeedling,
  FaFeatherAlt
} from 'react-icons/fa'
import Link from 'next/link'

export default function AboutPage() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const cardBg = useColorModeValue('gray.50', 'gray.700')

  const journey = [
    {
      year: '2023',
      title: 'The Beginning',
      description: 'Roots and Wings was born from a simple observation: seniors needed tech help, and students needed meaningful volunteer opportunities.',
      icon: FaSeedling,
    },
    {
      year: '2023',
      title: 'First Connections',
      description: 'Our first 50 matches created lasting friendships and proved that intergenerational learning works.',
      icon: FaHandshake,
    },
    {
      year: '2024',
      title: 'Growing Wings',
      description: 'Expanded to 500+ seniors helped, with programs in technology literacy, financial literacy, and live webinars.',
      icon: FaRocket,
    },
    {
      year: 'Today',
      title: 'Soaring Together',
      description: 'A thriving community of learners and volunteers, continuously growing and making a real difference.',
      icon: FaFeatherAlt,
    },
  ]

  const values = [
    {
      icon: FaUsers,
      title: 'Community First',
      description: 'We believe in the power of connection. Every interaction builds a stronger, more supportive community.',
      color: 'pink',
      position: 'left',
    },
    {
      icon: FaGraduationCap,
      title: 'Lifelong Learning',
      description: 'Education doesn\'t have an expiration date. We celebrate curiosity and growth at every age.',
      color: 'orange',
      position: 'right',
    },
    {
      icon: FaHeart,
      title: 'Compassionate Support',
      description: 'We meet people where they are, with patience, understanding, and genuine care for each individual journey.',
      color: 'red',
      position: 'left',
    },
    {
      icon: FaHandshake,
      title: 'Mutual Benefit',
      description: 'Everyone gains something valuable - seniors learn skills, volunteers gain perspective, and both form meaningful connections.',
      color: 'blue',
      position: 'right',
    },
  ]

  const testimonials = [
    {
      name: 'Maria Rodriguez',
      role: 'Senior Participant',
      quote: 'I was so afraid of technology, but my volunteer was so patient. Now I video call my grandchildren every week!',
      avatar: 'MR',
    },
    {
      name: 'James Chen',
      role: 'Student Volunteer',
      quote: 'Volunteering here changed my perspective. The connections I\'ve made are more valuable than any resume line.',
      avatar: 'JC',
    },
    {
      name: 'Patricia Williams',
      role: 'Senior Participant',
      quote: 'The financial literacy program saved me from a scam. I\'m so grateful for this community.',
      avatar: 'PW',
    },
  ]

  return (
    <Box>
      {/* Hero Section - Centered & Unique */}
      <Box 
        bgGradient={useColorModeValue(
          'linear(to-br, pink.50, orange.50, purple.50)',
          'linear(to-br, gray.900, gray.800)'
        )}
        py={24}
        position="relative"
        overflow="hidden"
      >
        {/* Animated background elements */}
        <Box
          position="absolute"
          top="10%"
          left="5%"
          width="150px"
          height="150px"
          borderRadius="full"
          bg="pink.200"
          opacity="0.2"
          animation="float 6s ease-in-out infinite"
        />
        <Box
          position="absolute"
          bottom="15%"
          right="10%"
          width="200px"
          height="200px"
          borderRadius="full"
          bg="orange.200"
          opacity="0.2"
          animation="float 8s ease-in-out infinite"
        />
        <Box
          position="absolute"
          top="50%"
          right="20%"
          width="100px"
          height="100px"
          borderRadius="full"
          bg="purple.200"
          opacity="0.2"
          animation="float 7s ease-in-out infinite"
        />

        <Container maxW="container.xl" position="relative">
          <VStack spacing={8} align="center" textAlign="center" maxW="4xl" mx="auto">
            <HStack spacing={3} justify="center">
              <Icon as={FaSeedling} w={6} h={6} color="pink.500" />
              <Badge colorScheme="pink" px={4} py={2} rounded="full" fontSize="md">
                About Roots and Wings
              </Badge>
              <Icon as={FaFeatherAlt} w={6} h={6} color="orange.500" />
            </HStack>
            <Heading 
              as="h1" 
              size="4xl" 
              fontWeight="900"
              bgGradient={useColorModeValue(
                'linear(to-r, pink.600, orange.600, purple.600)',
                'linear(to-r, pink.300, orange.300, purple.300)'
              )}
              bgClip="text"
              lineHeight="1.1"
            >
              Rooted in Wisdom,
              <Text as="span" display="block">
                Soaring Together
              </Text>
            </Heading>
            <Text fontSize="2xl" color={textColor} lineHeight="1.8" maxW="3xl">
              Where the wisdom of experience meets the innovation of youth, creating powerful connections 
              that transform lives on both sides of the generational bridge.
            </Text>
            <HStack spacing={4} pt={4} flexWrap="wrap" justify="center">
              <Button
                as={Link}
                href="/register"
                size="lg"
                bg="pink.500"
                color="white"
                px={10}
                py={7}
                rounded="full"
                fontSize="lg"
                fontWeight="600"
                leftIcon={<FaUsers />}
                _hover={{ bg: 'pink.600', transform: 'translateY(-3px)', shadow: 'xl' }}
                transition="all 0.3s"
                shadow="lg"
              >
                Join Our Community
              </Button>
              <Button
                as={Link}
                href="/volunteer/become"
                size="lg"
                variant="outline"
                colorScheme="orange"
                px={10}
                py={7}
                rounded="full"
                fontSize="lg"
                fontWeight="600"
                borderWidth="2px"
                _hover={{ transform: 'translateY(-3px)', shadow: 'lg' }}
                transition="all 0.3s"
              >
                Become a Volunteer
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Our Journey - Timeline Style */}
      <Box py={20} bg={bgColor} position="relative">
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center" maxW="2xl" mx="auto">
              <Heading size="2xl" color={useColorModeValue('gray.800', 'white')}>
                Our Journey
              </Heading>
              <Text fontSize="lg" color={textColor}>
                From a small idea to a growing movement - here's how we've evolved.
              </Text>
            </VStack>

            <Box w="full" position="relative">
              {/* Timeline line */}
              <Box
                position="absolute"
                left={{ base: '20px', md: '50%' }}
                top="0"
                bottom="0"
                width="3px"
                bg={useColorModeValue('gray.200', 'gray.600')}
                display={{ base: 'block', md: 'none' }}
              />
              <Box
                position="absolute"
                left="50%"
                top="0"
                bottom="0"
                width="3px"
                bg={useColorModeValue('gray.200', 'gray.600')}
                display={{ base: 'none', md: 'block' }}
                transform="translateX(-50%)"
              />

              <VStack spacing={12} align="stretch">
                {journey.map((step, index) => (
                  <Flex
                    key={index}
                    direction={{ base: 'row', md: index % 2 === 0 ? 'row' : 'row-reverse' }}
                    align="center"
                    gap={8}
                    position="relative"
                  >
                    <Box flex={1} display={{ base: 'none', md: 'block' }} />
                    <Box
                      flex={1}
                      position="relative"
                      zIndex={2}
                    >
                      <Card
                        bg={cardBg}
                        shadow="lg"
                        _hover={{ shadow: 'xl', transform: 'scale(1.02)' }}
                        transition="all 0.3s"
                        borderLeft={{ base: '4px', md: 'none' }}
                        borderLeftColor="pink.500"
                        borderTop={{ base: 'none', md: '4px' }}
                        borderTopColor="pink.500"
                      >
                        <CardBody p={8}>
                          <HStack spacing={4} mb={4}>
                            <Box
                              bg="pink.500"
                              color="white"
                              p={3}
                              rounded="lg"
                            >
                              <Icon as={step.icon} w={6} h={6} />
                            </Box>
                            <VStack align="start" spacing={0}>
                              <Badge colorScheme="pink" fontSize="sm" mb={1}>
                                {step.year}
                              </Badge>
                              <Heading as="h3" size="lg" color={useColorModeValue('gray.800', 'white')}>
                                {step.title}
                              </Heading>
                            </VStack>
                          </HStack>
                          <Text color={textColor} lineHeight="1.7">
                            {step.description}
                          </Text>
                        </CardBody>
                      </Card>
                    </Box>
                    <Box
                      position="absolute"
                      left={{ base: '20px', md: '50%' }}
                      transform={{ base: 'translateX(-50%)', md: 'translateX(-50%)' }}
                      w="40px"
                      h="40px"
                      bg="pink.500"
                      rounded="full"
                      border="4px solid"
                      borderColor={bgColor}
                      zIndex={3}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={step.icon} color="white" w={4} h={4} />
                    </Box>
                    <Box flex={1} display={{ base: 'none', md: 'block' }} />
                  </Flex>
                ))}
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Values - Alternating Layout */}
      <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center" maxW="2xl" mx="auto">
              <Heading size="2xl" color={useColorModeValue('gray.800', 'white')}>
                What Guides Us
              </Heading>
              <Text fontSize="lg" color={textColor}>
                These principles shape every interaction, every program, and every connection we make.
              </Text>
            </VStack>

            <VStack spacing={12} w="full">
              {values.map((value, index) => (
                <Flex
                  key={index}
                  direction={{ base: 'column', md: value.position === 'left' ? 'row' : 'row-reverse' }}
                  align="center"
                  gap={8}
                  w="full"
                >
                  <Box flex={1}>
                    <Card
                      bg={bgColor}
                      shadow="xl"
                      h="full"
                      borderTop="4px"
                      borderTopColor={`${value.color}.500`}
                      _hover={{ transform: 'translateY(-4px)', shadow: '2xl' }}
                      transition="all 0.3s"
                    >
                      <CardBody p={10}>
                        <VStack spacing={6} align="start">
                          <Box
                            bg={`${value.color}.100`}
                            p={4}
                            rounded="xl"
                            display="inline-block"
                          >
                            <Icon as={value.icon} w={10} h={10} color={`${value.color}.500`} />
                          </Box>
                          <Heading as="h3" size="xl" color={useColorModeValue('gray.800', 'white')}>
                            {value.title}
                          </Heading>
                          <Text color={textColor} fontSize="lg" lineHeight="1.8">
                            {value.description}
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  </Box>
                  <Box
                    flex={1}
                    display={{ base: 'none', md: 'block' }}
                    h="300px"
                    bg={`${value.color}.50`}
                    rounded="2xl"
                    opacity={0.3}
                  />
                </Flex>
              ))}
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Impact - Visual Stats */}
      <Box py={20} bg={bgColor}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
            <Box
              bgGradient="linear(to-br, pink.500, pink.600)"
              p={10}
              rounded="2xl"
              color="white"
              textAlign="center"
              shadow="xl"
              _hover={{ transform: 'scale(1.05)', shadow: '2xl' }}
              transition="all 0.3s"
            >
              <Icon as={FaUsers} w={16} h={16} mb={4} opacity={0.9} />
              <Heading size="4xl" mb={2} fontWeight="900">
                500+
              </Heading>
              <Text fontSize="xl" opacity={0.95}>
                Seniors Helped
              </Text>
            </Box>
            <Box
              bgGradient="linear(to-br, orange.500, orange.600)"
              p={10}
              rounded="2xl"
              color="white"
              textAlign="center"
              shadow="xl"
              _hover={{ transform: 'scale(1.05)', shadow: '2xl' }}
              transition="all 0.3s"
            >
              <Icon as={FaClock} w={16} h={16} mb={4} opacity={0.9} />
              <Heading size="4xl" mb={2} fontWeight="900">
                2,500+
              </Heading>
              <Text fontSize="xl" opacity={0.95}>
                Volunteer Hours
              </Text>
            </Box>
            <Box
              bgGradient="linear(to-br, purple.500, purple.600)"
              p={10}
              rounded="2xl"
              color="white"
              textAlign="center"
              shadow="xl"
              _hover={{ transform: 'scale(1.05)', shadow: '2xl' }}
              transition="all 0.3s"
            >
              <Icon as={FaHeart} w={16} h={16} mb={4} opacity={0.9} />
              <Heading size="4xl" mb={2} fontWeight="900">
                300+
              </Heading>
              <Text fontSize="xl" opacity={0.95}>
                Success Stories
              </Text>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center" maxW="2xl" mx="auto">
              <Heading size="2xl" color={useColorModeValue('gray.800', 'white')}>
                Voices from Our Community
              </Heading>
              <Text fontSize="lg" color={textColor}>
                Real stories from the people who make Roots and Wings special.
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  bg={bgColor}
                  shadow="lg"
                  _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}
                  transition="all 0.3s"
                  borderTop="4px"
                  borderTopColor="pink.500"
                >
                  <CardBody p={8}>
                    <VStack spacing={6} align="start">
                      <Icon as={FaQuoteLeft} w={8} h={8} color="pink.400" />
                      <Text color={textColor} fontSize="md" lineHeight="1.8" fontStyle="italic">
                        "{testimonial.quote}"
                      </Text>
                      <Divider />
                      <HStack spacing={4}>
                        <Avatar name={testimonial.avatar} bg="pink.500" />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
                            {testimonial.name}
                          </Text>
                          <Text fontSize="sm" color={textColor}>
                            {testimonial.role}
                          </Text>
                        </VStack>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Mission - Large Statement */}
      <Box py={20} bg={bgColor}>
        <Container maxW="container.xl">
          <Box
            bgGradient={useColorModeValue(
              'linear(to-r, pink.50, orange.50)',
              'linear(to-r, gray.700, gray.800)'
            )}
            p={16}
            rounded="3xl"
            position="relative"
            overflow="hidden"
            border="2px solid"
            borderColor={useColorModeValue('pink.200', 'gray.600')}
          >
            <Box
              position="absolute"
              top="-100px"
              right="-100px"
              width="300px"
              height="300px"
              borderRadius="full"
              bg="pink.200"
              opacity="0.1"
            />
            <VStack spacing={8} align="center" textAlign="center" position="relative" maxW="4xl" mx="auto">
              <HStack spacing={3}>
                <Icon as={FaSeedling} w={10} h={10} color="pink.500" />
                <Heading as="h2" size="2xl" color={useColorModeValue('gray.800', 'white')}>
                  Our Mission
                </Heading>
                <Icon as={FaFeatherAlt} w={10} h={10} color="orange.500" />
              </HStack>
              <Text fontSize="2xl" color={textColor} lineHeight="1.9" fontWeight="400">
                To bridge the digital divide by connecting seniors with patient, trained student volunteers who provide 
                personalized technology and financial literacy support. We believe that everyone, regardless of age, 
                deserves the opportunity to confidently navigate the digital world and stay connected with their loved ones.
              </Text>
              <Text fontSize="xl" color={textColor} lineHeight="1.8" fontStyle="italic" mt={4}>
                "Rooted in wisdom, soaring together - because learning has no age limit."
              </Text>
            </VStack>
          </Box>
        </Container>
      </Box>

      {/* Call to Action - Unique Design */}
      <Box py={24} position="relative" overflow="hidden">
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-br, pink.500, orange.500, purple.500)"
          opacity={0.9}
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="whiteAlpha.50"
          opacity={0.1}
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
          }}
        />
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={10} align="center" textAlign="center">
            <Heading size="3xl" color="white" fontWeight="900">
              Ready to Make a Difference?
            </Heading>
            <Text fontSize="xl" color="whiteAlpha.900" maxW="2xl" lineHeight="1.8">
              Whether you're a senior looking to learn new skills or a student wanting to make an impact, 
              we welcome you to our community. Together, we can bridge the digital divide.
            </Text>
            <HStack spacing={6} flexWrap="wrap" justify="center">
              <Button
                size="xl"
                bg="white"
                color="pink.600"
                px={12}
                py={8}
                fontSize="xl"
                fontWeight="700"
                rounded="full"
                shadow="2xl"
                leftIcon={<FaUsers />}
                rightIcon={<FaArrowRight />}
                _hover={{
                  transform: 'translateY(-4px) scale(1.05)',
                  shadow: '2xl',
                }}
                transition="all 0.3s"
                as={Link}
                href="/register"
              >
                Get Started Today
              </Button>
              <Button
                size="xl"
                variant="outline"
                color="white"
                borderColor="white"
                borderWidth="3px"
                px={12}
                py={8}
                fontSize="xl"
                fontWeight="700"
                rounded="full"
                _hover={{
                  bg: 'whiteAlpha.200',
                  transform: 'translateY(-4px)',
                }}
                transition="all 0.3s"
                as={Link}
                href="/contact"
              >
                Contact Us
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}
