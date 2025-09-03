import { useState } from "react";
import { Send, User, ArrowLeft } from "lucide-react";

interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
}

const MensagensPage = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const contacts: Contact[] = [
    {
      id: 1,
      name: "Maria Silva",
      lastMessage: "Oi! Como você está?",
      time: "14:30",
      unread: 2
    },
    {
      id: 2,
      name: "José Santos",
      lastMessage: "Vamos ao baile hoje?",
      time: "12:15",
      unread: 0
    },
    {
      id: 3,
      name: "Ana Costa",
      lastMessage: "Obrigada pela receita!",
      time: "10:45",
      unread: 1
    },
    {
      id: 4,
      name: "Carlos Oliveira",
      lastMessage: "Até amanhã na caminhada",
      time: "Ontem",
      unread: 0
    },
    {
      id: 5,
      name: "Rosa Ferreira",
      lastMessage: "Parabéns pelo aniversário!",
      time: "Ontem",
      unread: 0
    }
  ];

  const [messages, setMessages] = useState<Record<number, Message[]>>({
    1: [
      { id: 1, text: "Oi! Como você está?", sender: 'other', time: "14:30" },
      { id: 2, text: "Tudo bem, obrigado! E você?", sender: 'me', time: "14:32" },
      { id: 3, text: "Estou ótima! Que bom saber que você está bem.", sender: 'other', time: "14:35" }
    ],
    2: [
      { id: 1, text: "Vamos ao baile hoje?", sender: 'other', time: "12:15" },
      { id: 2, text: "Claro! A que horas?", sender: 'me', time: "12:20" },
      { id: 3, text: "Às 19h. Te busco às 18:30?", sender: 'other', time: "12:22" }
    ],
    3: [
      { id: 1, text: "Obrigada pela receita!", sender: 'other', time: "10:45" },
      { id: 2, text: "Ficou gostoso?", sender: 'me', time: "10:50" },
      { id: 3, text: "Delicioso! Minha família adorou.", sender: 'other', time: "11:00" }
    ]
  });

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedContact) {
      const newMsg: Message = {
        id: Date.now(),
        text: newMessage.trim(),
        sender: 'me',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg]
      }));

      setNewMessage("");
    }
  };

  if (selectedContact) {
    const chatMessages = messages[selectedContact.id] || [];

    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Header do Chat */}
        <div className="card-soft mb-4 flex items-center flex-shrink-0">
          <button
            onClick={() => setSelectedContact(null)}
            className="p-2 rounded-xl bg-secondary text-primary hover:bg-primary-soft transition-colors mr-3"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="friend-avatar mr-3">
            <User size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-senior-lg text-primary">{selectedContact.name}</h2>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>

        {/* Mensagens - Área com scroll */}
        <div className="flex-1 overflow-y-auto px-1 mb-4" style={{ scrollbarWidth: 'thin' }}>
          <div className="space-y-3">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-xs p-3 rounded-2xl
                    ${message.sender === 'me' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-foreground'
                    }
                  `}
                >
                  <p className="text-senior-base">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input de Mensagem - Fixo na parte inferior */}
        <div className="flex space-x-2 bg-background p-2 border-t border-border flex-shrink-0">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-3 border border-border rounded-xl bg-background text-senior-base"
          />
          <button
            onClick={handleSendMessage}
            className="btn-primary px-4 flex-shrink-0"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="text-center pt-4">
        <h1 className="text-senior-xl text-primary mb-2">Mensagens</h1>
        <p className="text-muted-foreground">Converse com seus amigos</p>
      </div>

      <div className="space-y-3">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => setSelectedContact(contact)}
            className="card-soft hover:shadow-md transition-all cursor-pointer flex items-center"
          >
            <div className="friend-avatar mr-4">
              <User size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-foreground">{contact.name}</h3>
                <span className="text-sm text-muted-foreground">{contact.time}</span>
              </div>
              <p className="text-muted-foreground text-sm truncate">{contact.lastMessage}</p>
            </div>
            {contact.unread > 0 && (
              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ml-2">
                {contact.unread}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MensagensPage;