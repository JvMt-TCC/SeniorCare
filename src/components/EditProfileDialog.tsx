import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../contexts/AuthContext";

interface EditProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProfileDialog = ({ isOpen, onOpenChange }: EditProfileDialogProps) => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    name: profile?.nome || "",
    email: profile?.email || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim()) {
      // TODO: Implement profile update with Supabase
      console.log("Profile update functionality to be implemented");
      onOpenChange(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl text-primary mb-2">
            Editar Informações
          </DialogTitle>
          <p className="text-muted-foreground">
            Atualize suas informações pessoais
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium">
              Nome Completo
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome completo"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="h-12 text-base rounded-xl border-2 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="h-12 text-base rounded-xl border-2 focus:border-primary"
              required
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-xl border-2"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90"
            >
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;