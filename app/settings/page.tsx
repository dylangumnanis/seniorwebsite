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
  Switch,
  Select,
  useColorModeValue,
  useToast,
  Alert,
  AlertIcon,
  Divider,
  Avatar,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react'
import { FaSave, FaUser, FaBell, FaShield, FaTrash } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const toast = useToast()
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: ''
  })
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    sessionReminders: true,
    weeklyUpdates: false,
    marketingEmails: false
  })

  const [isSaving, setIsSaving] = useState(false)

  const cardBg = useColorModeValue('white', 'gray.700')
  const bgColor = useColorModeValue('gray.50', 'gray.900')

  useEffect(() => {
    if (session?.user) {
      setProfile({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: '',
        bio: '',
        location: ''
      })
    }
  }, [session])

  const handleProfileSave = async () => {
    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been saved successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setIsSaving(false)
    }, 1000)
  }

  const handleNotificationSave = async () => {
    toast({
      title: 'Notification Preferences Updated',
      description: 'Your notification settings have been saved.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  if (!session) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="warning">
          <AlertIcon />
          Please log in to access your settings.
        </Alert>
      </Container>
    )
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.lg" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack align="start" spacing={2}>
            <Heading size="lg">Account Settings</Heading>
            <Text color="gray.600">
              Manage your profile, notifications, and account preferences
            </Text>
          </VStack>

          {/* Account Overview */}
          <Card bg={cardBg}>
            <CardHeader>
              <HStack>
                <Avatar name={session.user?.name || 'User'} bg="orange.500" />
                <VStack align="start" spacing={1}>
                  <Heading size="md">{session.user?.name || 'User'}</Heading>
                  <HStack>
                    <Badge 
                      colorScheme={
                        session.user?.role === 'SENIOR' ? 'blue' : 
                        session.user?.role === 'VOLUNTEER' ? 'green' : 'purple'
                      }
                    >
                      {session.user?.role?.toLowerCase()}
                    </Badge>
                    <Text fontSize="sm" color="gray.500">
                      Member since {new Date().getFullYear()}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
            </CardHeader>
          </Card>

          {/* Profile Settings */}
          <Card bg={cardBg}>
            <CardHeader>
              <HStack>
                <FaUser />
                <Heading size="md">Profile Information</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      type="email"
                    />
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      type="tel"
                      placeholder="Optional"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Input
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      placeholder="City, State (Optional)"
                    />
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel>Bio</FormLabel>
                  <Input
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    placeholder="Tell us a bit about yourself (Optional)"
                  />
                </FormControl>

                <Button
                  colorScheme="blue"
                  leftIcon={<FaSave />}
                  onClick={handleProfileSave}
                  isLoading={isSaving}
                  loadingText="Saving..."
                  alignSelf="flex-start"
                >
                  Save Profile
                </Button>
              </VStack>
            </CardBody>
          </Card>

          {/* Notification Settings */}
          <Card bg={cardBg}>
            <CardHeader>
              <HStack>
                <FaBell />
                <Heading size="md">Notification Preferences</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="600">Email Notifications</Text>
                    <Text fontSize="sm" color="gray.500">
                      Receive notifications about sessions and updates
                    </Text>
                  </VStack>
                  <Switch
                    isChecked={notifications.emailNotifications}
                    onChange={(e) => setNotifications({
                      ...notifications,
                      emailNotifications: e.target.checked
                    })}
                  />
                </HStack>

                <Divider />

                <HStack justify="space-between">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="600">Session Reminders</Text>
                    <Text fontSize="sm" color="gray.500">
                      Get reminded about upcoming sessions
                    </Text>
                  </VStack>
                  <Switch
                    isChecked={notifications.sessionReminders}
                    onChange={(e) => setNotifications({
                      ...notifications,
                      sessionReminders: e.target.checked
                    })}
                  />
                </HStack>

                <Divider />

                <HStack justify="space-between">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="600">Weekly Updates</Text>
                    <Text fontSize="sm" color="gray.500">
                      Receive weekly summary of your activities
                    </Text>
                  </VStack>
                  <Switch
                    isChecked={notifications.weeklyUpdates}
                    onChange={(e) => setNotifications({
                      ...notifications,
                      weeklyUpdates: e.target.checked
                    })}
                  />
                </HStack>

                <Divider />

                <HStack justify="space-between">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="600">Marketing Emails</Text>
                    <Text fontSize="sm" color="gray.500">
                      Receive information about new features and programs
                    </Text>
                  </VStack>
                  <Switch
                    isChecked={notifications.marketingEmails}
                    onChange={(e) => setNotifications({
                      ...notifications,
                      marketingEmails: e.target.checked
                    })}
                  />
                </HStack>

                <Button
                  colorScheme="blue"
                  leftIcon={<FaSave />}
                  onClick={handleNotificationSave}
                  alignSelf="flex-start"
                >
                  Save Preferences
                </Button>
              </VStack>
            </CardBody>
          </Card>

          {/* Security Settings */}
          <Card bg={cardBg}>
            <CardHeader>
              <HStack>
                <FaShield />
                <Heading size="md">Security & Privacy</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Button variant="outline" colorScheme="blue" alignSelf="flex-start">
                  Change Password
                </Button>
                
                <Text fontSize="sm" color="gray.600">
                  Last password change: Never
                </Text>

                <Divider />

                <Alert status="info">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="600">Privacy Notice</Text>
                    <Text fontSize="sm">
                      We take your privacy seriously. Your personal information is never shared with third parties without your consent.
                    </Text>
                  </VStack>
                </Alert>
              </VStack>
            </CardBody>
          </Card>

          {/* Danger Zone */}
          <Card bg={cardBg} borderColor="red.200">
            <CardHeader>
              <HStack>
                <FaTrash color="red" />
                <Heading size="md" color="red.500">Danger Zone</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text color="gray.600">
                  Once you delete your account, there is no going back. Please be certain.
                </Text>
                <Button
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<FaTrash />}
                  alignSelf="flex-start"
                >
                  Delete Account
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  )
}
