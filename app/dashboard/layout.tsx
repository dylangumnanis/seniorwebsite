'use client'

import {
  Box,
  Flex,
  Icon,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Link,
  Divider,
} from '@chakra-ui/react'
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaVideo,
  FaComments,
  FaBook,
  FaCog,
} from 'react-icons/fa'
import { usePathname } from 'next/navigation'
import NextLink from 'next/link'

interface NavItemProps {
  icon: any
  children: React.ReactNode
  href: string
  isActive?: boolean
}

const NavItem = ({ icon, children, href, isActive }: NavItemProps) => {
  return (
    <Link
      as={NextLink}
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <HStack
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? 'primary.500' : 'transparent'}
        color={isActive ? 'white' : 'gray.600'}
        _hover={{
          bg: isActive ? 'primary.600' : 'gray.100',
          color: isActive ? 'white' : 'gray.900',
        }}
      >
        <Icon
          mr="4"
          fontSize="16"
          as={icon}
          color={isActive ? 'white' : 'gray.500'}
        />
        <Text>{children}</Text>
      </HStack>
    </Link>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { icon: FaHome, label: 'Dashboard', href: '/dashboard' },
    { icon: FaUsers, label: 'Find Volunteers', href: '/dashboard/volunteers' },
    { icon: FaCalendarAlt, label: 'Schedule', href: '/dashboard/schedule' },
    { icon: FaVideo, label: 'Webinars', href: '/dashboard/webinars' },
    { icon: FaComments, label: 'Forum', href: '/dashboard/forum' },
    { icon: FaBook, label: 'Resources', href: '/dashboard/resources' },
    { icon: FaCog, label: 'Settings', href: '/dashboard/settings' },
  ]

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Flex>
        {/* Sidebar */}
        <Box
          w="64"
          h="100vh"
          bg={useColorModeValue('white', 'gray.800')}
          borderRight="1px"
          borderRightColor={useColorModeValue('gray.200', 'gray.700')}
          pos="fixed"
          py="5"
        >
          <VStack spacing={1} align="stretch">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                href={item.href}
                isActive={pathname === item.href}
              >
                {item.label}
              </NavItem>
            ))}
          </VStack>
        </Box>

        {/* Main Content */}
        <Box
          ml="64"
          w="calc(100% - 16rem)"
          minH="100vh"
          p="8"
        >
          {children}
        </Box>
      </Flex>
    </Box>
  )
} 