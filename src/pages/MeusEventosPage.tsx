import { useState, useEffect } from "react";
import { Calendar, MapPin, Check, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Importar todas as imagens dos eventos
import bailejpg from "../images/Baile.jpg";
import chuijpg from "../images/Chui.jpg";
import artejpg from "../images/arte.jpg";
import caminhadajpg from "../images/caminhada.jpg";
import choppjpg from "../images/chopp.jpg";
import culinarajpg from "../images/culinaria.jpg";
import dominojpg from "../images/domino.jpg";
import ecologicojpg from "../images/ecologico.jpg";
import fotografajpg from "../images/fotografa.jpg";
import hidroginasticajpg from "../images/hidroginastica.jpg";
import mercadojpg from "../images/mercado.jpg";
import poesiajpg from "../images/poesia.jpg";
import quadrilhajpg from "../images/quadrilha.jpg";
import sambajpg from "../images/sambaa.jpg";
import talentojpg from "../images/talento.jpg";
import teatrojpg from "../images/teatro.jpg";
import tricojpg from "../images/trico.jpg";
import trocasjpg from "../images/trocas.jpg";
import violaojpg from "../images/violao.jpg";
import workshopjpg from "../images/workshop.jpg";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
}

interface EventRegistration {
  id: string;
  event_id: number;
  status: string;
}

const MeusEventosPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);

  const events: Event[] = [
    {
      id: 1,
      title: "Caminhada no Parque",
      description: "Caminhe conosco pelas trilhas do parque e desfrute da natureza.",
      date: "2025-08-20",
      location: "Parque da Cidade",
      image: caminhadajpg
    },
    {
      id: 2,
      title: "Aula de Culinária",
      description: "Aprenda receitas deliciosas e saudáveis com nossos chefs.",
      date: "2025-08-22",
      location: "Centro Comunitário",
      image: culinarajpg
    },
    {
      id: 3,
      title: "Oficina de Arte",
      description: "Desenvolva sua criatividade com pintura e artesanato.",
      date: "2025-08-25",
      location: "Espaço Cultural",
      image: artejpg
    },
    {
      id: 4,
      title: "Baile da Terceira Idade",
      description: "Uma noite especial de música e dança para todos.",
      date: "2025-08-28",
      location: "Salão de Festas",
      image: bailejpg
    },
    {
      id: 5,
      title: "Sessão de Cinema",
      description: "Filmes clássicos com pipoca e boa companhia.",
      date: "2025-08-30",
      location: "Cinema do Bairro",
      image: chuijpg
    },
    {
      id: 6,
      title: "Tarde de Jogos",
      description: "Domin, cartas e outros jogos de tabuleiro.",
      date: "2025-09-02",
      location: "Centro Comunitário",
      image: dominojpg
    },
    {
      id: 7,
      title: "Passeio Ecológico",
      description: "Explore a natureza e aprenda sobre o meio ambiente.",
      date: "2025-09-05",
      location: "Reserva Natural",
      image: ecologicojpg
    },
    {
      id: 8,
      title: "Workshop de Fotografia",
      description: "Aprenda técnicas básicas de fotografia.",
      date: "2025-09-08",
      location: "Biblioteca Municipal",
      image: fotografajpg
    },
    {
      id: 9,
      title: "Hidroginástica",
      description: "Exercícios na água para melhorar a saúde.",
      date: "2025-09-10",
      location: "Clube Aquático",
      image: hidroginasticajpg
    },
    {
      id: 10,
      title: "Visita ao Mercado",
      description: "Conheça produtos locais e frescos.",
      date: "2025-09-12",
      location: "Mercado Municipal",
      image: mercadojpg
    },
    {
      id: 11,
      title: "Recital de Poesia",
      description: "Compartilhe e ouça belas poesias.",
      date: "2025-09-15",
      location: "Café Literário",
      image: poesiajpg
    },
    {
      id: 12,
      title: "Festa Junina",
      description: "Celebre as tradições com dança e comida típica.",
      date: "2025-09-18",
      location: "Praça Central",
      image: quadrilhajpg
    },
    {
      id: 13,
      title: "Roda de Samba",
      description: "Curta boa música e faça novos amigos.",
      date: "2025-09-20",
      location: "Bar do Samba",
      image: sambajpg
    },
    {
      id: 14,
      title: "Show de Talentos",
      description: "Mostre seu talento ou aprecie apresentações.",
      date: "2025-09-22",
      location: "Teatro Municipal",
      image: talentojpg
    },
    {
      id: 15,
      title: "Peça de Teatro",
      description: "Assista a uma emocionante apresentação teatral.",
      date: "2025-09-25",
      location: "Teatro do Bairro",
      image: teatrojpg
    },
    {
      id: 16,
      title: "Curso de Tricô",
      description: "Aprenda a tricotar e faça peças incríveis.",
      date: "2025-09-28",
      location: "Centro de Artesanato",
      image: tricojpg
    },
    {
      id: 17,
      title: "Feira de Trocas",
      description: "Troque objetos e roupas em bom estado.",
      date: "2025-10-01",
      location: "Praça do Comércio",
      image: trocasjpg
    },
    {
      id: 18,
      title: "Aula de Violão",
      description: "Aprenda acordes básicos e toque suas músicas favoritas.",
      date: "2025-10-05",
      location: "Escola de Música",
      image: violaojpg
    },
    {
      id: 19,
      title: "Workshop de Bem-Estar",
      description: "Dicas para uma vida mais saudável e feliz.",
      date: "2025-10-08",
      location: "Centro de Saúde",
      image: workshopjpg
    },
    {
      id: 20,
      title: "Happy Hour",
      description: "Encontro descontraído com petiscos e bebidas.",
      date: "2025-10-10",
      location: "Choperia da Praça",
      image: choppjpg
    }
  ];

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao buscar registros:', error);
        return;
      }

      if (data) {
        setRegistrations(data);
      }
    };

    fetchRegistrations();
  }, [user]);

  const registeredEvents = events.filter(event => 
    registrations.some(reg => reg.event_id === event.id)
  );

  const updateStatus = async (eventId: number, newStatus: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('event_registrations')
      .update({ status: newStatus })
      .eq('user_id', user.id)
      .eq('event_id', eventId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
      return;
    }

    setRegistrations(prev => 
      prev.map(reg => 
        reg.event_id === eventId ? { ...reg, status: newStatus } : reg
      )
    );

    toast({
      title: "Sucesso",
      description: `Status atualizado para ${newStatus === 'presente' ? 'Presente' : 'Ausente'}.`,
    });
  };

  const getStatusForEvent = (eventId: number) => {
    return registrations.find(reg => reg.event_id === eventId)?.status || 'registrado';
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="text-center pt-4">
        <h1 className="text-senior-xl text-primary mb-2">Meus Eventos</h1>
        <p className="text-senior-base text-muted-foreground">
          Eventos em que você está inscrito
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {registeredEvents.length > 0 ? (
          registeredEvents.map((event) => {
            const status = getStatusForEvent(event.id);
            return (
              <div
                key={event.id}
                className="card-soft overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-senior-lg text-primary mb-3">{event.title}</h3>
                  <p className="text-senior-base text-muted-foreground mb-4">
                    {event.description}
                  </p>
                  <div className="flex items-center text-senior-sm text-muted-foreground mb-2">
                    <Calendar size={18} className="mr-2" />
                    <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center text-senior-sm text-muted-foreground mb-4">
                    <MapPin size={18} className="mr-2" />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => updateStatus(event.id, 'presente')}
                      className={`flex-1 touch-button ${
                        status === 'presente' 
                          ? 'bg-primary hover:bg-primary/90' 
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                      variant={status === 'presente' ? 'default' : 'outline'}
                    >
                      <Check size={20} className="mr-2" />
                      Presente
                    </Button>
                    <Button
                      onClick={() => updateStatus(event.id, 'ausente')}
                      className={`flex-1 touch-button ${
                        status === 'ausente' 
                          ? 'bg-destructive hover:bg-destructive/90' 
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                      variant={status === 'ausente' ? 'default' : 'outline'}
                    >
                      <X size={20} className="mr-2" />
                      Ausente
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card-soft text-center py-12">
            <p className="text-senior-base text-muted-foreground">
              Você ainda não está inscrito em nenhum evento.
            </p>
            <p className="text-senior-sm text-muted-foreground mt-2">
              Vá para a página de Sugestões para se inscrever!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeusEventosPage;
