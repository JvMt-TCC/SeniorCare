import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Pill } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MedicationCategory {
  id: number;
  name: string;
  description: string;
  relatedConditions: string[];
  isPrimary?: boolean;
}

const MedicamentosPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userConditions = location.state?.conditions || [];

  const medicationCategories: MedicationCategory[] = [
    {
      id: 1,
      name: "Dores Musculares",
      description: "Anti-inflamatórios e analgésicos para dores musculares",
      relatedConditions: ["Artrite", "Artrose", "Fibromialgia"]
    },
    {
      id: 2,
      name: "Dores de Cabeça",
      description: "Medicamentos para cefaleia e enxaqueca",
      relatedConditions: ["Enxaqueca", "Cefaleia tensional"]
    },
    {
      id: 3,
      name: "Cãibras",
      description: "Suplementos e medicamentos para prevenir cãibras",
      relatedConditions: []
    },
    {
      id: 4,
      name: "Dores nas Costas",
      description: "Relaxantes musculares e anti-inflamatórios",
      relatedConditions: ["Hérnia de disco", "Lombalgia"]
    },
    {
      id: 5,
      name: "Artrite/Artrose",
      description: "Medicamentos para proteção articular",
      relatedConditions: ["Artrite", "Artrose", "Artrite reumatoide"]
    },
    {
      id: 6,
      name: "Pressão Alta",
      description: "Anti-hipertensivos e controle de pressão",
      relatedConditions: ["Hipertensão", "Pressão alta"]
    },
    {
      id: 7,
      name: "Diabetes",
      description: "Controle de glicemia",
      relatedConditions: ["Diabetes tipo 1", "Diabetes tipo 2"]
    },
    {
      id: 8,
      name: "Insônia",
      description: "Indutores de sono e reguladores de ciclo",
      relatedConditions: ["Insônia", "Distúrbios do sono"]
    },
    {
      id: 9,
      name: "Ansiedade",
      description: "Ansiolíticos e calmantes naturais",
      relatedConditions: ["Ansiedade", "Síndrome do pânico", "Estresse"]
    },
    {
      id: 10,
      name: "Gripe e Resfriado",
      description: "Alívio de sintomas gripais",
      relatedConditions: []
    }
  ];

  // Categorize medications based on user conditions
  const categorizedMeds = medicationCategories.map(cat => {
    const isPrimary = cat.relatedConditions.some(condition =>
      userConditions.some((userCond: string) =>
        userCond.toLowerCase().includes(condition.toLowerCase()) ||
        condition.toLowerCase().includes(userCond.toLowerCase())
      )
    );
    return { ...cat, isPrimary };
  });

  const primaryMeds = categorizedMeds.filter(cat => cat.isPrimary);
  const otherMeds = categorizedMeds.filter(cat => !cat.isPrimary);

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-secondary text-primary hover:bg-primary-soft transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-senior-lg text-primary ml-4">Medicamentos</h1>
      </div>

      {/* Primary Medications (Based on User Conditions) */}
      {primaryMeds.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-senior-xl text-primary">Recomendados para Você</h2>
            <Badge variant="default" className="bg-primary">
              Baseado no seu perfil
            </Badge>
          </div>
          <div className="space-y-3">
            {primaryMeds.map((category) => (
              <Card
                key={category.id}
                className="card-soft cursor-pointer hover:bg-primary/5 transition-colors"
                onClick={() => navigate(`/saude/medicamentos/${category.id}`, { state: { category } })}
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Pill className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="text-senior-base font-semibold">{category.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Other Medications */}
      <div>
        <h2 className="text-senior-xl text-primary mb-4">
          {primaryMeds.length > 0 ? "Outras Categorias" : "Todas as Categorias"}
        </h2>
        <div className="space-y-3">
          {otherMeds.map((category) => (
            <Card
              key={category.id}
              className="card-soft cursor-pointer hover:bg-primary/5 transition-colors"
              onClick={() => navigate(`/saude/medicamentos/${category.id}`, { state: { category } })}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-secondary p-3 rounded-full">
                    <Pill className="text-muted-foreground" size={24} />
                  </div>
                  <div>
                    <p className="text-senior-base font-semibold">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>⚠️ Importante:</strong> Sempre consulte um médico antes de iniciar qualquer tratamento.
          As recomendações são baseadas nas condições de saúde informadas no seu cadastro.
        </p>
      </div>
    </div>
  );
};

export default MedicamentosPage;
