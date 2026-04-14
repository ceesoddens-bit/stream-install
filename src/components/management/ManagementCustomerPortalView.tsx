import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Check,
  Code,
  FolderOpen,
  IndentDecrease,
  IndentIncrease,
  Link as LinkIcon,
  List,
  ListChecks,
  ListOrdered,
  Lock,
  Monitor,
  Quote,
  Strikethrough,
  Underline,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CustomerPortalTabId = 'layout' | 'content';

type CustomerPortalTab = {
  id: CustomerPortalTabId;
  label: string;
};

const tabs: CustomerPortalTab[] = [
  { id: 'layout', label: 'Lay-Out' },
  { id: 'content', label: 'Klantportaalinhoud' },
];

function CustomerPortalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="px-6 pt-5">
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
      </div>
      <div className="px-6 pb-5 pt-4">
        {children}
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" className="gap-2" disabled>
            <Lock className="h-4 w-4" />
            Opslaan
          </Button>
        </div>
      </div>
    </section>
  );
}

function ToolbarButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900',
        className
      )}
    >
      {children}
    </button>
  );
}

function isHexColor(value: string) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

function normalizeHexColor(value: string) {
  const trimmed = value.trim();
  if (!trimmed.startsWith('#')) return `#${trimmed}`;
  return trimmed;
}

type ManagementCustomerPortalViewProps = {
  initialTab?: CustomerPortalTabId;
};

