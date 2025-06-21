'use client'

import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react'
import { FaUsers, FaClock, FaVideo, FaComments } from 'react-icons/fa'

export default function DashboardPage() {
  const stats = [
    {
      label: 'Total Sessions',
      value: '12',
      change: '+2.5%',
      icon: FaClock,
    },
    {
      label: 'Active Volunteers',
      value: '24',
      change: '+5.2%',
      icon: FaUsers,
    },
    {
      label: 'Upcoming Webinars',
      value: '3',
      change: '0%',
      icon: FaVideo,
    },
    {
      label: 'Forum Posts',
      value: '45',
      change: '+12.3%',
      icon: FaComments,
    },
  ]

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg">Welcome back!</Heading>
          <Text color="gray.600" mt={2}>
            Here's an overview of your activity
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {stats.map((stat, index) => (
            <Box
              key={index}
              bg={useColorModeValue('white', 'gray.700')}
              p={6}
              rounded="lg"
              shadow="md"
            >
              <HStack spacing={4}>
                <Icon
                  as={stat.icon}
                  w={8}
                  h={8}
                  color="primary.500"
                />
                <Stat>
                  <StatLabel>{stat.label}</StatLabel>
                  <StatNumber>{stat.value}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {stat.change}
                  </StatHelpText>
                </Stat>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Upcoming Sessions */}
          <Box
            bg={useColorModeValue('white', 'gray.700')}
            p={6}
            rounded="lg"
            shadow="md"
          >
            <Heading size="md" mb={4}>
              Upcoming Sessions
            </Heading>
            <VStack align="stretch" spacing={4}>
              {/* Add session list here */}
              <Text color="gray.500">No upcoming sessions</Text>
            </VStack>
          </Box>

          {/* Recent Activity */}
          <Box
            bg={useColorModeValue('white', 'gray.700')}
            p={6}
            rounded="lg"
            shadow="md"
          >
            <Heading size="md" mb={4}>
              Recent Activity
            </Heading>
            <VStack align="stretch" spacing={4}>
              {/* Add activity list here */}
              <Text color="gray.500">No recent activity</Text>
            </VStack>
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
  )
} 