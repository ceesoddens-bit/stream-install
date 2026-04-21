import React, { useState } from 'react';
import { X, Send, Loader2, Clock } from 'lucide-react';
import { hoursService, HourEntry } from '@/lib/hoursService';
import { Button } from '@/components/ui/button';

interface HoursAddModalProps {
  onClose: () => void;
}

export function HoursAddModal({ onClose }: HoursAddModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<HourEntry, 'id' | 'createdAt' | 'durationMinutes'>>({
    userId: 'current-user',
    userName: 'Huidige Gebruiker',
    type: 'Werktijd',
    begin: '',
    einde: '',
    pauze: '0',
    duur: '00:00',
    date: new Date().toISOString().split('T')[0],
    project: '',
    ticketId: '',
    status: 'Concept'
  });

  const calculateDuration = () => {
    if (formData.begin && formData.einde) {
      const beginTime = new Date(formData.begin).getTime();
      const eindeTime = new Date(formData.einde).getTime();
      if (eindeTime > beginTime) {
        const diffMins = Math.max(0, Math.floor((eindeTime - beginTime) / 60000) - parseInt(formData.pauze || '0'));
        const h = Math.floor(diffMins / 60);
        const m = diffMins % 60;
        setFormData(prev => ({
          ...prev,
          duur: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
        }));
        return diffMins;
      }
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const durationMinutes = calculateDuration();
      if (durationMinutes <= 0) {
        throw new Error("Ongeldige tijd. Controleer of de eindtijd later is dan de begintijd.");
      }
      
      await hoursService.addEntry({
        ...formData,
        durationMinutes
      });
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
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none mb-1">Uren Toevoegen</h2>
              <p className="text-xs text-gray-400 font-medium">Handmatig gewerkte uren invoeren</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Type Uren</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
            >
              <option value="Werktijd">Werktijd</option>
              <option value="Reistijd">Reistijd</option>
              <option value="Administratie">Administratie</option>
              <option value="Verlof">Verlof</option>
              <option value="Ziekte">Ziekte</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Begin Tijd</label>
              <input
                type="datetime-local"
                required
                value={formData.begin}
                onChange={(e) => {
                  setFormData({ ...formData, begin: e.target.value });
                  setTimeout(calculateDuration, 10);
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Eind Tijd</label>
              <input
                type="datetime-local"
                required
                value={formData.einde}
                onChange={(e) => {
                  setFormData({ ...formData, einde: e.target.value });
                  setTimeout(calculateDuration, 10);
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Pauze (minuten)</label>
              <input
                type="number"
                min="0"
                value={formData.pauze}
                onChange={(e) => {
                  setFormData({ ...formData, pauze: e.target.value });
                  setTimeout(calculateDuration, 10);
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Project / Ticket ID</label>
              <input
                type="text"
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                placeholder="Optioneel"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
          
          <div className="bg-emerald-50 text-emerald-800 px-4 py-3 rounded-lg border border-emerald-100 flex justify-between items-center mt-2">
            <span className="text-xs font-bold uppercase tracking-widest">Berekende Duur</span>
            <span className="font-mono font-bold text-lg">{formData.duur}</span>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={onClose} className="text-gray-500 font-bold">Annuleren</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Uren Opslaan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}