'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Link as ChakraLink,
  useColorModeValue,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useState } from 'react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match')
      setIsLoading(false)
      return
    }

    // For static hosting, we'll show a demo message
    setTimeout(() => {
      setMessage('Demo mode: Registration would be handled by a third-party service like Auth0 or Firebase.')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Container maxW="md" py={12}>
      <VStack spacing={8}>
        <VStack spacing={4} textAlign="center">
          <Heading size="xl">Join Our Community</Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            Create your Senior Tech Connect account
          </Text>
        </VStack>

        <Box
          w="full"
          bg={useColorModeValue('white', 'gray.800')}
          p={8}
          rounded="xl"
          shadow="lg"
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>I am a...</FormLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Select your role"
                >
                  <option value="senior">Senior Citizen</option>
                  <option value="volunteer">Student Volunteer</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
              </FormControl>

              {message && (
                <Alert status="info">
                  <AlertIcon />
                  {message}
                </Alert>
              )}

              <Button
                type="submit"
                bg="orange.500"
                color="white"
                size="lg"
                w="full"
                isLoading={isLoading}
                loadingText="Creating account..."
                _hover={{ bg: 'orange.600' }}
              >
                Create Account
              </Button>
            </VStack>
          </form>
        </Box>

        <Text textAlign="center">
          Already have an account?{' '}
          <ChakraLink as={Link} href="/login" color="orange.500" fontWeight="semibold">
            Sign in here
          </ChakraLink>
        </Text>
      </VStack>
    </Container>
  )
} 