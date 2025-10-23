import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  data_nascimento?: string;
  problemas_saude?: string[];
  gostos_lazer?: string[];
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  login: (username: string, password: string) => Promise<{ error?: string }>;
  signup: (signupData: SignupData) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

interface SignupData {
  nome: string;
  username: string;
  email: string;
  password: string;
  telefone?: string;
  endereco?: string;
  data_nascimento?: string;
  problemas_saude?: string[];
  gostos_lazer?: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            await fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        // Convert Json arrays to string arrays safely
        const profile: Profile = {
          ...data,
          problemas_saude: Array.isArray(data.problemas_saude) 
            ? data.problemas_saude.filter((item): item is string => typeof item === 'string')
            : [],
          gostos_lazer: Array.isArray(data.gostos_lazer) 
            ? data.gostos_lazer.filter((item): item is string => typeof item === 'string')
            : []
        };
        setProfile(profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      // Primeiro, buscar o email associado ao username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username)
        .single();

      if (profileError || !profileData) {
        return { error: "Usuário não encontrado." };
      }

      // Depois, fazer login com o email encontrado
      const { data, error } = await supabase.auth.signInWithPassword({
        email: profileData.email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: "Erro inesperado ao fazer login" };
    }
  };

  const signup = async (signupData: SignupData) => {
    try {
      // Verificar se o username já existe
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', signupData.username)
        .maybeSingle();

      if (existingUser) {
        return { error: "Este nome de usuário já está em uso." };
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome: signupData.nome,
            username: signupData.username,
            telefone: signupData.telefone,
            endereco: signupData.endereco,
            data_nascimento: signupData.data_nascimento,
            problemas_saude: JSON.stringify(signupData.problemas_saude || []),
            gostos_lazer: JSON.stringify(signupData.gostos_lazer || [])
          }
        }
      });

      if (error) {
        return { error: error.message };
      }

      // If signup is successful and user is confirmed, create profile
      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar o cadastro.",
        });
      }

      return {};
    } catch (error) {
      return { error: "Erro inesperado ao criar conta" };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
      loading
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