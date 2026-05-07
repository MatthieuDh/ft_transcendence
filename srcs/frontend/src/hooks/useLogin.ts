import { useState, useEffect } from "react";
import { authService } from "../api/services";

export function useLogin() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');

    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      window.location.href = '/';
    }
  }, []);


  const login = async(username:string, password: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authService.login(username, password);
      localStorage.setItem('access_token', response.data.access_token);
      window.location.href = '/';
    } catch (err) {
      setError('login failed please check your credentials');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const loginWithGoogle = () => {
    authService.googleLogin();
  };

  return { login, loginWithGoogle, error, isLoading }
}