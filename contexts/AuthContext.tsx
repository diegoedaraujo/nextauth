import { createContext, ReactNode, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../services/api";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};
type SigInCredentials = {
  email: string;
  password: string;
};
type AuthContextData = {
  sigIn(credentials: SigInCredentials): Promise<void>;
  user: User | undefined;
  isAuthenticated: boolean;
};
type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  async function sigIn({ email, password }: SigInCredentials) {
    try {
      const response = await api.post("sessions", { email, password });
      const { permissions, roles } = response.data;
      setUser({ email, permissions, roles });
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <AuthContext.Provider value={{ sigIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
