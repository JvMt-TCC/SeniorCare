import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { capacitorStorage } from "@/lib/storage";

interface Alarm {
  id: string;
  title: string;
  time: string;
  isActive: boolean;
  createdAt: string;
}

interface AlarmContextType {
  alarms: Alarm[];
  addAlarm: (title: string, time: string) => void;
  removeAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

const ALARMS_STORAGE_KEY = 'seniorcare_alarms';

export const AlarmProvider = ({ children }: { children: ReactNode }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Carregar alarmes do storage na inicialização
  useEffect(() => {
    const loadAlarms = async () => {
      try {
        const stored = await capacitorStorage.getItem(ALARMS_STORAGE_KEY);
        if (stored) {
          setAlarms(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Erro ao carregar alarmes:', error);
      }
      setInitialized(true);
    };
    loadAlarms();
  }, []);

  // Salvar alarmes no storage quando mudam
  useEffect(() => {
    if (initialized && alarms.length >= 0) {
      capacitorStorage.setItem(ALARMS_STORAGE_KEY, JSON.stringify(alarms));
    }
  }, [alarms, initialized]);

  // Verificar alarmes a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      alarms.forEach(alarm => {
        if (alarm.isActive && alarm.time === currentTime) {
          // Disparar notificação web (fallback)
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('SeniorCare - Alarme', {
              body: alarm.title,
              icon: '/favicon.ico'
            });
          }
          
          // Mostrar toast (funciona em qualquer plataforma)
          toast({
            title: "🔔 Alarme!",
            description: alarm.title,
            duration: 10000,
          });
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [alarms]);

  // Solicitar permissão para notificações web
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
      createdAt: new Date().toISOString()
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