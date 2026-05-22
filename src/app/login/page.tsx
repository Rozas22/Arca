'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { login, signup } from '@/app/auth/actions';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Llamada a las Server Actions de Next.js
      const result = isLoginMode 
        ? await login(formData)
        : await signup(formData);

      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Ocurrió un error inesperado de conexión. Por favor revisa tu internet y vuelve a intentar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-none bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            {isLoginMode ? 'Bienvenido a Arca' : 'Crea tu cuenta'}
          </CardTitle>
          <CardDescription>
            {isLoginMode 
              ? 'Ingresa tus credenciales para acceder a tu panel.' 
              : 'Regístrate para empezar a organizar tus sesiones de estudio.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input 
                id="email"
                name="email"
                type="email" 
                placeholder="tu@email.com" 
                required
                className="bg-neutral-50 dark:bg-neutral-950"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password"
                name="password"
                type="password" 
                required
                className="bg-neutral-50 dark:bg-neutral-950"
              />
            </div>
            
            <div className="space-y-4 pt-2">
              <Button className="w-full text-md h-11" type="submit" disabled={isLoading}>
                {isLoading 
                  ? (isLoginMode ? 'Iniciando sesión...' : 'Registrando...') 
                  : (isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta')}
              </Button>

              {error && (
                <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 rounded-lg flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center text-sm text-neutral-500">
          <button 
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError(null);
            }}
            className="hover:text-neutral-900 dark:hover:text-neutral-300 underline underline-offset-4 transition-colors"
          >
            {isLoginMode 
              ? '¿No tienes cuenta? Regístrate aquí' 
              : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
