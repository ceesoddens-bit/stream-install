import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { EditDialog } from '../ui/EditDialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { planningService, PlanningEntry } from '@/lib/planningService';
import { Project } from '@/lib/projectService';
import { Technician } from '@/lib/teamService';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
  technicians: Technician[];
  selectedDate: string; // YYYY-MM-DD
  onSuccess?: () => void;
}

export function PlanProjectDialog({ open, onOpenChange, project, technicians, selectedDate, onSuccess }: Props) {
  const form = useForm<Partial<PlanningEntry>>({
    defaultValues: {
      startTime: '08:00',
      endTime: '12:00',
      status: 'Ingepland',
      type: 'Installatie',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        projectId: project?.id || '',
        projectName: project?.name || '',
        client: project?.client || '',
        date: selectedDate,
        startTime: '08:00',
        endTime: '12:00',
        technician: technicians[0]?.name || '',
        status: 'Ingepland',
        type: 'Installatie',
      });
    }
  }, [open, project, selectedDate, technicians, form]);

  const onSubmit = async (values: Partial<PlanningEntry>) => {
    try {
      await planningService.addPlanningEntry(values as PlanningEntry);
      toast.success('Project ingepland');
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Fout bij inplannen');
    }
  };

  return (
    <EditDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Project plannen: ${project?.name || ''}`}
      form={form}
      onSubmit={onSubmit}
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Monteur</Label>
          <select 
            {...form.register('technician')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {technicians.map(t => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Starttijd</Label>
            <Input type="time" {...form.register('startTime')} />
          </div>
          <div className="space-y-1.5">
            <Label>Eindtijd</Label>
            <Input type="time" {...form.register('endTime')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Type</Label>
            <select 
              {...form.register('type')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Installatie">Installatie</option>
              <option value="Service">Service</option>
              <option value="Onderhoud">Onderhoud</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <select 
              {...form.register('status')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Ingepland">Ingepland</option>
              <option value="Onderweg">Onderweg</option>
              <option value="Bezig">Bezig</option>
              <option value="Afgerond">Afgerond</option>
            </select>
          </div>
        </div>
      </div>
    </EditDialog>
  );
}
