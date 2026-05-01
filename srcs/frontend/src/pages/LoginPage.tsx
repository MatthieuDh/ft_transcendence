import { Link as RouterLink } from 'react-router-dom';
import { Flex, Box, Heading, Text, Stack } from '@chakra-ui/react';
import { useLogin } from '../hooks/useLogin';
import LoginForm from '../components/loginForm';
import SigmaLogo from '../components/logo';

export default function LoginPage() {
  const { login, error, isLoading } = useLogin();

  return (
    <Flex 
      minH="100vh" 
      align="center" 
      justify="center" 
      bg="gray.50" 
      _dark={{ bg: "gray.900" }} 
      p={4} 
      position="relative"
    >
      
      <Box position="absolute" top={6} left={6}>
        <SigmaLogo height="48px" />
      </Box>

      <Box 
        w="full" 
        maxW="md" 
        bg="white" 
        _dark={{ bg: "gray.800", borderWidth: "1px", borderColor: "gray.700", boxShadow: "none" }}
        p={8} 
        borderRadius="xl" 
        boxShadow="lg"
      >
        <Stack gap={6}>
          
          <Box textAlign="center">
            <Heading fontSize="3xl" mb={2} color="gray.800" _dark={{ color: "white" }}>
              Sign In
            </Heading>
            <Text color="gray.500" _dark={{ color: "gray.400" }} fontSize="md">
              Welcome to Sigma. The ultimate task management system.
            </Text>
          </Box>

          <LoginForm onSubmit={login} error={error} isLoading={isLoading} />

          <Text textAlign="center" fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            Don't have an account yet?{' '}
            <RouterLink 
              to="/register" 
              style={{ 
                color: '#9f7aea', 
                fontWeight: 'bold', 
                textDecoration: 'none' 
              }}
            >
              Sign up here
            </RouterLink>
          </Text>

        </Stack>
      </Box>

    </Flex>
  );
}