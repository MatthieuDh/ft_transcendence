import { Flex, HStack, Box, Heading, Text, VStack, Input, Button } from "@chakra-ui/react";
import { ColorModeButton } from "./ui/color-mode";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../hooks/useNotification";
import { LuBell, LuSearch } from "react-icons/lu";
import { useLogout } from "../hooks/useLogout";
import { useFriendRequests } from "../hooks/useFriend";
import { useAuth } from "../context/AuthContext";
import ChangePasswordModal from "./changePasswordModal";

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function TopBar({ searchQuery, onSearchChange }: TopBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const { requests, accept, reject } = useFriendRequests();
  const { logout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const getPageTitle = (path: string) => {
    if (path === '/' || path === '' || path === '/main') return 'Dashboard';
    const parts = path.split('/').filter(Boolean);
    const mainPath = parts[0];
    return mainPath.charAt(0).toUpperCase() + mainPath.slice(1);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayNotifications = notifications.filter(
    n => !n.message.toLowerCase().includes('friend request')
  );

  const totalAlerts = unreadCount + requests.length;

  return (
    <Flex as="header" w="full" h="72px" align="center" justify="space-between" px={8} position="relative" zIndex={100} backdropFilter="blur(12px)" bg="rgba(255,255,255,0.8)" borderBottom="1px solid" borderColor="rgba(255,255,255,0.15)" _dark={{ bg: "rgba(10,10,15,0.85)", borderColor: "rgba(255,255,255,0.08)" }}>

      <Heading size="lg" fontWeight="bold" color="gray.800" _dark={{ color: "white" }} minW="150px">
        {getPageTitle(location.pathname)}
      </Heading>

      <Box flex={1} maxW="500px" mx={8} display={{ base: "none", md: "block" }}>
        {(location.pathname === '/' || location.pathname === '/main') && (
          <Flex align="center" bg="gray.50" borderRadius="lg" border="1px solid" borderColor="gray.200" _dark={{ bg: "gray.800", borderColor: "gray.700" }} px={4} py={2}>
            <LuSearch color="gray" size={20} />
            <Input
              variant="outline"
              border="none"
              placeholder="Search projects and tasks..."
              _focus={{ boxShadow: "none" }}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              ml={2}
            />
          </Flex>
        )}
      </Box>

      <HStack gap={6}>
        <Box position="relative" ref={menuRef}>
          <Box cursor="pointer" position="relative" onClick={() => setIsOpen(!isOpen)} p={1}>
            <LuBell size={24} />
            {totalAlerts > 0 && (
              <Flex position="absolute" top="-4px" right="-4px" bg="red.500" color="white" w="18px" h="18px" borderRadius="full" justify="center" align="center" fontSize="10px" fontWeight="bold">
                {totalAlerts}
              </Flex>
            )}
          </Box>

          {isOpen && (
            <Box position="absolute" top="50px" right="-10px" w="320px" bg="white" _dark={{ bg: "gray.800", borderColor: "gray.700" }} boxShadow="xl" borderRadius="lg" border="1px solid" borderColor="gray.200" zIndex={9999} overflow="hidden">
              <Flex justify="space-between" align="center" p={3} borderBottom="1px solid" borderColor="gray.100" bg="gray.50" _dark={{ borderColor: "gray.700", bg: "gray.900" }}>
                <Text fontWeight="bold" fontSize="sm">Notifications</Text>
                {unreadCount > 0 && (
                  <Text fontSize="xs" color="purple.500" cursor="pointer" onClick={markAllAsRead} _hover={{ textDecoration: "underline" }}>
                    Mark all as read
                  </Text>
                )}
              </Flex>
              <VStack maxH="300px" overflowY="auto" align="stretch" gap={0}>
                {requests.map(req => (
                  <Box key={`req-${req.id}`} p={3} borderBottom="1px solid" borderColor="gray.100" bg="purple.50" _dark={{ borderColor: "gray.700", bg: "purple.900" }}>
                    <Text fontSize="sm" color="gray.800" _dark={{ color: "white" }} mb={2}>
                      <strong>{req.requester.username}</strong> sent you a friend request!
                    </Text>
                    <HStack>
                      <Button size="xs" colorPalette="green" onClick={(e) => { e.preventDefault(); e.stopPropagation(); accept(req.requesterId); }}>
                        Accept
                      </Button>
                      <Button size="xs" colorPalette="red" variant="outline" onClick={(e) => { e.preventDefault(); e.stopPropagation(); reject(req.requesterId); }}>
                        Decline
                      </Button>
                    </HStack>
                  </Box>
                ))}
                {displayNotifications.length === 0 && requests.length === 0 ? (
                  <Text p={4} textAlign="center" fontSize="sm" color="gray.500">No notifications</Text>
                ) : (
                  displayNotifications.map(notif => (
                    <Box
                      key={notif.id}
                      p={3}
                      borderBottom="1px solid"
                      borderColor="gray.100"
                      bg={notif.isRead ? "transparent" : "purple.50"}
                      _dark={{ borderColor: "gray.700", bg: notif.isRead ? "transparent" : "purple.900" }}
                      _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}
                    >
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

        <Box position="relative" ref={profileMenuRef}>
          <Box w="40px" h="40px" bg="purple.500" color="white" borderRadius="full" display="flex" alignItems="center" justifyContent="center" fontWeight="bold" cursor="pointer" _hover={{ bg: "purple.600" }} onClick={() => setIsProfileOpen(!isProfileOpen)}>
            {currentUser?.username?.charAt(0).toUpperCase() || 'S'}
          </Box>

          {isProfileOpen && (
            <Box position="absolute" top="50px" right="0" w="160px" bg="white" _dark={{ bg: "gray.800", borderColor: "gray.700" }} boxShadow="xl" borderRadius="lg" border="1px solid" borderColor="gray.200" zIndex={9999} overflow="hidden">
              <VStack align="stretch" gap={0}>
                <Box p={3} cursor="pointer" _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }} onClick={() => {
                  setIsProfileOpen(false);
                  if (currentUser) navigate(`/profile/${currentUser.id}`);
                }}>
                  <Text fontSize="sm" fontWeight="bold">My Profile</Text>
                </Box>
                <Box
                  p={3}
                  cursor="pointer"
                  _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}
                  borderTop="1px solid"
                  borderColor="gray.100"
                  _dark={{ borderColor: "gray.700" }}
                  onClick={() => { setIsProfileOpen(false); setChangePasswordOpen(true); }}
                >
                  <Text fontSize="sm" fontWeight="bold">Change Password</Text>
                </Box>
                <Box
                  p={3}
                  cursor="pointer"
                  color="red.500"
                  _hover={{ bg: "red.50", _dark: { bg: "red.900/30" } }}
                  borderTop="1px solid"
                  borderColor="gray.100"
                  _dark={{ borderColor: "gray.700" }}
                  onClick={() => { setIsProfileOpen(false); logout(); }}
                >
                  <Text fontSize="sm" fontWeight="bold">Logout</Text>
                </Box>
              </VStack>
            </Box>
          )}
        </Box>

        <ChangePasswordModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
      </HStack>
    </Flex>
  );
}