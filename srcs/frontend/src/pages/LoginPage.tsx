import { Link as RouterLink } from 'react-router-dom'
import { Flex, Box, Heading, Text, Stack, Input, Button } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useLogin } from '../hooks/useLogin'
import { PasswordInput } from '../components/ui/password-input'
import { Field } from '../components/ui/field'
import SigmaLogo from '../components/logo'

interface FormValues { username: string; password: string }

export default function LoginPage() {
  const { login, error, isLoading } = useLogin()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" _dark={{ bg: "gray.900" }} p={4} position="relative">
      <Box position="absolute" top={6} left={6}><SigmaLogo height="40px" /></Box>

      <Box w="full" maxW="md" bg="white" _dark={{ bg: "gray.800", borderWidth: "1px", borderColor: "gray.700" }} p={8} borderRadius="xl" boxShadow="lg">
        <Stack gap={6}>
          <Box textAlign="center">
            <Heading fontSize="3xl" mb={2}>Inloggen</Heading>
            <Text color="gray.500" fontSize="md">Welkom bij Sigma. Het ultieme taakbeheersysteem.</Text>
          </Box>

          <form onSubmit={handleSubmit((d) => login(d.username, d.password))} style={{ width: '100%' }}>
            <Stack gap={4}>
              {error && <Text color="red.500" fontWeight="bold" textAlign="center" fontSize="sm">{error}</Text>}

              <Field label="Gebruikersnaam" invalid={!!errors.username} errorText={errors.username?.message}>
                <Input {...register('username', { required: 'Verplicht' })} size="lg" />
              </Field>

              <Field label="Wachtwoord" invalid={!!errors.password} errorText={errors.password?.message}>
                <PasswordInput {...register('password', { required: 'Verplicht' })} size="lg" />
              </Field>

              <Button type="submit" loading={isLoading} colorPalette="purple" size="lg" width="full">
                Inloggen
              </Button>

              <Box position="relative" textAlign="center" py={2}>
                <Box position="absolute" top="50%" left={0} right={0} h="1px" bg="gray.200" _dark={{ bg: "gray.700" }} />
                <Text position="relative" display="inline-block" px={3} bg="white" _dark={{ bg: "gray.800" }} color="gray.500" fontSize="sm">of</Text>
              </Box>

              <Button
                type="button"
                variant="outline"
                size="lg"
                width="full"
                onClick={() => { window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google` }}
              >
                <GoogleIcon /> Inloggen met Google
              </Button>
            </Stack>
          </form>

          <Text textAlign="center" fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            Nog geen account?{' '}
            <RouterLink to="/register" style={{ color: '#9f7aea', fontWeight: 'bold', textDecoration: 'none' }}>
              Registreer hier
            </RouterLink>
          </Text>
        </Stack>
      </Box>
    </Flex>
  )
}

function GoogleIcon() {
  return (
    <svg style={{ marginRight: 8, height: 18, width: 18 }} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}
