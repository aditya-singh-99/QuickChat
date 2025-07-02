import { createContext, useEffect, useState } from "react";
import type { User } from "../types/User";
import { useNavigate } from "react-router";
import { fetchMe } from "../services/authService";

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const authInit = async () => {
      const token = localStorage.getItem("JWTtoken");
      if (token) {
        try {
          const fetchedUser = await fetchMe();
          login(fetchedUser, token);
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    }
    authInit();
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem("JWTtoken", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("JWTtoken");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext>
  );
};

export default AuthProvider;