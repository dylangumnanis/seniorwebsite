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
  Image,
} from '@chakra-ui/react'
import { 
  FaUsers, 
  FaHandshake, 
  FaGraduationCap, 
  FaHeart,
  FaClock,
  FaRocket,
  FaQuoteLeft,
  FaArrowRight,
  FaSeedling,
  FaFeatherAlt,
  FaCode,
  FaLinkedin,
  FaEnvelope,
  FaInstagram,
  FaShareAlt
} from 'react-icons/fa'
import Link from 'next/link'

export default function AboutPage() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const cardBg = useColorModeValue('gray.50', 'gray.700')

  const journey = [
    {
      year: '2024',
      title: 'The Beginning',
      description: 'Roots and Wings was born from a simple observation: seniors needed tech help, and students needed meaningful volunteer opportunities.',
      icon: FaSeedling,
    },
    {
      year: '2024',
      title: 'First Connections',
      description: 'Our first 50 matches created lasting friendships and proved that intergenerational learning works.',
      icon: FaHandshake,
    },
    {
      year: '2025',
      title: 'Growing Wings',
      description: 'Expanded to 70+ seniors helped, with programs in technology literacy, financial literacy, and live webinars.',
      icon: FaRocket,
    },
    {
      year: 'Today',
      title: 'Soaring Together',
      description: 'A thriving community of learners and volunteers, continuously growing and making a real difference.',
      icon: FaFeatherAlt,
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

      {/* Meet the Team */}
      <Box py={20} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center" maxW="2xl" mx="auto">
              <Badge colorScheme="orange" px={4} py={2} rounded="full" fontSize="md">
                The People Behind the Mission
              </Badge>
              <Heading size="2xl" color={useColorModeValue('gray.800', 'white')}>
                Meet the Team
              </Heading>
              <Text fontSize="lg" color={textColor}>
                Dedicated individuals working to bridge the digital divide.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
              {/* Dylan Gumnani */}
              <Card
                bg={cardBg}
                shadow="xl"
                overflow="hidden"
                _hover={{ transform: 'translateY(-4px)', shadow: '2xl' }}
                transition="all 0.3s"
              >
                <Flex direction="column">
                  {/* Photo Section */}
                  <Box
                    w="full"
                    h="280px"
                    bg={useColorModeValue('orange.100', 'gray.600')}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    overflow="hidden"
                  >
                    <Image
                      src="/team/dylan.jpg"
                      alt="Dylan Gumnani"
                      objectFit="cover"
                      w="full"
                      h="full"
                      fallback={
                        <VStack spacing={3}>
                          <Avatar 
                            size="2xl" 
                            name="Dylan Gumnani" 
                            bg="orange.500"
                            color="white"
                          />
                          <Text fontSize="xs" color={textColor}>
                            Photo coming soon
                          </Text>
                        </VStack>
                      }
                    />
                  </Box>
                  
                  {/* Info Section */}
                  <CardBody p={6}>
                    <VStack align="start" spacing={3}>
                      <VStack align="start" spacing={1}>
                        <Heading size="lg" color={useColorModeValue('gray.800', 'white')}>
                          Dylan Gumnani
                        </Heading>
                        <HStack spacing={2}>
                          <Badge colorScheme="orange" fontSize="xs">
                            Founder
                          </Badge>
                          <Badge colorScheme="purple" fontSize="xs">
                            Developer
                          </Badge>
                        </HStack>
                      </VStack>
                      
                      <Text color={textColor} fontSize="sm" lineHeight="1.7">
                        Avid tech-enthusiast and amateur break-dancer, Dylan discovered his passion 
                        for helping others growing up near community centers in his home state of New Jersey.
                      </Text>

                      <HStack spacing={3} pt={1}>
                        <Icon as={FaCode} color="orange.500" w={4} h={4} />
                        <Text fontSize="xs" color={textColor}>
                          Building technology that connects generations
                        </Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Flex>
              </Card>

              {/* Sarah Vares */}
              <Card
                bg={cardBg}
                shadow="xl"
                overflow="hidden"
                _hover={{ transform: 'translateY(-4px)', shadow: '2xl' }}
                transition="all 0.3s"
              >
                <Flex direction="column">
                  {/* Photo Section */}
                  <Box
                    w="full"
                    h="280px"
                    bg={useColorModeValue('pink.100', 'gray.600')}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    overflow="hidden"
                  >
                    <Image
                      src="/team/sarah.jpg"
                      alt="Sarah Vares"
                      objectFit="cover"
                      w="full"
                      h="full"
                      fallback={
                        <VStack spacing={3}>
                          <Avatar 
                            size="2xl" 
                            name="Sarah Vares" 
                            bg="pink.500"
                            color="white"
                          />
                          <Text fontSize="xs" color={textColor}>
                            Photo coming soon
                          </Text>
                        </VStack>
                      }
                    />
                  </Box>
                  
                  {/* Info Section */}
                  <CardBody p={6}>
                    <VStack align="start" spacing={3}>
                      <VStack align="start" spacing={1}>
                        <Heading size="lg" color={useColorModeValue('gray.800', 'white')}>
                          Sarah Vares
                        </Heading>
                        <HStack spacing={2}>
                          <Badge colorScheme="pink" fontSize="xs">
                            Social Media Manager
                          </Badge>
                        </HStack>
                      </VStack>
                      
                      <Text color={textColor} fontSize="sm" lineHeight="1.7">
                        Passionate about storytelling and community engagement, Sarah helps spread 
                        our mission and connect with supporters across social platforms.
                      </Text>

                      <HStack spacing={3} pt={1}>
                        <Icon as={FaInstagram} color="pink.500" w={4} h={4} />
                        <Text fontSize="xs" color={textColor}>
                          Sharing stories that inspire action
                        </Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Flex>
              </Card>

              {/* Zofia Jankowska */}
              <Card
                bg={cardBg}
                shadow="xl"
                overflow="hidden"
                _hover={{ transform: 'translateY(-4px)', shadow: '2xl' }}
                transition="all 0.3s"
              >
                <Flex direction="column">
                  {/* Photo Section */}
                  <Box
                    w="full"
                    h="280px"
                    bg={useColorModeValue('purple.100', 'gray.600')}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    overflow="hidden"
                  >
                    <Image
                      src="/team/zofia.jpg"
                      alt="Zofia Jankowska"
                      objectFit="cover"
                      w="full"
                      h="full"
                      fallback={
                        <VStack spacing={3}>
                          <Avatar 
                            size="2xl" 
                            name="Zofia Jankowska" 
                            bg="purple.500"
                            color="white"
                          />
                          <Text fontSize="xs" color={textColor}>
                            Photo coming soon
                          </Text>
                        </VStack>
                      }
                    />
                  </Box>
                  
                  {/* Info Section */}
                  <CardBody p={6}>
                    <VStack align="start" spacing={3}>
                      <VStack align="start" spacing={1}>
                        <Heading size="lg" color={useColorModeValue('gray.800', 'white')}>
                          Zofia Jankowska
                        </Heading>
                        <HStack spacing={2}>
                          <Badge colorScheme="purple" fontSize="xs">
                            Social Media Manager
                          </Badge>
                        </HStack>
                      </VStack>
                      
                      <Text color={textColor} fontSize="sm" lineHeight="1.7">
                        Creative and dedicated, Zofia brings fresh ideas to our online presence 
                        and helps amplify the voices of seniors and volunteers alike.
                      </Text>

                      <HStack spacing={3} pt={1}>
                        <Icon as={FaShareAlt} color="purple.500" w={4} h={4} />
                        <Text fontSize="xs" color={textColor}>
                          Amplifying community voices online
                        </Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Flex>
              </Card>
            </SimpleGrid>

            {/* Join the Team CTA */}
            <Box
              bg={useColorModeValue('orange.50', 'gray.700')}
              p={8}
              rounded="xl"
              textAlign="center"
              maxW="2xl"
              w="full"
            >
              <VStack spacing={4}>
                <Heading size="md" color={useColorModeValue('gray.800', 'white')}>
                  Want to Join Our Team?
                </Heading>
                <Text color={textColor}>
                  We're always looking for passionate individuals to help grow our mission.
                </Text>
                <Button
                  as={Link}
                  href="/contact"
                  colorScheme="orange"
                  rounded="full"
                  px={8}
                >
                  Get in Touch
                </Button>
              </VStack>
            </Box>
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
              {/* Timeline line - Desktop only, centered */}
              <Box
                position="absolute"
                left="50%"
                top="0"
                bottom="0"
                width="4px"
                bg={useColorModeValue('pink.200', 'pink.800')}
                display={{ base: 'none', md: 'block' }}
                transform="translateX(-50%)"
                rounded="full"
              />

              <VStack spacing={8} align="stretch">
                {journey.map((step, index) => (
                  <Flex
                    key={index}
                    direction={{ base: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' }}
                    align={{ base: 'stretch', md: 'center' }}
                    gap={{ base: 4, md: 0 }}
                    position="relative"
                  >
                    {/* Card Container - Left or Right side */}
                    <Box
                      flex={1}
                      pr={{ base: 0, md: index % 2 === 0 ? 12 : 0 }}
                      pl={{ base: 0, md: index % 2 === 0 ? 0 : 12 }}
                    >
                      <Card
                        bg={cardBg}
                        shadow="lg"
                        _hover={{ shadow: 'xl', transform: 'scale(1.02)' }}
                        transition="all 0.3s"
                        borderTop="4px"
                        borderTopColor="pink.500"
                      >
                        <CardBody p={6}>
                          <HStack spacing={4} align="start">
                            {/* Icon inside card for mobile, hidden on desktop */}
                            <Box
                              display={{ base: 'flex', md: 'none' }}
                              bg="pink.500"
                              color="white"
                              p={3}
                              rounded="full"
                              flexShrink={0}
                            >
                              <Icon as={step.icon} w={5} h={5} />
                            </Box>
                            <VStack align="start" spacing={2} flex={1}>
                              <Badge colorScheme="pink" fontSize="sm">
                                {step.year}
                              </Badge>
                              <Heading as="h3" size="md" color={useColorModeValue('gray.800', 'white')}>
                                {step.title}
                              </Heading>
                              <Text color={textColor} lineHeight="1.7" fontSize="sm">
                                {step.description}
                              </Text>
                            </VStack>
                          </HStack>
                        </CardBody>
                      </Card>
                    </Box>

                    {/* Timeline Icon - Desktop only, centered on timeline */}
                    <Box
                      position="absolute"
                      left="50%"
                      top="50%"
                      transform="translate(-50%, -50%)"
                      w="48px"
                      h="48px"
                      bg="pink.500"
                      rounded="full"
                      border="4px solid"
                      borderColor={bgColor}
                      zIndex={3}
                      display={{ base: 'none', md: 'flex' }}
                      alignItems="center"
                      justifyContent="center"
                      shadow="lg"
                    >
                      <Icon as={step.icon} color="white" w={5} h={5} />
                    </Box>

                    {/* Empty space for the other side - Desktop only */}
                    <Box flex={1} display={{ base: 'none', md: 'block' }} />
                  </Flex>
                ))}
              </VStack>
            </Box>
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
                70+
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
                40+
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
