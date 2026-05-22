'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  let success = false;

  try {
    const supabase = await createClient();

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      return { error: error.message };
    }

    success = true;
  } catch (error: any) {
    return { error: error?.message || 'Error interno al intentar iniciar sesión. Por favor, intenta de nuevo.' };
  }

  if (success) {
    revalidatePath('/dashboard');
    redirect('/dashboard');
  }
}

export async function signup(formData: FormData) {
  let success = false;

  try {
    const supabase = await createClient();

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
      return { error: error.message };
    }

    success = true;
  } catch (error: any) {
    return { error: error?.message || 'Error interno al intentar registrarse. Por favor, intenta de nuevo.' };
  }

  if (success) {
    revalidatePath('/dashboard');
    redirect('/dashboard');
  }
}
