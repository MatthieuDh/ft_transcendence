import { Link as RouterLink } from 'react-router-dom';
import { Flex, Box, Heading, Text, Stack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useLogin } from '../hooks/useLogin';
import LoginForm from '../components/loginForm';
import PublicNavbar from '../components/PublicNavbar';

export default function LoginPage() {
  const { login, loginWithGoogle, error, isLoading } = useLogin();

  return (
    <Box minH="100vh" bg="#0a0a0f">
      <PublicNavbar />

      <Flex minH="calc(100vh - 72px)" align="center" justify="center" p={4} position="relative">

        {/* subtle purple orb */}
        <Box position="absolute" top={-40} right={-40} w="360px" h="360px" pointerEvents="none" style={{ filter: 'blur(80px)', opacity: 0.35 }}>
          <Box w="full" h="full" borderRadius="full" bg="radial-gradient(circle at 30% 30%, rgba(168,85,247,0.18), rgba(168,85,247,0.06) 40%, transparent 60%)" />
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
                  Welcome back
                </Heading>
                <Text color="gray.500" fontSize="md">
                  Sign in to continue to Sigma
                </Text>
              </Box>

              <LoginForm
                onSubmit={login}
                onGoogleLogin={loginWithGoogle}
                error={error}
                isLoading={isLoading}
              />

              <Text textAlign="center" fontSize="sm" color="gray.400">
                Don't have an account yet?{' '}
                <RouterLink
                  to="/register"
                  style={{
                    color: 'purple.400',
                    fontWeight: 'bold',
                    textDecoration: 'none'
                  }}
                >
                  Sign up here
                </RouterLink>
              </Text>

            </Stack>
          </Box>
        </motion.div>

      </Flex>
    </Box>
  );
}
