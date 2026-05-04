import { Flex, HStack, Box, Heading, Text, VStack } from "@chakra-ui/react";
import { ColorModeButton } from "./ui/color-mode";
import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../hooks/useNotification";
import { LuBell } from "react-icons/lu";

export default function TopBar() {
  const location = useLocation();
  const { notifications, unreadCount, markAllAsRead, currentUser } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Flex as="header" w="full" h="72px" align="center" justify="space-between" px={8} bg="white" borderBottom="1px solid" borderColor="gray.200" _dark={{ bg: "gray.900", borderColor: "gray.700" }}>
      <Heading size="lg" fontWeight="bold" color="gray.800" _dark={{ color: "white" }}>
        {getPageTitle(location.pathname)}
      </Heading>

      <HStack gap={6}>
        <Box position="relative" ref={menuRef}>
          <Box cursor="pointer" position="relative" onClick={() => setIsOpen(!isOpen)}>
            <LuBell size={24} />
            {unreadCount > 0 && (
              <Flex position="absolute" top="-4px" right="-4px" bg="red.500" color="white" w="18px" h="18px" borderRadius="full" justify="center" align="center" fontSize="10px" fontWeight="bold">
                {unreadCount}
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

        <Box w="40px" h="40px" bg="purple.500" color="white" borderRadius="full" display="flex" alignItems="center" justifyContent="center" fontWeight="bold" cursor="pointer" _hover={{ bg: "purple.600" }}>
          {currentUser?.username?.charAt(0).toUpperCase() || 'S'}
        </Box>
      </HStack>
    </Flex>
  );
}