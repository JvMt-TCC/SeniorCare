import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pill, MapPin, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import VolunteerChatButton from "@/components/VolunteerChatButton";
import ElderVolunteerButton from "@/components/ElderVolunteerButton";

const SaudePage = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [healthLocations, setHealthLocations] = useState<any[]>([]);

  useEffect(() => {
    const fetchHealthLocations = async () => {
      const { data, error } = await supabase
        .from('health_locations')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar locais:', error);
        return;
      }

      if (data) {
        setHealthLocations(data);
      }
    };

    fetchHealthLocations();
  }, []);

  const medicationCategories = [
    { id: 1, name: "Dores Musculares", icon: "💪" },
    { id: 2, name: "Dores de Cabeça", icon: "🤕" },
    { id: 3, name: "Cãibras", icon: "🦵" },
    { id: 4, name: "Dores nas Costas", icon: "🔙" },
    { id: 5, name: "Artrite/Artrose", icon: "🦴" },
    { id: 6, name: "Pressão Alta", icon: "❤️" },
    { id: 7, name: "Diabetes", icon: "🩸" },
    { id: 8, name: "Insônia", icon: "😴" },
    { id: 9, name: "Ansiedade", icon: "😰" },
    { id: 10, name: "Gripe e Resfriado", icon: "🤧" },
  ];

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-senior-2xl text-primary mb-2">Saúde</h1>
        <p className="text-muted-foreground text-senior-base">
          Informações sobre medicamentos e locais de cuidado
        </p>
      </div>

      {/* Botão específico baseado no tipo de usuário */}
      {profile?.user_type === 'voluntario' && <VolunteerChatButton />}
      {profile?.user_type === 'idoso' && <ElderVolunteerButton />}

      {/* Seção Medicamentos */}
      <div>
        <h2 className="text-senior-xl text-primary mb-4 flex items-center">
          <Pill className="mr-2" size={24} />
          Medicamentos
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {medicationCategories.map((category) => (
            <Card
              key={category.id}
              className="card-soft cursor-pointer hover:bg-primary/5 transition-colors"
              onClick={() => navigate(`/saude/medicamentos/${category.id}`, { state: { category } })}
            >
              <div className="text-center p-4">
                <div className="text-4xl mb-2">{category.icon}</div>
                <p className="text-senior-base font-semibold">{category.name}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Seção Locais de Cuidado */}
      <div>
        <h2 className="text-senior-xl text-primary mb-4 flex items-center">
          <MapPin className="mr-2" size={24} />
          Locais de Cuidado
        </h2>
        <div className="space-y-3">
          {healthLocations.map((location) => (
            <Card
              key={location.id}
              className="card-soft cursor-pointer hover:bg-primary/5 transition-colors"
              onClick={() => navigate(`/saude/locais/${location.id}`, { state: { location } })}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <p className="text-senior-base font-semibold">{location.name}</p>
                  <p className="text-sm text-muted-foreground">{location.type}</p>
                  <p className="text-sm text-muted-foreground mt-1">{location.address}</p>
                </div>
                <ChevronRight className="text-muted-foreground" size={24} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SaudePage;
