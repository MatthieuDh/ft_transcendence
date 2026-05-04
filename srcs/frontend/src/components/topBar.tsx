import { Flex, HStack, Heading, Box, Badge } from "@chakra-ui/react"
import { ColorModeButton } from "./ui/color-mode"
import { useLocation, useNavigate } from "react-router-dom"
import { useCurrentUser } from "../hooks/useCurrentUser"

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projecten',
  '/friends': 'Vrienden',
  '/notifications': 'Notificaties',
  '/profile': 'Profiel',
}

export default function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, unreadCount } = useCurrentUser()

  const title = Object.entries(titles).find(([key]) => location.pathname.startsWith(key))?.[1] ?? 'Sigma'
  const initials = user?.username?.[0]?.toUpperCase() ?? '?'

  function logout() {
    localStorage.removeItem('access_token')
    navigate('/login')
  }

  return (
    <Flex
      as="header"
      w="full"
      h="72px"
      align="center"
      justify="space-between"
      px={8}
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      _dark={{ bg: "gray.900", borderColor: "gray.700" }}
      flexShrink={0}
    >
      <Heading size="lg" fontWeight="bold" color="gray.800" _dark={{ color: "white" }}>
        {title}
      </Heading>

      <HStack gap={4}>
        <Box position="relative" cursor="pointer" fontSize="xl" onClick={() => navigate('/notifications')} _hover={{ opacity: 0.7 }}>
          🔔
          {unreadCount > 0 && (
            <Badge position="absolute" top="-1" right="-1" colorPalette="red" borderRadius="full" fontSize="xs" minW="18px" h="18px" display="flex" alignItems="center" justifyContent="center" p={0}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Box>

        <ColorModeButton />

        <Box
          w="36px" h="36px"
          bg="purple.500" color="white"
          borderRadius="full"
          display="flex" alignItems="center" justifyContent="center"
          fontWeight="bold" fontSize="sm"
          cursor="pointer"
          _hover={{ bg: "purple.600" }}
          onClick={logout}
          title={`${user?.username ?? ''} (klik om uit te loggen)`}
        >
          {initials}
        </Box>
      </HStack>
    </Flex>
  )
}
