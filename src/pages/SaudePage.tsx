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
      <Card
        className="card-soft cursor-pointer hover:bg-primary/5 transition-colors"
        onClick={() => navigate('/saude/medicamentos', { state: { conditions: profile?.problemas_saude || [] } })}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <Pill className="text-blue-600 dark:text-blue-300" size={24} />
            </div>
            <div>
              <p className="text-senior-base font-semibold">Medicamentos</p>
              <p className="text-sm text-muted-foreground">
                Encontre medicamentos recomendados
              </p>
            </div>
          </div>
          <ChevronRight className="text-muted-foreground" size={24} />
        </div>
      </Card>

      {/* Seção Locais de Cuidado */}
      <Card
        className="card-soft cursor-pointer hover:bg-primary/5 transition-colors"
        onClick={() => navigate('/saude/locais')}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <MapPin className="text-green-600 dark:text-green-300" size={24} />
            </div>
            <div>
              <p className="text-senior-base font-semibold">Locais de Cuidado</p>
              <p className="text-sm text-muted-foreground">
                Encontre hospitais e clínicas próximas
              </p>
            </div>
          </div>
          <ChevronRight className="text-muted-foreground" size={24} />
        </div>
      </Card>

      <div className="card-soft">
        <h3 className="text-senior-lg text-primary mb-4">Dicas de Saúde</h3>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Beba pelo menos 8 copos de água por dia</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Faça caminhadas leves de 30 minutos diariamente</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Mantenha uma alimentação balanceada com frutas e verduras</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Durma de 7 a 8 horas por noite</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Realize check-ups médicos regulares</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SaudePage;
