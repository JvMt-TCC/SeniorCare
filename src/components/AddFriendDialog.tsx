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

  const validateUsername = (value: string): string | null => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return "Nome de usuário não pode estar vazio";
    }
    
    if (trimmed.length < 3) {
      return "Nome de usuário deve ter pelo menos 3 caracteres";
    }
    
    if (trimmed.length > 30) {
      return "Nome de usuário deve ter no máximo 30 caracteres";
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      return "Nome de usuário deve conter apenas letras, números, underscore ou hífen";
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateUsername(username);
    if (validationError) {
      toast({
        title: "Entrada inválida",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      // Search for user by username (case-insensitive)
      const { data: targetUser, error: searchError } = await supabase
        .from("profiles")
        .select("id, username, nome")
        .ilike("username", username.trim())
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
              maxLength={30}
            />
            <p className="text-xs text-muted-foreground">
              3-30 caracteres: letras, números, _ ou -
            </p>
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
