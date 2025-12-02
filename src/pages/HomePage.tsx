import { Plus, Clock, Trash2, User } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAlarms } from "../contexts/AlarmContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import AddFriendDialog from "../components/AddFriendDialog";
import FriendProfileModal from "../components/FriendProfileModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DAILY_PHRASES = [
  "A idade não é medida pelos anos vividos, mas pela sabedoria adquirida e pelos sorrisos compartilhados.",
  "Cada dia é uma nova oportunidade para aprender, crescer e fazer a diferença.",
  "A experiência é o melhor professor e a paciência, a melhor virtude.",
  "Nunca é tarde para ser aquilo que você sempre quis ser.",
  "A vida começa no fim da sua zona de conforto.",
  "Envelhecer é um privilégio, e sabedoria é o prêmio.",
  "Os melhores momentos da vida são aqueles compartilhados com quem amamos.",
  "Cada ruga conta uma história de risadas e experiências vividas.",
  "A idade traz sabedoria, e a sabedoria traz paz interior.",
  "Hoje é o dia perfeito para fazer algo que você ama."
];

interface Friend {
  id: string;
  nome: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  data_nascimento: string | null;
}

const HomePage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { alarms, addAlarm, removeAlarm, toggleAlarm } = useAlarms();
  const [isAlarmDialogOpen, setIsAlarmDialogOpen] = useState(false);
  const [newAlarm, setNewAlarm] = useState({ title: "", time: "" });
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [isFriendProfileOpen, setIsFriendProfileOpen] = useState(false);
  const [tasks, setTasks] = useState<Array<{ id: string; title: string; subtitle: string | null; date: string }>>([]);

  // Frase do dia - fixa até novo login
  const dailyPhrase = useMemo(() => {
    const storedPhrase = sessionStorage.getItem('dailyPhrase');
    if (storedPhrase) {
      return storedPhrase;
    }
    const randomPhrase = DAILY_PHRASES[Math.floor(Math.random() * DAILY_PHRASES.length)];
    sessionStorage.setItem('dailyPhrase', randomPhrase);
    return randomPhrase;
  }, []);

  // Buscar tarefas do Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar tarefas:', error);
        return;
      }
      
      if (data) {
        setTasks(data.map(t => ({
          id: t.id,
          title: t.title,
          subtitle: t.subtitle || '',
          date: t.date
        })));
      }
    };

    fetchTasks();
  }, [user]);

  // Buscar amigos do Supabase
  const fetchFriends = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('friends')
      .select(`
        id,
        friend_user_id,
        profiles!friends_friend_user_id_fkey(
          id,
          nome,
          username,
          bio,
          avatar_url,
          data_nascimento
        )
      `)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Erro ao buscar amigos:', error);
      return;
    }
    
    if (data) {
      const friendsList = data
        .filter(f => f.profiles)
        .map(f => ({
          id: f.profiles.id,
          nome: f.profiles.nome,
          username: f.profiles.username,
          bio: f.profiles.bio,
          avatar_url: f.profiles.avatar_url,
          data_nascimento: f.profiles.data_nascimento,
        }));
      setFriends(friendsList);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [user]);

  // Mostrar todas as tarefas ordenadas por data
  const allTasks = [...tasks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleAddAlarm = () => {
    if (newAlarm.title && newAlarm.time) {
      addAlarm(newAlarm.title, newAlarm.time);
      setNewAlarm({ title: "", time: "" });
      setIsAlarmDialogOpen(false);
    }
  };

  const handleFriendClick = (friend: Friend) => {
    setSelectedFriend(friend);
    setIsFriendProfileOpen(true);
  };

  const isVolunteer = profile?.user_type === 'voluntario';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pt-4">
        <h1 className="text-senior-xl text-primary mb-2">
          {isVolunteer 
            ? `Olá, Voluntário${user ? ` ${user.user_metadata?.nome || ''}` : ''}!`
            : `Bem vindo de volta${user ? `, ${user.user_metadata?.nome || 'usuário'}` : ''}!`
          }
        </h1>
        {isVolunteer && (
          <p className="text-muted-foreground">Obrigado por fazer a diferença!</p>
        )}
      </div>

      {/* Frase do Dia */}
      <div className={`slide-up ${isVolunteer ? 'card-soft border-2 border-primary/30' : 'card-primary'}`}>
        <h2 className="text-senior-lg mb-3">{isVolunteer ? 'Motivação do Dia' : 'Frase do Dia'}</h2>
        <p className="text-senior-base opacity-90">
          {dailyPhrase}
        </p>
      </div>

      {/* Amigos */}
      <div className="card-soft slide-up">
        <h3 className="text-senior-lg text-primary mb-6">Amigos</h3>
        <div className="flex space-x-4 overflow-x-auto pb-4 mobile-scroll">
          {friends.map((friend) => (
            <div 
              key={friend.id} 
              className="flex flex-col items-center min-w-[80px] cursor-pointer"
              onClick={() => handleFriendClick(friend)}
            >
              <Avatar className="w-16 h-16 mb-3">
                <AvatarImage src={friend.avatar_url || undefined} />
                <AvatarFallback className="bg-primary-soft text-primary text-xl">
                  {friend.nome.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-center font-medium">{friend.nome.split(' ')[0]}</span>
            </div>
          ))}
          <div className="flex flex-col items-center min-w-[80px]">
            <button 
              onClick={() => setIsAddFriendOpen(true)}
              className="touch-target w-16 h-16 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors mb-3"
            >
              <Plus size={28} className="text-primary-foreground" />
            </button>
            <span className="text-sm text-center font-medium">Adicionar</span>
          </div>
        </div>
      </div>

      {/* Tarefas */}
      <div className="card-soft slide-up">
        <h3 className="text-senior-lg text-primary mb-4">Minhas Tarefas</h3>
        <div className="space-y-3">
          {allTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma tarefa cadastrada
            </p>
          ) : (
            allTasks.map((task) => {
              const taskDate = new Date(task.date + 'T00:00:00');
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isPastDue = taskDate < today;
              const isToday = taskDate.getTime() === today.getTime();

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isPastDue
                      ? 'bg-red-50 border-red-200'
                      : isToday
                      ? 'bg-primary-soft border-primary'
                      : 'bg-white border-border'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">
                        {task.title}
                      </h4>
                      {task.subtitle && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {task.subtitle}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {new Date(task.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                        {isToday && <span className="ml-2 text-primary font-medium">• Hoje</span>}
                        {isPastDue && <span className="ml-2 text-red-600 font-medium">• Atrasada</span>}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Alarmes - apenas para idosos */}
      {!isVolunteer && (
        <div className="card-soft slide-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-senior-lg text-primary">Alarmes</h3>
            <Dialog open={isAlarmDialogOpen} onOpenChange={setIsAlarmDialogOpen}>
              <DialogTrigger asChild>
                <button className="touch-target p-2 bg-primary rounded-full hover:bg-primary/90 transition-colors">
                  <Plus size={20} className="text-primary-foreground" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Alarme</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Título do alarme"
                    value={newAlarm.title}
                    onChange={(e) => setNewAlarm({ ...newAlarm, title: e.target.value })}
                    className="text-senior-base"
                  />
                  <Input
                    type="time"
                    value={newAlarm.time}
                    onChange={(e) => setNewAlarm({ ...newAlarm, time: e.target.value })}
                    className="text-senior-base"
                  />
                  <Button onClick={handleAddAlarm} className="w-full">
                    Adicionar Alarme
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {alarms.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum alarme configurado
              </p>
            ) : (
              alarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className={`p-4 rounded-xl border-2 flex items-center justify-between ${
                    alarm.isActive ? 'bg-white border-primary' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <Clock size={24} className={alarm.isActive ? 'text-primary' : 'text-gray-400'} />
                    <div>
                      <p className={`font-medium ${alarm.isActive ? 'text-foreground' : 'text-gray-500'}`}>
                        {alarm.title}
                      </p>
                      <p className={`text-lg ${alarm.isActive ? 'text-primary' : 'text-gray-400'}`}>
                        {alarm.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        alarm.isActive ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          alarm.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => removeAlarm(alarm.id)}
                      className="touch-target p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Seção exclusiva para voluntários */}
      {isVolunteer && (
        <div className="card-soft slide-up border-2 border-primary/20 bg-primary/5">
          <h3 className="text-senior-lg text-primary mb-4">Área do Voluntário</h3>
          <p className="text-muted-foreground mb-4">
            Acesse a seção de Voluntariado para ver e ajudar idosos que precisam de apoio.
          </p>
          <Button 
            onClick={() => navigate('/saude/ajuda-amigo')}
            className="w-full"
          >
            Ver Solicitações de Ajuda
          </Button>
        </div>
      )}

      <AddFriendDialog
        isOpen={isAddFriendOpen}
        onOpenChange={setIsAddFriendOpen}
        onRequestSent={fetchFriends}
      />

      <FriendProfileModal
        isOpen={isFriendProfileOpen}
        onOpenChange={setIsFriendProfileOpen}
        friend={selectedFriend}
      />
    </div>
  );
};

export default HomePage;
