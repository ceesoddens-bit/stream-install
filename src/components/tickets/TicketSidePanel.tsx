import React, { useState, useEffect } from 'react';
import { X, Send, Paperclip, Trash2, Clock, User, Calendar as CalendarIcon, MessageSquare } from 'lucide-react';
import { ticketService, Ticket, TicketComment } from '@/lib/ticketService';
import { teamService, Technician } from '@/lib/teamService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { useTenant } from '@/lib/tenantContext';
import { aiService } from '@/lib/aiService';

interface TicketSidePanelProps {
  ticket: Ticket;
  onClose: () => void;
}

export function TicketSidePanel({ ticket, onClose }: TicketSidePanelProps) {
  const { heeftToegang } = useTenant();
  const hasAi = heeftToegang('ai_assistent');
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [assignee, setAssignee] = useState(ticket.assigneeId || '');
  const [slaDate, setSlaDate] = useState(ticket.slaDate || '');
  const [startTime, setStartTime] = useState(ticket.startTime || '08:00');
  const [endTime, setEndTime] = useState(ticket.endTime || '09:00');
  const [hasChanges, setHasChanges] = useState(false);
  const [techs, setTechs] = useState<Technician[]>([]);

  useEffect(() => {
    const unsubscribe = teamService.subscribeToTechnicians(setTechs);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!ticket.id) return;
    const unsubscribe = ticketService.subscribeToComments(ticket.id, (fetched) => {
      setComments(fetched);
    });
    return () => unsubscribe();
  }, [ticket.id]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !ticket.id) return;
    setIsSubmitting(true);
    await ticketService.addComment(ticket.id, {
      text: newComment,
      userId: 'current-user', // Should use real user ID
      userName: 'Huidige Gebruiker',
      userImage: 'https://i.pravatar.cc/150?u=me',
    });
    setNewComment('');
    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!ticket.id) return;
    await ticketService.deleteComment(ticket.id, commentId);
  };

  const handleSaveDetails = async () => {
    if (!ticket.id) return;
    setIsSubmitting(true);
    await ticketService.updateTicket(ticket.id, {
      assigneeId: assignee,
      slaDate: slaDate,
      startTime: startTime,
      endTime: endTime
    });
    setHasChanges(false);
    setIsSubmitting(false);
    toast.success('Wijzigingen opgeslagen');
  };

  const handleUpdateTicket = async (updates: Partial<Ticket>) => {
    if (!ticket.id) return;
    await ticketService.updateTicket(ticket.id, updates);
  };

  const handleGenerateSummary = async () => {
    if (!ticket.id) return;
    setIsAiLoading(true);
    try {
      const summary = await aiService.generate(`Maak een samenvatting van ticket: ${ticket.title} met beschrijving: ${ticket.description}`, 'ticket_summary');
      await ticketService.addComment(ticket.id, {
        text: `✨ AI Samenvatting:\n${summary}`,
        userId: 'ai-assistent',
        userName: 'AI Assistent',
        userImage: 'https://ui-avatars.com/api/?name=AI&background=0D8ABC&color=fff',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGenerateReply = async () => {
    setIsAiLoading(true);
    try {
      const reply = await aiService.generate(`Maak een professioneel antwoord op dit ticket: ${ticket.title}. Huidige beschrijving: ${ticket.description}`, 'ticket_reply');
      setNewComment(reply);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">{ticket.title}</h2>
            <Badge variant="outline" className="text-[10px] uppercase">{ticket.status}</Badge>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Details Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Toegewezen aan</label>
                <select 
                  value={assignee}
                  onChange={(e) => {
                    setAssignee(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white outline-none"
                >
                  <option value="">Niet toegewezen</option>
                  {techs.map(tech => (
                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Datum</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="date" 
                    value={slaDate}
                    onChange={(e) => {
                      setSlaDate(e.target.value);
                      setHasChanges(true);
                    }}
                    className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-3 py-2 bg-gray-50 focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Starttijd</label>
                <input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Eindtijd</label>
                <input 
                  type="time" 
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white outline-none"
                />
              </div>
            </div>

            {hasChanges && (
              <div className="pt-2">
                <Button 
                  onClick={handleSaveDetails} 
                  disabled={isSubmitting}
                  className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold h-10 shadow-lg shadow-emerald-800/10"
                >
                  {isSubmitting ? 'Opslaan...' : 'Wijzigingen Opslaan'}
                </Button>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Omschrijving</label>
                {hasAi && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-[10px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2"
                    onClick={handleGenerateSummary}
                    disabled={isAiLoading}
                  >
                    {isAiLoading ? 'Genereren...' : '✨ Samenvatten'}
                  </Button>
                )}
              </div>
              <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 min-h-[100px] whitespace-pre-wrap">
                {ticket.description || <span className="text-gray-400 italic">Geen omschrijving...</span>}
              </div>
            </div>

            {/* Attachments */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block flex items-center gap-2">
                  <Paperclip className="h-3 w-3" /> Bijlagen
                </label>
                <div className="space-y-2">
                  {ticket.attachments.map((att, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg">
                      <a href={att.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate max-w-[250px]">
                        {att.name}
                      </a>
                      <button 
                        onClick={() => {
                          const newAtts = ticket.attachments!.filter((_, idx) => idx !== i);
                          handleUpdateTicket({ attachments: newAtts });
                        }}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <hr className="border-gray-100" />

          {/* Comments Section */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare className="h-3 w-3" /> Reacties ({comments.length})
            </label>
            
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-3 group">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={comment.userImage} />
                    <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-gray-50 rounded-xl rounded-tl-none p-3 relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-900">{comment.userName}</span>
                      <span className="text-[10px] text-gray-400">
                        {comment.createdAt ? format(comment.createdAt.toDate(), 'dd MMM HH:mm', { locale: nl }) : 'Nu'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                    
                    <button 
                      onClick={() => handleDeleteComment(comment.id)}
                      className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 space-y-2">
              {hasAi && (
                <div className="flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-[10px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2"
                    onClick={handleGenerateReply}
                    disabled={isAiLoading}
                  >
                    {isAiLoading ? 'Genereren...' : '✨ Antwoord suggestie'}
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Schrijf een reactie..."
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 focus:bg-white outline-none"
                />
                <Button 
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isSubmitting}
                  className="bg-emerald-800 hover:bg-emerald-700 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
