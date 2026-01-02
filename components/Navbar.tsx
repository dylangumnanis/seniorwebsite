'use client'

import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Container,
  Collapse,
  VStack,
  Avatar,
  Badge,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { FaHeart, FaUsers, FaCog, FaSignOutAlt, FaTachometerAlt, FaCalendarAlt, FaQuestionCircle } from 'react-icons/fa'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface NavLinkProps {
  children: React.ReactNode
  href: string
  linkColor: string
  linkHoverColor: string
}

const NavLink = ({ children, href, linkColor, linkHoverColor }: NavLinkProps) => (
  <Box
    as={Link}
    href={href}
    px={3}
    py={2}
    rounded="md"
    fontSize="md"
    fontWeight="500"
    color={linkColor}
    _hover={{
      textDecoration: 'none',
      color: linkHoverColor,
      transform: 'translateY(-1px)',
    }}
    transition="all 0.2s"
  >
    {children}
  </Box>
)

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Move ALL useColorModeValue calls to the top to ensure consistent hook order
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const navBgColor = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')
  const textColor = useColorModeValue('gray.800', 'white')
  const subtitleColor = useColorModeValue('gray.500', 'gray.400')
  const linkColor = useColorModeValue('gray.700', 'gray.200')
  const linkHoverColor = useColorModeValue('orange.600', 'orange.300')

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const getDashboardLink = () => {
    if (!session?.user?.role) return '/dashboard'
    switch (session.user.role) {
      case 'SENIOR': return '/senior/dashboard'
      case 'VOLUNTEER': return '/volunteer/dashboard'
      case 'ADMIN': return '/dashboard'
      default: return '/dashboard'
    }
  }

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      position="fixed"
      top="0"
      w="100%"
      zIndex="1000"
      backdropFilter="blur(10px)"
      backgroundColor={navBgColor}
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Box as={Link} href="/" _hover={{ textDecoration: 'none' }}>
            <HStack spacing={3}>
              <Box
                bg="orange.500"
                color="white"
                p={2}
                rounded="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FaUsers size={20} />
              </Box>
              <VStack spacing={0} align="start">
                <Text
                  fontSize="lg"
                  fontWeight="800"
                  color={textColor}
                  lineHeight="1"
                >
                  Roots and Wings
                </Text>
                <Text
                  fontSize="xs"
                  color={subtitleColor}
                  lineHeight="1"
                >
                  rooted in wisdom, soaring together
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* Desktop Navigation */}
          <HStack as="nav" spacing={8} display={{ base: 'none', lg: 'flex' }}>
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                rightIcon={<ChevronDownIcon />}
                fontSize="md"
                fontWeight="500"
                color={linkColor}
                _hover={{
                  color: linkHoverColor,
                }}
              >
                Volunteer
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} href="/volunteer/become">
                  Become a Volunteer
                </MenuItem>
                <MenuItem as={Link} href="/volunteer/training">
                  Training Program
                </MenuItem>
                <MenuItem as={Link} href="/volunteer/schedule">
                  Schedule Sessions
                </MenuItem>
              </MenuList>
            </Menu>

            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                rightIcon={<ChevronDownIcon />}
                fontSize="md"
                fontWeight="500"
                color={linkColor}
                _hover={{
                  color: linkHoverColor,
                }}
              >
                Programs
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} href="/programs/tech-literacy">
                  Technology Literacy
                </MenuItem>
                <MenuItem as={Link} href="/programs/financial-literacy">
                  Financial Literacy
                </MenuItem>
                <MenuItem as={Link} href="/programs/webinars">
                  Live Webinars
                </MenuItem>
                <MenuItem as={Link} href="/programs/workshops">
                  Workshops
                </MenuItem>
              </MenuList>
            </Menu>

            <NavLink href="/about" linkColor={linkColor} linkHoverColor={linkHoverColor}>About Us</NavLink>
            <NavLink href="/contact" linkColor={linkColor} linkHoverColor={linkHoverColor}>Contact</NavLink>
            <NavLink href="/forum" linkColor={linkColor} linkHoverColor={linkHoverColor}>Forum</NavLink>
            
            <Button
              as={Link}
              href="/donate"
              variant="ghost"
              leftIcon={<FaHeart />}
              color="pink.500"
              _hover={{
                color: 'pink.600',
                bg: 'pink.50',
              }}
              fontSize="md"
              fontWeight="500"
            >
              Donate
            </Button>
          </HStack>

          {/* Auth Buttons / User Menu */}
          <HStack spacing={4} display={{ base: 'none', lg: 'flex' }}>
            {status === 'loading' ? (
              <Text color="gray.500">Loading...</Text>
            ) : session ? (
              <Menu>
                <MenuButton>
                  <HStack spacing={3} cursor="pointer">
                    <Avatar 
                      size="sm" 
                      name={session.user?.name || 'User'} 
                      bg="orange.500"
                    />
                    <VStack spacing={0} align="start">
                      <Text 
                        fontSize="sm" 
                        fontWeight="600"
                        color={textColor}
                      >
                        {session.user?.name || 'User'}
                      </Text>
                      <Badge 
                        size="sm" 
                        colorScheme={
                          session.user?.role === 'SENIOR' ? 'blue' : 
                          session.user?.role === 'VOLUNTEER' ? 'green' : 'purple'
                        }
                        fontSize="xs"
                      >
                        {session.user?.role?.toLowerCase()}
                      </Badge>
                    </VStack>
                    <ChevronDownIcon />
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem 
                    as={Link} 
                    href={getDashboardLink()}
                    icon={<FaTachometerAlt />}
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem 
                    as={Link} 
                    href="/senior/request-session"
                    icon={<FaCalendarAlt />}
                  >
                    {session.user?.role === 'SENIOR' ? 'Request Session' : 'Schedule'}
                  </MenuItem>
                  <MenuItem 
                    as={Link} 
                    href="/contact"
                    icon={<FaQuestionCircle />}
                  >
                    Support
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem 
                    as={Link} 
                    href="/settings"
                    icon={<FaCog />}
                  >
                    Settings
                  </MenuItem>
                  <MenuItem 
                    onClick={handleSignOut}
                    icon={<FaSignOutAlt />}
                    color="red.500"
                  >
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <>
                <Button
                  as={Link}
                  href="/login"
                  variant="ghost"
                  size="md"
                  fontWeight="500"
                  color={linkColor}
                  _hover={{
                    color: linkHoverColor,
                  }}
                >
                  Log In
                </Button>
                <Button
                  as={Link}
                  href="/register"
                  bg="orange.500"
                  color="white"
                  size="md"
                  fontWeight="600"
                  rounded="full"
                  px={6}
                  _hover={{
                    bg: 'orange.600',
                    transform: 'translateY(-1px)',
                  }}
                  _active={{
                    transform: 'translateY(0)',
                  }}
                  transition="all 0.2s"
                >
                  Sign Up
                </Button>
              </>
            )}
          </HStack>

          {/* Mobile menu button */}
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ lg: 'none' }}
            onClick={isOpen ? onClose : onOpen}
            variant="ghost"
          />
        </Flex>

        {/* Mobile Navigation */}
        <Collapse in={isOpen} animateOpacity>
          <Box pb={4} display={{ lg: 'none' }}>
            <Stack as="nav" spacing={4}>
              <VStack align="start" spacing={2}>
                <Text fontWeight="600" color={textColor} fontSize="sm">
                  VOLUNTEER
                </Text>
                <Box pl={4}>
                  <VStack align="start" spacing={1}>
                    <NavLink href="/volunteer/become" linkColor={linkColor} linkHoverColor={linkHoverColor}>Become a Volunteer</NavLink>
                    <NavLink href="/volunteer/training" linkColor={linkColor} linkHoverColor={linkHoverColor}>Training Program</NavLink>
                    <NavLink href="/volunteer/schedule" linkColor={linkColor} linkHoverColor={linkHoverColor}>Schedule Sessions</NavLink>
                  </VStack>
                </Box>
              </VStack>

              <VStack align="start" spacing={2}>
                <Text fontWeight="600" color={textColor} fontSize="sm">
                  PROGRAMS
                </Text>
                <Box pl={4}>
                  <VStack align="start" spacing={1}>
                    <NavLink href="/programs/tech-literacy" linkColor={linkColor} linkHoverColor={linkHoverColor}>Technology Literacy</NavLink>
                    <NavLink href="/programs/financial-literacy" linkColor={linkColor} linkHoverColor={linkHoverColor}>Financial Literacy</NavLink>
                    <NavLink href="/programs/webinars" linkColor={linkColor} linkHoverColor={linkHoverColor}>Live Webinars</NavLink>
                    <NavLink href="/programs/workshops" linkColor={linkColor} linkHoverColor={linkHoverColor}>Workshops</NavLink>
                  </VStack>
                </Box>
              </VStack>

              <NavLink href="/about" linkColor={linkColor} linkHoverColor={linkHoverColor}>About Us</NavLink>
              <NavLink href="/contact" linkColor={linkColor} linkHoverColor={linkHoverColor}>Contact</NavLink>
              <NavLink href="/forum" linkColor={linkColor} linkHoverColor={linkHoverColor}>Forum</NavLink>
              
              <Button
                as={Link}
                href="/donate"
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<FaHeart />}
                color="pink.500"
                _hover={{
                  color: 'pink.600',
                  bg: 'pink.50',
                }}
                fontSize="md"
                fontWeight="500"
              >
                Donate
              </Button>

              <Box pt={4} borderTop="1px" borderColor={borderColor}>
                <VStack spacing={3}>
                  <Button
                    as={Link}
                    href="/login"
                    variant="outline"
                    colorScheme="orange"
                    size="md"
                    w="full"
                    fontWeight="500"
                  >
                    Log In
                  </Button>
                  <Button
                    as={Link}
                    href="/register"
                    bg="orange.500"
                    color="white"
                    size="md"
                    w="full"
                    fontWeight="600"
                    _hover={{
                      bg: 'orange.600',
                    }}
                  >
                    Sign Up
                  </Button>
                </VStack>
              </Box>
            </Stack>
          </Box>
        </Collapse>
      </Container>
    </Box>
  )
} 