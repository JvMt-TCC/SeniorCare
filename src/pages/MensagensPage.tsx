import { useState, useEffect, useRef } from "react";
import { Send, User, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface Friend {
  id: string;
  nome: string;
  username: string;
  avatar_url: string | null;
  lastMessage?: string;
  lastMessageTime?: string;
  unread?: number;
}

interface Message {
  id: string;
  content: string;
  from_user_id: string;
  to_user_id: string;
  created_at: string;
  read: boolean;
}

const MAX_MESSAGE_LENGTH = 1000;

const MensagensPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const userIdParam = searchParams.get('userId');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch friends list
  const fetchFriends = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('friends')
      .select(`
        friend_user_id,
        profiles!friends_friend_user_id_fkey(
          id,
          nome,
          username,
          avatar_url
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching friends:', error);
      return;
    }

    if (data) {
      const friendsList = data
        .filter(f => f.profiles)
        .map(f => ({
          id: f.profiles.id,
          nome: f.profiles.nome,
          username: f.profiles.username,
          avatar_url: f.profiles.avatar_url,
        }));
      setFriends(friendsList);

      // If userId param is present, select that friend
      if (userIdParam) {
        const friend = friendsList.find(f => f.id === userIdParam);
        if (friend) {
          setSelectedFriend(friend);
        }
      }
    }
  };

  // Fetch messages
  const fetchMessages = async (friendId: string) => {
    if (!user) return;

    // Fetch messages in both directions without string interpolation
    const [sentResult, receivedResult] = await Promise.all([
      supabase
        .from('messages')
        .select('*')
        .eq('from_user_id', user.id)
        .eq('to_user_id', friendId),
      supabase
        .from('messages')
        .select('*')
        .eq('from_user_id', friendId)
        .eq('to_user_id', user.id)
    ]);

    if (sentResult.error) {
      console.error('Error fetching sent messages:', sentResult.error);
      return;
    }

    if (receivedResult.error) {
      console.error('Error fetching received messages:', receivedResult.error);
      return;
    }

    // Combine and sort messages by timestamp
    const allMessages = [...(sentResult.data || []), ...(receivedResult.data || [])]
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    setMessages(allMessages);

    // Mark messages as read
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('to_user_id', user.id)
      .eq('from_user_id', friendId)
      .eq('read', false);
  };

  useEffect(() => {
    fetchFriends();
  }, [user]);

  useEffect(() => {
    if (selectedFriend) {
      fetchMessages(selectedFriend.id);

      // Subscribe to new messages (sent or received)
      const channel = supabase
        .channel(`messages-${selectedFriend.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          },
          (payload) => {
            const msg = payload.new as Message;
            // Only add if it's part of this conversation
            if (
              (msg.from_user_id === user?.id && msg.to_user_id === selectedFriend.id) ||
              (msg.from_user_id === selectedFriend.id && msg.to_user_id === user?.id)
            ) {
              setMessages((prev) => [...prev, msg]);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedFriend, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    const trimmed = newMessage.trim();
    
    if (!trimmed || !selectedFriend || !user) return;

    // Validate message length
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      toast({
        title: "Mensagem muito longa",
        description: `Máximo de ${MAX_MESSAGE_LENGTH} caracteres permitidos`,
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('messages')
      .insert({
        from_user_id: user.id,
        to_user_id: selectedFriend.id,
        content: trimmed,
      });

    if (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive"
      });
      return;
    }

    setNewMessage("");
  };

  if (selectedFriend) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Header do Chat */}
        <div className="card-soft mb-4 flex items-center flex-shrink-0">
          <button
            onClick={() => setSelectedFriend(null)}
            className="p-2 rounded-xl bg-secondary text-primary hover:bg-primary-soft transition-colors mr-3"
          >
            <ArrowLeft size={20} />
          </button>
          <Avatar className="w-10 h-10 mr-3">
            <AvatarImage src={selectedFriend.avatar_url || undefined} />
            <AvatarFallback>
              {selectedFriend.nome?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-senior-lg text-primary">{selectedFriend.nome}</h2>
            <p className="text-sm text-muted-foreground">@{selectedFriend.username}</p>
          </div>
        </div>

        {/* Mensagens - Área com scroll */}
        <div className="flex-1 overflow-y-auto px-1 mb-4" style={{ scrollbarWidth: 'thin' }}>
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.from_user_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-xs p-3 rounded-2xl
                    ${message.from_user_id === user?.id
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-foreground'
                    }
                  `}
                >
                  <p className="text-senior-base">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.from_user_id === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {new Date(message.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input de Mensagem - Fixo na parte inferior */}
        <div className="flex space-x-2 bg-background p-2 border-t border-border flex-shrink-0">
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua mensagem..."
              maxLength={MAX_MESSAGE_LENGTH}
              className="w-full p-3 border border-border rounded-xl bg-background text-senior-base"
            />
            <p className="text-xs text-muted-foreground mt-1 px-1">
              {newMessage.length}/{MAX_MESSAGE_LENGTH}
            </p>
          </div>
          <button
            onClick={handleSendMessage}
            className="btn-primary px-4 flex-shrink-0"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="text-center pt-4">
        <h1 className="text-senior-xl text-primary mb-2">Mensagens</h1>
        <p className="text-muted-foreground">Converse com seus amigos</p>
      </div>

      <div className="space-y-3">
        {friends.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Você ainda não tem amigos adicionados
          </p>
        ) : (
          friends.map((friend) => (
            <div
              key={friend.id}
              onClick={() => setSelectedFriend(friend)}
              className="card-soft hover:shadow-md transition-all cursor-pointer flex items-center"
            >
              <Avatar className="w-12 h-12 mr-4">
                <AvatarImage src={friend.avatar_url || undefined} />
                <AvatarFallback>
                  {friend.nome?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-foreground">{friend.nome}</h3>
                </div>
                <p className="text-sm text-muted-foreground">@{friend.username}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MensagensPage;
