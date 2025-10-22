import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAlarms } from "@/contexts/AlarmContext";
import { Bell, Trash2, Plus } from "lucide-react";
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-senior-lg">
            <Bell className="mr-2" size={24} />
            Gerenciar Alarmes
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Form para adicionar novo alarme */}
          <div className="space-y-3 border-b pb-4">
            <div>
              <Label htmlFor="alarm-title" className="text-senior-base">Descrição</Label>
              <Input
                id="alarm-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Tomar remédio"
                className="text-senior-base"
              />
            </div>
            <div>
              <Label htmlFor="alarm-time" className="text-senior-base">Horário</Label>
              <Input
                id="alarm-time"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="text-senior-base"
              />
            </div>
            <Button onClick={handleAddAlarm} className="w-full">
              <Plus className="mr-2" size={18} />
              Adicionar Alarme
            </Button>
          </div>

          {/* Lista de alarmes */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {alarms.length === 0 ? (
              <p className="text-center text-muted-foreground text-senior-base py-4">
                Nenhum alarme cadastrado
              </p>
            ) : (
              alarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-senior-base">{alarm.title}</p>
                    <p className="text-sm text-muted-foreground">{alarm.time}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={alarm.isActive}
                      onCheckedChange={() => toggleAlarm(alarm.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAlarm(alarm.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlarmModal;
