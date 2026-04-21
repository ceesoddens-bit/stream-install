import React, { useEffect, useState } from 'react';
import { useTenant } from '@/lib/tenantContext';
import { ticketService, Ticket } from '@/lib/ticketService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LifeBuoy, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Nieuw': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Nieuw</Badge>;
    case 'Bezig': return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none">In behandeling</Badge>;
    case 'Wachten': return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-none">Wacht op reactie</Badge>;
    case 'Afgerond': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Afgerond</Badge>;
    default: return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none">{status}</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'High': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Hoog</Badge>;
    case 'Medium': return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none">Normaal</Badge>;
    case 'Low': return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none">Laag</Badge>;
    default: return null;
  }
};

export function PortalTickets() {
  const { userDoc, tenant } = useTenant();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const primaryColor = tenant?.branding?.kleur || '#076735';

  const [formData, setFormData] = useState({
    title: '',
    type: 'Storing',
    priority: 'Medium',
    description: '',
  });

  useEffect(() => {
    if (!userDoc?.contactId) return;
    const unsub = ticketService.subscribeToTickets(setTickets, 50, userDoc.contactId);
    return () => unsub();
  }, [userDoc?.contactId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDoc?.contactId) {
      toast.error('Uw account is niet gekoppeld aan een klantprofiel.');
      return;
    }

    setSaving(true);
    try {
      await ticketService.addTicket({
        title: formData.title,
        type: formData.type,
        priority: formData.priority as any,
        description: formData.description,
        status: 'Nieuw',
        date: new Date().toISOString().split('T')[0],
        userId: userDoc.contactId,
        userImage: userDoc.photoURL,
        // Using any to bypass TS for fields that might be added to the model later for portal identification
        contactId: userDoc.contactId,
        source: 'portal',
      } as any);
      
      toast.success('Ticket succesvol aangemaakt');
      setIsAddOpen(false);
      setFormData({ title: '', type: 'Storing', priority: 'Medium', description: '' });
    } catch (error) {
      console.error(error);
      toast.error('Er is een fout opgetreden bij het aanmaken van het ticket');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets & Service</h1>
          <p className="text-sm text-gray-500">Meld een probleem of bekijk de status van uw lopende aanvragen.</p>
        </div>
        <Button 
          className="gap-2 text-white" 
          style={{ backgroundColor: primaryColor }}
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Nieuw Ticket
        </Button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <LifeBuoy className="h-12 w-12 text-gray-300 mb-4" />
            <p>U heeft op dit moment geen actieve tickets.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Onderwerp</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Datum</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Prioriteit</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{ticket.title}</td>
                  <td className="p-4 text-sm text-gray-600">{ticket.date}</td>
                  <td className="p-4 text-sm text-gray-600">{ticket.type}</td>
                  <td className="p-4">{getPriorityBadge(ticket.priority)}</td>
                  <td className="p-4">{getStatusBadge(ticket.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nieuw ticket aanmaken</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Onderwerp</Label>
              <Input 
                id="title" 
                required 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Korte beschrijving van het probleem"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.type} 
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Storing">Storing</option>
                  <option value="Vraag">Vraag</option>
                  <option value="Onderhoud">Onderhoud</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Prioriteit</Label>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.priority} 
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="Low">Laag</option>
                  <option value="Medium">Normaal</option>
                  <option value="High">Hoog</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Beschrijving</Label>
              <textarea 
                id="description" 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Beschrijf uw vraag of probleem zo gedetailleerd mogelijk..."
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Annuleren</Button>
              <Button type="submit" disabled={saving} style={{ backgroundColor: primaryColor }} className="text-white">
                {saving ? 'Opslaan...' : 'Versturen'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}