import { Plus, Clock, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAlarms } from "../contexts/AlarmContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import AddFriendDialog from "../components/AddFriendDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const HomePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { alarms, addAlarm, removeAlarm, toggleAlarm } = useAlarms();
  const [isAlarmDialogOpen, setIsAlarmDialogOpen] = useState(false);
  const [newAlarm, setNewAlarm] = useState({ title: "", time: "" });
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [friends, setFriends] = useState<Array<{ id: string; name: string; avatar: string | null }>>([]);
  const [tasks, setTasks] = useState<Array<{ id: string; title: string; subtitle: string | null; date: string }>>([]);

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
  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Erro ao buscar amigos:', error);
        return;
      }
      
      if (data) {
        setFriends(data);
      }
    };

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

  const handleAddFriend = async (friend: { name: string; avatar: string }) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('friends')
      .insert([{ 
        user_id: user.id, 
        name: friend.name, 
        avatar: friend.avatar || null 
      }])
      .select()
      .single();
    
    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o amigo.",
        variant: "destructive",
      });
      return;
    }
    
    if (data) {
      setFriends(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Amigo adicionado com sucesso!",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pt-4">
        <h1 className="text-senior-xl text-primary mb-2">
          Bem vindo de volta{user ? `, ${user.user_metadata?.nome || 'usuário'}` : ''}!
        </h1>
      </div>

      {/* Frase do Dia */}
      <div className="card-primary slide-up">
        <h2 className="text-senior-lg mb-3">Frase do Dia</h2>
        <p className="text-senior-base opacity-90">
          "A idade não é medida pelos anos vividos, mas pela sabedoria adquirida e pelos sorrisos compartilhados."
        </p>
      </div>

      {/* Amigos */}
      <div className="card-soft slide-up">
        <h3 className="text-senior-lg text-primary mb-6">Amigos</h3>
        <div className="flex space-x-4 overflow-x-auto pb-4 mobile-scroll">
          {/* TROCAR IMAGEM DO USUÁRIO: Substitua o span abaixo por uma tag <img> com src da foto do amigo */}
          {friends.map((friend, index) => (
            <div key={index} className="flex flex-col items-center min-w-[80px]">
              <div className="friend-avatar mb-3">
                <span className="text-primary text-xl font-bold">{friend.name[0]}</span>
              </div>
              <span className="text-sm text-center font-medium">{friend.name.split(' ')[0]}</span>
            </div>
          ))}
          <div className="flex flex-col items-center min-w-[80px]">
            <button 
              onClick={() => setIsAddFriendOpen(true)}
              className="touch-target w-16 h-16 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors mb-3"
            >
              <Plus size={24} className="text-white" />
            </button>
            <span className="text-sm text-center font-medium">Adicionar</span>
          </div>
        </div>
      </div>

      {/* Todas as Tarefas */}
      <div className="card-soft slide-up">
        <h3 className="text-senior-lg text-primary mb-6">Minhas Tarefas</h3>
        <div className="space-y-4">
          {allTasks.length > 0 ? (
            allTasks.map((task) => {
              const taskDate = new Date(task.date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              taskDate.setHours(0, 0, 0, 0);
              const isPast = taskDate < today;
              const isToday = taskDate.getTime() === today.getTime();
              
              return (
                <div
                  key={task.id}
                  className={`bg-secondary rounded-2xl p-6 border border-border hover:shadow-md transition-all ${
                    isPast ? 'opacity-75 border-muted' : ''
                  } ${isToday ? 'ring-2 ring-primary border-primary' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className={`font-semibold mb-2 text-lg ${isPast ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.title}
                      </h4>
                      <p className={`text-base ${isPast ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                        {task.subtitle}
                      </p>
                      <p className={`text-base font-medium ${
                        isToday ? 'text-primary' : isPast ? 'text-muted-foreground' : 'text-foreground'
                      }`}>
                        {new Date(task.date).toLocaleDateString('pt-BR')}
                        {isToday && ' (Hoje)'}
                        {isPast && ' (Concluída)'}
                      </p>
                    </div>
                    {isPast && (
                      <div className="text-green-500 text-2xl">✓</div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-muted-foreground text-center py-8 text-lg">
              Nenhuma tarefa cadastrada
            </p>
          )}
        </div>
      </div>

      {/* Alarmes */}
      <div className="card-soft slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-senior-lg text-primary">Meus Alarmes</h3>
          <Dialog open={isAlarmDialogOpen} onOpenChange={setIsAlarmDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="touch-button">
                <Plus size={20} className="mr-2" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Alarme</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título do Alarme</label>
                  <Input
                    type="text"
                    value={newAlarm.title}
                    onChange={(e) => setNewAlarm({...newAlarm, title: e.target.value})}
                    placeholder="Ex: Tomar remédio"
                    className="text-senior-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Horário</label>
                  <Input
                    type="time"
                    value={newAlarm.time}
                    onChange={(e) => setNewAlarm({...newAlarm, time: e.target.value})}
                    className="text-senior-base"
                  />
                </div>
                <Button onClick={handleAddAlarm} className="w-full btn-primary">
                  Criar Alarme
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="space-y-4">
          {alarms.length > 0 ? (
            alarms.map((alarm) => (
              <div
                key={alarm.id}
                className="bg-secondary rounded-2xl p-6 border border-border hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Clock size={24} className="text-primary" />
                    <div>
                      <h4 className="font-semibold text-foreground text-lg">{alarm.title}</h4>
                      <p className="text-base text-muted-foreground">{alarm.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      className={`w-14 h-8 rounded-full transition-colors touch-target ${
                        alarm.isActive ? 'bg-primary' : 'bg-gray-300'
                      } relative`}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full transition-transform ${
                          alarm.isActive ? 'translate-x-7' : 'translate-x-1'
                        } absolute top-1`}
                      />
                    </button>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => removeAlarm(alarm.id)}
                      className="text-destructive hover:text-destructive touch-target"
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8 text-lg">
              Nenhum alarme configurado
            </p>
          )}
        </div>
      </div>

      <AddFriendDialog
        isOpen={isAddFriendOpen}
        onOpenChange={setIsAddFriendOpen}
        onAddFriend={handleAddFriend}
      />
    </div>
  );
};

export default HomePage;