'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Image,
  useColorModeValue,
  Icon,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react'
import { FaCheckCircle, FaUsers, FaHandshake, FaGraduationCap, FaHeart } from 'react-icons/fa'

export default function AboutPage() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  const values = [
    {
      icon: FaUsers,
      title: 'Community',
      description: 'Building a supportive network of learners and volunteers.',
    },
    {
      icon: FaHandshake,
      title: 'Empowerment',
      description: 'Enabling seniors to navigate the digital world with confidence.',
    },
    {
      icon: FaGraduationCap,
      title: 'Education',
      description: 'Providing accessible and personalized learning experiences.',
    },
    {
      icon: FaHeart,
      title: 'Compassion',
      description: 'Understanding and addressing the unique needs of each individual.',
    },
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        bg="primary.600" 
        color="white" 
        py={20}
        backgroundImage="url('/about-hero.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
        position="relative"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.6)"
        />
        <Container maxW="container.xl" position="relative">
          <VStack spacing={6} align="center" textAlign="center">
            <Heading as="h1" size="2xl" fontWeight="bold">
              About Senior Tech Connect
            </Heading>
            <Text fontSize="xl" maxW="2xl">
              Empowering senior citizens through technology education and intergenerational connections.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Our Story */}
      <Box py={16}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
            <VStack align="start" spacing={6}>
              <Heading size="xl">Our Story</Heading>
              <Text fontSize="lg" color={textColor}>
                Senior Tech Connect was founded in 2023 with a simple yet powerful mission: to bridge the digital divide
                between generations and empower senior citizens with the technology skills they need to thrive in today's
                digital world.
              </Text>
              <Text fontSize="lg" color={textColor}>
                What started as a small initiative has grown into a vibrant community of learners and volunteers,
                united by the belief that age should never be a barrier to technology.
              </Text>
            </VStack>
            <Box>
              <Image
                src="/about-story.jpg"
                alt="Senior citizen learning technology"
                rounded="lg"
                shadow="xl"
              />
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Our Values */}
      <Box py={16} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading size="xl" textAlign="center">
              Our Values
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
              {values.map((value, index) => (
                <Box
                  key={index}
                  p={6}
                  bg={bgColor}
                  rounded="lg"
                  shadow="md"
                  textAlign="center"
                >
                  <Icon as={value.icon} w={10} h={10} color="primary.500" mb={4} />
                  <Heading as="h3" size="md" mb={2}>
                    {value.title}
                  </Heading>
                  <Text color={textColor}>{value.description}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* What We Do */}
      <Box py={16}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading size="xl" textAlign="center">
              What We Do
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <Box p={6} bg={bgColor} rounded="lg" shadow="md">
                <Heading as="h3" size="lg" mb={4}>
                  For Senior Citizens
                </Heading>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="primary.500" />
                    One-on-one technology mentoring sessions
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="primary.500" />
                    Interactive workshops on digital skills
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="primary.500" />
                    Financial literacy education
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="primary.500" />
                    Community support and networking
                  </ListItem>
                </List>
              </Box>
              <Box p={6} bg={bgColor} rounded="lg" shadow="md">
                <Heading as="h3" size="lg" mb={4}>
                  For Student Volunteers
                </Heading>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="primary.500" />
                    Comprehensive training program
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="primary.500" />
                    Flexible scheduling options
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="primary.500" />
                    Community service hours
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="primary.500" />
                    Leadership opportunities
                  </ListItem>
                </List>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Impact */}
      <Box py={16} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading size="xl" textAlign="center">
              Our Impact
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
              <Box p={6} bg={bgColor} rounded="lg" shadow="md" textAlign="center">
                <Heading size="2xl" color="primary.500" mb={2}>
                  500+
                </Heading>
                <Text fontSize="lg">Seniors Helped</Text>
              </Box>
              <Box p={6} bg={bgColor} rounded="lg" shadow="md" textAlign="center">
                <Heading size="2xl" color="primary.500" mb={2}>
                  2,500+
                </Heading>
                <Text fontSize="lg">Volunteer Hours</Text>
              </Box>
              <Box p={6} bg={bgColor} rounded="lg" shadow="md" textAlign="center">
                <Heading size="2xl" color="primary.500" mb={2}>
                  300+
                </Heading>
                <Text fontSize="lg">Success Stories</Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
} 