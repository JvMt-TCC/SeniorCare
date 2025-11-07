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
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    data_nascimento: "",
    problemas_saude: [] as string[],
    gostos_lazer: [] as string[],
    userType: "idoso" as "idoso" | "voluntario"
  });
  const [loadingCep, setLoadingCep] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.nome || !formData.username || !formData.email || !formData.password || !formData.cep || !formData.numero) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios (nome, usuário, email, senha, CEP e número).",
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

    // Validação de CEP
    const cepNumeros = formData.cep.replace(/\D/g, '');
    if (cepNumeros.length !== 8) {
      toast({
        title: "Erro",
        description: "O CEP deve conter exatamente 8 dígitos.",
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
    
    // Buscar coordenadas do endereço completo
    const enderecoCompleto = `${formData.logradouro}, ${formData.numero}, ${formData.bairro}, ${formData.cidade}, ${formData.estado}, Brasil`;
    let latitude, longitude;
    
    try {
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}&limit=1`
      );
      const geoData = await geoResponse.json();
      if (geoData && geoData[0]) {
        latitude = geoData[0].lat;
        longitude = geoData[0].lon;
      }
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error);
    }

    const enderecoFormatado = `${formData.logradouro}, ${formData.numero}${formData.complemento ? `, ${formData.complemento}` : ''} - ${formData.bairro}, ${formData.cidade}/${formData.estado} - CEP: ${formData.cep}`;
    
    const { error } = await signup({
      nome: formData.nome,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      telefone: formData.telefone || undefined,
      endereco: enderecoFormatado,
      cep: formData.cep,
      logradouro: formData.logradouro,
      numero: formData.numero,
      complemento: formData.complemento || undefined,
      bairro: formData.bairro,
      cidade: formData.cidade,
      estado: formData.estado,
      latitude: latitude || undefined,
      longitude: longitude || undefined,
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

  const handleCepChange = async (cep: string) => {
    const cepNumeros = cep.replace(/\D/g, '');
    setFormData({ ...formData, cep: cepNumeros });

    if (cepNumeros.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          }));
          toast({
            title: "CEP encontrado!",
            description: "Endereço preenchido automaticamente.",
          });
        } else {
          toast({
            title: "CEP não encontrado",
            description: "Por favor, verifique o CEP digitado.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Erro ao buscar CEP",
          description: "Não foi possível buscar o endereço. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoadingCep(false);
      }
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

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">CEP *</label>
                  <Input
                    type="text"
                    value={formData.cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                    placeholder="00000-000"
                    className="text-senior-base"
                    maxLength={9}
                    required
                  />
                  {loadingCep && (
                    <p className="text-xs text-muted-foreground mt-1">Buscando endereço...</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Logradouro</label>
                    <Input
                      type="text"
                      value={formData.logradouro}
                      onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                      placeholder="Rua/Avenida"
                      className="text-senior-base"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Número *</label>
                    <Input
                      type="text"
                      value={formData.numero}
                      onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                      placeholder="Nº"
                      className="text-senior-base"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Complemento</label>
                    <Input
                      type="text"
                      value={formData.complemento}
                      onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                      placeholder="Apto, Bloco, etc."
                      className="text-senior-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bairro</label>
                    <Input
                      type="text"
                      value={formData.bairro}
                      onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                      placeholder="Bairro"
                      className="text-senior-base"
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Cidade</label>
                    <Input
                      type="text"
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                      placeholder="Cidade"
                      className="text-senior-base"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Estado</label>
                    <Input
                      type="text"
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      placeholder="UF"
                      className="text-senior-base"
                      maxLength={2}
                      readOnly
                    />
                  </div>
                </div>
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