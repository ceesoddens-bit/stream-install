import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { EditDialog } from '../ui/EditDialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Contact, Company, crmService } from '@/lib/crmService';
import { toast } from 'sonner';

interface ContactEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: Contact | null;
  onSuccess?: () => void;
}

export function ContactEditDialog({ open, onOpenChange, contact, onSuccess }: ContactEditDialogProps) {
  const form = useForm<Partial<Contact>>({
    defaultValues: {
      name: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      mobile: '',
      address: '',
      tags: [],
    },
  });

  useEffect(() => {
    if (contact) {
      form.reset(contact);
    } else {
      form.reset({
        name: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        mobile: '',
        address: '',
        tags: [],
      });
    }
  }, [contact, form, open]);

  const onSubmit = async (values: Partial<Contact>) => {
    try {
      if (contact?.id) {
        await crmService.updateContact(contact.id, values);
        toast.success('Contact bijgewerkt');
      } else {
        // Build full name if not provided
        const name = values.name || `${values.firstName || ''} ${values.lastName || ''}`.trim();
        await crmService.addContact({
          ...values,
          name: name || 'Naamloos',
        } as Contact);
        toast.success('Contact toegevoegd');
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error('Fout bij opslaan');
    }
  };

  return (
    <EditDialog
      open={open}
      onOpenChange={onOpenChange}
      title={contact ? 'Contact bewerken' : 'Nieuw contact'}
      form={form}
      onSubmit={onSubmit}
      size="md"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Voornaam</Label>
          <Input {...form.register('firstName')} />
        </div>
        <div className="space-y-1.5">
          <Label>Achternaam</Label>
          <Input {...form.register('lastName')} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>E-mailadres</Label>
        <Input type="email" {...form.register('email')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Mobiel</Label>
          <Input {...form.register('mobile')} />
        </div>
        <div className="space-y-1.5">
          <Label>Vaste telefoon</Label>
          <Input {...form.register('telephone')} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Adres</Label>
        <Input {...form.register('address')} />
      </div>
      <div className="space-y-1.5">
        <Label>Tags (komma gescheiden)</Label>
        <Input 
          placeholder="bijv. Installatie, Particulier" 
          onChange={(e) => {
            const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
            form.setValue('tags', tags);
          }}
          defaultValue={contact?.tags?.join(', ')}
        />
      </div>
    </EditDialog>
  );
}

interface CompanyEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: Company | null;
  onSuccess?: () => void;
}

export function CompanyEditDialog({ open, onOpenChange, company, onSuccess }: CompanyEditDialogProps) {
  const form = useForm<Partial<Company>>({
    defaultValues: {
      name: '',
      type: 'Residential',
      phone: '',
      email: '',
      address: '',
      kvkNumber: '',
      status: 'Actief',
    },
  });

  useEffect(() => {
    if (company) {
      form.reset(company);
    } else {
      form.reset({
        name: '',
        type: 'Residential',
        phone: '',
        email: '',
        address: '',
        kvkNumber: '',
        status: 'Actief',
      });
    }
  }, [company, form, open]);

  const onSubmit = async (values: Partial<Company>) => {
    try {
      if (company?.id) {
        await crmService.updateCompany(company.id, values);
        toast.success('Bedrijf bijgewerkt');
      } else {
        await crmService.addCompany(values as Company);
        toast.success('Bedrijf toegevoegd');
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error('Fout bij opslaan');
    }
  };

  return (
    <EditDialog
      open={open}
      onOpenChange={onOpenChange}
      title={company ? 'Bedrijf bewerken' : 'Nieuw bedrijf'}
      form={form}
      onSubmit={onSubmit}
      size="md"
    >
      <div className="space-y-1.5">
        <Label>Bedrijfsnaam</Label>
        <Input {...form.register('name')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Type</Label>
          <select 
            {...form.register('type')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="Residential">Particulier</option>
            <option value="Commercial">Zakelijk</option>
            <option value="Installateur">Installateur</option>
            <option value="Aannemer">Aannemer</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <select 
            {...form.register('status')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="Actief">Actief</option>
            <option value="Inactief">Inactief</option>
            <option value="Prospect">Prospect</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>E-mail</Label>
          <Input type="email" {...form.register('email')} />
        </div>
        <div className="space-y-1.5">
          <Label>Telefoon</Label>
          <Input {...form.register('phone')} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Adres</Label>
        <Input {...form.register('address')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>KvK nummer</Label>
          <Input {...form.register('kvkNumber')} />
        </div>
        <div className="space-y-1.5">
          <Label>BTW nummer</Label>
          <Input {...form.register('vatNumber')} />
        </div>
      </div>
    </EditDialog>
  );
}
