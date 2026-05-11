import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Flex, Box, VStack, Link } from '@chakra-ui/react';
import { LuHouse, LuUsers, LuActivity, LuUser } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import SigmaLogo from './logo';

export default function Sidebar() {
  const location = useLocation();
  const { currentUser } = useAuth();

  const NAV_ITEMS = [
    { label: 'Home', path: '/main', icon: LuHouse, aliases: ['/', '/main'] },
    { label: 'Users', path: '/users', icon: LuUsers },
    { label: 'Dashboard', path: '/dashboard', icon: LuActivity },
    ...(currentUser ? [{ label: 'Profile', path: `/profile/${currentUser.id}`, icon: LuUser }] : []),
  ];

  return (
    <Flex
      w="clamp(200px, 20vw, 260px)"
      h="100vh"
      bg="gray.50"
      borderRight="1px solid"
      borderColor="gray.200"
      _dark={{ bg: 'rgba(10,10,15,0.85)', borderColor: "gray.700" }}
      direction="column"
      position="sticky"
      top="0"
      display={{ base: "none", md: "flex" }}
    >
      <Box p="clamp(16px, 2vw, 24px)" display="flex" alignItems="center" justifyContent="flex-start">
        <Link asChild outline="none" boxShadow="none" border="none" _hover={{ textDecoration: 'none', opacity: 0.8 }} transition="opacity 0.2s">
          <RouterLink to="/main">
            <SigmaLogo height="32px" iconColor="#a855f7" textColor="inherit" />
          </RouterLink>
        </Link>
      </Box>

      <VStack as="nav" gap={2} px={4} flex={1} align="stretch">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || item.aliases?.includes(location.pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              asChild
              outline="none"
              boxShadow="none"
              border="none"
              _hover={{ textDecoration: 'none', bg: 'gray.100', _dark: { bg: 'rgba(168,85,247,0.08)' } }}
              p={3}
              borderRadius="md"
              fontWeight="medium"
              display="flex"
              alignItems="center"
              gap={3}
              color={isActive ? "purple.500" : "gray.700"}
              _dark={{ color: isActive ? "purple.400" : "gray.200" }}
              borderLeft="3px solid"
              borderColor={isActive ? "purple.500" : "transparent"}
              bg={isActive ? "rgba(168,85,247,0.08)" : "transparent"}
            >
              <RouterLink to={item.path}>
                <Icon size={20} style={{ flexShrink: 0 }} />
                {item.label}
              </RouterLink>
            </Link>
          );
        })}
      </VStack>
    </Flex>
  );
}