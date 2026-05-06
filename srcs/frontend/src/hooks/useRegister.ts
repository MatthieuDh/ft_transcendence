import { useState } from "react";
import { authService, userService } from "../api/services";

export function useRegister() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      await userService.create({ username, email, password });
      const response = await authService.login(username, password);
      localStorage.setItem('access_token', response.data.access_token);
      window.location.href = '/';
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;

      if (Array.isArray(backendMessage)) {
        setError(backendMessage.join(' | '));
      } else if (typeof backendMessage === 'string') {
        setError(backendMessage);
      } else {
        setError('Registration failed. Username or email might be taken.');
      }
      
      console.error("🔥 Error van de backend:", err.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return { register, error, isLoading };
};