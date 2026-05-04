import { Button, Input, Stack, Text } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { PasswordInput } from "./ui/password-input"
import { Field } from "./ui/field"

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
  error?: string;
  isLoading: boolean;
}

interface FormValues {
  username: string
  password: string
}

export default function LoginForm({ onSubmit, error, isLoading }: LoginFormProps) {
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
            focusRingColor="purple.300"
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
        >
          Login
        </Button>
      </Stack>
    </form>
  )
}
