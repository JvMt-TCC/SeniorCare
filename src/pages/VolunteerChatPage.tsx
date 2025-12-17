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
  elder_name: string;
  elder_avatar: string | null;
}

const VolunteerChatPage = () => {
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
          elder_id,
          profiles!volunteer_chats_elder_id_fkey(
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
        navigate('/saude/ajuda-amigo');
        return;
      }

      setChatInfo({
        elder_name: data.profiles?.nome || 'Usuário',
        elder_avatar: data.profiles?.avatar_url || null,
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

    // Subscribe to new messages with unique channel
    const subscription = supabase
      .channel(`volunteer-chat-${chatId}`)
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
      supabase.removeChannel(subscription);
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
    <div 
      className="flex flex-col -mt-4 -mx-4 bg-gradient-to-br from-primary-soft via-background to-secondary animate-fade-in"
      style={{ 
        height: 'calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 6rem)',
        minHeight: '400px'
      }}
    >
      {/* Header */}
      <div 
        className="bg-background/95 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center gap-3 shadow-sm"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/saude/ajuda-amigo')}
          className="h-11 w-11 rounded-xl hover:bg-primary/10"
        >
          <ArrowLeft size={24} className="text-foreground" />
        </Button>
        {chatInfo && (
          <>
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarImage src={chatInfo.elder_avatar || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {chatInfo.elder_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{chatInfo.elder_name}</p>
              <p className="text-xs text-muted-foreground">Idoso</p>
            </div>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Inicie uma conversa!</p>
          </div>
        )}
        {messages.map((message) => {
          const isFromUser = message.from_user_id === user?.id;
          return (
            <div
              key={message.id}
              className={`flex ${isFromUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                  isFromUser
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-background border border-border/50 rounded-bl-md'
                }`}
              >
                <p className="text-base leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-1.5 ${isFromUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
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
      <div 
        className="bg-background/95 backdrop-blur-md border-t border-border/50 p-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' }}
      >
        <div className="flex gap-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 h-12 text-base bg-secondary/50 border-border/50 rounded-xl focus:border-primary"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerChatPage;