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
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Container,
  Collapse,
  VStack,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { FaHeart, FaUsers, FaGraduationCap } from 'react-icons/fa'
import Link from 'next/link'

interface NavLinkProps {
  children: React.ReactNode
  href: string
}

const NavLink = ({ children, href }: NavLinkProps) => (
  <Box
    as={Link}
    href={href}
    px={3}
    py={2}
    rounded="md"
    fontSize="md"
    fontWeight="500"
    color={useColorModeValue('gray.700', 'gray.200')}
    _hover={{
      textDecoration: 'none',
      color: useColorModeValue('orange.600', 'orange.300'),
      transform: 'translateY(-1px)',
    }}
    transition="all 0.2s"
  >
    {children}
  </Box>
)

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

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
      backgroundColor={useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')}
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
                  color={useColorModeValue('gray.800', 'white')}
                  lineHeight="1"
                >
                  Senior Tech Connect
                </Text>
                <Text
                  fontSize="xs"
                  color={useColorModeValue('gray.500', 'gray.400')}
                  lineHeight="1"
                >
                  bridging generations
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
                color={useColorModeValue('gray.700', 'gray.200')}
                _hover={{
                  color: useColorModeValue('orange.600', 'orange.300'),
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
                color={useColorModeValue('gray.700', 'gray.200')}
                _hover={{
                  color: useColorModeValue('orange.600', 'orange.300'),
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

            <NavLink href="/about">About Us</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavLink href="/forum">Forum</NavLink>
            
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

          {/* Auth Buttons */}
          <HStack spacing={4} display={{ base: 'none', lg: 'flex' }}>
            <Button
              as={Link}
              href="/login"
              variant="ghost"
              size="md"
              fontWeight="500"
              color={useColorModeValue('gray.700', 'gray.200')}
              _hover={{
                color: useColorModeValue('orange.600', 'orange.300'),
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
                <Text fontWeight="600" color={useColorModeValue('gray.800', 'white')} fontSize="sm">
                  VOLUNTEER
                </Text>
                <Box pl={4}>
                  <VStack align="start" spacing={1}>
                    <NavLink href="/volunteer/become">Become a Volunteer</NavLink>
                    <NavLink href="/volunteer/training">Training Program</NavLink>
                    <NavLink href="/volunteer/schedule">Schedule Sessions</NavLink>
                  </VStack>
                </Box>
              </VStack>

              <VStack align="start" spacing={2}>
                <Text fontWeight="600" color={useColorModeValue('gray.800', 'white')} fontSize="sm">
                  PROGRAMS
                </Text>
                <Box pl={4}>
                  <VStack align="start" spacing={1}>
                    <NavLink href="/programs/tech-literacy">Technology Literacy</NavLink>
                    <NavLink href="/programs/financial-literacy">Financial Literacy</NavLink>
                    <NavLink href="/programs/webinars">Live Webinars</NavLink>
                    <NavLink href="/programs/workshops">Workshops</NavLink>
                  </VStack>
                </Box>
              </VStack>

              <NavLink href="/about">About Us</NavLink>
              <NavLink href="/contact">Contact</NavLink>
              <NavLink href="/forum">Forum</NavLink>
              
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