import { Link as RouterLink } from 'react-router-dom'
import { Flex, Box, Heading, Text, Stack, Input, Button } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useRegister } from '../hooks/useRegister'
import { PasswordInput } from '../components/ui/password-input'
import { Field } from '../components/ui/field'
import SigmaLogo from '../components/logo'

interface FormValues { username: string; email: string; password: string }

export default function RegisterPage() {
  const { register: doRegister, error, isLoading } = useRegister()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

  return (
    <Flex minH="100vh" bg="gray.50" _dark={{ bg: "gray.950" }}>
      <Box
        display={{ base: 'none', lg: 'flex' }}
        w="45%"
        bgGradient="to-br"
        gradientFrom="purple.600"
        gradientTo="blue.700"
        position="relative"
        overflow="hidden"
        flexDirection="column"
        justifyContent="space-between"
        p={12}
      >
        <Box position="absolute" top="-60px" right="-60px" w="300px" h="300px" borderRadius="full" bg="whiteAlpha.100" />
        <Box position="absolute" bottom="-80px" left="-80px" w="400px" h="400px" borderRadius="full" bg="whiteAlpha.100" />

        <Box position="relative">
          <SigmaLogo height="36px" />
        </Box>

        <Box position="relative">
          <Heading color="white" size="2xl" mb={4} lineHeight="1.2">
            Begin vandaag nog met Sigma
          </Heading>
          <Text color="whiteAlpha.800" fontSize="lg">
            Maak een account aan en ga meteen aan de slag met je eerste project.
          </Text>
        </Box>
      </Box>

      <Flex flex={1} align="center" justify="center" p={8}>
        <Box w="full" maxW="400px">
          <Box display={{ base: 'block', lg: 'none' }} mb={8}>
            <SigmaLogo height="32px" />
          </Box>

          <Box mb={8}>
            <Heading fontSize="2xl" mb={2}>Account aanmaken</Heading>
            <Text color="gray.500" fontSize="sm">Maak je Sigma account aan en begin meteen</Text>
          </Box>

          <Box bg="white" _dark={{ bg: "gray.800", borderWidth: "1px", borderColor: "gray.700" }} p={8} borderRadius="2xl" boxShadow="sm">
            <form onSubmit={handleSubmit((d) => doRegister(d.username, d.email, d.password))} style={{ width: '100%' }}>
              <Stack gap={4}>
                {error && (
                  <Box bg="red.50" _dark={{ bg: "red.900" }} border="1px solid" borderColor="red.200" borderRadius="lg" p={3}>
                    <Text color="red.600" _dark={{ color: "red.300" }} fontSize="sm" textAlign="center">{error}</Text>
                  </Box>
                )}

                <Field label="Gebruikersnaam" invalid={!!errors.username} errorText={errors.username?.message}>
                  <Input {...register('username', { required: 'Verplicht' })} placeholder="jouwgebruikersnaam" />
                </Field>

                <Field label="E-mailadres" invalid={!!errors.email} errorText={errors.email?.message}>
                  <Input {...register('email', { required: 'Verplicht' })} type="email" placeholder="jij@voorbeeld.be" />
                </Field>

                <Field label="Wachtwoord" invalid={!!errors.password} errorText={errors.password?.message}>
                  <PasswordInput {...register('password', { required: 'Verplicht', minLength: { value: 8, message: 'Minimaal 8 tekens' } })} placeholder="Minimaal 8 tekens" />
                </Field>

                <Button type="submit" loading={isLoading} colorPalette="purple" size="lg" width="full" mt={2}>
                  Account aanmaken
                </Button>

                <Box position="relative" textAlign="center" py={1}>
                  <Box position="absolute" top="50%" left={0} right={0} h="1px" bg="gray.200" _dark={{ bg: "gray.700" }} />
                  <Text position="relative" display="inline-block" px={3} bg="white" _dark={{ bg: "gray.800" }} color="gray.400" fontSize="xs">OF</Text>
                </Box>

                <Button type="button" variant="outline" size="md" width="full" onClick={() => { window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google` }}>
                  <GoogleIcon /> Doorgaan met Google
                </Button>
              </Stack>
            </form>
          </Box>

          <Text textAlign="center" fontSize="sm" color="gray.500" mt={6}>
            Al een account?{' '}
            <RouterLink to="/login" style={{ color: '#9f7aea', fontWeight: '600', textDecoration: 'none' }}>Inloggen</RouterLink>
          </Text>
        </Box>
      </Flex>
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
