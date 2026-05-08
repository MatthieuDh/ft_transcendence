import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../../../../shared/srcs/types/user";
import { userService } from "../api/services";

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  setCurrentUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token){
      setIsLoading(false);
      return;
    }

    userService.getMe()
      .then(response => setCurrentUser(response.data))
      .catch(() => setCurrentUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}