import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const VolunteerChatButton = () => {
  const navigate = useNavigate();

  return (
    <Card
      className="card-soft cursor-pointer hover:bg-primary/5 transition-colors"
      onClick={() => navigate('/saude/ajuda-amigo')}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <MessageCircle className="text-primary" size={24} />
          </div>
          <div>
            <p className="text-senior-base font-semibold">Ajuda ao Amigo</p>
            <p className="text-sm text-muted-foreground">
              Converse com idosos que precisam de companhia
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VolunteerChatButton;