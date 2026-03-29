import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Link, Eye, Mail, Phone, Smartphone } from 'lucide-react';
import { contacts, companies } from '@/data/mockData';
import { Contact } from '@/types';

export function ContactsTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === contacts.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(contacts.map((c) => c.id));
    }
  };

  const getCompanyName = (companyId?: string) => {
    if (!companyId) return '-';
    return companies.find(c => c.id === companyId)?.name || '-';
  };

  return (
    <div className="border rounded-md bg-white overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox 
                checked={selectedRows.length === contacts.length && contacts.length > 0}
                onCheckedChange={toggleAll}
              />
            </TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">Naam</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">Bedrijf</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">Email</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">Telefoon</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">Tags</TableHead>
            <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-gray-500">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id} className="hover:bg-gray-50/50 transition-colors group">
              <TableCell>
                <Checkbox 
                  checked={selectedRows.includes(contact.id)}
                  onCheckedChange={() => toggleRow(contact.id)}
                />
              </TableCell>
              <TableCell className="text-sm font-medium text-gray-900">{contact.firstName} {contact.lastName}</TableCell>
              <TableCell className="text-sm text-blue-600 font-medium">{getCompanyName(contact.companyId)}</TableCell>
              <TableCell className="text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  {contact.email}
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    {contact.phone}
                  </div>
                  {contact.mobile && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Smartphone className="h-3 w-3" />
                      {contact.mobile}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {contact.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 font-medium bg-gray-100 text-gray-600 border-transparent">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="px-4 py-3 border-t bg-gray-50/30 flex items-center justify-between text-xs text-gray-500 font-medium">
        <div className="flex items-center gap-4">
          <span>Regels per pagina: 25</span>
          <span>{selectedRows.length} geselecteerd</span>
        </div>
        <div>1-{contacts.length} of {contacts.length}</div>
      </div>
    </div>
  );
}
