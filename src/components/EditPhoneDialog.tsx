import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EditPhoneDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditPhoneDialog = ({ isOpen, onOpenChange }: EditPhoneDialogProps) => {
  const { profile, user } = useAuth();
  const [phone, setPhone] = useState(profile?.telefone || "");
  const [loading, setLoading] = useState(false);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const limited = numbers.slice(0, 11);
    
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 7) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ telefone: phone.trim() })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Telefone atualizado com sucesso!",
      });
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o telefone.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    setPhone(formatted);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl text-primary mb-2">
            Editar Telefone
          </DialogTitle>
          <p className="text-muted-foreground">
            Atualize seu número de telefone
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-base font-medium">
              Número de Telefone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(21) 99999-9999"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="h-12 text-base rounded-xl border-2 focus:border-primary"
              required
            />
            <p className="text-sm text-muted-foreground">
              Formato: (DD) 99999-9999
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-xl border-2"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPhoneDialog;