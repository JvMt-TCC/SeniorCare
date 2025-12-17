import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAlarms } from "@/contexts/AlarmContext";
import { Bell, Trash2, Plus, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface AlarmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AlarmModal = ({ open, onOpenChange }: AlarmModalProps) => {
  const { alarms, addAlarm, removeAlarm, toggleAlarm } = useAlarms();
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("");

  const handleAddAlarm = () => {
    if (newTitle && newTime) {
      addAlarm(newTitle, newTime);
      setNewTitle("");
      setNewTime("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[calc(100%-2rem)] max-w-[400px] rounded-2xl bg-background border-border shadow-xl max-h-[85vh] overflow-hidden"
        style={{ 
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1.25rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.25rem)'
        }}
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
            <div className="p-2 rounded-xl bg-primary/10">
              <Bell className="text-primary" size={22} />
            </div>
            Gerenciar Alarmes
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 8rem)' }}>
          {/* Form para adicionar novo alarme */}
          <div className="space-y-4 p-4 rounded-xl bg-secondary/50 border border-border/50">
            <div className="space-y-2">
              <Label htmlFor="alarm-title" className="text-base font-medium text-foreground">
                Descrição
              </Label>
              <Input
                id="alarm-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Tomar remédio"
                className="h-12 text-base bg-background border-border/60 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alarm-time" className="text-base font-medium text-foreground">
                Horário
              </Label>
              <Input
                id="alarm-time"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="h-12 text-base bg-background border-border/60 focus:border-primary"
              />
            </div>
            <Button 
              onClick={handleAddAlarm} 
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
              disabled={!newTitle || !newTime}
            >
              <Plus className="mr-2" size={20} />
              Adicionar Alarme
            </Button>
          </div>

          {/* Lista de alarmes */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-foreground flex items-center gap-2">
              <Clock size={18} className="text-muted-foreground" />
              Seus Alarmes
            </h3>
            
            {alarms.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-xl bg-muted/30 border border-border/30">
                <Bell className="mx-auto mb-3 text-muted-foreground" size={32} />
                <p className="text-muted-foreground text-base">
                  Nenhum alarme cadastrado
                </p>
                <p className="text-muted-foreground/70 text-sm mt-1">
                  Adicione um alarme acima
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {alarms.map((alarm) => (
                  <div
                    key={alarm.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      alarm.isActive 
                        ? 'bg-primary/5 border-primary/30' 
                        : 'bg-muted/30 border-border/30'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-base truncate ${
                        alarm.isActive ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {alarm.title}
                      </p>
                      <p className={`text-lg font-mono ${
                        alarm.isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {alarm.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-3">
                      <Switch
                        checked={alarm.isActive}
                        onCheckedChange={() => toggleAlarm(alarm.id)}
                        className="data-[state=checked]:bg-primary"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAlarm(alarm.id)}
                        className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlarmModal;
