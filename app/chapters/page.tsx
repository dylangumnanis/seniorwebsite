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
  List,
  ListItem,
  ListIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import { 
  FaSchool, 
  FaUsers, 
  FaLaptop, 
  FaHandshake, 
  FaCheckCircle, 
  FaGraduationCap,
  FaHeart,
  FaGlobe,
  FaCertificate,
  FaBook,
  FaChalkboardTeacher,
  FaUsersCog,
  FaRocket,
  FaShieldAlt,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa'
import { useState } from 'react'

export default function ChaptersPage() {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    contactName: '',
    contactTitle: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    estimatedStudents: '',
    estimatedSeniors: '',
    hearAbout: '',
    message: '',
    agreeTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const cardBg = useColorModeValue('white', 'gray.700')

  const benefits = [
    {
      icon: FaLaptop,
      title: 'Free Platform Access',
      description: 'Full access to our volunteer management platform, session scheduling, and tracking tools at no cost.',
      color: 'blue',
    },
    {
      icon: FaBook,
      title: 'Training Materials',
      description: 'Comprehensive training curriculum for volunteers including videos, guides, and quizzes.',
      color: 'green',
    },
    {
      icon: FaCertificate,
      title: 'Verified Service Hours',
      description: 'Official documentation of volunteer hours for students\' college applications and transcripts.',
      color: 'purple',
    },
    {
      icon: FaUsersCog,
      title: 'Admin Dashboard',
      description: 'Dedicated dashboard to manage your chapter, track progress, and generate reports.',
      color: 'orange',
    },
    {
      icon: FaChalkboardTeacher,
      title: 'Ongoing Support',
      description: 'Regular check-ins, best practices sharing, and access to our support team.',
      color: 'teal',
    },
    {
      icon: FaShieldAlt,
      title: 'Brand & Resources',
      description: 'Use of Roots and Wings branding, marketing materials, and promotional templates.',
      color: 'red',
    },
  ]

  const requirements = [
    'A dedicated faculty advisor or community coordinator',
    'Minimum of 5 student volunteers to start',
    'Access to computers or tablets for virtual sessions',
    'Commitment to our mission and values',
    'Agreement to follow our volunteer guidelines and code of conduct',
    'Quarterly reporting on chapter activities and impact',
  ]

  const steps = [
    {
      number: '1',
      title: 'Submit Application',
      description: 'Fill out the form below with your organization\'s information and goals.',
    },
    {
      number: '2',
      title: 'Review & Approval',
      description: 'Our team reviews your application within 5-7 business days.',
    },
    {
      number: '3',
      title: 'Onboarding Call',
      description: 'Schedule a call with our team to set up your chapter and get trained.',
    },
    {
      number: '4',
      title: 'Launch Your Chapter',
      description: 'Start recruiting volunteers and connecting with seniors in your community!',
    },
  ]

  const faqs = [
    {
      question: 'Is there any cost to start a chapter?',
      answer: 'No! Roots and Wings chapters are completely free. We provide the platform, training materials, and support at no cost to schools and community organizations.',
    },
    {
      question: 'How many volunteers do we need to start?',
      answer: 'We recommend starting with at least 5 committed student volunteers. This ensures you can provide consistent support to seniors in your community.',
    },
    {
      question: 'Can community organizations (not just schools) start chapters?',
      answer: 'Absolutely! Libraries, community centers, faith-based organizations, and other nonprofits are welcome to start chapters.',
    },
    {
      question: 'What age do volunteers need to be?',
      answer: 'Volunteers should be at least 14 years old. For volunteers under 18, parental consent is required.',
    },
    {
      question: 'How do we find seniors to help?',
      answer: 'We can help connect you with local senior centers, retirement communities, and other organizations. Many chapters also serve seniors referred by family members of volunteers.',
    },
    {
      question: 'What kind of support do chapters receive?',
      answer: 'Chapters receive ongoing support including monthly check-ins, access to our resource library, a dedicated support contact, and connection to other chapter leaders.',
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
      setMessage({ type: 'error', text: 'Please agree to the terms and partnership guidelines.' })
      setIsLoading(false)
      return
    }

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false)
      setMessage({ 
        type: 'success', 
        text: 'Application submitted successfully! Our team will contact you within 5-7 business days.' 
      })
      setFormData({
        organizationName: '',
        organizationType: '',
        contactName: '',
        contactTitle: '',
        email: '',
        phone: '',
        city: '',
        state: '',
        estimatedStudents: '',
        estimatedSeniors: '',
        hearAbout: '',
        message: '',
        agreeTerms: false,
      })
    }, 1500)
  }

  return (
    <Box minH="100vh">
      {/* Hero Section */}
      <Box
        bgGradient="linear(to-br, teal.600, teal.800)"
        color="white"
        py={24}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-150px"
          right="-150px"
          w="500px"
          h="500px"
          borderRadius="full"
          bg="whiteAlpha.100"
        />
        <Box
          position="absolute"
          bottom="-100px"
          left="-100px"
          w="400px"
          h="400px"
          borderRadius="full"
          bg="whiteAlpha.100"
        />
        
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
            <VStack spacing={6} align="start">
              <Badge colorScheme="yellow" fontSize="md" px={4} py={1} rounded="full">
                Partner With Us
              </Badge>
              <Heading size="3xl" fontWeight="800" lineHeight="1.1">
                Start a Roots & Wings Chapter
              </Heading>
              <Text fontSize="xl" opacity={0.9} lineHeight="1.7">
                Bring our proven tech literacy program to your school or community. 
                Get free access to our platform, training materials, and ongoing support 
                to help seniors in your area.
              </Text>
              <HStack spacing={6} pt={4} flexWrap="wrap">
                <HStack>
                  <Icon as={FaCheckCircle} />
                  <Text>100% Free</Text>
                </HStack>
                <HStack>
                  <Icon as={FaCheckCircle} />
                  <Text>Full Support</Text>
                </HStack>
                <HStack>
                  <Icon as={FaCheckCircle} />
                  <Text>Verified Hours</Text>
                </HStack>
              </HStack>
            </VStack>
            
            <Box
              bg="whiteAlpha.200"
              p={8}
              rounded="2xl"
              backdropFilter="blur(10px)"
              display={{ base: 'none', lg: 'block' }}
            >
              <VStack spacing={4}>
                <Icon as={FaGlobe} w={16} h={16} />
                <Heading size="lg" textAlign="center">Join 15+ Active Chapters</Heading>
                <Text textAlign="center" opacity={0.9}>
                  Schools and communities across the country are already making a difference.
                </Text>
                <SimpleGrid columns={2} spacing={4} w="full" pt={4}>
                  <VStack bg="whiteAlpha.200" p={4} rounded="lg">
                    <Text fontSize="2xl" fontWeight="bold">70+</Text>
                    <Text fontSize="sm">Seniors Helped</Text>
                  </VStack>
                  <VStack bg="whiteAlpha.200" p={4} rounded="lg">
                    <Text fontSize="2xl" fontWeight="bold">200+</Text>
                    <Text fontSize="sm">Volunteers</Text>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Upcoming Chapters Section */}
      <Box py={16} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={8}>
            <VStack spacing={4} textAlign="center">
              <Badge colorScheme="orange" fontSize="md" px={4} py={1} rounded="full">
                Coming Soon
              </Badge>
              <Heading size="xl">Upcoming Chapters</Heading>
              <Text color={textColor} fontSize="lg" maxW="2xl">
                We're excited to announce new chapters launching soon! Join the growing movement.
              </Text>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full" maxW="4xl">
              <Box
                bg={useColorModeValue('orange.50', 'gray.700')}
                p={8}
                rounded="xl"
                borderLeft="4px"
                borderLeftColor="orange.500"
                _hover={{ transform: 'translateX(4px)', shadow: 'lg' }}
                transition="all 0.3s"
              >
                <HStack spacing={4} align="start">
                  <Icon as={FaGraduationCap} w={10} h={10} color="orange.500" />
                  <VStack align="start" spacing={2}>
                    <Badge colorScheme="orange" fontSize="xs">Opening Soon</Badge>
                    <Heading size="md">Lodi High School</Heading>
                    <Text fontWeight="600" color="orange.600">National Honor Society</Text>
                    <Text color={textColor} fontSize="sm">
                      Lodi NHS members will be bringing tech literacy support to seniors in the Lodi community.
                    </Text>
                  </VStack>
                </HStack>
              </Box>
              
              <Box
                bg={useColorModeValue('blue.50', 'gray.700')}
                p={8}
                rounded="xl"
                borderLeft="4px"
                borderLeftColor="blue.500"
                _hover={{ transform: 'translateX(4px)', shadow: 'lg' }}
                transition="all 0.3s"
              >
                <HStack spacing={4} align="start">
                  <Icon as={FaHandshake} w={10} h={10} color="blue.500" />
                  <VStack align="start" spacing={2}>
                    <Badge colorScheme="blue" fontSize="xs">Opening Soon</Badge>
                    <Heading size="md">Lodi High School</Heading>
                    <Text fontWeight="600" color="blue.600">Key Club</Text>
                    <Text color={textColor} fontSize="sm">
                      Lodi Key Club members are joining forces to help seniors navigate the digital world.
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </SimpleGrid>

            <Text color={textColor} fontSize="sm" fontStyle="italic">
              Want your school or organization featured here? Apply below!
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center" maxW="3xl">
              <Heading size="xl">What Your Chapter Gets</Heading>
              <Text color={textColor} fontSize="lg">
                Everything you need to run a successful chapter—completely free of charge.
              </Text>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
              {benefits.map((benefit, index) => (
                <Box
                  key={index}
                  bg={cardBg}
                  p={8}
                  rounded="xl"
                  shadow="lg"
                  borderTop="4px"
                  borderTopColor={`${benefit.color}.500`}
                  _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
                  transition="all 0.3s"
                >
                  <Icon 
                    as={benefit.icon} 
                    w={10} 
                    h={10} 
                    color={`${benefit.color}.500`} 
                    mb={4} 
                  />
                  <Heading size="md" mb={3}>
                    {benefit.title}
                  </Heading>
                  <Text color={textColor}>
                    {benefit.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Requirements Section */}
      <Box py={20} bg={bgColor}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
            <VStack align="start" spacing={6}>
              <Badge colorScheme="teal" px={3} py={1} rounded="full">
                Requirements
              </Badge>
              <Heading size="xl">What We Ask From Chapters</Heading>
              <Text color={textColor} fontSize="lg" lineHeight="1.7">
                Starting a chapter is easy, but we do have a few requirements to ensure 
                every chapter can make a meaningful impact in their community.
              </Text>
              <List spacing={4} pt={4}>
                {requirements.map((req, index) => (
                  <ListItem key={index} display="flex" alignItems="start">
                    <ListIcon as={FaCheckCircle} color="teal.500" mt={1} />
                    <Text>{req}</Text>
                  </ListItem>
                ))}
              </List>
            </VStack>
            
            <Box
              bg={useColorModeValue('teal.50', 'gray.700')}
              p={10}
              rounded="2xl"
            >
              <VStack spacing={8}>
                <Heading size="lg" textAlign="center">How It Works</Heading>
                {steps.map((step, index) => (
                  <HStack key={index} align="start" spacing={4} w="full">
                    <Box
                      bg="teal.500"
                      color="white"
                      w={10}
                      h={10}
                      rounded="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                      flexShrink={0}
                    >
                      {step.number}
                    </Box>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
                        {step.title}
                      </Text>
                      <Text color={textColor} fontSize="sm">
                        {step.description}
                      </Text>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Application Form Section */}
      <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.lg">
          <VStack spacing={8}>
            <VStack spacing={4} textAlign="center">
              <Badge colorScheme="teal" px={3} py={1} rounded="full">
                Get Started
              </Badge>
              <Heading size="xl">Apply to Start a Chapter</Heading>
              <Text color={textColor} maxW="2xl">
                Fill out the form below and our partnerships team will reach out within 5-7 business days.
              </Text>
            </VStack>

            <Box
              w="full"
              bg={cardBg}
              p={{ base: 6, md: 10 }}
              rounded="2xl"
              shadow="xl"
              borderTop="4px"
              borderTopColor="teal.500"
            >
              <form onSubmit={handleSubmit}>
                <VStack spacing={8}>
                  {/* Organization Information */}
                  <Box w="full">
                    <HStack mb={4}>
                      <Icon as={FaSchool} color="teal.500" />
                      <Text fontWeight="bold" fontSize="lg" color="teal.500">
                        Organization Information
                      </Text>
                    </HStack>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Organization Name</FormLabel>
                        <Input
                          name="organizationName"
                          value={formData.organizationName}
                          onChange={handleChange}
                          placeholder="e.g., Lincoln High School"
                          size="lg"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Organization Type</FormLabel>
                        <Select
                          name="organizationType"
                          value={formData.organizationType}
                          onChange={handleChange}
                          placeholder="Select type"
                          size="lg"
                        >
                          <option value="high-school">High School</option>
                          <option value="middle-school">Middle School</option>
                          <option value="college">College/University</option>
                          <option value="library">Library</option>
                          <option value="community-center">Community Center</option>
                          <option value="faith-based">Faith-Based Organization</option>
                          <option value="nonprofit">Other Nonprofit</option>
                          <option value="other">Other</option>
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>City</FormLabel>
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="City"
                          size="lg"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>State</FormLabel>
                        <Input
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="State"
                          size="lg"
                        />
                      </FormControl>
                    </SimpleGrid>
                  </Box>

                  <Divider />

                  {/* Contact Information */}
                  <Box w="full">
                    <HStack mb={4}>
                      <Icon as={FaUsers} color="teal.500" />
                      <Text fontWeight="bold" fontSize="lg" color="teal.500">
                        Primary Contact
                      </Text>
                    </HStack>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Contact Name</FormLabel>
                        <Input
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleChange}
                          placeholder="Full name"
                          size="lg"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Title/Role</FormLabel>
                        <Input
                          name="contactTitle"
                          value={formData.contactTitle}
                          onChange={handleChange}
                          placeholder="e.g., Teacher, Club Advisor"
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
                          placeholder="your.email@organization.org"
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
                    </SimpleGrid>
                  </Box>

                  <Divider />

                  {/* Chapter Details */}
                  <Box w="full">
                    <HStack mb={4}>
                      <Icon as={FaRocket} color="teal.500" />
                      <Text fontWeight="bold" fontSize="lg" color="teal.500">
                        Chapter Details
                      </Text>
                    </HStack>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Estimated # of Student Volunteers</FormLabel>
                        <Select
                          name="estimatedStudents"
                          value={formData.estimatedStudents}
                          onChange={handleChange}
                          placeholder="Select range"
                          size="lg"
                        >
                          <option value="5-10">5-10 volunteers</option>
                          <option value="11-20">11-20 volunteers</option>
                          <option value="21-50">21-50 volunteers</option>
                          <option value="50+">50+ volunteers</option>
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Estimated # of Seniors to Serve</FormLabel>
                        <Select
                          name="estimatedSeniors"
                          value={formData.estimatedSeniors}
                          onChange={handleChange}
                          placeholder="Select range"
                          size="lg"
                        >
                          <option value="1-10">1-10 seniors</option>
                          <option value="11-25">11-25 seniors</option>
                          <option value="26-50">26-50 seniors</option>
                          <option value="50+">50+ seniors</option>
                        </Select>
                      </FormControl>

                      <FormControl gridColumn={{ md: 'span 2' }}>
                        <FormLabel>How did you hear about us?</FormLabel>
                        <Select
                          name="hearAbout"
                          value={formData.hearAbout}
                          onChange={handleChange}
                          placeholder="Select one"
                          size="lg"
                        >
                          <option value="social-media">Social Media</option>
                          <option value="search">Google/Search Engine</option>
                          <option value="news">News/Press</option>
                          <option value="referral">Referral from Another Chapter</option>
                          <option value="conference">Conference/Event</option>
                          <option value="other">Other</option>
                        </Select>
                      </FormControl>
                    </SimpleGrid>

                    <FormControl mt={4}>
                      <FormLabel>Additional Information (Optional)</FormLabel>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your organization, your goals for the chapter, or any questions you have..."
                        rows={4}
                      />
                    </FormControl>
                  </Box>

                  <Divider />

                  {/* Terms */}
                  <FormControl isRequired>
                    <Checkbox
                      name="agreeTerms"
                      isChecked={formData.agreeTerms}
                      onChange={handleChange}
                      colorScheme="teal"
                      size="lg"
                    >
                      <Text fontSize="sm">
                        I agree to the Roots and Wings partnership guidelines and understand 
                        that our chapter will follow the organization's mission, values, and 
                        code of conduct.
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
                    bg="teal.500"
                    color="white"
                    size="lg"
                    w="full"
                    py={7}
                    fontSize="lg"
                    isLoading={isLoading}
                    loadingText="Submitting Application..."
                    leftIcon={<FaRocket />}
                    _hover={{ bg: 'teal.600', transform: 'translateY(-2px)' }}
                    transition="all 0.2s"
                  >
                    Submit Chapter Application
                  </Button>
                </VStack>
              </form>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box py={20} bg={bgColor}>
        <Container maxW="container.lg">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading size="xl">Frequently Asked Questions</Heading>
              <Text color={textColor} maxW="2xl">
                Have questions about starting a chapter? Find answers to common questions below.
              </Text>
            </VStack>

            <Accordion allowMultiple w="full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} border="none" mb={4}>
                  <AccordionButton
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    rounded="lg"
                    _expanded={{ bg: 'teal.500', color: 'white' }}
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                    py={4}
                    px={6}
                  >
                    <Box flex="1" textAlign="left" fontWeight="600">
                      {faq.question}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4} pt={4} px={6}>
                    <Text color={textColor}>{faq.answer}</Text>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </VStack>
        </Container>
      </Box>

      {/* Contact CTA */}
      <Box py={20} bg="teal.500">
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} alignItems="center">
            <VStack align="start" spacing={4} color="white">
              <Heading size="xl">Have More Questions?</Heading>
              <Text fontSize="lg" opacity={0.9}>
                Our partnerships team is here to help you get started. 
                Reach out anytime—we'd love to hear from you!
              </Text>
            </VStack>
            <VStack spacing={4} align={{ base: 'start', md: 'end' }}>
              <HStack
                bg="whiteAlpha.200"
                px={6}
                py={4}
                rounded="full"
                color="white"
              >
                <Icon as={FaEnvelope} />
                <Text fontWeight="600">dgumnani@gmail.com</Text>
              </HStack>
              <HStack
                bg="whiteAlpha.200"
                px={6}
                py={4}
                rounded="full"
                color="white"
              >
                <Icon as={FaPhone} />
                <Text fontWeight="600">(201) 893-6220</Text>
              </HStack>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  )
}

