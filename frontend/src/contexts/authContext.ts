import { createContext } from "react";

type AuthUser = {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
};

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null as AuthUser | null,
  setUser: (_user: AuthUser | null) => {},
  setIsAuthenticated: (value: boolean) => {},
  logout: () => {},
});
