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
import { Checkbox } from "../components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import Logo from "../images/SeniorCareLogo.png";

const problemasSaudeOptions = [
  "Nenhum problema de saúde",
  "Hipertensão",
  "Diabetes",
  "Artrite/Artrose", 
  "Problemas cardíacos",
  "Dores nas costas",
  "Osteoporose",
  "Depressão/Ansiedade",
  "Problemas de visão",
  "Problemas auditivos",
  "Outro"
];

const gostosLazerOptions = [
  "Leitura",
  "Filmes/TV",
  "Música",
  "Dança",
  "Caminhada",
  "Jardinagem",
  "Culinária",
  "Jogos",
  "Artesanato",
  "Viagens",
  "Esportes",
  "Teatro",
  "Fotografia"
];

const CadastroPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefone: "",
    endereco: "",
    data_nascimento: "",
    problemas_saude: [] as string[],
    gostos_lazer: [] as string[],
    userType: "idoso" as "idoso" | "voluntario"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.nome || !formData.username || !formData.email || !formData.password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Validação de username
    if (formData.username.length < 3 || formData.username.length > 30) {
      toast({
        title: "Erro",
        description: "O nome de usuário deve ter entre 3 e 30 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      toast({
        title: "Erro",
        description: "O nome de usuário deve conter apenas letras, números, underscore ou hífen.",
        variant: "destructive",
      });
      return;
    }

    // Validação de comprimento dos campos
    if (formData.nome.length > 100) {
      toast({
        title: "Erro",
        description: "O nome deve ter no máximo 100 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (formData.email.length > 255) {
      toast({
        title: "Erro",
        description: "O email deve ter no máximo 255 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (formData.endereco && formData.endereco.length > 200) {
      toast({
        title: "Erro",
        description: "O endereço deve ter no máximo 200 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erro", 
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    // Validação de telefone
    if (formData.telefone) {
      const telefoneNumeros = formData.telefone.replace(/\D/g, '');
      if (telefoneNumeros.length !== 11) {
        toast({
          title: "Erro",
          description: "O telefone deve conter exatamente 11 dígitos.",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    
    const { error } = await signup({
      nome: formData.nome,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      telefone: formData.telefone || undefined,
      endereco: formData.endereco || undefined,
      data_nascimento: formData.data_nascimento || undefined,
      problemas_saude: formData.problemas_saude,
      gostos_lazer: formData.gostos_lazer,
      user_type: formData.userType
    });
    
    if (error) {
      toast({
        title: "Erro no cadastro",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Cadastro realizado!",
        description: "Sua conta foi criada com sucesso.",
      });
      navigate("/");
    }
    
    setLoading(false);
  };

  const handleProblemasSaudeChange = (problema: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        problemas_saude: [...formData.problemas_saude, problema]
      });
    } else {
      setFormData({
        ...formData,
        problemas_saude: formData.problemas_saude.filter(p => p !== problema)
      });
    }
  };

  const handleGostosLazerChange = (gosto: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        gostos_lazer: [...formData.gostos_lazer, gosto]
      });
    } else {
      setFormData({
        ...formData,
        gostos_lazer: formData.gostos_lazer.filter(g => g !== gosto)
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft via-background to-secondary flex items-center justify-center p-4 w-full">
      <div className="w-full max-w-2xl">
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center space-y-4">
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
              Criar Nova Conta
            </CardTitle>
            <p className="text-muted-foreground">
              Preencha suas informações para criar sua conta
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome *</label>
                <Input
                  type="text"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Digite seu nome completo"
                  className="text-senior-base"
                  maxLength={100}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome de Usuário *</label>
                  <Input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })
                    }
                    placeholder="nomedeusuario"
                    className="text-senior-base"
                    maxLength={30}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    3-30 caracteres: letras, números, _ ou -
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Digite seu email"
                    className="text-senior-base"
                    maxLength={255}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Senha *</label>
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
                <div>
                  <label className="block text-sm font-medium mb-2">Confirmar Senha *</label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    placeholder="Confirme sua senha"
                    className="text-senior-base"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Telefone (11 dígitos)</label>
                  <Input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 11) {
                        const formatted = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
                        setFormData({ ...formData, telefone: value.length <= 2 ? value : formatted });
                      }
                    }}
                    placeholder="(00) 00000-0000"
                    className="text-senior-base"
                    maxLength={15}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Data de Nascimento</label>
                  <Input
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) =>
                      setFormData({ ...formData, data_nascimento: e.target.value })
                    }
                    className="text-senior-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Tipo de Usuário *</label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setFormData({ ...formData, userType: 'idoso' })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.userType === 'idoso'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">👴</div>
                      <p className="font-semibold">Idoso</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Participar de eventos e atividades
                      </p>
                    </div>
                  </div>
                  <div
                    onClick={() => setFormData({ ...formData, userType: 'voluntario' })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.userType === 'voluntario'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">🤝</div>
                      <p className="font-semibold">Voluntário</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ajudar na organização de eventos
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Endereço</label>
                <Input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) =>
                    setFormData({ ...formData, endereco: e.target.value })
                  }
                  placeholder="Digite seu endereço completo"
                  className="text-senior-base"
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Problemas de Saúde</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {problemasSaudeOptions.map((problema) => (
                    <div key={problema} className="flex items-center space-x-2">
                      <Checkbox
                        id={`problema-${problema}`}
                        checked={formData.problemas_saude.includes(problema)}
                        onCheckedChange={(checked) =>
                          handleProblemasSaudeChange(problema, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`problema-${problema}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {problema}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Gostos de Lazer</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {gostosLazerOptions.map((gosto) => (
                    <div key={gosto} className="flex items-center space-x-2">
                      <Checkbox
                        id={`gosto-${gosto}`}
                        checked={formData.gostos_lazer.includes(gosto)}
                        onCheckedChange={(checked) =>
                          handleGostosLazerChange(gosto, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`gosto-${gosto}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {gosto}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  type="submit"
                  className="w-full btn-primary text-senior-base"
                  disabled={loading}
                >
                  {loading ? "Criando conta..." : "Criar Conta"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-senior-base"
                  onClick={() => navigate("/")}
                >
                  Já tem uma conta? Entrar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroPage;