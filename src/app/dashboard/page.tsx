import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Clock, Target, CheckCircle2, AlertCircle } from 'lucide-react';

// Forzamos que esta ruta sea dinámica para que siempre evalúe la sesión en el servidor
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Validar la sesión del usuario
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // 2. Obtener el perfil para el saludo
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username')
    .eq('id', user.id)
    .single();

  const displayName = profile?.full_name || profile?.username || 'Estudiante';

  // 3. Obtener las sesiones de estudio de hoy
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', user.id)
    .gte('start_time', today.toISOString())
    .order('start_time', { ascending: false });

  // Calcular métricas
  const totalSessions = sessions?.length || 0;
  const totalMinutes = sessions?.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0) || 0;
  const completedSessions = sessions?.filter(s => s.status === 'completed').length || 0;

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Encabezado de bienvenida */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              ¡Hola, {displayName}! 👋
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              ¿Listo para alcanzar tus metas de hoy?
            </p>
          </div>
          
          <Button variant="outline" className="hidden md:flex">
            Configuración
          </Button>
        </header>

        {/* Botón Central de Acción */}
        <section className="flex justify-center items-center py-12">
          <Button 
            size="lg" 
            className="h-24 px-12 text-xl md:text-2xl rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <Play className="mr-3 h-8 w-8 fill-current" />
            Iniciar Sesión de Estudio
          </Button>
        </section>

        {/* Resumen de Hoy */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Resumen de Hoy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2 font-medium">
                  <Target className="h-4 w-4 text-blue-500" />
                  Sesiones Totales
                </CardDescription>
                <CardTitle className="text-4xl">{totalSessions}</CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2 font-medium">
                  <Clock className="h-4 w-4 text-orange-500" />
                  Minutos Estudiados
                </CardDescription>
                <CardTitle className="text-4xl">{totalMinutes} <span className="text-xl text-neutral-400 font-normal">min</span></CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Completadas
                </CardDescription>
                <CardTitle className="text-4xl">{completedSessions}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Lista de Sesiones Recientes */}
          <Card className="border-none shadow-sm bg-white dark:bg-neutral-900 overflow-hidden mt-6">
            <CardHeader className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800">
              <CardTitle className="text-lg">Registro de Actividad</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {sessions && sessions.length > 0 ? (
                <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {sessions.map((session) => (
                    <li key={session.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">{session.goal}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                          {session.duration_minutes || 0} min
                        </span>
                        {session.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                        {session.status === 'interrupted' && <AlertCircle className="h-5 w-5 text-red-500" />}
                        {session.status === 'planned' && <Clock className="h-5 w-5 text-neutral-300" />}
                        {session.status === 'in_progress' && <Play className="h-5 w-5 text-blue-500 animate-pulse" />}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-12 text-center text-neutral-500 flex flex-col items-center">
                  <Target className="h-12 w-12 text-neutral-200 dark:text-neutral-700 mb-3" />
                  <p>Aún no tienes sesiones registradas hoy.</p>
                  <p className="text-sm">¡Haz clic en el botón de arriba para comenzar!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}
