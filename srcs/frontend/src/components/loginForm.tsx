import { Button, Input, Stack, Text, HStack, Box } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { PasswordInput } from "./ui/password-input"
import { Field } from "./ui/field"
import { FaGoogle } from "react-icons/fa"

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
  onGoogleLogin: () => void;
  error?: string;
  isLoading: boolean;
}

interface FormValues {
  username: string
  password: string
}

export default function LoginForm({ onSubmit, onGoogleLogin, error, isLoading }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const submitHandler = handleSubmit((data) => {
    onSubmit(data.username, data.password);
  });

  return (
    <form onSubmit={submitHandler} style={{ width: '100%' }}>
      <Stack gap="4" align="stretch">

        {error && (
          <Text color="red.500" fontWeight="bold" textAlign="center" fontSize="sm">
            {error}
          </Text>
        )}

        <Field
          label="Username"
          invalid={!!errors.username}
          errorText={errors.username?.message}
        >
          <Input
            {...register("username", { required: "Username is required" })}
            focusRingColor="purple.500"
            bg="rgba(255,255,255,0.08)"
            border="1px solid rgba(255,255,255,0.15)"
            _hover={{ borderColor: "rgba(255,255,255,0.25)" }}
            _focus={{ borderColor: "purple.400", bg: "rgba(255,255,255,0.1)" }}
            color="white"
            _placeholder={{ color: 'gray.500' }}
            size="lg"
          />
        </Field>

        <Field
          label="Password"
          invalid={!!errors.password}
          errorText={errors.password?.message}
        >
          <PasswordInput
            {...register("password", { required: "Password is required" })}
            focusRingColor="purple.500"
            bg="rgba(255,255,255,0.08)"
            border="1px solid rgba(255,255,255,0.15)"
            _hover={{ borderColor: "rgba(255,255,255,0.25)" }}
            _focus={{ borderColor: "purple.400", bg: "rgba(255,255,255,0.1)" }}
            color="white"
            _placeholder={{ color: 'gray.500' }}
            size="lg"
          />
        </Field>

        <Button
          type="submit"
          loading={isLoading}
          colorPalette="purple"
          size="lg"
          mt={2}
          width="full"
          bg="purple.600"
          _hover={{ bg: 'purple.500', boxShadow: '0 8px 30px rgba(168,85,247,0.12)' }}
          borderRadius="lg"
        >
          Login
        </Button>

        <HStack w="full" my={2}>
          <Box flex="1" h="1px" bg="gray.200" _dark={{ bg: "gray.700" }} />
          <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">Or log in with</Text>
          <Box flex="1" h="1px" bg="gray.200" _dark={{ bg: "gray.700" }} />
        </HStack>

        <Button
          type="button"
          w="full"
          variant="outline"
          onClick={onGoogleLogin}
          display="flex"
          gap={2}
          size="lg"
          bg="rgba(255,255,255,0.03)"
          color="white"
          borderColor="rgba(255,255,255,0.1)"
        >
          <FaGoogle />
          Google
        </Button>

      </Stack>
    </form>
  )
}
