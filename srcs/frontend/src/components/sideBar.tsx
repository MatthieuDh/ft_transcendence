import { Link as RouterLink } from 'react-router-dom';
import { Flex, Box, VStack, Link } from '@chakra-ui/react';
import SigmaLogo from './logo';

export default function Sidebar() {
  return (
    <Flex 
      w="clamp(200px, 20vw, 260px)" 
      h="100vh" 
      bg="gray.50" 
      borderRight="1px solid" 
      borderColor="gray.200"
      _dark={{ bg: "gray.900", borderColor: "gray.700" }} 
      direction="column"
      position="sticky"
      top="0"
    >
      <Box p="clamp(16px, 2vw, 24px)">
        <Link asChild _hover={{ textDecoration: 'none' }}>
          <RouterLink to="/">
            <SigmaLogo height="32px" /> 
          </RouterLink>
        </Link>
      </Box>

      <VStack as="nav" gap={2} px={4} flex={1} align="stretch">
        
        <Link 
          asChild
          _hover={{ textDecoration: 'none', bg: 'gray.100', _dark: { bg: 'gray.800' } }}
          p={3}
          borderRadius="md"
          fontWeight="medium"
          display="flex"
          alignItems="center"
          gap={3}
          color="gray.700"
          _dark={{ color: "gray.200" }}
        >
          <RouterLink to="/">
            🏠 Home
          </RouterLink>
        </Link>

        <Link 
          asChild
          _hover={{ textDecoration: 'none', bg: 'gray.100', _dark: { bg: 'gray.800' } }}
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