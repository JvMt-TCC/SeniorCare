import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useTasks, Task } from "../contexts/TaskContext";

const CalendarioPage = () => {
  const { tasks, addTask, deleteTask } = useTasks();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", subtitle: "", date: "" });
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleAddTask = () => {
    if (newTask.title && newTask.date) {
      addTask({ 
        title: newTask.title,
        subtitle: newTask.subtitle,
        date: newTask.date 
      });
      setNewTask({ title: "", subtitle: "", date: "" });
      setIsAddingTask(false);
    }
  };

  const handleDeleteTask = (id: number) => {
    deleteTask(id);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getTasksForDate = (day: number) => {
    if (!day) return [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(task => task.date === dateStr);
  };

  const isToday = (day: number) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="space-y-6 fade-in">
      <div className="text-center pt-4">
        <h1 className="text-senior-xl text-primary mb-2">Calendário</h1>
        <p className="text-muted-foreground">Organize suas atividades</p>
      </div>

      {/* Calendário */}
      <div className="card-soft slide-up">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-primary" />
          </button>
          <h2 className="text-senior-lg text-primary">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-primary" />
          </button>
        </div>
        
        {/* Cabeçalho dos dias da semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Grade do calendário */}
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth().map((day, index) => {
            const tasksForDay = getTasksForDate(day || 0);
            const isTodayDay = isToday(day || 0);
            
            return (
              <div
                key={index}
                className={`
                  aspect-square p-1 text-center text-sm border border-border rounded-lg
                  ${day ? 'bg-background hover:bg-secondary' : 'bg-muted'}
                  ${isTodayDay ? 'bg-primary text-primary-foreground font-bold' : ''}
                  ${tasksForDay.length > 0 ? 'ring-2 ring-primary-soft' : ''}
                `}
              >
                {day && (
                  <div className="h-full flex flex-col justify-between">
                    <span className={isTodayDay ? 'text-primary-foreground' : ''}>{day}</span>
                    {tasksForDay.length > 0 && (
                      <div className="w-2 h-2 bg-primary rounded-full mx-auto"></div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Botão Adicionar Tarefa */}
      <button
        onClick={() => setIsAddingTask(true)}
        className="btn-primary w-full flex items-center justify-center"
      >
        <Plus size={20} className="mr-2" />
        Adicionar Tarefa
      </button>

      {/* Modal de Adicionar Tarefa */}
      {isAddingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card-soft w-full max-w-sm">
            <h3 className="text-senior-lg text-primary mb-4">Nova Tarefa</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full p-3 border border-border rounded-xl bg-background text-senior-base"
                  placeholder="Digite o título da tarefa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={newTask.subtitle}
                  onChange={(e) => setNewTask({...newTask, subtitle: e.target.value})}
                  className="w-full p-3 border border-border rounded-xl bg-background text-senior-base h-20"
                  placeholder="Digite a descrição da tarefa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Data</label>
                <input
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                  className="w-full p-3 border border-border rounded-xl bg-background text-senior-base"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="flex-1 py-3 border border-border rounded-xl text-muted-foreground"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddTask}
                  className="flex-1 btn-primary"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Tarefas */}
      <div className="card-soft slide-up">
        <h3 className="text-senior-lg text-primary mb-4">Todas as Tarefas</h3>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="bg-secondary rounded-xl p-4 border border-border">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{task.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{task.subtitle}</p>
                  <p className="text-sm text-primary font-medium">
                    {new Date(task.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-2 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarioPage;