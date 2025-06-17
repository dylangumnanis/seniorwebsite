'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Icon,
  VStack,
  HStack,
  Image,
  Flex,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Avatar,
  AvatarGroup,
} from '@chakra-ui/react'
import { FaUsers, FaGraduationCap, FaVideo, FaComments, FaBook, FaCalendarAlt, FaHeart, FaHandshake, FaClock } from 'react-icons/fa'
import Link from 'next/link'

export default function Home() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  const impactStats = [
    {
      label: 'Seniors Helped',
      value: '500+',
      icon: FaUsers,
    },
    {
      label: 'Volunteer Hours',
      value: '2,500+',
      icon: FaClock,
    },
    {
      label: 'Success Stories',
      value: '300+',
      icon: FaHeart,
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Senior Citizen',
      image: '/testimonials/sarah.jpg',
      quote: "Thanks to Senior Tech Connect, I can now video chat with my grandchildren and manage my finances online with confidence.",
    },
    {
      name: 'Michael Chen',
      role: 'Student Volunteer',
      image: '/testimonials/michael.jpg',
      quote: "Volunteering here has been incredibly rewarding. The impact we make on seniors' lives is truly meaningful.",
    },
  ]

  return (
    <Box>
      {/* Hero Section - Minimalist Design */}
      <Box 
        bg={useColorModeValue('orange.50', 'gray.900')}
        minH="100vh"
        display="flex"
        alignItems="center"
        position="relative"
        overflow="hidden"
      >
        {/* Subtle background elements */}
        <Box
          position="absolute"
          top="10%"
          right="5%"
          width="300px"
          height="300px"
          borderRadius="full"
          bg="orange.100"
          opacity="0.3"
          zIndex="0"
        />
        <Box
          position="absolute"
          bottom="15%"
          left="8%"
          width="200px"
          height="200px"
          borderRadius="full"
          bg="blue.100"
          opacity="0.4"
          zIndex="0"
        />
        
        <Container maxW="container.xl" position="relative" zIndex="1">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={16} alignItems="center">
            {/* Left side - Text content */}
            <VStack align="start" spacing={8} maxW="500px">
              <VStack align="start" spacing={4}>
                <Heading 
                  as="h1" 
                  size="3xl" 
                  fontWeight="800"
                  lineHeight="1.1"
                  color={useColorModeValue('gray.800', 'white')}
                >
                  Technology Made
                  <Text as="span" color="orange.500" display="block">
                    Simple & Friendly
                  </Text>
                </Heading>
                <Text 
                  fontSize="xl" 
                  color={useColorModeValue('gray.600', 'gray.300')}
                  fontWeight="400"
                  lineHeight="1.5"
                >
                  Connect with caring student volunteers for personalized tech support
                </Text>
              </VStack>
              
              <Button
                size="lg"
                bg="orange.500"
                color="white"
                px={8}
                py={6}
                fontSize="lg"
                fontWeight="600"
                rounded="full"
                shadow="lg"
                _hover={{
                  bg: 'orange.600',
                  transform: 'translateY(-2px)',
                  shadow: 'xl',
                }}
                _active={{
                  transform: 'translateY(0)',
                }}
                transition="all 0.2s"
                as={Link}
                href="/register"
              >
                Start Learning Today
              </Button>
              
              {/* Trust indicators */}
              <HStack spacing={6} pt={4}>
                <HStack spacing={2}>
                  <Icon as={FaUsers} color="orange.500" />
                  <Text fontSize="sm" color={textColor} fontWeight="500">
                    500+ seniors helped
                  </Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={FaHeart} color="orange.500" />
                  <Text fontSize="sm" color={textColor} fontWeight="500">
                    100% free
                  </Text>
                </HStack>
              </HStack>
            </VStack>
            
            {/* Right side - Illustration/Image */}
            <Box position="relative" display={{ base: 'none', lg: 'block' }}>
              <Box
                bg="white"
                rounded="2xl"
                shadow="2xl"
                p={8}
                position="relative"
                zIndex="2"
                transform="rotate(-2deg)"
                _hover={{ transform: 'rotate(0deg)' }}
                transition="transform 0.3s ease"
              >
                <VStack spacing={6}>
                  <HStack spacing={4}>
                    <Avatar 
                      size="lg" 
                      bg="orange.100" 
                      icon={<Icon as={FaUsers} color="orange.500" boxSize={6} />}
                    />
                    <Box>
                      <Text fontWeight="bold" color="gray.800">
                        Maria, 72
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Learning video calls
                      </Text>
                    </Box>
                  </HStack>
                  
                  <Box
                    bg="gray.50"
                    p={4}
                    rounded="lg"
                    w="full"
                  >
                    <Text fontSize="sm" color="gray.700" fontStyle="italic">
                      "My volunteer helped me set up video calls with my family. 
                      Now I talk to my grandchildren every week!"
                    </Text>
                  </Box>
                  
                  <HStack spacing={3} w="full" justify="center">
                    <Box w={3} h={3} bg="orange.200" rounded="full" />
                    <Box w={3} h={3} bg="orange.400" rounded="full" />
                    <Box w={3} h={3} bg="orange.200" rounded="full" />
                  </HStack>
                </VStack>
              </Box>
              
              {/* Floating elements */}
              <Box
                position="absolute"
                top="-10px"
                right="-10px"
                bg="blue.500"
                color="white"
                p={3}
                rounded="full"
                shadow="lg"
                zIndex="3"
              >
                <Icon as={FaGraduationCap} boxSize={5} />
              </Box>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Impact Stats */}
      <Box py={16} bg={useColorModeValue('white', 'gray.800')}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading size="lg" textAlign="center" color={textColor}>
              Trusted by seniors nationwide
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
              {impactStats.map((stat, index) => (
                <Box
                  key={index}
                  textAlign="center"
                >
                  <Icon as={stat.icon} w={8} h={8} color="orange.500" mb={4} />
                  <Stat>
                    <StatNumber fontSize="3xl" fontWeight="bold" color="orange.500">
                      {stat.value}
                    </StatNumber>
                    <StatLabel fontSize="lg" color={textColor}>{stat.label}</StatLabel>
                  </Stat>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box py={16} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
            <Box>
              <Image
                src="/mission-image.jpg"
                alt="Senior citizen learning technology"
                rounded="xl"
                shadow="xl"
              />
            </Box>
            <VStack align="start" spacing={6}>
              <Heading size="xl" color={useColorModeValue('gray.800', 'white')}>
                Learning shouldn't stop at any age
              </Heading>
              <Text fontSize="lg" color={textColor} lineHeight="1.7">
                We connect seniors with patient, trained student volunteers who provide 
                one-on-one technology support in a comfortable, judgment-free environment.
              </Text>
              <Button
                as={Link}
                href="/about"
                variant="outline"
                colorScheme="orange"
                size="lg"
                rounded="full"
              >
                Our Story
              </Button>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box py={16} bg={useColorModeValue('white', 'gray.800')}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading size="xl" textAlign="center" color={useColorModeValue('gray.800', 'white')}>
              Real stories from our community
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              {testimonials.map((testimonial, index) => (
                <Box
                  key={index}
                  p={8}
                  bg={bgColor}
                  rounded="xl"
                  shadow="lg"
                  borderTop="4px"
                  borderTopColor="orange.500"
                >
                  <VStack spacing={4} align="start">
                    <Text fontSize="lg" fontStyle="italic" color={textColor}>
                      "{testimonial.quote}"
                    </Text>
                    <HStack>
                      <Avatar src={testimonial.image} size="md" />
                      <Box>
                        <Text fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
                          {testimonial.name}
                        </Text>
                        <Text color={textColor} fontSize="sm">{testimonial.role}</Text>
                      </Box>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box py={20} bg="orange.500">
        <Container maxW="container.xl">
          <VStack spacing={8} align="center" textAlign="center">
            <Heading size="xl" color="white">
              Ready to get started?
            </Heading>
            <Text fontSize="lg" color="orange.100" maxW="2xl">
              Join our welcoming community of learners and volunteers. 
              Technology support is just a click away.
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
              Join Our Community
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
} 