import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Target, Lock, Mail, Chrome } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Ongeldig e-mailadres'),
  password: z.string().min(6, 'Minimaal 6 tekens'),
});

type LoginValues = z.infer<typeof loginSchema>;

function mapAuthError(code?: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mailadres of wachtwoord is onjuist.';
    case 'auth/too-many-requests':
      return 'Te veel pogingen. Probeer het later opnieuw.';
    case 'auth/network-request-failed':
      return 'Geen netwerkverbinding.';
    case 'auth/popup-closed-by-user':
      return 'Inloggen is afgebroken.';
    default:
      return 'Inloggen mislukt. Probeer het opnieuw.';
  }
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  const [error, setError] = useState('');

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginValues) => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(mapAuthError(err?.code));
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(mapAuthError(err?.code));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />

      <Card className="w-full max-w-md border-gray-800 bg-gray-900/50 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <Target className="h-10 w-10 text-emerald-500" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white">StreamInstall</CardTitle>
          <CardDescription className="text-gray-400">Log in op uw account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">E-mailadres</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="naam@bedrijf.nl"
                  {...form.register('email')}
                  className="pl-10 bg-gray-950 border-gray-800 text-white h-11"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-red-400 text-xs">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300">Wachtwoord</Label>
                <Link to="/wachtwoord-vergeten" className="text-xs text-emerald-400 hover:underline">
                  Vergeten?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  {...form.register('password')}
                  className="pl-10 bg-gray-950 border-gray-800 text-white h-11"
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-red-400 text-xs">{form.formState.errors.password.message}</p>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 p-2 rounded border border-red-400/20">{error}</p>
            )}

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11"
            >
              {form.formState.isSubmitting ? 'Bezig...' : 'Inloggen'}
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-4 text-gray-500 tracking-widest">of</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            className="w-full border-gray-800 bg-transparent text-gray-300 hover:bg-gray-800/50 h-11"
          >
            <Chrome className="mr-2 h-4 w-4" /> Inloggen met Google
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-400 w-full text-center">
            Nog geen account?{' '}
            <Link to="/registreren" className="text-emerald-400 hover:underline font-medium">
              Registreer gratis
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
