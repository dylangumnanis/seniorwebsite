'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useColorModeValue,
  useToast,
  Alert,
  AlertIcon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react'
import { FaArrowLeft, FaCalendarAlt, FaClock, FaUser, FaExclamationTriangle } from 'react-icons/fa'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RequestSessionPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const toast = useToast()
  
  const [formData, setFormData] = useState({
    topicTitle: '',
    description: '',
    urgency: 'medium',
    estimatedDuration: 30,
    preferredTime: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cardBg = useColorModeValue('white', 'gray.700')
  const bgColor = useColorModeValue('gray.50', 'gray.900')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/senior/request-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: Date.now().toString(),
          topicTitle: formData.topicTitle,
          description: formData.description,
          urgency: formData.urgency,
          estimatedDuration: formData.estimatedDuration
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: 'Session Requested Successfully!',
          description: 'A volunteer will be matched with you shortly. You can check your dashboard for updates.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        router.push('/senior/dashboard')
      } else {
        const errorData = await response.json()
        toast({
          title: 'Request Failed',
          description: errorData.error || 'Failed to request session',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (error) {
      toast({
        title: 'Request Failed',
        description: 'An error occurred while requesting the session',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.lg" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Breadcrumb */}
          <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href="/senior/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Request Session</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header */}
          <HStack justify="space-between">
            <VStack align="start" spacing={2}>
              <Heading size="lg">Request Help Session</Heading>
              <Text color="gray.600">
                Tell us what you need help with and we'll match you with a volunteer
              </Text>
            </VStack>
            <Button
              as={Link}
              href="/senior/dashboard"
              leftIcon={<FaArrowLeft />}
              variant="ghost"
            >
              Back to Dashboard
            </Button>
          </HStack>

          {/* Main Form */}
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Session Details</Heading>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                  {/* Topic/Title */}
                  <FormControl isRequired>
                    <FormLabel>What do you need help with?</FormLabel>
                    <Input
                      placeholder="e.g., Setting up email, Using video calls, Online shopping..."
                      value={formData.topicTitle}
                      onChange={(e) => handleInputChange('topicTitle', e.target.value)}
                      size="lg"
                    />
                  </FormControl>

                  {/* Description */}
                  <FormControl>
                    <FormLabel>Additional Details</FormLabel>
                    <Textarea
                      placeholder="Provide any specific details or questions you have. The more information you provide, the better we can help you!"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                    />
                  </FormControl>

                  {/* Session Options Grid */}
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <FormControl>
                      <FormLabel>Priority Level</FormLabel>
                      <Select
                        value={formData.urgency}
                        onChange={(e) => handleInputChange('urgency', e.target.value)}
                      >
                        <option value="low">Low - I can wait</option>
                        <option value="medium">Medium - Soon would be great</option>
                        <option value="high">High - I need help urgently</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Estimated Time Needed</FormLabel>
                      <Select
                        value={formData.estimatedDuration}
                        onChange={(e) => handleInputChange('estimatedDuration', parseInt(e.target.value))}
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Preferred Time (Optional)</FormLabel>
                      <Input
                        type="datetime-local"
                        value={formData.preferredTime}
                        onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </FormControl>
                  </SimpleGrid>

                  {/* Help Text */}
                  <Alert status="info">
                    <AlertIcon />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="600">How it works:</Text>
                      <Text fontSize="sm">
                        1. Submit your request and we'll find an available volunteer
                        <br />
                        2. You'll receive a notification when a volunteer accepts
                        <br />
                        3. Join the video session when it's time
                      </Text>
                    </VStack>
                  </Alert>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    isLoading={isSubmitting}
                    loadingText="Requesting Session..."
                    isDisabled={!formData.topicTitle.trim()}
                    leftIcon={<FaCalendarAlt />}
                  >
                    Request Session
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Common Help Topics */}
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Common Help Topics</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
                {[
                  'Email setup and management',
                  'Video calling (Zoom, Skype)',
                  'Online shopping and banking',
                  'Social media (Facebook, WhatsApp)',
                  'Photo storage and sharing',
                  'Smartphone basics',
                  'Computer troubleshooting',
                  'Internet safety and security',
                  'Online doctor appointments'
                ].map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    size="sm"
                    justifyContent="flex-start"
                    onClick={() => handleInputChange('topicTitle', topic)}
                    _hover={{ bg: 'blue.50' }}
                  >
                    {topic}
                  </Button>
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  )
}
