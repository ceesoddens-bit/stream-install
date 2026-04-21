import React from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import { FormProvider, UseFormReturn, FieldValues, SubmitHandler } from 'react-hook-form';
import { Button } from './button';

interface EditDialogProps<TValues extends FieldValues> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  form: UseFormReturn<TValues>;
  onSubmit: SubmitHandler<TValues>;
  submitLabel?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE: Record<NonNullable<EditDialogProps<any>['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function EditDialog<TValues extends FieldValues>({
  open,
  onOpenChange,
  title,
  description,
  form,
  onSubmit,
  submitLabel = 'Opslaan',
  children,
  size = 'md',
}: EditDialogProps<TValues>) {
  const submitting = form.formState.isSubmitting;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <Dialog.Popup
          className={`fixed left-1/2 top-1/2 z-50 w-[95vw] ${SIZE[size]} -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-lg focus:outline-none`}
        >
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col max-h-[90vh]">
              <header className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
                <div>
                  <Dialog.Title className="text-lg font-semibold text-gray-900">{title}</Dialog.Title>
                  {description && (
                    <Dialog.Description className="mt-1 text-sm text-gray-500">{description}</Dialog.Description>
                  )}
                </div>
                <Dialog.Close
                  className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Sluiten"
                >
                  <X className="h-4 w-4" />
                </Dialog.Close>
              </header>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">{children}</div>

              <footer className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                  Annuleren
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Bezig...' : submitLabel}
                </Button>
              </footer>
            </form>
          </FormProvider>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
