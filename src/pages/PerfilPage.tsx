import { User, Mail, Phone, MapPin, Calendar, Edit, Camera } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EditProfileDialog from "../components/EditProfileDialog";
import EditPhoneDialog from "../components/EditPhoneDialog";
import ChangePasswordDialog from "../components/ChangePasswordDialog";

const PerfilPage = () => {
  const { user, logout, updateProfileImage } = useAuth();
  const navigate = useNavigate();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditPhoneOpen, setIsEditPhoneOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  
  const userInfo = {
    name: user?.name || "Usuário",
    email: user?.email || "usuario@email.com",
    phone: user?.phone || "(21) 99999-9999",
    birthDate: "15/03/1960",
    address: "Niterói, Rio de Janeiro",
    joined: "Janeiro 2024"
  };

  const stats = [
    { label: "Eventos Participados", value: "12" },
    { label: "Amigos", value: "25" },
    { label: "Tarefas Concluídas", value: "48" }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        updateProfileImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="space-y-6 fade-in">
      <div className="text-center pt-4">
        <h1 className="text-senior-xl text-primary mb-2">Meu Perfil</h1>
        <p className="text-muted-foreground">Suas informações pessoais</p>
      </div>

      {/* Foto e informações principais */}
      <div className="card-soft text-center slide-up">
        <div className="relative w-24 h-24 mx-auto mb-4">
          {/* TROCAR IMAGEM DE PERFIL: A imagem do usuário já é mostrada aqui quando uploadada */}
          {user?.profileImage ? (
            <img 
              src={user.profileImage} 
              alt="Foto de perfil" 
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-primary-soft rounded-full flex items-center justify-center">
              <User size={48} className="text-primary" />
            </div>
          )}
        </div>
        <h2 className="text-senior-xl text-primary mb-2">{userInfo.name}</h2>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-3 slide-up">
        {stats.map((stat, index) => (
          <div key={index} className="card-soft text-center">
            <p className="text-2xl font-bold text-primary mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Informações de contato */}
      <div className="card-soft slide-up">
        <h3 className="text-senior-lg text-primary mb-4">Informações de Contato</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <Mail size={20} className="mr-3 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{userInfo.email}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Phone size={20} className="mr-3 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-medium">{userInfo.phone}</p>
            </div>
          </div>

          <div className="flex items-center">
            <MapPin size={20} className="mr-3 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Localização</p>
              <p className="font-medium">{userInfo.address}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Calendar size={20} className="mr-3 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Data de Nascimento</p>
              <p className="font-medium">{userInfo.birthDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Configurações */}
      <div className="card-soft slide-up">
        <h3 className="text-senior-lg text-primary mb-4">Configurações</h3>
        <div className="space-y-3">
          <button 
            onClick={() => setIsEditProfileOpen(true)}
            className="w-full text-left p-3 rounded-xl bg-secondary hover:bg-primary-soft transition-colors"
          >
            <span className="font-medium">Editar Informações Pessoais</span>
          </button>
          <button 
            onClick={() => setIsEditPhoneOpen(true)}
            className="w-full text-left p-3 rounded-xl bg-secondary hover:bg-primary-soft transition-colors"
          >
            <span className="font-medium">Editar Telefone</span>
          </button>
          <button 
            onClick={() => setIsChangePasswordOpen(true)}
            className="w-full text-left p-3 rounded-xl bg-secondary hover:bg-primary-soft transition-colors"
          >
            <span className="font-medium">Alterar Senha</span>
          </button>
          <button className="w-full text-left p-3 rounded-xl bg-secondary hover:bg-primary-soft transition-colors">
            <span className="font-medium">Configurações de Notificação</span>
          </button>
          <button 
            onClick={() => navigate("/privacy-terms")}
            className="w-full text-left p-3 rounded-xl bg-secondary hover:bg-primary-soft transition-colors"
          >
            <span className="font-medium">Privacidade</span>
          </button>
        </div>
      </div>

      {/* Sobre o App */}
      <div className="card-soft slide-up">
        <h3 className="text-senior-lg text-primary mb-4">Sobre</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Membro desde {userInfo.joined}. Este aplicativo foi criado especialmente para conectar pessoas 
          da melhor idade, facilitando a organização de atividades e o fortalecimento de amizades.
        </p>
      </div>

      <div className="pb-4">
        <button 
          onClick={handleLogout}
          className="w-full py-3 border border-destructive text-destructive rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          Sair da Conta
        </button>
      </div>

      <EditProfileDialog 
        isOpen={isEditProfileOpen} 
        onOpenChange={setIsEditProfileOpen} 
      />

      <EditPhoneDialog 
        isOpen={isEditPhoneOpen} 
        onOpenChange={setIsEditPhoneOpen} 
      />
      
      <ChangePasswordDialog 
        isOpen={isChangePasswordOpen} 
        onOpenChange={setIsChangePasswordOpen} 
      />
    </div>
  );
};

export default PerfilPage;