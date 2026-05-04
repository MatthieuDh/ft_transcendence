import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, userService } from '../api/services'

export function useRegister() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true)
    setError('')
    try {
      await userService.create({ username, email, password })
      const response = await authService.login(username, password)
      localStorage.setItem('access_token', response.data.access_token)
      navigate('/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.message
      if (Array.isArray(msg)) setError(msg.join(' | '))
      else if (typeof msg === 'string') setError(msg)
      else setError('Registratie mislukt. Gebruikersnaam of e-mail al in gebruik.')
    } finally {
      setIsLoading(false)
    }
  }

  return { register, error, isLoading }
}
