import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bell, Calendar, Clock, MessageCircle } from "lucide-react";
import { useAlarms } from "@/contexts/AlarmContext";
import { useTasks } from "@/contexts/TaskContext";

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationsModal = ({ open, onOpenChange }: NotificationsModalProps) => {
  const { alarms } = useAlarms();
  const { tasks } = useTasks();

  // Filtrar alarmes ativos
  const activeAlarms = alarms.filter(alarm => alarm.isActive);

  // Filtrar tarefas dos próximos 7 dias
  const today = new Date();
  const next7Days = new Date();
  next7Days.setDate(today.getDate() + 7);
  
  const upcomingTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    return taskDate >= today && taskDate <= next7Days;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-senior-lg">
            <Bell className="mr-2" size={24} />
            Notificações
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Alarmes Ativos */}
          {activeAlarms.length > 0 && (
            <div>
              <h3 className="text-senior-base font-semibold mb-2 flex items-center">
                <Clock className="mr-2" size={18} />
                Alarmes Ativos ({activeAlarms.length})
              </h3>
              <div className="space-y-2">
                {activeAlarms.map((alarm) => (
                  <div
                    key={alarm.id}
                    className="p-3 bg-primary/10 rounded-lg border border-primary/20"
                  >
                    <p className="font-semibold text-senior-base">{alarm.title}</p>
                    <p className="text-sm text-muted-foreground">Horário: {alarm.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tarefas Próximas */}
          {upcomingTasks.length > 0 && (
            <div>
              <h3 className="text-senior-base font-semibold mb-2 flex items-center">
                <Calendar className="mr-2" size={18} />
                Tarefas Próximas ({upcomingTasks.length})
              </h3>
              <div className="space-y-2">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-secondary rounded-lg"
                  >
                    <p className="font-semibold text-senior-base">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.subtitle}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(task.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mensagens (placeholder) */}
          <div>
            <h3 className="text-senior-base font-semibold mb-2 flex items-center">
              <MessageCircle className="mr-2" size={18} />
              Mensagens
            </h3>
            <div className="p-3 bg-secondary rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Nenhuma mensagem nova</p>
            </div>
          </div>

          {/* Vazio */}
          {activeAlarms.length === 0 && upcomingTasks.length === 0 && (
            <div className="text-center py-8">
              <Bell className="mx-auto mb-2 text-muted-foreground" size={48} />
              <p className="text-muted-foreground text-senior-base">
                Nenhuma notificação no momento
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsModal;
