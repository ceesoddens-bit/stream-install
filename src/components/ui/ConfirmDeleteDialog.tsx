import React, { useEffect, useState } from 'react';
import { AlertDialog } from '@base-ui/react/alert-dialog';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmWord?: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmWord = 'VERWIJDER',
  confirmLabel = 'Verwijderen',
  onConfirm,
}: Props) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setValue('');
      setLoading(false);
    }
  }, [open]);

  const canConfirm = value.trim() === confirmWord && !loading;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    try {
      setLoading(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <AlertDialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg focus:outline-none">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <AlertDialog.Title className="text-base font-semibold text-gray-900">{title}</AlertDialog.Title>
              <AlertDialog.Description className="mt-1 text-sm text-gray-600">{description}</AlertDialog.Description>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <label className="text-xs text-gray-600">
              Typ <span className="font-mono font-semibold text-gray-900">{confirmWord}</span> om te bevestigen
            </label>
            <Input value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Annuleren
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirm} disabled={!canConfirm}>
              {loading ? 'Bezig...' : confirmLabel}
            </Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
