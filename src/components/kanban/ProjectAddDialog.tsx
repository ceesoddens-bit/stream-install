import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { EditDialog } from '../ui/EditDialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { crmService, Company, Contact } from '@/lib/crmService';
import { planningService } from '@/lib/planningService';
import { PlanningCard, PlanningStatus, ProjectType, ClientType, ProductTag } from '@/types';
import { toast } from 'sonner';

interface ProjectAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ProjectAddDialog({ open, onOpenChange, onSuccess }: ProjectAddDialogProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  const form = useForm<Partial<PlanningCard>>({
    defaultValues: {
      status: 'Offerte maken',
      projectType: 'Installatie',
      clientType: 'Residentieel',
      amount: 0,
      productTags: [],
    },
  });

  useEffect(() => {
    if (open) {
      const unsubCompanies = crmService.subscribeToCompanies(setCompanies);
      const unsubContacts = crmService.subscribeToContacts(setContacts);
      return () => {
        unsubCompanies();
        unsubContacts();
      };
    }
  }, [open]);

  const onSubmit = async (values: Partial<PlanningCard>) => {
    try {
      if (!values.clientName || !values.projectRef) {
        toast.error('Vul alle verplichte velden in');
        return;
      }

      await planningService.addPlanningCard(values as PlanningCard);
      toast.success('Project aangemaakt');
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error('Fout bij aanmaken project');
    }
  };

  return (
    <EditDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Nieuw Project Toevoegen"
      form={form}
      onSubmit={onSubmit}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Project Referentie</Label>
            <Input placeholder="bijv. PRJ-2024-001" {...form.register('projectRef')} />
          </div>
          <div className="space-y-1.5">
            <Label>Klanttype</Label>
            <select 
              {...form.register('clientType')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Residentieel">Residentieel</option>
              <option value="Commercieel">Commercieel</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Klant / Bedrijfsnaam</Label>
          <input 
            list="clients-list"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Selecteer of typ klantnaam..."
            {...form.register('clientName')}
          />
          <datalist id="clients-list">
            {companies.map(c => <option key={c.id} value={c.name} />)}
            {contacts.map(c => <option key={c.id} value={c.name} />)}
          </datalist>
        </div>

        <div className="space-y-1.5">
          <Label>Adres</Label>
          <Input placeholder="Straat 123, Stad" {...form.register('address')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Bedrag (excl. BTW)</Label>
            <Input type="number" step="0.01" {...form.register('amount', { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label>Project Type</Label>
            <select 
              {...form.register('projectType')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Installatie">Installatie</option>
              <option value="Service">Service</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Status</Label>
          <select 
            {...form.register('status')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="Offerte maken">Offerte maken</option>
            <option value="Offerte verstuurd">Offerte verstuurd</option>
            <option value="Montage plannen">Montage plannen</option>
            <option value="Project afgerond">Project afgerond</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label>Accountmanager</Label>
          <Input placeholder="Naam manager" {...form.register('accountManager')} />
        </div>
      </div>
    </EditDialog>
  );
}
