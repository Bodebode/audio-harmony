import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { clearLikedSongs } from '@/hooks/useLikedSongs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';

export const DeleteAccount = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const deleteAccount = async () => {
    if (!user || confirmation !== 'DELETE' || busy) return;
    setBusy(true);
    setError('');
    try {
      const { data, error: requestError } = await supabase.functions.invoke('delete-account', {
        body: { confirmation: 'DELETE' },
      });
      if (requestError || !data?.deleted) throw new Error('Your account could not be deleted. Please try again or sign in again.');
      await supabase.auth.signOut({ scope: 'local' });
      clearLikedSongs();
      localStorage.removeItem('guestMode');
      queryClient.clear();
      setOpen(false);
      navigate('/auth', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deletion failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={value => { if (!busy) { setOpen(value); setConfirmation(''); setError(''); } }}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full"><Trash2 className="mr-2 h-4 w-4" />Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your AlkePlay account?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes your login, profile, uploaded avatar, and payment/support records held by AlkePlay.
            Saved likes on this device will be removed. This cannot be undone.
            Any existing website subscription must be cancelled separately with its payment provider; deleting your account does not cancel billing.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <Label htmlFor="delete-confirmation">Type DELETE to confirm</Label>
          <Input id="delete-confirmation" value={confirmation} onChange={e => setConfirmation(e.target.value)} disabled={busy} autoComplete="off" />
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
          <Button variant="destructive" disabled={confirmation !== 'DELETE' || busy} onClick={deleteAccount}>
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            {busy ? 'Deleting…' : 'Permanently Delete Account'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};