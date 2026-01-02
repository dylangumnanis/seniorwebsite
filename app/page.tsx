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
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  Avatar,
  chakra,
} from '@chakra-ui/react'
import { FaUsers, FaGraduationCap, FaVideo, FaComments, FaBook, FaCalendarAlt, FaHeart, FaHandshake, FaClock } from 'react-icons/fa'
import Link from 'next/link'
import { motion, isValidMotionProp } from 'framer-motion'

// Create motion components
const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === 'children',
})

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
}

export default function Home() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  const impactStats = [
    {
      label: 'Seniors Helped',
      value: '70+',
      icon: FaUsers,
    },
    {
      label: 'Volunteer Hours',
      value: '2,500+',
      icon: FaClock,
    },
    {
      label: 'Success Stories',
      value: '40+',
      icon: FaHeart,
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
            <MotionBox
              as={VStack}
              align="start"
              spacing={8}
              maxW="500px"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <VStack align="start" spacing={4}>
                <MotionBox
                  variants={fadeInUp}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
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
                </MotionBox>
                <MotionBox
                  variants={fadeInUp}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                >
                  <Text 
                    fontSize="xl" 
                    color={useColorModeValue('gray.600', 'gray.300')}
                    fontWeight="400"
                    lineHeight="1.5"
                  >
                    At Roots and Wings, seniors share the roots of wisdom while youth volunteers bring the wings that make personalized tech support take flight.
                  </Text>
                </MotionBox>
              </VStack>
              
              <MotionBox
                variants={fadeInUp}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
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
              </MotionBox>
              
              {/* Trust indicators */}
              <MotionBox
                variants={fadeInUp}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              >
                <HStack spacing={6} pt={4}>
                  <HStack spacing={2}>
                    <Icon as={FaUsers} color="orange.500" />
                    <Text fontSize="sm" color={textColor} fontWeight="500">
                      70+ seniors helped
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Icon as={FaHeart} color="orange.500" />
                    <Text fontSize="sm" color={textColor} fontWeight="500">
                      100% free
                    </Text>
                  </HStack>
                </HStack>
              </MotionBox>
            </MotionBox>
            
            {/* Right side - Illustration/Image */}
            <MotionBox
              position="relative"
              display={{ base: 'none', lg: 'block' }}
              initial="hidden"
              animate="visible"
              variants={scaleIn}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
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
            </MotionBox>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Impact Stats */}
      <Box py={16} bg={useColorModeValue('white', 'gray.800')}>
        <Container maxW="container.xl">
          <MotionBox
            as={VStack}
            spacing={12}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <MotionBox variants={fadeInUp} transition={{ duration: 0.6 }}>
              <Heading size="lg" textAlign="center" color={textColor}>
                Trusted by seniors nationwide
              </Heading>
            </MotionBox>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
              {impactStats.map((stat, index) => (
                <MotionBox
                  key={index}
                  textAlign="center"
                  variants={fadeInUp}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <Icon as={stat.icon} w={8} h={8} color="orange.500" mb={4} />
                  <Stat>
                    <StatNumber fontSize="3xl" fontWeight="bold" color="orange.500">
                      {stat.value}
                    </StatNumber>
                    <StatLabel fontSize="lg" color={textColor}>{stat.label}</StatLabel>
                  </Stat>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionBox>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box py={16} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.lg">
          <MotionBox
            as={VStack}
            align="center"
            spacing={6}
            textAlign="center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <MotionBox variants={fadeInUp} transition={{ duration: 0.6 }}>
              <Heading size="xl" color={useColorModeValue('gray.800', 'white')}>
                Learning shouldn't stop at any age
              </Heading>
            </MotionBox>
            <MotionBox variants={fadeInUp} transition={{ duration: 0.6, delay: 0.1 }}>
              <Text fontSize="lg" color={textColor} lineHeight="1.7" maxW="2xl">
                We connect seniors with patient, trained student volunteers who provide 
                one-on-one technology support in a comfortable, judgment-free environment.
              </Text>
            </MotionBox>
            <MotionBox variants={fadeInUp} transition={{ duration: 0.6, delay: 0.2 }}>
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
            </MotionBox>
          </MotionBox>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box py={20} bg="orange.500">
        <Container maxW="container.xl">
          <MotionBox
            as={VStack}
            spacing={8}
            align="center"
            textAlign="center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <MotionBox variants={fadeInUp} transition={{ duration: 0.6 }}>
              <Heading size="xl" color="white">
                Ready to get started?
              </Heading>
            </MotionBox>
            <MotionBox variants={fadeInUp} transition={{ duration: 0.6, delay: 0.1 }}>
              <Text fontSize="lg" color="orange.100" maxW="2xl">
                Join our welcoming community of learners and volunteers. 
                Technology support is just a click away.
              </Text>
            </MotionBox>
            <MotionBox
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
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
            </MotionBox>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  )
} 