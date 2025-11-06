import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "@/hooks/use-toast";
import Logo from "../images/SeniorCareLogo.png";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await login(formData.username, formData.password);
    
    if (error) {
      toast({
        title: "Erro no login",
        description: error,
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft via-background to-secondary flex items-center justify-center p-0 w-full">
      <div className="w-full max-w-md px-4">
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center space-y-4">
            {/* TROCAR LOGO: Substitua a div abaixo por uma tag <img> com src do logo */}
            <div className="flex justify-center">
              <div className="w-28 h-28 rounded-full border-4 border-pink-500 overflow-hidden">
                <img
                  src={Logo}
                  alt="Logo SeniorCare"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <CardTitle className="text-senior-xl text-primary">
              Bem-vindo ao SeniorCare!
            </CardTitle>
            <p className="text-muted-foreground">
              Entre com suas informações para continuar
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Usuário</label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="Digite seu nome de usuário"
                  className="text-senior-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Senha</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Digite sua senha"
                    className="text-senior-base pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full btn-primary text-senior-base"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full text-senior-base"
                onClick={() => navigate("/cadastro")}
              >
                Criar nova conta
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
