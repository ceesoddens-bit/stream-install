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
import { Edit, Link, Eye, MoreHorizontal } from 'lucide-react';
import { companies } from '@/data/mockData';
import { Company } from '@/types';

export function CompaniesTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === companies.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(companies.map((c) => c.id));
    }
  };

  return (
    <div className="border rounded-md bg-white overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox 
                checked={selectedRows.length === companies.length && companies.length > 0}
                onCheckedChange={toggleAll}
              />
            </TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">Referentie</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">Bedrijfsnaam</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">Telefoon</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">KVK</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">Adres</TableHead>
            <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-gray-500">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id} className="hover:bg-gray-50/50 transition-colors group">
              <TableCell>
                <Checkbox 
                  checked={selectedRows.includes(company.id)}
                  onCheckedChange={() => toggleRow(company.id)}
                />
              </TableCell>
              <TableCell className="font-medium text-sm text-blue-600">{company.referenceNumber}</TableCell>
              <TableCell className="text-sm font-medium text-gray-900">{company.name}</TableCell>
              <TableCell className="text-sm text-gray-600">{company.phone}</TableCell>
              <TableCell className="text-sm text-gray-600">{company.kvkNumber}</TableCell>
              <TableCell className="text-sm text-gray-600 max-w-[200px] truncate">{company.address}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                    <Link className="h-4 w-4" />
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
        <div>1-{companies.length} of {companies.length}</div>
      </div>
    </div>
  );
}
