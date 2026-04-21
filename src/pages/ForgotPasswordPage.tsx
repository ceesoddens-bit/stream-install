import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      setError('Kon geen reset-link versturen. Controleer het e-mailadres.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Wachtwoord vergeten</CardTitle>
          <CardDescription>Vul uw e-mailadres in om een reset-link te ontvangen.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3">
            {sent ? (
              <p className="text-sm text-emerald-700">Er is een e-mail verzonden naar {email}.</p>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            {!sent && (
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Versturen...' : 'Verstuur reset-link'}
              </Button>
            )}
            <div className="text-sm text-center w-full">
              <Link to="/login" className="text-emerald-600 hover:underline">
                Terug naar inloggen
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
