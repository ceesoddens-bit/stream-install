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
import { Zap, Lock, Mail } from 'lucide-react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';

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
    <div className="min-h-screen bg-background font-sans flex flex-col relative overflow-hidden">
      <PublicNavbar />
      
      {/* Background Pattern from Landing Page */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border/50 bg-white/80 backdrop-blur-sm shadow-2xl relative z-10">
          <CardHeader className="space-y-2 text-center pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Welkom terug</CardTitle>
            <CardDescription className="text-gray-600">Log in op uw account om verder te gaan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">E-mailadres</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="naam@bedrijf.nl"
                    {...form.register('email')}
                    className="pl-10 h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-red-600 text-xs mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700">Wachtwoord</Label>
                  <Link to="/wachtwoord-vergeten" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors">
                    Vergeten?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    {...form.register('password')}
                    className="pl-10 h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                {form.formState.errors.password && (
                  <p className="text-red-600 text-xs mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              {error && (
                <p className="text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>
              )}

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold h-11 shadow-sm transition-all"
              >
                {form.formState.isSubmitting ? 'Bezig...' : 'Inloggen'}
              </Button>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-400 tracking-widest font-medium">of</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogle}
              className="w-full border-gray-200 bg-white text-gray-700 hover:bg-gray-50 h-11 shadow-sm transition-all font-medium"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Inloggen met Google
            </Button>
          </CardContent>
          <CardFooter className="pt-0 pb-6">
            <p className="text-sm text-gray-600 w-full text-center">
              Nog geen account?{' '}
              <Link to="/registreren" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-colors">
                Registreer gratis
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
