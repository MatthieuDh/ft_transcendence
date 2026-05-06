import { Link as RouterLink } from 'react-router-dom';
import { Flex, Box, Heading, Text, Stack } from '@chakra-ui/react';
import { useRegister } from '../hooks/useRegister';
import RegisterForm from '../components/registerForm';
import SigmaLogo from '../components/logo';

export default function RegisterPage() {
  const { register, error, isLoading } = useRegister();

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
              Create an Account
            </Heading>
            <Text color="gray.500" _dark={{ color: "gray.400" }} fontSize="md">
              Please enter your details to set up your workspace.
            </Text>
          </Box>

          <RegisterForm onSubmit={register} error={error} isLoading={isLoading} />

          <Text textAlign="center" fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            Already have an account?{' '}
            <RouterLink 
              to="/login" 
              style={{ 
                color: '#9f7aea', 
                fontWeight: 'bold', 
                textDecoration: 'none' 
              }}
            >
              Log in here
            </RouterLink>
          </Text>

        </Stack>
      </Box>

    </Flex>
  );
}