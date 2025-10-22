import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Pill, Clock, AlertTriangle, FileText, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MedicamentoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category;

  // Dados de medicamentos por categoria
  const medications: Record<number, any[]> = {
    1: [ // Dores Musculares
      {
        id: 1,
        name: "Ibuprofeno 600mg",
        effect_time: "30-60 minutos",
        benefits: "Anti-inflamatório potente, reduz dor e inflamação muscular",
        side_effects: "Pode causar desconforto estomacal, náuseas",
        prescription_required: false
      },
      {
        id: 2,
        name: "Diclofenaco Sódico 50mg",
        effect_time: "45-90 minutos",
        benefits: "Alívio eficaz de dores musculares intensas",
        side_effects: "Problemas gastrointestinais, tontura",
        prescription_required: true
      },
      {
        id: 3,
        name: "Paracetamol 750mg",
        effect_time: "20-30 minutos",
        benefits: "Analgésico seguro para uso prolongado",
        side_effects: "Raros quando usado corretamente",
        prescription_required: false
      },
    ],
    2: [ // Dores de Cabeça
      {
        id: 1,
        name: "Dipirona 500mg",
        effect_time: "15-30 minutos",
        benefits: "Alívio rápido de cefaleias leves a moderadas",
        side_effects: "Reações alérgicas em casos raros",
        prescription_required: false
      },
      {
        id: 2,
        name: "Paracetamol 500mg",
        effect_time: "20-30 minutos",
        benefits: "Seguro e eficaz para dores de cabeça",
        side_effects: "Mínimos quando usado adequadamente",
        prescription_required: false
      },
      {
        id: 3,
        name: "Sumatriptano 50mg",
        effect_time: "30-60 minutos",
        benefits: "Específico para enxaqueca",
        side_effects: "Tontura, sensação de formigamento",
        prescription_required: true
      },
    ],
    3: [ // Cãibras
      {
        id: 1,
        name: "Magnésio Quelado 400mg",
        effect_time: "1-2 horas (preventivo)",
        benefits: "Previne cãibras musculares",
        side_effects: "Diarreia em doses altas",
        prescription_required: false
      },
      {
        id: 2,
        name: "Complexo B",
        effect_time: "Efeito cumulativo (dias)",
        benefits: "Melhora função neuromuscular",
        side_effects: "Raros",
        prescription_required: false
      },
    ],
    4: [ // Dores nas Costas
      {
        id: 1,
        name: "Ciclobenzaprina 10mg",
        effect_time: "1-2 horas",
        benefits: "Relaxante muscular para dores nas costas",
        side_effects: "Sonolência, boca seca",
        prescription_required: true
      },
      {
        id: 2,
        name: "Ibuprofeno 400mg",
        effect_time: "30-60 minutos",
        benefits: "Anti-inflamatório para dores lombares",
        side_effects: "Desconforto gástrico",
        prescription_required: false
      },
    ],
    5: [ // Artrite/Artrose
      {
        id: 1,
        name: "Glicosamina + Condroitina",
        effect_time: "Semanas (efeito cumulativo)",
        benefits: "Proteção e regeneração da cartilagem",
        side_effects: "Mínimos",
        prescription_required: false
      },
      {
        id: 2,
        name: "Meloxicam 15mg",
        effect_time: "1-2 horas",
        benefits: "Anti-inflamatório de longa duração",
        side_effects: "Problemas gástricos, tontura",
        prescription_required: true
      },
    ],
    6: [ // Pressão Alta
      {
        id: 1,
        name: "Losartana 50mg",
        effect_time: "1-3 horas",
        benefits: "Controla pressão arterial",
        side_effects: "Tontura, fadiga",
        prescription_required: true
      },
      {
        id: 2,
        name: "Enalapril 10mg",
        effect_time: "1 hora",
        benefits: "Reduz pressão arterial eficazmente",
        side_effects: "Tosse seca, tontura",
        prescription_required: true
      },
    ],
    7: [ // Diabetes
      {
        id: 1,
        name: "Metformina 850mg",
        effect_time: "2-3 horas",
        benefits: "Controle de glicemia",
        side_effects: "Desconforto gastrointestinal",
        prescription_required: true
      },
      {
        id: 2,
        name: "Glibenclamida 5mg",
        effect_time: "1-2 horas",
        benefits: "Reduz glicemia efetivamente",
        side_effects: "Hipoglicemia, ganho de peso",
        prescription_required: true
      },
    ],
    8: [ // Insônia
      {
        id: 1,
        name: "Melatonina 3mg",
        effect_time: "30-60 minutos",
        benefits: "Induz sono natural",
        side_effects: "Sonolência residual",
        prescription_required: false
      },
      {
        id: 2,
        name: "Zolpidem 10mg",
        effect_time: "15-30 minutos",
        benefits: "Induz sono rapidamente",
        side_effects: "Dependência, sonambulismo",
        prescription_required: true
      },
    ],
    9: [ // Ansiedade
      {
        id: 1,
        name: "Passiflora (Maracujá)",
        effect_time: "30-60 minutos",
        benefits: "Calmante natural",
        side_effects: "Mínimos",
        prescription_required: false
      },
      {
        id: 2,
        name: "Alprazolam 0,5mg",
        effect_time: "20-30 minutos",
        benefits: "Alívio rápido de ansiedade",
        side_effects: "Dependência, sonolência",
        prescription_required: true
      },
    ],
    10: [ // Gripe e Resfriado
      {
        id: 1,
        name: "Paracetamol + Pseudoefedrina",
        effect_time: "30-60 minutos",
        benefits: "Alívio de sintomas gripais",
        side_effects: "Insônia, agitação",
        prescription_required: false
      },
      {
        id: 2,
        name: "Vitamina C 1g",
        effect_time: "Efeito preventivo",
        benefits: "Fortalece imunidade",
        side_effects: "Diarreia em doses altas",
        prescription_required: false
      },
    ],
  };

  const categoryMeds = medications[Number(id)] || [];
  const [selectedMed, setSelectedMed] = useState(categoryMeds.length > 0 ? categoryMeds[0] : null);

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-secondary text-primary hover:bg-primary-soft transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-senior-lg text-primary ml-4">
          {category?.name || "Medicamentos"}
        </h1>
      </div>

      {/* Lista de Medicamentos */}
      <div>
        <h2 className="text-senior-xl text-primary mb-4">Medicamentos Disponíveis</h2>
        <div className="space-y-3">
          {categoryMeds.map((med) => (
            <Card
              key={med.id}
              className="card-soft cursor-pointer hover:bg-primary/5 transition-colors"
              onClick={() => setSelectedMed(med)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-senior-base font-semibold flex items-center">
                      <Pill className="mr-2" size={18} />
                      {med.name}
                    </p>
                    {med.prescription_required && (
                      <Badge variant="destructive" className="mt-2">
                        <ShieldAlert size={14} className="mr-1" />
                        Receita Médica Obrigatória
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Detalhes do Medicamento Selecionado */}
      {selectedMed && (
        <Card className="card-soft">
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-senior-xl text-primary mb-2">{selectedMed.name}</h3>
              {selectedMed.prescription_required && (
                <Badge variant="destructive" className="text-senior-base">
                  <ShieldAlert size={16} className="mr-1" />
                  Receita Médica Obrigatória
                </Badge>
              )}
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="text-primary mt-1" size={20} />
              <div>
                <p className="font-semibold text-senior-base">Tempo de Efeito</p>
                <p className="text-muted-foreground">{selectedMed.effect_time}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FileText className="text-primary mt-1" size={20} />
              <div>
                <p className="font-semibold text-senior-base">Benefícios</p>
                <p className="text-muted-foreground">{selectedMed.benefits}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-orange-500 mt-1" size={20} />
              <div>
                <p className="font-semibold text-senior-base">Efeitos Colaterais</p>
                <p className="text-muted-foreground">{selectedMed.side_effects}</p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>⚠️ Importante:</strong> Sempre consulte um médico ou farmacêutico antes de usar qualquer medicamento. 
                Esta é apenas uma informação educativa e não substitui orientação profissional.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MedicamentoDetailPage;