export function ManagementCustomerPortalView({ initialTab = 'layout' }: ManagementCustomerPortalViewProps) {
  const [activeTab, setActiveTab] = useState<CustomerPortalTabId>(initialTab);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [bannerFileName, setBannerFileName] = useState<string>('');

  const [primaryColor, setPrimaryColor] = useState<string>('#076735');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!logoFile) {
      if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
      setLogoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(logoFile);
    setLogoPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [logoFile]);

  const activeLabel = useMemo(() => {
    return tabs.find(t => t.id === activeTab)?.label ?? '';
  }, [activeTab]);

  const onSelectFiles = (files: FileList | null) => {
    const file = files?.[0];
    setBannerFileName(file?.name ?? '');
  };

  const onSelectLogo = (files: FileList | null) => {
    const file = files?.[0];
    setLogoFile(file ?? null);
  };

  const primaryColorValue = normalizeHexColor(primaryColor);
  const primaryColorValid = isHexColor(primaryColorValue);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Portal</h1>
          <p className="text-sm text-gray-500">{activeLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 border-b border-gray-200 pb-2">
        {tabs.map((t) => {
          const isActive = t.id === activeTab;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={cn(
                'relative inline-flex items-center gap-2 px-1 pb-2 text-sm font-semibold transition-colors',
                isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
              )}
            >
              {t.id === 'layout' ? <Monitor className="h-4 w-4" /> : <FolderOpen className="h-4 w-4" />}
              {t.label}
              {isActive && <span className="pointer-events-none absolute inset-x-0 -bottom-[1px] h-0.5 rounded-full bg-emerald-600" />}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto pt-5">
        {activeTab === 'layout' ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="px-6 pt-5">
                <h2 className="text-base font-bold text-gray-900">Indeling</h2>
              </div>
              <div className="px-6 pb-5 pt-4">
                <div className="grid gap-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-700">Primaire kleur</div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="relative">
                        <input
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className={cn(
                            'h-9 w-32 rounded-lg border bg-white px-3 text-sm font-mono outline-none',
                            primaryColorValid ? 'border-gray-200' : 'border-rose-300'
                          )}
                          inputMode="text"
                          aria-label="Primaire kleur"
                        />
                        {primaryColorValid && (
                          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-emerald-600">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!primaryColorValid) return;
                        }}
                        className="h-9 w-9 rounded-full border border-gray-200"
                        style={{ backgroundColor: primaryColorValid ? primaryColorValue : '#ffffff' }}
                        aria-label="Kleurenvoorbeeld"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] gap-4">
                    <div>
                      <div className="relative h-40 w-full overflow-hidden rounded-lg border border-gray-200">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `linear-gradient(to right, #ffffff, ${primaryColorValid ? primaryColorValue : '#076735'})`,
                          }}
                        />
                        <div
                          className="absolute inset-0"
                          style={{ backgroundImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))' }}
                        />
                        <div className="absolute right-8 top-10 h-4 w-4 rounded-full border-2 border-white shadow" />
                      </div>

                      <div className="relative mt-3 h-3 w-full overflow-hidden rounded-full border border-gray-200">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage:
                              'linear-gradient(to right, rgb(255,0,0), rgb(255,255,0), rgb(0,255,0), rgb(0,255,255), rgb(0,0,255), rgb(255,0,255), rgb(255,0,0))',
                          }}
                        />
                        <div className="absolute left-[45%] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white shadow" />
                      </div>
                    </div>

                    <div className="flex items-start justify-end pt-2">
                      <div
                        className="h-10 w-10 rounded-full border border-gray-200"
                        style={{ backgroundColor: primaryColorValid ? primaryColorValue : '#076735' }}
                        aria-label="Kleur swatch"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="secondary" className="gap-2" disabled>
                      <Lock className="h-4 w-4" />
                      Opslaan
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="px-6 pt-5">
                <h2 className="text-base font-bold text-gray-900">Logo</h2>
              </div>
              <div className="px-6 pb-5 pt-4">
                <div
                  className="relative rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4"
                  role="button"
                  tabIndex={0}
                  onClick={() => logoInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') logoInputRef.current?.click();
                  }}
                >
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onSelectLogo(e.target.files)}
                  />

                  {logoPreviewUrl ? (
                    <div className="relative h-36 w-full overflow-hidden rounded-lg bg-white">
                      <img src={logoPreviewUrl} alt="Logo preview" className="h-full w-full object-contain" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLogoFile(null);
                        }}
                        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow hover:bg-white"
                        aria-label="Verwijder logo"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-36 w-full items-center justify-center rounded-lg bg-white text-sm text-gray-500">
                      Klik om een logo te uploaden
                    </div>
                  )}

                  <div className="absolute -right-2 bottom-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 shadow">
                    <LinkIcon className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button className="gap-2" disabled={!logoFile && !logoPreviewUrl}>
                    <Lock className="h-4 w-4" />
                    Opslaan
                  </Button>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-6">
              <CustomerPortalSection title="Banner">
                <div
                  className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6"
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => onSelectFiles(e.target.files)}
                  />
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <FolderOpen className="h-10 w-10" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="text-base font-bold text-gray-900">Sleep of selecteer bestanden</div>
                      <div className="mt-1 text-sm text-gray-500">
                        Sleep bestanden hier in of{' '}
                        <button
                          type="button"
                          className="text-blue-600 hover:underline"
                          onClick={(evt) => {
                            evt.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                        >
                          blader
                        </button>{' '}
                        door je machine
                      </div>
                      {bannerFileName ? (
                        <div className="mt-2 text-sm text-gray-700">Geselecteerd: {bannerFileName}</div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CustomerPortalSection>

              <CustomerPortalSection title="Over ons">
                <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                  <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 bg-gray-50/40 px-3 py-2">
                    <ToolbarButton>
                      <span className="font-bold">B</span>
                    </ToolbarButton>
                    <ToolbarButton>
                      <span className="italic">I</span>
                    </ToolbarButton>
                    <ToolbarButton>
                      <span className="line-through">S</span>
                    </ToolbarButton>
                    <ToolbarButton>
                      <span className="underline">U</span>
                    </ToolbarButton>
                    <div className="mx-1 h-5 w-px bg-gray-200" />
                    <ToolbarButton>
                      <AlignLeft className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton>
                      <AlignCenter className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton>
                      <AlignRight className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton>
                      <AlignJustify className="h-4 w-4" />
                    </ToolbarButton>
                    <div className="mx-1 h-5 w-px bg-gray-200" />
                    <ToolbarButton>
                      <List className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton>
                      <ListOrdered className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton>
                      <ListChecks className="h-4 w-4" />
                    </ToolbarButton>
                    <div className="mx-1 h-5 w-px bg-gray-200" />
                    <ToolbarButton>
                      <IndentDecrease className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton>
                      <IndentIncrease className="h-4 w-4" />
                    </ToolbarButton>
                    <div className="mx-1 h-5 w-px bg-gray-200" />
                    <ToolbarButton>
                      <LinkIcon className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton>
                      <Code className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton>
                      <Quote className="h-4 w-4" />
                    </ToolbarButton>
                  </div>
                  <textarea
                    className="min-h-[160px] w-full resize-none bg-white px-4 py-3 text-sm text-gray-900 outline-none"
                    placeholder=""
                  />
                </div>
              </CustomerPortalSection>
          </div>
        )}
      </div>
    </div>
  );
}
