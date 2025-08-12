import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

interface Alarm {
  id: string;
  title: string;
  time: string;
  isActive: boolean;
  createdAt: Date;
}

interface AlarmContextType {
  alarms: Alarm[];
  addAlarm: (title: string, time: string) => void;
  removeAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const AlarmProvider = ({ children }: { children: ReactNode }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  // Verificar alarmes a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      alarms.forEach(alarm => {
        if (alarm.isActive && alarm.time === currentTime) {
          // Disparar notificação
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('SeniorCare - Alarme', {
              body: alarm.title,
              icon: '/favicon.ico'
            });
          }
          
          // Mostrar toast
          toast({
            title: "🔔 Alarme!",
            description: alarm.title,
            duration: 10000,
          });
        }
      });
    }, 60000); // Verificar a cada minuto

    return () => clearInterval(interval);
  }, [alarms]);

  // Solicitar permissão para notificações
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const addAlarm = (title: string, time: string) => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      title,
      time,
      isActive: true,
      createdAt: new Date()
    };
    setAlarms(prev => [...prev, newAlarm]);
  };

  const removeAlarm = (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  };

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
    ));
  };

  return (
    <AlarmContext.Provider value={{
      alarms,
      addAlarm,
      removeAlarm,
      toggleAlarm
    }}>
      {children}
    </AlarmContext.Provider>
  );
};

export const useAlarms = () => {
  const context = useContext(AlarmContext);
  if (context === undefined) {
    throw new Error('useAlarms must be used within an AlarmProvider');
  }
  return context;
};