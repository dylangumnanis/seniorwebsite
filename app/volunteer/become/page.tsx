'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Checkbox,
  Button,
  Icon,
  useColorModeValue,
  Alert,
  AlertIcon,
  Badge,
  Divider,
} from '@chakra-ui/react'
import { FaHeart, FaGraduationCap, FaClock, FaUsers, FaHandsHelping, FaStar, FaCertificate } from 'react-icons/fa'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BecomeVolunteerPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    school: '',
    gradeLevel: '',
    experience: '',
    motivation: '',
    availability: '',
    agreeTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const cardBg = useColorModeValue('white', 'gray.700')

  const benefits = [
    {
      icon: FaCertificate,
      title: 'Service Hours',
      description: 'Earn verified community service hours for school or college applications.',
      color: 'purple',
    },
    {
      icon: FaGraduationCap,
      title: 'Skill Development',
      description: 'Build communication, patience, and teaching skills that last a lifetime.',
      color: 'blue',
    },
    {
      icon: FaHeart,
      title: 'Make an Impact',
      description: 'Help seniors stay connected with loved ones and navigate the digital world.',
      color: 'red',
    },
    {
      icon: FaUsers,
      title: 'Community',
      description: 'Join a supportive community of like-minded student volunteers.',
      color: 'green',
    },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    if (!formData.agreeTerms) {
      setMessage({ type: 'error', text: 'Please agree to the terms and conditions.' })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: 'volunteer',
          password: formData.email.split('@')[0] + '2024!', // Temporary password
          metadata: {
            age: formData.age,
            school: formData.school,
            gradeLevel: formData.gradeLevel,
            experience: formData.experience,
            motivation: formData.motivation,
            availability: formData.availability,
          },
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: 'Application submitted successfully! Check your email for next steps and login credentials.' 
        })
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          age: '',
          school: '',
          gradeLevel: '',
          experience: '',
          motivation: '',
          availability: '',
          agreeTerms: false,
        })
      } else {
        setMessage({ type: 'error', text: data.error || 'Registration failed. Please try again.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh">
      {/* Hero Section */}
      <Box
        bgGradient="linear(to-br, purple.600, purple.800)"
        color="white"
        py={20}
        position="relative"
        overflow="hidden"
      >
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
          bg="whiteAlpha.100"
        />
        
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={6} textAlign="center" maxW="3xl" mx="auto">
            <Badge colorScheme="yellow" fontSize="md" px={4} py={1} rounded="full">
              Join Our Team
            </Badge>
            <Heading size="3xl" fontWeight="800" lineHeight="1.1">
              Become a Volunteer
            </Heading>
            <Text fontSize="xl" opacity={0.9} maxW="2xl">
              Share your tech skills with seniors in your community. Make a real difference 
              while earning service hours and building valuable skills.
            </Text>
            <HStack spacing={8} pt={4}>
              <HStack>
                <Icon as={FaClock} />
                <Text>Flexible Hours</Text>
              </HStack>
              <HStack>
                <Icon as={FaStar} />
                <Text>Free Training</Text>
              </HStack>
              <HStack>
                <Icon as={FaCertificate} />
                <Text>Certified Hours</Text>
              </HStack>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box py={16} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading size="xl">Why Volunteer With Us?</Heading>
              <Text color={textColor} fontSize="lg" maxW="2xl">
                Volunteering with Roots and Wings is more than just service—it's an opportunity 
                to grow, connect, and make a lasting impact.
              </Text>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
              {benefits.map((benefit, index) => (
                <Box
                  key={index}
                  bg={cardBg}
                  p={8}
                  rounded="xl"
                  shadow="lg"
                  textAlign="center"
                  _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
                  transition="all 0.3s"
                >
                  <Icon 
                    as={benefit.icon} 
                    w={12} 
                    h={12} 
                    color={`${benefit.color}.500`} 
                    mb={4} 
                  />
                  <Heading size="md" mb={3}>
                    {benefit.title}
                  </Heading>
                  <Text color={textColor} fontSize="sm">
                    {benefit.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Application Form Section */}
      <Box py={16} bg={bgColor}>
        <Container maxW="container.md">
          <VStack spacing={8}>
            <VStack spacing={4} textAlign="center">
              <Heading size="xl">Apply to Volunteer</Heading>
              <Text color={textColor}>
                Fill out the form below and we'll get back to you within 48 hours.
              </Text>
            </VStack>

            <Box
              w="full"
              bg={cardBg}
              p={10}
              rounded="2xl"
              shadow="xl"
              borderTop="4px"
              borderTopColor="purple.500"
            >
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  {/* Personal Information */}
                  <Box w="full">
                    <Text fontWeight="bold" fontSize="lg" mb={4} color="purple.500">
                      Personal Information
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          size="lg"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          size="lg"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(555) 123-4567"
                          size="lg"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Age</FormLabel>
                        <Select
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="Select your age range"
                          size="lg"
                        >
                          <option value="14-15">14-15 years</option>
                          <option value="16-17">16-17 years</option>
                          <option value="18-21">18-21 years</option>
                          <option value="22+">22+ years</option>
                        </Select>
                      </FormControl>
                    </SimpleGrid>
                  </Box>

                  <Divider />

                  {/* Education Information */}
                  <Box w="full">
                    <Text fontWeight="bold" fontSize="lg" mb={4} color="purple.500">
                      Education
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>School/University</FormLabel>
                        <Input
                          name="school"
                          value={formData.school}
                          onChange={handleChange}
                          placeholder="Enter your school name"
                          size="lg"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Grade Level</FormLabel>
                        <Select
                          name="gradeLevel"
                          value={formData.gradeLevel}
                          onChange={handleChange}
                          placeholder="Select grade level"
                          size="lg"
                        >
                          <option value="freshman-hs">High School Freshman</option>
                          <option value="sophomore-hs">High School Sophomore</option>
                          <option value="junior-hs">High School Junior</option>
                          <option value="senior-hs">High School Senior</option>
                          <option value="freshman-college">College Freshman</option>
                          <option value="sophomore-college">College Sophomore</option>
                          <option value="junior-college">College Junior</option>
                          <option value="senior-college">College Senior</option>
                          <option value="graduate">Graduate Student</option>
                        </Select>
                      </FormControl>
                    </SimpleGrid>
                  </Box>

                  <Divider />

                  {/* Volunteer Experience */}
                  <Box w="full">
                    <Text fontWeight="bold" fontSize="lg" mb={4} color="purple.500">
                      About You
                    </Text>
                    
                    <VStack spacing={4}>
                      <FormControl>
                        <FormLabel>Previous Volunteer Experience (Optional)</FormLabel>
                        <Textarea
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          placeholder="Tell us about any previous volunteer work or relevant experience..."
                          rows={3}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Why do you want to volunteer with us?</FormLabel>
                        <Textarea
                          name="motivation"
                          value={formData.motivation}
                          onChange={handleChange}
                          placeholder="Share what motivates you to help seniors with technology..."
                          rows={4}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Availability</FormLabel>
                        <Select
                          name="availability"
                          value={formData.availability}
                          onChange={handleChange}
                          placeholder="How many hours per week can you commit?"
                          size="lg"
                        >
                          <option value="1-3">1-3 hours per week</option>
                          <option value="4-6">4-6 hours per week</option>
                          <option value="7-10">7-10 hours per week</option>
                          <option value="10+">10+ hours per week</option>
                        </Select>
                      </FormControl>
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Terms */}
                  <FormControl isRequired>
                    <Checkbox
                      name="agreeTerms"
                      isChecked={formData.agreeTerms}
                      onChange={handleChange}
                      colorScheme="purple"
                      size="lg"
                    >
                      <Text fontSize="sm">
                        I agree to the volunteer terms, code of conduct, and understand that 
                        I will need to complete training before starting sessions.
                      </Text>
                    </Checkbox>
                  </FormControl>

                  {message.text && (
                    <Alert status={message.type === 'success' ? 'success' : 'error'} rounded="lg">
                      <AlertIcon />
                      {message.text}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    bg="purple.500"
                    color="white"
                    size="lg"
                    w="full"
                    py={7}
                    fontSize="lg"
                    isLoading={isLoading}
                    loadingText="Submitting Application..."
                    _hover={{ bg: 'purple.600', transform: 'translateY(-2px)' }}
                    transition="all 0.2s"
                  >
                    Submit Application
                  </Button>

                  <Text fontSize="sm" color={textColor} textAlign="center">
                    Already a volunteer?{' '}
                    <Button
                      variant="link"
                      color="purple.500"
                      onClick={() => router.push('/login')}
                    >
                      Sign in here
                    </Button>
                  </Text>
                </VStack>
              </form>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* What to Expect Section */}
      <Box py={16} bg={useColorModeValue('purple.50', 'gray.900')}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading size="xl" textAlign="center">What Happens Next?</Heading>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <VStack
                bg={cardBg}
                p={8}
                rounded="xl"
                shadow="lg"
                spacing={4}
                textAlign="center"
              >
                <Box
                  bg="purple.100"
                  color="purple.600"
                  w={12}
                  h={12}
                  rounded="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xl"
                  fontWeight="bold"
                >
                  1
                </Box>
                <Heading size="md">Application Review</Heading>
                <Text color={textColor} fontSize="sm">
                  Our team reviews your application within 48 hours and reaches out via email.
                </Text>
              </VStack>

              <VStack
                bg={cardBg}
                p={8}
                rounded="xl"
                shadow="lg"
                spacing={4}
                textAlign="center"
              >
                <Box
                  bg="purple.100"
                  color="purple.600"
                  w={12}
                  h={12}
                  rounded="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xl"
                  fontWeight="bold"
                >
                  2
                </Box>
                <Heading size="md">Complete Training</Heading>
                <Text color={textColor} fontSize="sm">
                  Access our free online training modules to learn best practices for helping seniors.
                </Text>
              </VStack>

              <VStack
                bg={cardBg}
                p={8}
                rounded="xl"
                shadow="lg"
                spacing={4}
                textAlign="center"
              >
                <Box
                  bg="purple.100"
                  color="purple.600"
                  w={12}
                  h={12}
                  rounded="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xl"
                  fontWeight="bold"
                >
                  3
                </Box>
                <Heading size="md">Start Helping</Heading>
                <Text color={textColor} fontSize="sm">
                  Begin connecting with seniors and making a real difference in your community!
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}

