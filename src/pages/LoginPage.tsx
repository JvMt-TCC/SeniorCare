import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import Logo from "../images/Logo.jpg"; // Substitua pelo caminho correto do logo

const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.password) {
      login(formData);
    }
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
                <label className="block text-sm font-medium mb-2">Nome</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Digite seu nome"
                  className="text-senior-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Digite seu email"
                  className="text-senior-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Senha</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Digite sua senha"
                  className="text-senior-base"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full btn-primary text-senior-base"
              >
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
