import { createContext, useContext, useState, ReactNode } from "react";

export interface Task {
  id: number;
  title: string;
  subtitle: string;
  date: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (id: number) => void;
  updateTask: (id: number, task: Partial<Task>) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Caminhada no parque",
      subtitle: "Caminhada matinal no Parque da Cidade com o grupo de exercícios",
      date: "2025-08-12"
    },
    {
      id: 2,
      title: "Consulta médica",
      subtitle: "Consulta de rotina com cardiologista Dr. Silva",
      date: "2025-08-15"
    },
    {
      id: 3,
      title: "Visita aos netos",
      subtitle: "Almoço em família",
      date: "2025-08-18"
    }
  ]);

  const addTask = (task: Omit<Task, 'id'>) => {
    setTasks(prev => [...prev, { ...task, id: Date.now() }]);
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const updateTask = (id: number, updatedTask: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updatedTask } : task
    ));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};