import { useState, useEffect } from "react";
import { MapPin, Navigation, Loader } from "lucide-react";
import { Geolocation } from '@capacitor/geolocation';

interface GPSMapProps {
  targetLat: number;
  targetLng: number;
  locationName: string;
}

const GPSMap = ({ targetLat, targetLng, locationName }: GPSMapProps) => {
  const [currentPosition, setCurrentPosition] = useState<{lat: number, lng: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);

  const getCurrentPosition = async () => {
    setLoading(true);
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      const current = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };

      setCurrentPosition(current);
      
      // Calcular distância
      const dist = calculateDistance(current.lat, current.lng, targetLat, targetLng);
      setDistance(dist);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      // Fallback para posição simulada
      const fallback = { lat: -22.8833, lng: -43.1036 };
      setCurrentPosition(fallback);
      const dist = calculateDistance(fallback.lat, fallback.lng, targetLat, targetLng);
      setDistance(dist);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const openInMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${targetLat},${targetLng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="card-soft">
      <h3 className="text-senior-lg text-primary mb-4 flex items-center">
        <MapPin size={20} className="mr-2" />
        Localização GPS
      </h3>

      {/* Mapa Visual Simulado */}
      <div className="w-full h-48 bg-secondary rounded-xl mb-4 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin size={48} className="text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">{locationName}</p>
            <p className="text-xs text-muted-foreground">
              {targetLat.toFixed(4)}, {targetLng.toFixed(4)}
            </p>
          </div>
        </div>

        {/* Indicador de posição atual */}
        {currentPosition && (
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-2 py-1 rounded-lg text-xs">
            Você está aqui
          </div>
        )}

        {/* Linha conectando posições */}
        {currentPosition && (
          <svg className="absolute inset-0 w-full h-full">
            <line
              x1="20%"
              y1="80%"
              x2="50%"
              y2="50%"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>
        )}
      </div>

      {/* Informações de localização */}
      <div className="space-y-3">
        {currentPosition && distance && (
          <div className="bg-primary-soft rounded-xl p-3">
            <p className="text-sm font-medium text-primary">
              📍 Distância: {distance.toFixed(1)} km
            </p>
            <p className="text-xs text-muted-foreground">
              Sua posição: {currentPosition.lat.toFixed(4)}, {currentPosition.lng.toFixed(4)}
            </p>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={getCurrentPosition}
            disabled={loading}
            className="flex-1 btn-primary flex items-center justify-center"
          >
            {loading ? (
              <Loader size={16} className="mr-2 animate-spin" />
            ) : (
              <Navigation size={16} className="mr-2" />
            )}
            {loading ? 'Localizando...' : 'Minha Localização'}
          </button>

          <button
            onClick={openInMaps}
            className="flex-1 py-3 border border-primary text-primary rounded-xl hover:bg-primary-soft transition-colors"
          >
            Abrir no Maps
          </button>
        </div>
      </div>
    </div>
  );
};

export default GPSMap;