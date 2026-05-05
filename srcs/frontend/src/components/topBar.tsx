import { Flex, HStack, Heading, Box, Text, VStack, Separator } from "@chakra-ui/react"
import { ColorModeButton } from "./ui/color-mode"
import { useLocation, useNavigate } from "react-router-dom"
import { useNotifications } from "../hooks/useNotification"
import { LuBell, LuUser, LuLogOut, LuSettings } from "react-icons/lu"
import { useState, useRef, useEffect } from "react"

export default function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { notifications, unreadCount, markAllAsRead, currentUser } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const getPageTitle = (path: string) => {
    if (path === '/' || path === '') return 'Dashboard';
    const parts = path.split('/').filter(Boolean);
    const mainPath = parts[0];
    return mainPath.charAt(0).toUpperCase() + mainPath.slice(1);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        {getPageTitle(location.pathname)}
      </Heading>

      <HStack gap={6}>
        <Box position="relative" ref={menuRef}>
          <Box cursor="pointer" position="relative" onClick={() => setIsOpen(!isOpen)}>
            <LuBell size={24} />
            {unreadCount > 0 && (
              <Flex position="absolute" top="-4px" right="-4px" bg="red.500" color="white" w="18px" h="18px" borderRadius="full" justify="center" align="center" fontSize="10px" fontWeight="bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Flex>
            )}
          </Box>

          {isOpen && (
            <Box position="absolute" top="40px" right="-10px" w="320px" bg="white" _dark={{ bg: "gray.800", borderColor: "gray.700" }} boxShadow="xl" borderRadius="lg" border="1px solid" borderColor="gray.200" zIndex={1000} overflow="hidden">
              <Flex justify="space-between" align="center" p={3} borderBottom="1px solid" borderColor="gray.100" bg="gray.50" _dark={{ borderColor: "gray.700", bg: "gray.900" }}>
                <Text fontWeight="bold" fontSize="sm">Notifications</Text>
                {unreadCount > 0 && (
                  <Text fontSize="xs" color="purple.500" cursor="pointer" onClick={markAllAsRead} _hover={{ textDecoration: "underline" }}>
                    Mark all as read
                  </Text>
                )}
              </Flex>
              <VStack maxH="300px" overflowY="auto" align="stretch" gap={0}>
                {notifications.length === 0 ? (
                  <Text p={4} textAlign="center" fontSize="sm" color="gray.500">No notifications</Text>
                ) : (
                  notifications.map(notif => (
                    <Box key={notif.id} p={3} borderBottom="1px solid" borderColor="gray.100" bg={notif.isRead ? "transparent" : "purple.50"} _dark={{ borderColor: "gray.700", bg: notif.isRead ? "transparent" : "purple.900" }} _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}>
                      <Text fontSize="sm" color={notif.isRead ? "gray.600" : "gray.800"} _dark={{ color: notif.isRead ? "gray.400" : "white" }}>
                        {notif.message}
                      </Text>
                    </Box>
                  ))
                )}
              </VStack>
            </Box>
          )}
        </Box>

        <ColorModeButton />

        <Box position="relative" ref={userMenuRef}>
          <Box
            w="38px" h="38px"
            bg="purple.500" color="white"
            borderRadius="full"
            display="flex" alignItems="center" justifyContent="center"
            fontWeight="bold"
            fontSize="sm"
            cursor="pointer"
            _hover={{ bg: "purple.600", transform: "scale(1.05)" }}
            transition="all 0.15s"
            onClick={() => setUserMenuOpen(v => !v)}
            userSelect="none"
          >
            {currentUser?.username?.charAt(0).toUpperCase() || '?'}
          </Box>

          {userMenuOpen && (
            <Box
              position="absolute" top="48px" right="0"
              w="200px" bg="white" _dark={{ bg: "gray.800", borderColor: "gray.700" }}
              boxShadow="lg" borderRadius="lg" border="1px solid" borderColor="gray.200"
              zIndex={1000} overflow="hidden" py={1}
            >
              <Box px={4} py={3} borderBottom="1px solid" borderColor="gray.100" _dark={{ borderColor: "gray.700" }}>
                <Text fontWeight="semibold" fontSize="sm">{currentUser?.username}</Text>
                <Text fontSize="xs" color="gray.500" truncate>{currentUser?.email}</Text>
              </Box>

              <Box
                px={4} py={2.5} cursor="pointer" display="flex" alignItems="center" gap={3}
                _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}
                fontSize="sm"
                onClick={() => { setUserMenuOpen(false); navigate(`/profile/${currentUser?.id}`) }}
              >
                <LuUser size={16} /> Mijn profiel
              </Box>

              <Separator />

              <Box
                px={4} py={2.5} cursor="pointer" display="flex" alignItems="center" gap={3}
                _hover={{ bg: "red.50", color: "red.600", _dark: { bg: "gray.700", color: "red.400" } }}
                fontSize="sm" color="gray.700" _dark={{ color: "gray.300" }}
                onClick={() => { setUserMenuOpen(false); logout() }}
              >
                <LuLogOut size={16} /> Uitloggen
              </Box>
            </Box>
          )}
        </Box>
      </HStack>
    </Flex>
  )
}
