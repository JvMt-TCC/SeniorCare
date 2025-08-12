import { MapPin, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Baile from "../images/Baile.jpg";
import arte from "../images/arte.jpg";
import hidroginastica from "../images/hidroginastica.jpg";
import violao from "../images/violao.jpg";
import mercado from "../images/mercado.jpg";
import workshop from "../images/workshop.jpg";
import ecologico from "../images/ecologico.jpg";
import poesia from "../images/poesia.jpg";
import Chui from "../images/Chui.jpg";
import chopp from "../images/chopp.jpg";
import fotografia from "../images/fotografa.jpg";
import teatro from "../images/teatro.jpg";
import trocas from "../images/trocas.jpg";
import culinaria from "../images/culinaria.jpg";
import talento from "../images/talento.jpg";
import caminhada from "../images/caminhada.jpg";
import quadrilha from "../images/quadrilha.jpg";
import tricô from "../images/trico.jpg";
import dominó from "../images/domino.jpg";
import samba from "../images/sambaa.jpg";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
}

const SugestoesPage = () => {
  const events: Event[] = [
    {
      id: 1,
      title: "Baile da Terceira Idade",
      description:
        "Uma noite especial com músicas dos anos 60 e 70, danças de salão e muita diversão.",
      date: "2024-08-15",
      location: "Centro Cultural de Niterói",
      image: Baile,
    },
    {
      id: 2,
      title: "Aula de Pintura em Tela",
      description:
        "Desenvolva sua criatividade com técnicas de pintura em tela e aquarela.",
      date: "2024-08-18",
      location: "Atelier Criativo - São Francisco",
      image: arte,
    },
    {
      id: 3,
      title: "Hidroginástica Matinal",
      description:
        "Exercícios aquáticos para fortalecer músculos e articulações de forma suave.",
      date: "2024-08-20",
      location: "Clube Aquático de Icaraí",
      image: hidroginastica,
    },
    {
      id: 4,
      title: "Festival de Violão",
      description:
        "Apresentações musicais com violonistas locais e roda de conversa sobre música.",
      date: "2024-08-22",
      location: "Casa da Cultura - Ingá",
      image: violao,
    },
    {
      id: 5,
      title: "Mercado de Produtos Orgânicos",
      description:
        "Feira com alimentos frescos, plantas medicinais e produtos artesanais.",
      date: "2024-08-25",
      location: "Praça Leoni Ramos - São Domingos",
      image: mercado,
    },
    {
      id: 6,
      title: "Workshop de Memórias",
      description:
        "Atividades para estimular a memória através de jogos e exercícios mentais.",
      date: "2024-08-28",
      location: "Centro de Referência - Fonseca",
      image: workshop,
    },
    {
      id: 7,
      title: "Passeio Ecológico",
      description:
        "Caminhada pela Trilha do Morro da Viração com guia especializado.",
      date: "2024-08-30",
      location: "Parque da Cidade - Charitas",
      image: ecologico,
    },
    {
      id: 8,
      title: "Noite de Poesia",
      description:
        "Sarau com declamação de poesias e obras literárias da terceira idade.",
      date: "2024-09-02",
      location: "Biblioteca Popular - Centro",
      image: poesia,
    },
    {
      id: 9,
      title: "Tai Chi Chuan no Parque",
      description:
        "Prática de arte marcial chinesa para equilíbrio e bem-estar mental.",
      date: "2024-09-05",
      location: "Campo de São Bento",
      image: Chui,
    },
    {
      id: 10,
      title: "Festa do Chopp Alemão",
      description:
        "Celebração com música típica, dança e gastronomia germânica.",
      date: "2024-09-08",
      location: "Clube Germânia - Barreto",
      image: chopp,
    },
    {
      id: 11,
      title: "Curso de Fotografia",
      description:
        "Aprenda técnicas básicas de fotografia digital e composição de imagens.",
      date: "2024-09-10",
      location: "Escola Técnica - Pendotiba",
      image: fotografia,
    },
    {
      id: 12,
      title: "Roda de Samba",
      description:
        "Encontro musical com sambistas locais e participação aberta ao público.",
      date: "2024-09-12",
      location: "Quadra da Escola de Samba - Jurujuba",
      image: samba,
    },
    {
      id: 13,
      title: "Oficina de Teatro",
      description:
        "Exercícios teatrais e improvisação para desenvolver expressão corporal.",
      date: "2024-09-15",
      location: "Teatro Popular - Santa Rosa",
      image: teatro,
    },
    {
      id: 14,
      title: "Feira de Trocas",
      description:
        "Troque livros, roupas e objetos em evento sustentável e comunitário.",
      date: "2024-09-18",
      location: "Praça do Rádio Amador - Piratininga",
      image: trocas,
    },
    {
      id: 15,
      title: "Curso de Culinária Italiana",
      description: "Prepare massas e molhos tradicionais da cozinha italiana.",
      date: "2024-09-20",
      location: "Instituto Gastronômico - Itaipu",
      image: culinaria,
    },
    {
      id: 16,
      title: "Show de Talentos",
      description:
        "Apresente seus talentos artísticos em evento aberto à comunidade.",
      date: "2024-09-22",
      location: "Auditório Municipal - Várzea das Moças",
      image: talento,
    },
    {
      id: 17,
      title: "Caminhada Histórica",
      description:
        "Conheça pontos históricos de Niterói com guia especializado.",
      date: "2024-09-25",
      location: "Fortaleza de Santa Cruz - Jurujuba",
      image: caminhada,
    },
    {
      id: 18,
      title: "Festival de Quadrilha",
      description:
        "Competição amigável de quadrilhas com prêmios e muita diversão.",
      date: "2024-09-28",
      location: "Ginásio do Caramujo",
      image: quadrilha,
    },
    {
      id: 19,
      title: "Aula de Tricô Avançado",
      description:
        "Técnicas especiais de tricô para criação de peças personalizadas.",
      date: "2024-09-30",
      location: "Centro Comunitário - Engenhoca",
      image: tricô,
    },
    {
      id: 20,
      title: "Torneio de Dominó",
      description:
        "Competição de dominó com premiação e confraternização entre participantes.",
      date: "2024-10-02",
      location: "Clube da Melhor Idade - Alcântara",
      image: dominó,
    },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="text-center pt-4">
        <h1 className="text-senior-xl text-primary mb-2">
          Sugestões de Eventos
        </h1>
        <p className="text-muted-foreground">
          Descubra atividades especiais para você
        </p>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <Link
            key={event.id}
            to={`/evento/${event.id}`}
            state={{ event }}
            className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex">
              <img
                src={event.image}
                alt={event.title}
                className="w-32 h-32 object-cover flex-shrink-0"
              />
              <div className="p-4 flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-3 text-sm leading-relaxed line-clamp-2">
                  {event.description}
                </p>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={14} className="mr-2 text-primary" />
                    {new Date(event.date).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin size={14} className="mr-2 text-primary" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SugestoesPage;
