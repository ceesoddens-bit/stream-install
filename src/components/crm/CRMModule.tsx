import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Settings, Filter } from 'lucide-react';
import { CompaniesTable } from './CompaniesTable';
import { ContactsTable } from './ContactsTable';
import { crmService, Company, Contact } from '@/lib/crmService';

export function CRMModule() {
  const [activeTab, setActiveTab] = useState('bedrijven');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const unsubCompanies = crmService.subscribeToCompanies(setCompanies);
    const unsubContacts = crmService.subscribeToContacts(setContacts);
    return () => {
      unsubCompanies();
      unsubContacts();
    };
  }, []);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">CRM</h1>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setActiveTab('bedrijven')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${activeTab === 'bedrijven' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Bedrijven <span className="ml-1 text-xs opacity-60">[{companies.length}]</span>
            </button>
            <button 
              onClick={() => setActiveTab('contacten')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${activeTab === 'contacten' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Contacten <span className="ml-1 text-xs opacity-60">[{contacts.length}]</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder={`Zoek in ${activeTab}...`} 
              className="pl-9 h-9 bg-white border-gray-200"
            />
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9 text-gray-500 border-gray-200">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 text-gray-500 border-gray-200">
            <Settings className="h-4 w-4" />
          </Button>
          <Button className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="h-4 w-4" />
            {activeTab === 'bedrijven' ? 'Bedrijf Maken' : 'Contact Maken'}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'bedrijven' ? (
          <div className="h-full flex flex-col space-y-4">
            <div className="flex items-center gap-2 border-b pb-1">
              <button className="px-4 py-2 text-sm font-semibold border-b-2 border-blue-600 text-blue-600">
                Alles <span className="ml-1 text-xs opacity-60">[{companies.length}]</span>
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                Mijn Bedrijven
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                Recent Toegevoegd
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <CompaniesTable />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col space-y-4">
            <div className="flex items-center gap-2 border-b pb-1">
              <button className="px-4 py-2 text-sm font-semibold border-b-2 border-blue-600 text-blue-600">
                Alles <span className="ml-1 text-xs opacity-60">[{contacts.length}]</span>
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                Mijn Contacten
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <ContactsTable />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
