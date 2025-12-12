import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

export interface Task {
  id: string;
  title: string;
  subtitle: string;
  date: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  loading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Buscar tarefas do Supabase
  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    if (error) {
      console.error('Erro ao buscar tarefas:', error);
    } else if (data) {
      setTasks(data.map(t => ({
        id: t.id,
        title: t.title,
        subtitle: t.subtitle || '',
        date: t.date
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const addTask = async (task: Omit<Task, 'id'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title: task.title,
        subtitle: task.subtitle || null,
        date: task.date
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar tarefa:', error);
      return;
    }

    if (data) {
      setTasks(prev => [...prev, {
        id: data.id,
        title: data.title,
        subtitle: data.subtitle || '',
        date: data.date
      }]);
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Erro ao deletar tarefa:', error);
      return;
    }

    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    if (!user) return;

    const { error } = await supabase
      .from('tasks')
      .update({
        title: updatedTask.title,
        subtitle: updatedTask.subtitle || null,
        date: updatedTask.date
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return;
    }

    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updatedTask } : task
    ));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask, updateTask, loading }}>
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