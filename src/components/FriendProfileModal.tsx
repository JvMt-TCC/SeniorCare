import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, User, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FriendProfile {
  id: string;
  nome: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  data_nascimento: string | null;
}

interface FriendProfileModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  friend: FriendProfile | null;
}

const FriendProfileModal = ({ isOpen, onOpenChange, friend }: FriendProfileModalProps) => {
  const navigate = useNavigate();

  if (!friend) return null;

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(friend.data_nascimento);

  const handleSendMessage = () => {
    onOpenChange(false);
    navigate(`/mensagens?userId=${friend.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Perfil do Amigo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={friend.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">
                {friend.nome?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold">{friend.nome}</h3>
              <p className="text-muted-foreground">@{friend.username}</p>
            </div>
          </div>

          {friend.bio && (
            <div className="bg-secondary/50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium mb-1">Biografia</p>
                  <p className="text-sm text-muted-foreground">{friend.bio}</p>
                </div>
              </div>
            </div>
          )}

          {age && (
            <div className="bg-secondary/50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Idade</p>
                  <p className="text-sm text-muted-foreground">{age} anos</p>
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={handleSendMessage}
            className="w-full"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Enviar Mensagem
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FriendProfileModal;
