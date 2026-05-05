import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Flex, Box, VStack, Link, Text } from '@chakra-ui/react'
import { LuLayoutDashboard, LuFolder, LuUsers, LuBell, LuUser } from 'react-icons/lu'
import type { IconType } from 'react-icons'
import SigmaLogo from './logo'
import { useAuth } from '../context/AuthContext'

interface NavItemProps {
  to: string
  icon: IconType
  label: string
  active: boolean
}

function NavItem({ to, icon: Icon, label, active }: NavItemProps) {
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
          color={active ? "purple.600" : "gray.600"}
          bg={active ? "purple.50" : "transparent"}
          _dark={{
            color: active ? "purple.300" : "gray.400",
            bg: active ? "purple.900" : "transparent",
          }}
          _hover={{ bg: active ? undefined : "gray.100", color: active ? undefined : "gray.900", _dark: { bg: active ? undefined : "gray.800", color: active ? undefined : "gray.100" } }}
          transition="all 0.15s"
        >
          <Box
            w="32px" h="32px"
            display="flex" alignItems="center" justifyContent="center"
            borderRadius="md"
            bg={active ? "purple.100" : "transparent"}
            color={active ? "purple.600" : "inherit"}
            _dark={{ bg: active ? "purple.800" : "transparent", color: active ? "purple.300" : "inherit" }}
            transition="all 0.15s"
            flexShrink={0}
          >
            <Icon size={18} />
          </Box>
          <Text>{label}</Text>
          {active && (
            <Box ml="auto" w="6px" h="6px" borderRadius="full" bg="purple.500" _dark={{ bg: "purple.300" }} />
          )}
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
      <Box px={6} py={5} borderBottom="1px solid" borderColor="gray.100" _dark={{ borderColor: "gray.800" }}>
        <Link asChild _hover={{ textDecoration: 'none' }}>
          <RouterLink to="/dashboard">
            <SigmaLogo height="30px" />
          </RouterLink>
        </Link>
      </Box>

      <VStack as="nav" gap={1} px={3} pt={4} flex={1} align="stretch">
        <Text px={3} pb={1} fontSize="xs" fontWeight="semibold" color="gray.400" textTransform="uppercase" letterSpacing="wider">Menu</Text>
        <NavItem to="/dashboard" icon={LuLayoutDashboard} label="Dashboard" active={path === '/dashboard'} />
        <NavItem to="/projects" icon={LuFolder} label="Projecten" active={path.startsWith('/projects') || path.startsWith('/project/')} />
        <NavItem to="/friends" icon={LuUsers} label="Vrienden" active={path === '/friends'} />
        <NavItem to="/notifications" icon={LuBell} label="Notificaties" active={path === '/notifications'} />
      </VStack>

      <Box px={3} pb={5} borderTop="1px solid" borderColor="gray.100" _dark={{ borderColor: "gray.800" }} pt={3}>
        <NavItem to={profilePath} icon={LuUser} label="Profiel" active={path.startsWith('/profile')} />
      </Box>
    </Flex>
  )
}
