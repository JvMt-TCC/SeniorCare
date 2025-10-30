import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Chat {
  id: string;
  elder_id: string;
  elder_name: string;
  elder_avatar: string | null;
  created_at: string;
  last_message: string | null;
}

const AjudaAmigoPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('volunteer_chats')
        .select(`
          id,
          elder_id,
          created_at,
          profiles!volunteer_chats_elder_id_fkey(
            id,
            nome,
            avatar_url
          )
        `)
        .eq('volunteer_id', user.id)
        .eq('status', 'active')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar chats:', error);
        setLoading(false);
        return;
      }

      if (data) {
        const chatsWithMessages = await Promise.all(
          data.map(async (chat) => {
            const { data: messages } = await supabase
              .from('volunteer_chat_messages')
              .select('content')
              .eq('chat_id', chat.id)
              .order('created_at', { ascending: false })
              .limit(1);

            return {
              id: chat.id,
              elder_id: chat.elder_id,
              elder_name: chat.profiles?.nome || 'Usuário',
              elder_avatar: chat.profiles?.avatar_url || null,
              created_at: chat.created_at,
              last_message: messages?.[0]?.content || null,
            };
          })
        );
        setChats(chatsWithMessages);
      }
      setLoading(false);
    };

    fetchChats();

    // Subscribe to new chats
    const subscription = supabase
      .channel('volunteer_chats_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'volunteer_chats' },
        () => {
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

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
          <h1 className="text-senior-2xl text-primary">Ajuda ao Amigo</h1>
          <p className="text-muted-foreground text-senior-base">
            Conversas ativas com idosos
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando conversas...</p>
        </div>
      ) : chats.length === 0 ? (
        <Card className="card-soft text-center py-12">
          <MessageCircle size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-senior-base text-muted-foreground">
            Nenhuma conversa ativa no momento
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Quando um idoso iniciar uma conversa, ela aparecerá aqui
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => (
            <Card
              key={chat.id}
              className="card-soft cursor-pointer hover:bg-primary/5 transition-colors"
              onClick={() => navigate(`/chat/voluntario/${chat.id}`)}
            >
              <div className="flex items-center gap-4 p-4">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={chat.elder_avatar || undefined} />
                  <AvatarFallback className="bg-primary-soft text-primary text-xl">
                    {chat.elder_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-senior-base font-semibold">
                    {chat.elder_name}
                  </p>
                  {chat.last_message && (
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.last_message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(chat.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <MessageCircle className="text-primary" size={24} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AjudaAmigoPage;