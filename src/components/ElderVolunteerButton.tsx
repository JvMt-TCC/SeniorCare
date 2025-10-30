import { Heart } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ElderVolunteerButton = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    setShowModal(false);
    navigate('/saude/voluntarios');
  };

  return (
    <>
      <Card
        className="card-soft cursor-pointer hover:bg-primary/5 transition-colors"
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Heart className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-senior-base font-semibold">Voluntários</p>
              <p className="text-sm text-muted-foreground">
                Converse com voluntários disponíveis
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-senior-lg text-primary">
              Importante: Respeito e Cordialidade
            </DialogTitle>
            <DialogDescription className="text-senior-base space-y-3 pt-4">
              <p>
                Os voluntários estão aqui para ajudar e oferecer companhia. Por favor, seja sempre:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Respeitoso e educado</li>
                <li>Paciente e compreensivo</li>
                <li>Gentil em suas palavras</li>
              </ul>
              <p className="font-semibold text-foreground">
                Juntos podemos criar um ambiente acolhedor e amigável! 💛
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleContinue}
              className="flex-1 btn-primary"
            >
              Entendi, Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ElderVolunteerButton;