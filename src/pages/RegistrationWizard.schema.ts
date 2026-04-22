import { z } from 'zod';
import { ModuleKey, MODULES } from '@/lib/modules';
import { PermissionKey } from '@/lib/permissions';

const betaaldeKeys = MODULES.filter((m) => !m.inbegrepen).map((m) => m.key) as [ModuleKey, ...ModuleKey[]];

const teamlidSchema = z.object({
  email: z.string().trim().toLowerCase().email('Ongeldig e-mailadres'),
  role: z.enum(['owner', 'admin', 'member'] as const),
  permissions: z.array(z.string()).default([]),
});

export type TeamlidValues = z.infer<typeof teamlidSchema>;

export const registrationSchema = z.object({
  // Stap 1 — Bedrijf
  bedrijfsnaam: z.string().trim().min(2, 'Bedrijfsnaam is verplicht'),
  kvk: z
    .string()
    .trim()
    .regex(/^\d{8}$/, 'KvK-nummer moet 8 cijfers bevatten')
    .optional()
    .or(z.literal('')),
  btw: z.string().trim().optional().or(z.literal('')),
  land: z.string().min(2).default('NL'),

  // Stap 2 — Persoon
  voornaam: z.string().trim().min(1, 'Voornaam is verplicht'),
  achternaam: z.string().trim().min(1, 'Achternaam is verplicht'),
  email: z.string().trim().toLowerCase().email('Ongeldig e-mailadres'),
  password: z
    .string()
    .min(8, 'Minimaal 8 tekens')
    .regex(/[A-Z]/, 'Minimaal 1 hoofdletter')
    .regex(/[0-9]/, 'Minimaal 1 cijfer'),

  // Stap 3 — Pakket
  modules: z.array(z.enum(betaaldeKeys)).default([]),

  // Stap 4 — Team
  aantalOwners: z.coerce.number().int().min(1).default(1),
  aantalAdmins: z.coerce.number().int().min(0).default(0),
  aantalMembers: z.coerce.number().int().min(0).default(0),
  teamleden: z.array(teamlidSchema).default([]),

  // Stap 5 — Voorwaarden
  voorwaarden: z.literal(true, { errorMap: () => ({ message: 'Accepteer de voorwaarden om door te gaan' }) }),
}).superRefine((val, ctx) => {
  // Valideer dat teamleden-emails uniek zijn en niet gelijk aan de registrerende user
  const emails = val.teamleden.map((t) => t.email.toLowerCase());
  const ownerEmail = val.email.toLowerCase();
  const dupes = emails.filter((e, i) => emails.indexOf(e) !== i || e === ownerEmail);
  dupes.forEach((_, i) => {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['teamleden', i, 'email'],
      message: 'Dit e-mailadres is al in gebruik',
    });
  });
});

export type RegistrationValues = z.infer<typeof registrationSchema>;

export const STEP_FIELDS: Record<number, Array<keyof RegistrationValues>> = {
  1: ['bedrijfsnaam', 'kvk', 'btw', 'land'],
  2: ['voornaam', 'achternaam', 'email', 'password'],
  3: ['modules'],
  4: ['aantalOwners', 'aantalAdmins', 'aantalMembers', 'teamleden'],
  5: ['voorwaarden'],
};

export function passwordStrength(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  const clamped = Math.min(score, 4) as 0 | 1 | 2 | 3 | 4;
  const label = ['Zeer zwak', 'Zwak', 'Redelijk', 'Sterk', 'Zeer sterk'][clamped];
  return { score: clamped, label };
}
