import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bell, Clock, Calendar, UserPlus } from "lucide-react";
import { useAlarms } from "@/contexts/AlarmContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import FriendRequestsModal from "@/components/FriendRequestsModal";

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationsModal = ({ open, onOpenChange }: NotificationsModalProps) => {
  const { alarms } = useAlarms();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Array<{ title: string; subtitle: string | null; date: string }>>([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);

  // Buscar solicitações pendentes
  const fetchPendingRequests = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('friendship_requests')
      .select('id')
      .eq('to_user_id', user.id)
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching requests:', error);
      return;
    }

    setPendingRequestsCount(data?.length || 0);
  };

  // Buscar tarefas próximas
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
        const today = new Date();
        const next7Days = new Date();
        next7Days.setDate(today.getDate() + 7);
        
        const upcoming = data.filter(task => {
          const taskDate = new Date(task.date + 'T00:00:00');
          return taskDate >= today && taskDate <= next7Days;
        });
        
        setTasks(upcoming);
      }
    };

    fetchTasks();
    fetchPendingRequests();
  }, [user, open]);

  // Filtrar alarmes ativos
  const activeAlarms = alarms.filter(alarm => alarm.isActive);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {/* Solicitações de Amizade */}
          {pendingRequestsCount > 0 && (
            <div 
              className="p-4 bg-accent/50 rounded-lg flex items-start gap-3 cursor-pointer hover:bg-accent/70 transition-colors"
              onClick={() => {
                setIsRequestsModalOpen(true);
                onOpenChange(false);
              }}
            >
              <UserPlus className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <h4 className="font-medium text-foreground">
                  {pendingRequestsCount} {pendingRequestsCount === 1 ? 'Nova Solicitação' : 'Novas Solicitações'} de Amizade
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Toque para ver e responder
                </p>
              </div>
            </div>
          )}

          {/* Alarmes Ativos */}
          {activeAlarms.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Alarmes Ativos ({activeAlarms.length})
              </h3>
              {activeAlarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className="p-3 bg-primary/10 rounded-lg border border-primary/20"
                >
                  <p className="font-medium">{alarm.title}</p>
                  <p className="text-sm text-muted-foreground">Horário: {alarm.time}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tarefas Próximas */}
          {tasks.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Tarefas Próximas ({tasks.length})
              </h3>
              {tasks.map((task) => (
                <div
                  key={task.title}
                  className="p-3 bg-secondary/50 rounded-lg"
                >
                  <p className="font-medium">{task.title}</p>
                  {task.subtitle && (
                    <p className="text-sm text-muted-foreground">{task.subtitle}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(task.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeAlarms.length === 0 && tasks.length === 0 && pendingRequestsCount === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma notificação no momento
            </p>
          )}
        </div>
      </DialogContent>

      <FriendRequestsModal
        isOpen={isRequestsModalOpen}
        onOpenChange={setIsRequestsModalOpen}
        onRequestHandled={fetchPendingRequests}
      />
    </Dialog>
  );
};

export default NotificationsModal;
