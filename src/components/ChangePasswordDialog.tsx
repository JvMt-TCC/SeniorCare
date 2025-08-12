import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff, Check, X } from "lucide-react";

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangePasswordDialog = ({ isOpen, onOpenChange }: ChangePasswordDialogProps) => {
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });

  const passwordRequirements = [
    { test: (pass: string) => pass.length >= 8, text: "Mínimo 8 caracteres" },
    { test: (pass: string) => /[A-Z]/.test(pass), text: "1 letra maiúscula" },
    { test: (pass: string) => /[0-9]/.test(pass), text: "1 número" },
    { test: (pass: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pass), text: "1 caractere especial" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allRequirementsMet = passwordRequirements.every(req => req.test(passwords.newPassword));
    const passwordsMatch = passwords.newPassword === passwords.confirmPassword;
    
    if (allRequirementsMet && passwordsMatch) {
      // Simular alteração de senha
      alert("Senha alterada com sucesso!");
      setPasswords({ newPassword: "", confirmPassword: "" });
      onOpenChange(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const toggleShowPassword = (field: "new" | "confirm") => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl text-primary mb-2">
            Alterar Senha
          </DialogTitle>
          <p className="text-muted-foreground">
            Crie uma nova senha segura
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-base font-medium">
              Nova Senha
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                placeholder="Digite sua nova senha"
                value={passwords.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
                className="h-12 text-base rounded-xl border-2 focus:border-primary pr-12"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => toggleShowPassword("new")}
              >
                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-base font-medium">
              Confirmar Senha
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                placeholder="Digite novamente sua nova senha"
                value={passwords.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                className="h-12 text-base rounded-xl border-2 focus:border-primary pr-12"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => toggleShowPassword("confirm")}
              >
                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Requisitos da senha:
            </Label>
            <div className="space-y-1">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center text-sm">
                  {req.test(passwords.newPassword) ? (
                    <Check size={16} className="text-green-500 mr-2" />
                  ) : (
                    <X size={16} className="text-red-500 mr-2" />
                  )}
                  <span className={req.test(passwords.newPassword) ? "text-green-600" : "text-red-600"}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
            <div className="flex items-center text-sm text-red-600">
              <X size={16} className="mr-2" />
              As senhas não coincidem
            </div>
          )}

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
              disabled={
                !passwordRequirements.every(req => req.test(passwords.newPassword)) ||
                passwords.newPassword !== passwords.confirmPassword
              }
            >
              Alterar Senha
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;