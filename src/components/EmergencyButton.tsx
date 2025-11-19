import { useState } from "react";
import { Phone, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

const EmergencyButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useAuth();

  const handleEmergencyCall = (number: string) => {
    // Opens the native phone dialer with the number
    window.location.href = `tel:${number}`;
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 h-16 w-16 rounded-full bg-destructive hover:bg-destructive/90 shadow-lg z-50 animate-pulse"
        size="icon"
      >
        <AlertTriangle size={32} className="text-destructive-foreground" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-destructive">
              Emergência
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button
              onClick={() => handleEmergencyCall("192")}
              className="w-full h-20 text-lg bg-destructive hover:bg-destructive/90"
              size="lg"
            >
              <Phone className="mr-2" size={24} />
              Ligar para SAMU (192)
            </Button>

            {profile?.trusted_contact_phone && (
              <Button
                onClick={() => handleEmergencyCall(profile.trusted_contact_phone!)}
                className="w-full h-20 text-lg"
                variant="outline"
                size="lg"
              >
                <Phone className="mr-2" size={24} />
                Ligar para {profile.trusted_contact_name || "Contato de Confiança"}
              </Button>
            )}

            {!profile?.trusted_contact_phone && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Adicione um contato de confiança nas configurações do seu perfil
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmergencyButton;
