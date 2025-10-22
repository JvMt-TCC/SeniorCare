import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, X, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FriendRequest {
  id: string;
  from_user_id: string;
  status: string;
  created_at: string;
  profiles: {
    nome: string;
    username: string;
    avatar_url: string | null;
  };
}

interface FriendRequestsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestHandled: () => void;
}

const FriendRequestsModal = ({ isOpen, onOpenChange, onRequestHandled }: FriendRequestsModalProps) => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("friendship_requests")
        .select(`
          id,
          from_user_id,
          status,
          created_at,
          profiles!friendship_requests_from_user_id_fkey(nome, username, avatar_url)
        `)
        .eq("to_user_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen]);

  const handleRequest = async (requestId: string, action: "accepted" | "rejected", fromUserId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update request status
      const { error: updateError } = await supabase
        .from("friendship_requests")
        .update({ status: action })
        .eq("id", requestId);

      if (updateError) throw updateError;

      // If accepted, create friendship
      if (action === "accepted") {
        const { error: friendError } = await supabase
          .from("friends")
          .insert({ user_id: user.id, friend_user_id: fromUserId });

        if (friendError) throw friendError;

        // Also create reverse friendship
        await supabase
          .from("friends")
          .insert({ user_id: fromUserId, friend_user_id: user.id });
      }

      toast({
        title: action === "accepted" ? "Solicitação aceita!" : "Solicitação recusada",
        description: action === "accepted" 
          ? "Agora vocês são amigos!" 
          : "A solicitação foi recusada.",
      });

      fetchRequests();
      onRequestHandled();
    } catch (error) {
      console.error("Error handling request:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar a solicitação.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Solicitações de Amizade
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Carregando...</p>
          ) : requests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma solicitação pendente
            </p>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={request.profiles.avatar_url || undefined} />
                    <AvatarFallback>
                      {request.profiles.nome?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.profiles.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      @{request.profiles.username}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-green-600 hover:bg-green-50"
                    onClick={() => handleRequest(request.id, "accepted", request.from_user_id)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-600 hover:bg-red-50"
                    onClick={() => handleRequest(request.id, "rejected", request.from_user_id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FriendRequestsModal;
