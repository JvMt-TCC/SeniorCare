import { Plus, User, Clock, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTasks } from "../contexts/TaskContext";
import { useAuth } from "../contexts/AuthContext";
import { useAlarms } from "../contexts/AlarmContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import AddFriendDialog from "../components/AddFriendDialog";

const HomePage = () => {
  const { tasks } = useTasks();
  const { user } = useAuth();
  const { alarms, addAlarm, removeAlarm, toggleAlarm } = useAlarms();
  const [isAlarmDialogOpen, setIsAlarmDialogOpen] = useState(false);
  const [newAlarm, setNewAlarm] = useState({ title: "", time: "" });
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [friends, setFriends] = useState([
    { name: "Maria Silva", avatar: "" },
    { name: "João Santos", avatar: "" },
    { name: "Ana Costa", avatar: "" }
  ]);

  // Filtrar tarefas futuras (incluindo hoje)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const futureTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);
  return taskDate >= today;
  });

  const handleAddAlarm = () => {
    if (newAlarm.title && newAlarm.time) {
      addAlarm(newAlarm.title, newAlarm.time);
      setNewAlarm({ title: "", time: "" });
      setIsAlarmDialogOpen(false);
    }
  };

  const handleAddFriend = (friend: { name: string; avatar: string }) => {
    setFriends(prev => [...prev, friend]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pt-4">
        <h1 className="text-senior-xl text-primary mb-2">
          Bem vindo de volta{user ? `, ${user.name}` : ''}!
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
        <h3 className="text-senior-lg text-primary mb-4">Amigos</h3>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {/* TROCAR IMAGEM DO USUÁRIO: Substitua o span abaixo por uma tag <img> com src da foto do amigo */}
          {friends.map((friend, index) => (
            <div key={index} className="flex flex-col items-center min-w-[60px]">
              <div className="w-12 h-12 bg-primary-soft rounded-full flex items-center justify-center mb-2">
                <span className="text-primary text-lg font-bold">{friend.name[0]}</span>
              </div>
              <span className="text-xs text-center">{friend.name.split(' ')[0]}</span>
            </div>
          ))}
          <div className="flex flex-col items-center min-w-[60px]">
            <button 
              onClick={() => setIsAddFriendOpen(true)}
              className="w-12 h-12 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors mb-2"
            >
              <Plus size={16} className="text-white" />
            </button>
            <span className="text-xs text-center">Adicionar</span>
          </div>
        </div>
      </div>

      {/* Próximas Tarefas */}
      <div className="card-soft slide-up">
        <h3 className="text-senior-lg text-primary mb-4">Próximas Tarefas</h3>
        <div className="space-y-3">
          {futureTasks.length > 0 ? (
            futureTasks.map((task) => (
              <div
                key={task.id}
                className="bg-secondary rounded-xl p-4 border border-border hover:shadow-md transition-all"
              >
                <h4 className="font-semibold text-foreground mb-1">{task.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(task.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma tarefa próxima
            </p>
          )}
        </div>
      </div>

      {/* Alarmes */}
      <div className="card-soft slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-senior-lg text-primary">Meus Alarmes</h3>
          <Dialog open={isAlarmDialogOpen} onOpenChange={setIsAlarmDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="btn-primary">
                <Plus size={16} className="mr-2" />
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
        
        <div className="space-y-3">
          {alarms.length > 0 ? (
            alarms.map((alarm) => (
              <div
                key={alarm.id}
                className="bg-secondary rounded-xl p-4 border border-border hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock size={20} className="text-primary" />
                    <div>
                      <h4 className="font-semibold text-foreground">{alarm.title}</h4>
                      <p className="text-sm text-muted-foreground">{alarm.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        alarm.isActive ? 'bg-primary' : 'bg-gray-300'
                      } relative`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          alarm.isActive ? 'translate-x-6' : 'translate-x-0.5'
                        } absolute top-0.5`}
                      />
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAlarm(alarm.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
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