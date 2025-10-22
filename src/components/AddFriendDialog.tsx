import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AddFriendDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestSent: () => void;
}

const AddFriendDialog = ({ isOpen, onOpenChange, onRequestSent }: AddFriendDialogProps) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      // Search for user by username
      const { data: targetUser, error: searchError } = await supabase
        .from("profiles")
        .select("id, username, nome")
        .eq("username", username.trim())
        .single();

      if (searchError || !targetUser) {
        toast({
          title: "Usuário não encontrado",
          description: "Não foi possível encontrar um usuário com esse nome.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (targetUser.id === user.id) {
        toast({
          title: "Erro",
          description: "Você não pode enviar solicitação para si mesmo.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Send friend request
      const { error: requestError } = await supabase
        .from("friendship_requests")
        .insert({
          from_user_id: user.id,
          to_user_id: targetUser.id,
          status: "pending"
        });

      if (requestError) {
        if (requestError.code === "23505") {
          toast({
            title: "Solicitação já enviada",
            description: "Você já enviou uma solicitação para este usuário.",
            variant: "destructive",
          });
        } else {
          throw requestError;
        }
      } else {
        toast({
          title: "Sucesso!",
          description: `Solicitação enviada para ${targetUser.nome || targetUser.username}`,
        });
        onRequestSent();
        setUsername("");
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a solicitação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Amigo</DialogTitle>
          <DialogDescription>
            Digite o nome de usuário para enviar uma solicitação de amizade
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nome de Usuário</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@nomedousuario"
              className="w-full"
              disabled={loading}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar Solicitação"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialog;
