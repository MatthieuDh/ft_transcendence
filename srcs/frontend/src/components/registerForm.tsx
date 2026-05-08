import { Button, Input, Stack, Text } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { PasswordInput } from "./ui/password-input"
import { Field } from "./ui/field"

interface RegisterFormProps {
  onSubmit: (username: string, email: string, password: string) => void;
  error?: string;
  isLoading: boolean;
}

interface FormValues {
  username: string
  email: string
  password: string
}

export default function RegisterForm({ onSubmit, error, isLoading }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const submitHandler = handleSubmit((data) => {
    onSubmit(data.username, data.email, data.password);
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
          label="Email"
          invalid={!!errors.email}
          errorText={errors.email?.message}
        >
          <Input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
            })}
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
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters long" }
            })}
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
          Sign Up
        </Button>

      </Stack>
    </form>
  )
}
