import { useState } from "react";
import { authService, userService } from "../api/services";

/*export function useRegister() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const register = async(username: string, email: string, password: string) =>
    {
            setIsLoading(true);
            setError('');
    try {
        await userService.create({ username, email, password});
        const response = await authService.login(username, password);
        localStorage.setItem('acces_token', response.data.access_token);
        }
    catch (err: any)
    {
        setError(err.response?.data?.message || 'Registration failed. Username or email might be taken.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { register, error, isLoading };
}*/

export function useRegister() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      // 1. Maak de gebruiker aan
      await userService.create({ username, email, password });
      
      // 2. Log de gebruiker direct in
      const response = await authService.login(username, password);
      
      // 3. Sla de token op (typfoutje gefixt naar 'access_token')
      localStorage.setItem('access_token', response.data.access_token);
      
    } catch (err: any) {
      // De slimme error-afhandeling zodat je precies ziet wat er fout gaat!
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