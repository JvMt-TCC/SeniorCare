import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Users, User } from "lucide-react";
import GPSMap from "../components/GPSMap";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Recebe evento vindo do Link (SugestoesPage)
  const event = location.state?.event;

  // Dados extras fictícios para todos os eventos
  const eventDetails: Record<number, any> = {
    1: {
      time: "19:00",
      address: "Rua Quinze de Novembro, 35 - Centro",
      coordinates: { lat: -22.8833, lng: -43.1036 },
    },
    2: {
      time: "14:00",
      address: "Rua das Artes, 120 - São Francisco",
      coordinates: { lat: -22.9001, lng: -43.1005 },
    },
    3: {
      time: "07:30",
      address: "Av. Beira-Mar, 45 - Icaraí",
      coordinates: { lat: -22.8964, lng: -43.1066 },
    },
    4: {
      time: "18:00",
      address: "Rua da Música, 22 - Ingá",
      coordinates: { lat: -22.8912, lng: -43.1155 },
    },
    5: {
      time: "08:00",
      address: "Praça Leoni Ramos - São Domingos",
      coordinates: { lat: -22.9007, lng: -43.105 },
    },
    6: {
      time: "09:00",
      address: "Av. Fonseca, 310 - Fonseca",
      coordinates: { lat: -22.88, lng: -43.11 },
    },
    7: {
      time: "08:00",
      address: "Parque da Cidade - Charitas",
      coordinates: { lat: -22.902, lng: -43.095 },
    },
    8: {
      time: "19:30",
      address: "Av. Central, 90 - Centro",
      coordinates: { lat: -22.89, lng: -43.1 },
    },
    9: {
      time: "07:00",
      address: "Campo de São Bento",
      coordinates: { lat: -22.8975, lng: -43.109 },
    },
    10: {
      time: "18:00",
      address: "Clube Germânia - Barreto",
      coordinates: { lat: -22.8905, lng: -43.115 },
    },
    11: {
      time: "15:00",
      address: "Escola Técnica - Pendotiba",
      coordinates: { lat: -22.87, lng: -43.09 },
    },
    12: {
      time: "20:00",
      address: "Quadra da Escola de Samba - Jurujuba",
      coordinates: { lat: -22.893, lng: -43.098 },
    },
    13: {
      time: "16:00",
      address: "Teatro Popular - Santa Rosa",
      coordinates: { lat: -22.88, lng: -43.1055 },
    },
    14: {
      time: "09:00",
      address: "Praça do Rádio Amador - Piratininga",
      coordinates: { lat: -22.9005, lng: -43.12 },
    },
    15: {
      time: "14:00",
      address: "Instituto Gastronômico - Itaipu",
      coordinates: { lat: -22.91, lng: -43.13 },
    },
    16: {
      time: "17:00",
      address: "Auditório Municipal - Várzea das Moças",
      coordinates: { lat: -22.915, lng: -43.14 },
    },
    17: {
      time: "08:30",
      address: "Fortaleza de Santa Cruz - Jurujuba",
      coordinates: { lat: -22.92, lng: -43.15 },
    },
    18: {
      time: "18:00",
      address: "Ginásio do Caramujo",
      coordinates: { lat: -22.93, lng: -43.16 },
    },
    19: {
      time: "10:00",
      address: "Centro Comunitário - Engenhoca",
      coordinates: { lat: -22.94, lng: -43.17 },
    },
    20: {
      time: "15:00",
      address: "Clube da Melhor Idade - Alcântara",
      coordinates: { lat: -22.95, lng: -43.18 },
    },
  };

  const details = event ? eventDetails[event.id] : null;

  const friends = [
    { id: 1, name: "Maria", going: true },
    { id: 2, name: "José", going: true },
    { id: 3, name: "Ana", going: false },
    { id: 4, name: "Carlos", going: true },
    { id: 5, name: "Rosa", going: false },
  ];

  const goingFriends = friends.filter((friend) => friend.going);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center pt-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-secondary text-primary hover:bg-primary-soft transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-senior-lg text-primary ml-4">Detalhes do Evento</h1>
      </div>

      {/* Imagem */}
      {event?.image && (
        <div className="card-soft">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-48 object-cover rounded-xl mb-4"
          />
        </div>
      )}

      {/* Informações */}
      {event && details && (
        <div className="card-soft">
          <h2 className="text-senior-xl text-primary mb-4">{event.title}</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {event.description}
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar size={20} className="mr-3 text-primary" />
              <div>
                <p className="font-semibold">
                  {new Date(event.date).toLocaleDateString("pt-BR")}
                </p>
                <p className="text-sm text-muted-foreground">{details.time}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin size={20} className="mr-3 text-primary mt-1" />
              <div>
                <p className="font-semibold">{event.location}</p>
                <p className="text-sm text-muted-foreground">
                  {details.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Amigos */}
      <div className="card-soft">
        <h3 className="text-senior-lg text-primary mb-4 flex items-center">
          <Users size={20} className="mr-2" /> Amigos Participando (
          {goingFriends.length})
        </h3>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {goingFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex flex-col items-center space-y-2 min-w-0"
            >
              <div className="friend-avatar">
                <User size={20} className="text-primary" />
              </div>
              <span className="text-sm text-center font-medium">
                {friend.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mapa */}
      {details?.coordinates && (
        <GPSMap
          targetLat={details.coordinates.lat}
          targetLng={details.coordinates.lng}
          locationName={event.location}
        />
      )}

      {/* Botão */}
      <div className="pb-4">
        <button className="btn-primary w-full">Confirmar Participação</button>
      </div>
    </div>
  );
};

export default EventDetailPage;
