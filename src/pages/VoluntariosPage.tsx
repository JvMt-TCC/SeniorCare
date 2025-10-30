import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Volunteer {
  id: string;
  nome: string;
  avatar_url: string | null;
  bio: string | null;
}

const VoluntariosPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [existingChat, setExistingChat] = useState<string | null>(null);

  useEffect(() => {
    const fetchVolunteers = async () => {
      if (!user) return;

      // Check if user already has an active chat
      const { data: chatData } = await supabase
        .from('volunteer_chats')
        .select('id')
        .eq('elder_id', user.id)
        .eq('status', 'active')
        .single();

      if (chatData) {
        setExistingChat(chatData.id);
        setLoading(false);
        return;
      }

      // Fetch available volunteers
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, avatar_url, bio')
        .eq('user_type', 'voluntario')
        .limit(10);

      if (error) {
        console.error('Erro ao buscar voluntários:', error);
        setLoading(false);
        return;
      }

      if (data) {
        setVolunteers(data);
      }
      setLoading(false);
    };

    fetchVolunteers();
  }, [user]);

  const handleStartChat = async (volunteerId: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('volunteer_chats')
      .insert([{
        volunteer_id: volunteerId,
        elder_id: user.id,
        status: 'active'
      }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a conversa.",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      navigate(`/chat/idoso/${data.id}`);
    }
  };

  if (existingChat) {
    return (
      <div className="space-y-6 py-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/saude')}
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-senior-2xl text-primary">Voluntários</h1>
        </div>

        <Card className="card-soft text-center py-12">
          <Heart size={48} className="mx-auto mb-4 text-primary" />
          <p className="text-senior-base font-semibold mb-2">
            Você já está em uma conversa!
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Continue sua conversa com o voluntário
          </p>
          <Button
            onClick={() => navigate(`/chat/idoso/${existingChat}`)}
            className="btn-primary"
          >
            Ir para a Conversa
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/saude')}
        >
          <ArrowLeft size={24} />
        </Button>
        <div>
          <h1 className="text-senior-2xl text-primary">Voluntários Disponíveis</h1>
          <p className="text-muted-foreground text-senior-base">
            Escolha um voluntário para conversar
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando voluntários...</p>
        </div>
      ) : volunteers.length === 0 ? (
        <Card className="card-soft text-center py-12">
          <Users size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-senior-base text-muted-foreground">
            Nenhum voluntário disponível no momento
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Por favor, tente novamente mais tarde
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {volunteers.map((volunteer) => (
            <Card
              key={volunteer.id}
              className="card-soft hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center gap-4 p-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={volunteer.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary-soft text-primary text-xl">
                    {volunteer.nome.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-senior-lg font-semibold">
                    {volunteer.nome}
                  </p>
                  {volunteer.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {volunteer.bio}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => handleStartChat(volunteer.id)}
                  className="btn-primary"
                >
                  Conversar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoluntariosPage;