import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const LocaisCuidadoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const [healthLocations, setHealthLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthLocations = async () => {
      const { data, error } = await supabase
        .from('health_locations')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar locais de saúde:', error);
      } else if (data) {
        // Calcular distância e ordenar por proximidade se o usuário tiver coordenadas
        if (profile?.latitude && profile?.longitude) {
          const locationsWithDistance = data.map(loc => ({
            ...loc,
            distance: calculateDistance(
              Number(profile.latitude),
              Number(profile.longitude),
              Number(loc.latitude),
              Number(loc.longitude)
            )
          }));
          
          // Ordenar por distância
          locationsWithDistance.sort((a, b) => a.distance - b.distance);
          setHealthLocations(locationsWithDistance);
        } else {
          setHealthLocations(data);
        }
      }
      setLoading(false);
    };

    fetchHealthLocations();
  }, [profile]);

  // Função para calcular distância entre dois pontos usando Haversine
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distância em km
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Hospital': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      'UPA': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
      'Posto de Saúde': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      'Clínica': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      'Policlínica': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-secondary text-primary hover:bg-primary-soft transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="ml-4">
          <h1 className="text-senior-lg text-primary">Locais de Cuidado</h1>
          <p className="text-sm text-muted-foreground">
            {profile?.latitude && profile?.longitude 
              ? 'Ordenados por proximidade' 
              : profile?.cidade || 'Todos os locais'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando locais...</p>
        </div>
      ) : healthLocations.length === 0 ? (
        <Card className="card-soft text-center py-12">
          <MapPin size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-senior-base text-muted-foreground">
            Nenhum local encontrado na sua região
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {healthLocations.map((loc) => (
            <Card
              key={loc.id}
              className="card-soft cursor-pointer hover:bg-primary/5 transition-colors"
              onClick={() =>
                navigate(`/saude/locais/${loc.id}`, {
                  state: {
                    location: {
                      ...loc,
                      coordinates: { lat: Number(loc.latitude), lng: Number(loc.longitude) }
                    }
                  }
                })
              }
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-senior-base font-semibold">{loc.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{loc.address}</p>
                    <p className="text-sm text-muted-foreground">{loc.neighborhood}</p>
                    {loc.distance && (
                      <p className="text-xs text-primary font-semibold mt-1">
                        📍 {loc.distance.toFixed(1)} km de distância
                      </p>
                    )}
                  </div>
                  <Badge className={getTypeColor(loc.type)}>{loc.type}</Badge>
                </div>
                
                {loc.phone && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone size={14} className="mr-2" />
                    {loc.phone}
                  </div>
                )}

                {loc.services && loc.services.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {loc.services.slice(0, 3).map((service: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                      >
                        {service}
                      </span>
                    ))}
                    {loc.services.length > 3 && (
                      <span className="px-2 py-1 bg-secondary text-muted-foreground rounded-full text-xs">
                        +{loc.services.length - 3} mais
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocaisCuidadoPage;
