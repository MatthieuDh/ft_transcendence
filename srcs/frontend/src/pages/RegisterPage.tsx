import { Link as RouterLink } from 'react-router-dom';
import { Flex, Box, Heading, Text, Stack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useRegister } from '../hooks/useRegister';
import RegisterForm from '../components/registerForm';
import PublicNavbar from '../components/PublicNavbar';

export default function RegisterPage() {
  const { register, error, isLoading } = useRegister();

  return (
    <Box minH="100vh" bg="#0a0a0f" overflow="hidden">
      <PublicNavbar />

      <Flex h="calc(100vh - 72px)" align="center" justify="center" p={4} position="relative" overflowY="auto">

        <Box position="absolute" bottom={-40} left={-40} w="360px" h="360px" pointerEvents="none" style={{ filter: 'blur(80px)', opacity: 0.28 }}>
          <Box w="full" h="full" borderRadius="full" bg="radial-gradient(circle at 70% 70%, rgba(168,85,247,0.16), rgba(168,85,247,0.04) 40%, transparent 60%)" />
        </Box>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: '480px' }}>
          <Box
            w="full"
            bg="rgba(255,255,255,0.03)"
            border="1px solid rgba(255,255,255,0.08)"
            backdropFilter="blur(10px)"
            p={8}
            borderRadius="xl"
            boxShadow="0 0 40px rgba(168,85,247,0.08)"
          >
            <Stack gap={6}>

              <Box textAlign="center">
                <Heading fontSize="xl" mb={2} color="white">
                  Create your account
                </Heading>
                <Text color="gray.500" fontSize="md">
                  Please enter your details to set up your workspace.
                </Text>
              </Box>

              <RegisterForm onSubmit={register} error={error} isLoading={isLoading} />

              <Text textAlign="center" fontSize="sm" color="gray.400">
                Already have an account?{' '}
                <RouterLink
                  to="/login"
                  style={{
                    color: 'purple.400',
                    fontWeight: 'bold',
                    textDecoration: 'none'
                  }}
                >
                  Log in here
                </RouterLink>
              </Text>

            </Stack>
          </Box>
        </motion.div>

      </Flex>
    </Box>
  );
}
