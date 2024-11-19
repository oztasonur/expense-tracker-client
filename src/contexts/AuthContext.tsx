import { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
  token: string | null;
  username: string | null;
  setAuth: (token: string | null, username: string | null) => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('jwt_token');
  });
  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem('username');
  });

  const isAuthenticated = !!token;

  const setAuth = (newToken: string | null, newUsername: string | null) => {
    setToken(newToken);
    setUsername(newUsername);
  };

  useEffect(() => {
    if (token && username) {
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('username');
    }
  }, [token, username]);

  return (
    <AuthContext.Provider value={{ token, username, setAuth, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 