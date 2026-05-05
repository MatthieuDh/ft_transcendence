import { useState } from "react";
import { authService } from "../api/services";

export function useLogin() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const login = async(username:string, password: string) => 
        {
            setIsLoading(true);
            setError('');
    try {
        const response = await authService.login(username, password);
        localStorage.setItem('access_token', response.data.access_token);

        window.location.href = '/';
    }
    catch (err) {
        setError('login failed please check your credentials');
        console.error(err);
        }
        finally {setIsLoading(false);}
    }
    return{ login, error, isLoading}
}