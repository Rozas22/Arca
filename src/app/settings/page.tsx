'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { signOut } from '@/app/auth/actions';
import { useTransition } from 'react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 p-6 md:p-12 font-sans w-full">
      <div className="max-w-4xl mx-auto space-y-10">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Ajustes
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Personaliza tu experiencia en Arca.
          </p>
        </header>

        <section className="space-y-6">
          <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
            <CardHeader>
              <CardTitle>Apariencia</CardTitle>
              <CardDescription>
                Cambia el tema de la aplicación.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button 
                  variant={theme === 'light' ? 'default' : 'outline'} 
                  onClick={() => setTheme('light')}
                  className="flex-1 h-14"
                >
                  <Sun className="mr-2 h-5 w-5" /> Claro
                </Button>
                <Button 
                  variant={theme === 'dark' ? 'default' : 'outline'} 
                  onClick={() => setTheme('dark')}
                  className="flex-1 h-14"
                >
                  <Moon className="mr-2 h-5 w-5" /> Oscuro
                </Button>
                <Button 
                  variant={theme === 'system' ? 'default' : 'outline'} 
                  onClick={() => setTheme('system')}
                  className="flex-1 h-14"
                >
                  <Monitor className="mr-2 h-5 w-5" /> Sistema
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-neutral-900 border-red-100 dark:border-red-900/30">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Cuenta</CardTitle>
              <CardDescription>
                Gestión de sesión.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                onClick={handleSignOut}
                disabled={isPending}
                className="w-full sm:w-auto h-12 px-8"
              >
                <LogOut className="mr-2 h-5 w-5" /> 
                {isPending ? 'Cerrando sesión...' : 'Cerrar Sesión'}
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
