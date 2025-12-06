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
  Button,
  Link as ChakraLink,
  useColorModeValue,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setMessage('Invalid email or password')
      } else {
        // Get the session to determine user role and redirect
        const session = await getSession()
        if (session?.user?.role === 'SENIOR') {
          router.push('/senior/dashboard')
        } else if (session?.user?.role === 'VOLUNTEER') {
          router.push('/volunteer/dashboard')
        } else if (session?.user?.role === 'ADMIN') {
          router.push('/dashboard')
        } else {
          router.push('/')
        }
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="md" py={12}>
      <VStack spacing={8}>
        <VStack spacing={4} textAlign="center">
          <Heading size="xl">Welcome Back</Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            Sign in to your Roots and Wings account
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
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
                loadingText="Signing in..."
                _hover={{ bg: 'orange.600' }}
              >
                Sign In
              </Button>
            </VStack>
          </form>
        </Box>

        <Text textAlign="center">
          Don't have an account?{' '}
          <ChakraLink as={Link} href="/register" color="orange.500" fontWeight="semibold">
            Sign up here
          </ChakraLink>
        </Text>
      </VStack>
    </Container>
  )
} 