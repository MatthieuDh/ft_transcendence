import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flex, Text } from '@chakra-ui/react'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      localStorage.setItem('access_token', token)
      navigate('/dashboard', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Text color="gray.500">Inloggen via Google...</Text>
    </Flex>
  )
}
