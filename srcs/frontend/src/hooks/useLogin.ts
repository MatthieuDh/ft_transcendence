import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../api/services'

export function useLogin() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    setError('')
    try {
      const response = await authService.login(username, password)
      localStorage.setItem('access_token', response.data.access_token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Inloggen mislukt. Controleer je gegevens.')
    } finally {
      setIsLoading(false)
    }
  }

  return { login, error, isLoading }
}
