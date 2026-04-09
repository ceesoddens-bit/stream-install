import React, { useState, useRef } from 'react';
import { 
  X, Paperclip, Send, Loader2, AlertCircle, FileIcon, ImageIcon, Package, User, Hash
} from 'lucide-react';
import { ticketService, Ticket } from '@/lib/ticketService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TicketFormModalProps {
  onClose: () => void;
}

export function TicketFormModal({ onClose }: TicketFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<Ticket, 'id' | 'createdAt' | 'attachments'>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Support',
    status: 'Nieuw',
    priority: 'Medium',
    userId: 'Huidige Gebruiker',
    userImage: 'https://i.pravatar.cc/150?u=me'
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    setIsSubmitting(true);
    try {
      // 1. Create the ticket document
      const docRef = await ticketService.addTicket(formData);
      
      // 2. If files, upload them
      if (files.length > 0 && docRef?.id) {
        const attachments = await ticketService.uploadFiles(docRef.id, files);
        // Update the ticket with attachments
        await ticketService.updateTicket(docRef.id, { attachments });
      }

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-800">
               <Package className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none mb-1">Nieuwe Ticket Aanmaken</h2>
              <p className="text-xs text-gray-400 font-medium tracking-tight">Voer alle details in om een service ticket te openen</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Title Section */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Titel van de melding</label>
            <div className="relative group">
              <input
                autoFocus
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Bijv. Factuur niet ontvangen of CV Ketel defect..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-emerald-600 focus:ring-0 transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             {/* Type */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Module / Type</label>
              <select 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:bg-white focus:border-emerald-600 transition-all cursor-pointer"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Techniek">Techniek</option>
                <option value="Facturatie">Facturatie</option>
                <option value="Support">Support</option>
                <option value="Inkoop">Inkoop</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Prioriteit</label>
              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                {(['Low', 'Medium', 'High'] as const).map(p => (
                   <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p })}
                    className={cn(
                      "flex-1 py-1.5 px-2 text-[10px] font-bold rounded-lg transition-all uppercase tracking-tighter",
                      formData.priority === p 
                        ? (p === 'High' ? "bg-red-600 text-white shadow-sm" : p === 'Medium' ? "bg-amber-500 text-white shadow-sm" : "bg-emerald-600 text-white shadow-sm")
                        : "text-gray-400 hover:text-gray-600"
                    )}
                   >
                    {p}
                   </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Omschrijving</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Geef een uitgebreide toelichting van de ticket..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-700 outline-none focus:bg-white focus:border-emerald-600 transition-all resize-none placeholder:text-gray-300"
            />
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Bijlagen (Bestanden of Foto's)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-100 bg-gray-50/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all group"
            >
              <input 
                type="file" 
                multiple 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange}
              />
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                 <Paperclip className="h-6 w-6 text-gray-400 group-hover:text-emerald-600" />
              </div>
              <p className="text-xs font-bold text-gray-600 mb-1">Klik om bestanden toe te voegen</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Sleep bestanden naar hier</p>
            </div>
            
            {files.length > 0 && (
              <div className="space-y-2 pt-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs font-bold text-emerald-800">
                    <div className="flex items-center gap-2">
                       {f.type.startsWith('image/') ? <ImageIcon className="h-3.5 w-3.5" /> : <FileIcon className="h-3.5 w-3.5" />}
                       <span className="truncate max-w-[200px]">{f.name}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setFiles(files.filter((_, idx) => idx !== i)); }}
                      className="text-emerald-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-4 sticky bottom-0">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onClose}
            className="text-gray-500 font-bold text-xs uppercase"
          >
            Annuleren
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title}
            className="bg-emerald-800 hover:bg-emerald-700 text-white px-8 h-12 rounded-xl font-bold text-sm shadow-lg shadow-emerald-800/20 gap-2 min-w-[160px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Aanmaken...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Ticket Aanmaken
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
