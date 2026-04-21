import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Plus, CheckCircle2, Circle, Clock, Trash2 } from 'lucide-react';
import { tasksService, TaskItem } from '@/lib/tasksService';
import { TasksAddModal } from './TasksAddModal';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

export function TasksLayout() {
  const [personalView, setPersonalView] = useState(true);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [quickInput, setQuickInput] = useState('');

  useEffect(() => {
    // If personal view, filter by assigneeId
    const filters = personalView ? { assigneeId: 'current-user' } : undefined;
    const unsubscribe = tasksService.subscribeToTasks((fetched) => {
      setTasks(fetched);
    }, filters);
    return () => unsubscribe();
  }, [personalView]);

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    
    await tasksService.addTask({
      title: quickInput.trim(),
      priority: 'Medium',
      status: 'Open',
      assigneeId: 'current-user',
      assigneeName: 'Huidige Gebruiker',
      createdBy: 'current-user',
    });
    setQuickInput('');
  };

  const handleToggleStatus = async (task: TaskItem) => {
    if (!task.id) return;
    const newStatus = task.status === 'Done' ? 'Open' : 'Done';
    await tasksService.updateTask(task.id, { status: newStatus });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Taak verwijderen?')) {
      await tasksService.deleteTask(id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] relative">
      
      {/* ── Top Header Bar ── */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          {/* Custom Taken Icon */}
          <div className="flex flex-col gap-1 w-6 h-6 justify-center">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <div className="h-1.5 w-4 rounded-sm bg-emerald-900"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <div className="h-1.5 w-4 rounded-sm bg-blue-900"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <div className="h-1.5 w-4 rounded-sm bg-emerald-900"></div>
            </div>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Takenlijst</h1>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-emerald-700 transition-all"
        >
          <Plus className="h-4 w-4" /> Nieuwe Taak
        </button>
      </div>

      {/* ── Main Content Container ── */}
      <div className="flex flex-col flex-1 p-6 overflow-hidden">
        
        {/* Navigation / Filter Bar */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 px-2 pt-2 mb-6 shrink-0">
          <div className="flex items-center border-b-2 border-emerald-800 px-6 pb-2 pt-1 translate-y-[2px]">
            <span className="text-[13px] font-medium text-gray-900">{personalView ? 'Mijn Taken' : 'Alle Taken'}</span>
          </div>
          
          <div className="flex items-center px-4 pb-2 pt-1 gap-3">
            <span className="text-xs font-bold text-gray-500">Persoonlijk</span>
            <button 
              type="button"
              onClick={() => setPersonalView(!personalView)}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2",
                personalView ? "bg-emerald-800" : "bg-gray-200"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
                  personalView ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>

        {/* Quick Input */}
        <form onSubmit={handleQuickAdd} className="mb-6 relative">
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Snel een taak toevoegen en druk op Enter..."
            className="w-full px-5 py-3 pr-12 bg-white border border-gray-200 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          <button type="submit" disabled={!quickInput.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 disabled:opacity-50">
            <Plus className="h-5 w-5" />
          </button>
        </form>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-[28px] font-bold text-gray-900 mb-8">Geen taken gevonden!</h2>
              <div className="relative w-64 h-64 flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-[#f1f5f9] rounded-full scale-x-125 scale-y-100 opacity-80" style={{ borderRadius: '48% 52% 51% 49% / 51% 48% 52% 49%'}}></div>
                <div className="absolute inset-0 bg-[#e2e8f0] opacity-40 rounded-full blur-xl transform translate-x-4 translate-y-4"></div>
                <div className="relative z-10 w-40 h-28 bg-[#e2e8f0] rounded-xl shadow-sm border px-3 py-3 border-[#cbd5e1] flex flex-col items-center">
                  <div className="flex gap-1.5 w-full mb-3">
                    <div className="w-2 h-2 rounded-full bg-white opacity-80"></div>
                    <div className="w-2 h-2 rounded-full bg-white opacity-80"></div>
                    <div className="w-2 h-2 rounded-full bg-white opacity-80"></div>
                  </div>
                  <div className="flex gap-2 w-full flex-1">
                     <div className="flex flex-col gap-2 flex-1 pt-1">
                        <div className="h-2 w-3/4 border-2 border-dashed border-[#cbd5e1] rounded-full"></div>
                        <div className="h-2 w-full border-2 border-dashed border-[#cbd5e1] rounded-full"></div>
                        <div className="h-2 w-2/3 border-2 border-dashed border-[#cbd5e1] rounded-full"></div>
                     </div>
                     <div className="w-14 h-full bg-[#cbd5e1] rounded-lg"></div>
                  </div>
                </div>
                <LayoutDashboard className="absolute top-10 left-8 h-4 w-4 text-[#cbd5e1] opacity-60" />
              </div>
              <p className="text-[13px] text-gray-500 max-w-sm mb-6 font-medium">
                Er zijn geen taken die aan deze criteria voldoen.
              </p>
            </div>
          ) : (
            tasks.map(task => (
              <div 
                key={task.id} 
                className={cn(
                  "bg-white border rounded-xl p-4 shadow-sm flex items-start gap-4 transition-all group hover:border-emerald-200",
                  task.status === 'Done' ? "opacity-60 border-gray-100" : "border-gray-200"
                )}
              >
                <button 
                  onClick={() => handleToggleStatus(task)}
                  className={cn(
                    "mt-0.5 shrink-0 transition-colors",
                    task.status === 'Done' ? "text-emerald-500" : "text-gray-300 hover:text-emerald-400"
                  )}
                >
                  {task.status === 'Done' ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <h3 className={cn("text-sm font-bold text-gray-900 mb-1", task.status === 'Done' && "line-through text-gray-500")}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{task.description}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span className={cn(
                          new Date(task.dueDate) < new Date() && task.status !== 'Done' ? "text-red-500" : ""
                        )}>
                          {format(new Date(task.dueDate), 'dd MMM yyyy', { locale: nl })}
                        </span>
                      </div>
                    )}
                    
                    <Badge variant="outline" className={cn(
                      "text-[9px] uppercase px-1.5 py-0 leading-none",
                      task.priority === 'High' ? "text-red-600 bg-red-50 border-red-200" : 
                      task.priority === 'Medium' ? "text-amber-600 bg-amber-50 border-amber-200" : 
                      "text-emerald-600 bg-emerald-50 border-emerald-200"
                    )}>
                      {task.priority}
                    </Badge>
                    
                    {!personalView && task.assigneeName && (
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {task.assigneeName}
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => handleDelete(task.id!)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>

      {isAddModalOpen && (
        <TasksAddModal 
          onClose={() => setIsAddModalOpen(false)} 
          defaultAssignee={personalView ? 'current-user' : undefined} 
        />
      )}
    </div>
  );
}
