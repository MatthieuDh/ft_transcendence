import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Flex, Box, VStack, Link } from '@chakra-ui/react';
import SigmaLogo from './logo';

const NAV_ITEMS = [
  { label: 'Home', path: '/main', icon: '🏠', aliases: ['/', '/main'] },
  { label: 'Users', path: '/users', icon: '👤' },
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <Flex
      w="clamp(200px, 20vw, 260px)"
      h="100vh"
      bg="gray.50"
      borderRight="1px solid"
      borderColor="gray.200"
      _dark={{ bg: "gray.950", borderColor: "gray.700" }}
      direction="column"
      position="sticky"
      top="0"
    >
      <Box p="clamp(16px, 2vw, 24px)">
        <Link asChild _hover={{ textDecoration: 'none' }} _focusVisible={{ outline: "none", boxShadow: "none" }}>
          <RouterLink to="/main">
            <SigmaLogo height="32px" />
          </RouterLink>
        </Link>
      </Box>

      <VStack as="nav" gap={2} px={4} flex={1} align="stretch">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || item.aliases?.includes(location.pathname);

          return (
            <Link
              key={item.path}
              asChild
              _hover={{ textDecoration: 'none', bg: 'gray.100', _dark: { bg: 'rgba(168,85,247,0.08)' } }}
              _focusVisible={{ outline: "none", boxShadow: "none" }}
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
                {item.icon} {item.label}
              </RouterLink>
            </Link>
          );
        })}

      </VStack>

    </Flex>
  );
}
