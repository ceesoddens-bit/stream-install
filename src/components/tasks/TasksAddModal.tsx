import React, { useState } from 'react';
import { X, Send, Loader2, ListTodo } from 'lucide-react';
import { tasksService, TaskItem } from '@/lib/tasksService';
import { Button } from '@/components/ui/button';

interface TasksAddModalProps {
  onClose: () => void;
  defaultAssignee?: string;
}

export function TasksAddModal({ onClose, defaultAssignee }: TasksAddModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<TaskItem, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Open',
    assigneeId: defaultAssignee || 'current-user',
    assigneeName: 'Huidige Gebruiker',
    createdBy: 'current-user',
    projectId: '',
    ticketId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    
    setIsSubmitting(true);
    try {
      await tasksService.addTask(formData);
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-800">
              <ListTodo className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none mb-1">Nieuwe Taak</h2>
              <p className="text-xs text-gray-400 font-medium">Maak een nieuwe taak aan</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Titel</label>
            <input
              type="text"
              required
              autoFocus
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              placeholder="Wat moet er gebeuren?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Omschrijving</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600 resize-none"
              placeholder="Optionele details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Deadline</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Prioriteit</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              >
                <option value="Low">Laag</option>
                <option value="Medium">Gemiddeld</option>
                <option value="High">Hoog</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={onClose} className="text-gray-500 font-bold">Annuleren</Button>
            <Button type="submit" disabled={isSubmitting || !formData.title} className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Taak Aanmaken
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}