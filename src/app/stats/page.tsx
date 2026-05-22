'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';

// Datos Mock (falsos) de los últimos 7 días
const mockData = [
  { name: 'Lun', minutos: 45 },
  { name: 'Mar', minutos: 60 },
  { name: 'Mié', minutos: 30 },
  { name: 'Jue', minutos: 90 },
  { name: 'Vie', minutos: 25 },
  { name: 'Sáb', minutos: 120 },
  { name: 'Dom', minutos: 80 },
];

export default function StatsPage() {
  const { resolvedTheme } = useTheme();

  // Colores dinámicos para el gráfico basados en el tema
  const textColor = resolvedTheme === 'dark' ? '#a3a3a3' : '#525252';
  const gridColor = resolvedTheme === 'dark' ? '#262626' : '#e5e5e5';
  const barColor = '#2563eb'; // blue-600

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
              <CardTitle>Minutos Estudiados</CardTitle>
              <CardDescription>Resumen de los últimos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: textColor, fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: textColor, fontSize: 12 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: resolvedTheme === 'dark' ? '#171717' : '#f5f5f5' }}
                      contentStyle={{ 
                        backgroundColor: resolvedTheme === 'dark' ? '#171717' : '#ffffff',
                        borderColor: resolvedTheme === 'dark' ? '#262626' : '#e5e5e5',
                        borderRadius: '8px',
                        color: resolvedTheme === 'dark' ? '#ffffff' : '#000000'
                      }}
                    />
                    <Bar 
                      dataKey="minutos" 
                      fill={barColor} 
                      radius={[4, 4, 0, 0]} 
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
