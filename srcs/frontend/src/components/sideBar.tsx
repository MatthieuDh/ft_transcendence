import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Flex, Box, VStack, Link, Text } from '@chakra-ui/react'
import SigmaLogo from './logo'
import { useAuth } from '../context/AuthContext'

interface NavItemProps {
  to: string
  icon: string
  label: string
  active: boolean
}

function NavItem({ to, icon, label, active }: NavItemProps) {
  return (
    <Link asChild _hover={{ textDecoration: 'none' }}>
      <RouterLink to={to}>
        <Flex
          align="center"
          gap={3}
          px={3}
          py={2.5}
          borderRadius="md"
          fontWeight="medium"
          fontSize="sm"
          color={active ? "purple.600" : "gray.700"}
          bg={active ? "purple.50" : "transparent"}
          _dark={{
            color: active ? "purple.300" : "gray.300",
            bg: active ? "purple.900" : "transparent",
          }}
          _hover={{ bg: active ? undefined : "gray.100", _dark: { bg: active ? undefined : "gray.800" } }}
          transition="all 0.15s"
        >
          <Text fontSize="lg">{icon}</Text>
          <Text>{label}</Text>
        </Flex>
      </RouterLink>
    </Link>
  )
}

export default function Sidebar() {
  const location = useLocation()
  const path = location.pathname
  const { currentUser } = useAuth()

  const profilePath = currentUser ? `/profile/${currentUser.id}` : '/profile/0'

  return (
    <Flex
      w="clamp(200px, 20vw, 240px)"
      h="100vh"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      _dark={{ bg: "gray.900", borderColor: "gray.700" }}
      direction="column"
      position="sticky"
      top="0"
      flexShrink={0}
    >
      <Box p={6}>
        <Link asChild _hover={{ textDecoration: 'none' }}>
          <RouterLink to="/dashboard">
            <SigmaLogo height="32px" />
          </RouterLink>
        </Link>
      </Box>

      <VStack as="nav" gap={1} px={3} flex={1} align="stretch">
        <NavItem to="/dashboard" icon="📊" label="Dashboard" active={path === '/dashboard'} />
        <NavItem to="/projects" icon="📁" label="Projecten" active={path.startsWith('/projects') || path.startsWith('/project/')} />
        <NavItem to="/friends" icon="👥" label="Vrienden" active={path === '/friends'} />
        <NavItem to="/notifications" icon="🔔" label="Notificaties" active={path === '/notifications'} />
      </VStack>

      <Box px={3} pb={4}>
        <NavItem to={profilePath} icon="👤" label="Profiel" active={path.startsWith('/profile')} />
      </Box>
    </Flex>
  )
}
