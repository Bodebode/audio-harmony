import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DeleteAccount } from '@/components/DeleteAccount';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DeleteAccountPage() {
  const { user, loading } = useAuth();
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-3xl font-semibold">AlkePlay account deletion</h1>
        <p className="text-muted-foreground">You can permanently delete your AlkePlay account here or in Profile Settings → Delete Account.</p>
        <p className="text-muted-foreground">Deletion removes your login, profile, uploaded avatar, and AlkePlay payment/support records immediately after a successful request. Likes saved on this device are removed. Copies saved on other devices remain there until you clear their browser or app data.</p>
        <p className="text-muted-foreground">Stripe or PayPal may retain their own transaction records under their policies and legal obligations. Cancel any existing website subscription with the payment provider before deleting your account; deletion does not cancel that subscription.</p>
        {loading ? <p>Loading account…</p> : user ? <DeleteAccount /> : <SignInForDeletion />}
        <Link to="/privacy-policy" className="block text-primary underline">Privacy Policy</Link>
        <Link to="/" className="block text-primary underline">Back to AlkePlay</Link>
      </div>
    </main>
  );
}

function SignInForDeletion() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return <form className="space-y-4" onSubmit={async e => {
    e.preventDefault(); setBusy(true); setError('');
    const result = await signIn(email, password);
    if (result.error) setError('Sign-in failed. Check your email and password.');
    setBusy(false);
  }}>
    <p>Sign in to verify ownership of the account you want to delete.</p>
    <Label htmlFor="deletion-email">Email</Label>
    <Input id="deletion-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} />
    <Label htmlFor="deletion-password">Password</Label>
    <Input id="deletion-password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} />
    {error && <p role="alert" className="text-destructive">{error}</p>}
    <Button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign In'}</Button>
  </form>;
}
