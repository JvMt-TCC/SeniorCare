import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User & { password: string }) => void;
  logout: () => void;
  updateProfile: (userData: { name?: string; email?: string; phone?: string }) => void;
  updateProfileImage: (imageUrl: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User & { password: string }) => {
    // Login fictício - aceita qualquer credencial
    setUser({ name: userData.name, email: userData.email });
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (userData: { name?: string; email?: string; phone?: string }) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const updateProfileImage = (imageUrl: string) => {
    if (user) {
      setUser({ ...user, profileImage: imageUrl });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      updateProfile,
      updateProfileImage,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};