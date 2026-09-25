import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/** Verify the Supabase user on the server before rendering private UI. */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return user;
}
