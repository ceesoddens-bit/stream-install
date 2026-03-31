import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Target, Lock, Mail, Chrome } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />

      <Card className="w-full max-w-md border-gray-800 bg-gray-900/50 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <Target className="h-10 w-10 text-emerald-500" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
            OpusFlow Premium
          </CardTitle>
          <CardDescription className="text-gray-400 text-base">
            Beheer uw installatiebedrijf met gemak
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-sm font-medium">E-mailadres</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="naam@bedrijf.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-950 border-gray-800 text-white focus:ring-emerald-500/20 focus:border-emerald-500 transition-all h-11"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" title="password" className="text-gray-300 text-sm font-medium">Wachtwoord</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-gray-950 border-gray-800 text-white focus:ring-emerald-500/20 focus:border-emerald-500 transition-all h-11"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-xs mt-1 font-medium bg-red-400/10 p-2 rounded border border-red-400/20">{error}</p>}

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              {isRegistering ? 'Account aanmaken' : 'Inloggen'}
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#111827] px-4 text-gray-500 font-bold tracking-widest">OF</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={handleGoogleAuth}
            className="w-full border-gray-800 bg-transparent text-gray-300 hover:bg-gray-800/50 hover:text-white h-11 transition-all"
          >
            <Chrome className="mr-2 h-4 w-4" /> Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-gray-400 hover:text-emerald-500 transition-colors font-medium underline underline-offset-4"
          >
            {isRegistering ? 'Al een account? Log in' : 'Nog geen account? Registreer hier'}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
