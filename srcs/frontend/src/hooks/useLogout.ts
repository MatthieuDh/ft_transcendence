// useLogout.ts (of .js)

import { useNavigate } from 'react-router-dom';

export function useLogout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');   
  };
  return { logout };
}