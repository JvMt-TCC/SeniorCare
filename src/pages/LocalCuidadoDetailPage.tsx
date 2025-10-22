import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import GPSMap from "@/components/GPSMap";

const LocalCuidadoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const healthLocation = location.state?.location;

  // Informações adicionais por local
  const locationDetails: Record<number, any> = {
    1: {
      phone: "(21) 2620-7700",
      hours: "24 horas",
      services: ["Emergência", "Internação", "Cirurgias", "UTI"],
      description: "Hospital de referência em Niterói, oferece atendimento completo de emergência e especialidades médicas."
    },
    2: {
      phone: "(21) 2709-0800",
      hours: "07:00 - 19:00",
      services: ["Consultas", "Exames", "Vacinação", "Odontologia"],
      description: "Policlínica com atendimento ambulatorial em diversas especialidades médicas."
    },
    3: {
      phone: "(21) 2714-2200",
      hours: "08:00 - 17:00",
      services: ["Consultas", "Vacinação", "Curativo", "Medicamentos"],
      description: "Posto de saúde do bairro com atendimento de atenção primária."
    },
    4: {
      phone: "(21) 2620-2000",
      hours: "24 horas",
      services: ["Urgência", "Emergência", "Raio-X", "Medicamentos"],
      description: "Unidade de Pronto Atendimento 24 horas para urgências e emergências."
    },
    5: {
      phone: "(21) 2629-9000",
      hours: "24 horas",
      services: ["Emergência", "Ensino", "Pesquisa", "Especialidades"],
      description: "Hospital universitário com atendimento de alta complexidade e ensino médico."
    },
  };

  const details = healthLocation ? locationDetails[healthLocation.id] : null;

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
        <h1 className="text-senior-lg text-primary ml-4">Detalhes do Local</h1>
      </div>

      {/* Informações */}
      {healthLocation && details && (
        <Card className="card-soft">
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-senior-xl text-primary mb-2">{healthLocation.name}</h2>
              <p className="text-lg text-muted-foreground">{healthLocation.type}</p>
            </div>

            <p className="text-muted-foreground leading-relaxed">{details.description}</p>

            <div className="flex items-start space-x-3">
              <MapPin className="text-primary mt-1" size={20} />
              <div>
                <p className="font-semibold text-senior-base">Endereço</p>
                <p className="text-muted-foreground">{healthLocation.address}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="text-primary mt-1" size={20} />
              <div>
                <p className="font-semibold text-senior-base">Telefone</p>
                <p className="text-muted-foreground">{details.phone}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="text-primary mt-1" size={20} />
              <div>
                <p className="font-semibold text-senior-base">Horário de Funcionamento</p>
                <p className="text-muted-foreground">{details.hours}</p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-senior-base mb-2">Serviços Disponíveis</p>
              <div className="flex flex-wrap gap-2">
                {details.services.map((service: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Mapa */}
      {healthLocation?.coordinates && (
        <div>
          <h3 className="text-senior-lg text-primary mb-4">Localização</h3>
          <GPSMap
            targetLat={healthLocation.coordinates.lat}
            targetLng={healthLocation.coordinates.lng}
            locationName={healthLocation.name}
          />
        </div>
      )}

      {/* Botões de Ação */}
      <div className="space-y-3 pb-4">
        <button 
          className="btn-primary w-full"
          onClick={() => window.open(`tel:${details?.phone}`, '_self')}
        >
          Ligar para o Local
        </button>
        <button 
          className="btn-secondary w-full"
          onClick={() => {
            const { lat, lng } = healthLocation.coordinates;
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
          }}
        >
          Abrir no Google Maps
        </button>
      </div>
    </div>
  );
};

export default LocalCuidadoDetailPage;
