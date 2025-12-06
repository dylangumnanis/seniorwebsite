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
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
  useToast,
} from '@chakra-ui/react'
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock,
  FaComments,
  FaPaperPlane,
  FaHeadset,
  FaQuestionCircle,
  FaHandshake,
  FaHeart
} from 'react-icons/fa'
import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const cardBg = useColorModeValue('gray.50', 'gray.700')
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: 'Message sent!',
        description: "We'll get back to you as soon as possible.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    }, 1000)
  }

  const contactMethods = [
    {
      icon: FaEnvelope,
      title: 'Email Us',
      description: 'Send us an email anytime',
      value: 'info@rootsandwings.org',
      color: 'orange',
    },
    {
      icon: FaPhone,
      title: 'Call Us',
      description: 'Monday - Friday, 9am - 5pm',
      value: '(555) 123-4567',
      color: 'blue',
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Visit Us',
      description: 'Stop by our office',
      value: '123 Community Center St, City, ST 12345',
      color: 'green',
    },
    {
      icon: FaClock,
      title: 'Office Hours',
      description: 'We\'re here to help',
      value: 'Mon-Fri: 9am-5pm EST',
      color: 'purple',
    },
  ]

  const reasons = [
    {
      icon: FaQuestionCircle,
      title: 'General Questions',
      description: 'Have questions about our programs or services? We\'re here to help.',
    },
    {
      icon: FaHandshake,
      title: 'Become a Volunteer',
      description: 'Interested in volunteering? Learn how you can make a difference.',
    },
    {
      icon: FaHeadset,
      title: 'Technical Support',
      description: 'Need help with your account or using our platform?',
    },
    {
      icon: FaHeart,
      title: 'Partnerships',
      description: 'Want to partner with us or support our mission?',
    },
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        bg={useColorModeValue('teal.50', 'gray.900')}
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
          bg="teal.100"
          opacity="0.3"
        />
        <Container maxW="container.xl" position="relative">
          <VStack spacing={6} align="start" maxW="3xl">
            <Badge colorScheme="teal" px={3} py={1} rounded="full" fontSize="sm">
              Get in Touch
            </Badge>
            <Heading as="h1" size="3xl" fontWeight="800" color={useColorModeValue('gray.800', 'white')}>
              We're Here to Help
            </Heading>
            <Text fontSize="xl" color={textColor} lineHeight="1.7">
              Have questions? Need support? Want to get involved? Our friendly team is ready to assist you. 
              Reach out to us through any of the methods below, and we'll get back to you as soon as possible.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Contact Methods */}
      <Box py={16} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center" maxW="2xl">
              <Heading size="xl" color={useColorModeValue('gray.800', 'white')}>
                Ways to Reach Us
              </Heading>
              <Text fontSize="lg" color={textColor}>
                Choose the method that works best for you. We're available through multiple channels.
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {contactMethods.map((method, index) => (
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
                      <Icon as={method.icon} w={8} h={8} color={`${method.color}.500`} />
                      <Heading as="h3" size="md" color={useColorModeValue('gray.800', 'white')}>
                        {method.title}
                      </Heading>
                      <Text color={textColor} fontSize="sm">
                        {method.description}
                      </Text>
                      <Text 
                        color={`${method.color}.600`} 
                        fontSize="sm" 
                        fontWeight="600"
                        wordBreak="break-word"
                      >
                        {method.value}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Contact Form & Reasons */}
      <Box py={16} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12}>
            {/* Contact Form */}
            <Box
              bg={bgColor}
              p={8}
              rounded="xl"
              shadow="xl"
              borderTop="4px"
              borderTopColor="teal.500"
            >
              <VStack spacing={6} align="start">
                <VStack spacing={2} align="start">
                  <Heading size="lg" color={useColorModeValue('gray.800', 'white')}>
                    Send Us a Message
                  </Heading>
                  <Text color={textColor}>
                    Fill out the form below and we'll respond within 24-48 hours.
                  </Text>
                </VStack>

                <Box as="form" onSubmit={handleSubmit} w="full">
                  <VStack spacing={5}>
                    <FormControl isRequired>
                      <FormLabel color={useColorModeValue('gray.700', 'gray.300')}>Name</FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        bg={useColorModeValue('white', 'gray.700')}
                        borderColor={useColorModeValue('gray.300', 'gray.600')}
                        _hover={{
                          borderColor: 'teal.400',
                        }}
                        _focus={{
                          borderColor: 'teal.500',
                          boxShadow: '0 0 0 1px teal.500',
                        }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color={useColorModeValue('gray.700', 'gray.300')}>Email</FormLabel>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        bg={useColorModeValue('white', 'gray.700')}
                        borderColor={useColorModeValue('gray.300', 'gray.600')}
                        _hover={{
                          borderColor: 'teal.400',
                        }}
                        _focus={{
                          borderColor: 'teal.500',
                          boxShadow: '0 0 0 1px teal.500',
                        }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color={useColorModeValue('gray.700', 'gray.300')}>Subject</FormLabel>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What is this regarding?"
                        bg={useColorModeValue('white', 'gray.700')}
                        borderColor={useColorModeValue('gray.300', 'gray.600')}
                        _hover={{
                          borderColor: 'teal.400',
                        }}
                        _focus={{
                          borderColor: 'teal.500',
                          boxShadow: '0 0 0 1px teal.500',
                        }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color={useColorModeValue('gray.700', 'gray.300')}>Message</FormLabel>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help..."
                        rows={6}
                        bg={useColorModeValue('white', 'gray.700')}
                        borderColor={useColorModeValue('gray.300', 'gray.600')}
                        _hover={{
                          borderColor: 'teal.400',
                        }}
                        _focus={{
                          borderColor: 'teal.500',
                          boxShadow: '0 0 0 1px teal.500',
                        }}
                      />
                      <FormHelperText color={textColor}>
                        Please provide as much detail as possible so we can assist you better.
                      </FormHelperText>
                    </FormControl>

                    <Button
                      type="submit"
                      size="lg"
                      bg="teal.500"
                      color="white"
                      w="full"
                      px={8}
                      rounded="full"
                      isLoading={isSubmitting}
                      loadingText="Sending..."
                      leftIcon={<FaPaperPlane />}
                      _hover={{
                        bg: 'teal.600',
                        transform: 'translateY(-2px)',
                      }}
                      transition="all 0.2s"
                    >
                      Send Message
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            </Box>

            {/* Reasons to Contact */}
            <VStack spacing={6} align="start">
              <VStack spacing={2} align="start">
                <Heading size="lg" color={useColorModeValue('gray.800', 'white')}>
                  Common Reasons to Contact Us
                </Heading>
                <Text color={textColor}>
                  Here are some of the most common reasons people reach out to us.
                </Text>
              </VStack>

              <SimpleGrid columns={1} spacing={4} w="full">
                {reasons.map((reason, index) => (
                  <Card
                    key={index}
                    bg={cardBg}
                    _hover={{
                      transform: 'translateX(4px)',
                      shadow: 'md',
                    }}
                    transition="all 0.2s"
                  >
                    <CardBody>
                      <HStack spacing={4} align="start">
                        <Icon as={reason.icon} w={6} h={6} color="teal.500" mt={1} />
                        <VStack align="start" spacing={1}>
                          <Heading as="h3" size="sm" color={useColorModeValue('gray.800', 'white')}>
                            {reason.title}
                          </Heading>
                          <Text color={textColor} fontSize="sm">
                            {reason.description}
                          </Text>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>

              {/* Quick Links */}
              <Box
                bg={bgColor}
                p={6}
                rounded="xl"
                shadow="md"
                w="full"
                borderLeft="4px"
                borderLeftColor="teal.500"
              >
                <VStack spacing={4} align="start">
                  <Heading as="h3" size="md" color={useColorModeValue('gray.800', 'white')}>
                    Quick Links
                  </Heading>
                  <VStack spacing={2} align="start" w="full">
                    <Button
                      as={Link}
                      href="/register"
                      variant="link"
                      colorScheme="teal"
                      leftIcon={<FaComments />}
                      size="sm"
                    >
                      Create an Account
                    </Button>
                    <Button
                      as={Link}
                      href="/volunteer/become"
                      variant="link"
                      colorScheme="teal"
                      leftIcon={<FaHandshake />}
                      size="sm"
                    >
                      Become a Volunteer
                    </Button>
                    <Button
                      as={Link}
                      href="/programs/tech-literacy"
                      variant="link"
                      colorScheme="teal"
                      leftIcon={<FaQuestionCircle />}
                      size="sm"
                    >
                      View Our Programs
                    </Button>
                  </VStack>
                </VStack>
              </Box>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Response Time Info */}
      <Box py={12} bg={bgColor}>
        <Container maxW="container.xl">
          <Box
            bg={useColorModeValue('teal.50', 'gray.700')}
            p={8}
            rounded="xl"
            borderLeft="4px"
            borderLeftColor="teal.500"
          >
            <HStack spacing={4} align="start">
              <Icon as={FaClock} w={8} h={8} color="teal.500" flexShrink={0} />
              <VStack align="start" spacing={2}>
                <Heading as="h3" size="md" color={useColorModeValue('gray.800', 'white')}>
                  Response Times
                </Heading>
                <Text color={textColor}>
                  We typically respond to emails and messages within 24-48 hours during business days. 
                  For urgent matters, please call us directly. Our team is committed to providing 
                  timely and helpful responses to all inquiries.
                </Text>
              </VStack>
            </HStack>
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box py={20} bg="teal.500">
        <Container maxW="container.xl">
          <VStack spacing={8} align="center" textAlign="center">
            <Heading size="xl" color="white">
              Ready to Get Started?
            </Heading>
            <Text fontSize="lg" color="teal.100" maxW="2xl">
              Don't wait - join our community today and start your journey with personalized technology 
              and financial literacy support.
            </Text>
            <HStack spacing={4}>
              <Button
                size="lg"
                bg="white"
                color="teal.500"
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
                Sign Up Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                color="white"
                borderColor="white"
                px={8}
                py={6}
                fontSize="lg"
                fontWeight="600"
                rounded="full"
                _hover={{
                  bg: 'whiteAlpha.200',
                }}
                as={Link}
                href="/about"
              >
                Learn More
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}

