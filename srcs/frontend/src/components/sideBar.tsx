import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Flex, Box, VStack, Link } from '@chakra-ui/react';
import SigmaLogo from './logo';

export default function Sidebar() {
  const location = useLocation();
  const isHomeActive = location.pathname === '/' || location.pathname === '/main';

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
        <Link asChild _hover={{ textDecoration: 'none' }}>
          <RouterLink to="/main">
            <SigmaLogo height="32px" />
          </RouterLink>
        </Link>
      </Box>

      <VStack as="nav" gap={2} px={4} flex={1} align="stretch">

        <Link
          asChild
          _hover={{ textDecoration: 'none', bg: 'gray.100', _dark: { bg: 'rgba(168,85,247,0.08)' } }}
          p={3}
          borderRadius="md"
          fontWeight="medium"
          display="flex"
          alignItems="center"
          gap={3}
          color={isHomeActive ? "purple.500" : "gray.700"}
          _dark={{ color: isHomeActive ? "purple.400" : "gray.200" }}
          borderLeft={isHomeActive ? "3px solid" : "none"}
          borderColor={isHomeActive ? "purple.500" : "transparent"}
          bg={isHomeActive ? "rgba(168,85,247,0.08)" : "transparent"}
        >
          <RouterLink to="/main">
            🏠 Home
          </RouterLink>
        </Link>

        <Link
          asChild
          _hover={{ textDecoration: 'none', bg: 'gray.100', _dark: { bg: 'rgba(168,85,247,0.08)' } }}
          p={3}
          borderRadius="md"
          fontWeight="medium"
          display="flex"
          alignItems="center"
          gap={3}
          color="gray.700"
          _dark={{ color: "gray.200" }}
        >
          <RouterLink to="`/profile/$userId">
            👤 Profile
          </RouterLink>
        </Link>

      </VStack>

    </Flex>
  );
}
