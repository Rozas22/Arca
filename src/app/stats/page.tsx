import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsChart } from './stats-chart';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BarChart2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  const supabase = await createClient();

  // Validar sesión
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Calcular la fecha de hace 7 días
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // Obtener sesiones completadas de los últimos 7 días
  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('start_time, duration_minutes')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .gte('start_time', sevenDaysAgo.toISOString());

  // Generar la estructura de los últimos 7 días (incluso si no hay datos)
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const chartData: { name: string; minutos: number }[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayName = days[d.getDay()];
    chartData.push({ name: dayName, minutos: 0, dateStr: d.toDateString() } as any);
  }

  // Rellenar con los datos reales
  if (sessions) {
    sessions.forEach(session => {
      const sessionDate = new Date(session.start_time).toDateString();
      const targetDay = chartData.find((d: any) => d.dateStr === sessionDate);
      if (targetDay) {
        targetDay.minutos += (session.duration_minutes || 0);
      }
    });
  }

  const totalMinutos = chartData.reduce((acc, curr) => acc + curr.minutos, 0);

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 p-6 md:p-12 font-sans w-full">
      <div className="max-w-4xl mx-auto space-y-10">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Estadísticas
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Analiza tu rendimiento y constancia.
          </p>
        </header>

        <section>
          <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-blue-500" />
                Minutos Estudiados
              </CardTitle>
              <CardDescription>
                Has acumulado {totalMinutos} minutos en los últimos 7 días.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aquí pasamos los datos del servidor al componente del cliente */}
              <StatsChart data={chartData} />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
