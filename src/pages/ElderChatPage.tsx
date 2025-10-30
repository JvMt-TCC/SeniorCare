import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  from_user_id: string;
  created_at: string;
}

interface ChatInfo {
  volunteer_name: string;
  volunteer_avatar: string | null;
}

const ElderChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId || !user) return;

    const fetchChatInfo = async () => {
      const { data, error } = await supabase
        .from('volunteer_chats')
        .select(`
          volunteer_id,
          profiles!volunteer_chats_volunteer_id_fkey(
            nome,
            avatar_url
          )
        `)
        .eq('id', chatId)
        .single();

      if (error || !data) {
        toast({
          title: "Erro",
          description: "Chat não encontrado.",
          variant: "destructive",
        });
        navigate('/saude');
        return;
      }

      setChatInfo({
        volunteer_name: data.profiles?.nome || 'Voluntário',
        volunteer_avatar: data.profiles?.avatar_url || null,
      });
    };

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('volunteer_chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar mensagens:', error);
        return;
      }

      if (data) {
        setMessages(data);
      }
      setLoading(false);
    };

    fetchChatInfo();
    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`chat_${chatId}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'volunteer_chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [chatId, user, navigate, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId || !user) return;

    const { error } = await supabase
      .from('volunteer_chat_messages')
      .insert([{
        chat_id: chatId,
        from_user_id: user.id,
        content: newMessage.trim()
      }]);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      });
      return;
    }

    setNewMessage("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Carregando chat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-primary-soft via-background to-secondary">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 py-3 flex items-center gap-3 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/saude')}
        >
          <ArrowLeft size={24} />
        </Button>
        {chatInfo && (
          <>
            <Avatar className="w-10 h-10">
              <AvatarImage src={chatInfo.volunteer_avatar || undefined} />
              <AvatarFallback className="bg-primary-soft text-primary">
                {chatInfo.volunteer_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{chatInfo.volunteer_name}</p>
              <p className="text-xs text-muted-foreground">Voluntário</p>
            </div>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => {
          const isFromUser = message.from_user_id === user?.id;
          return (
            <div
              key={message.id}
              className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  isFromUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white border border-border'
                }`}
              >
                <p className="text-senior-base">{message.content}</p>
                <p className={`text-xs mt-1 ${isFromUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 text-senior-base"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="btn-primary"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ElderChatPage;