'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';

type ChartData = {
  name: string;
  minutos: number;
};

export function StatsChart({ data }: { data: ChartData[] }) {
  const { resolvedTheme } = useTheme();

  // Colores dinámicos para el gráfico basados en el tema
  const textColor = resolvedTheme === 'dark' ? '#a3a3a3' : '#525252';
  const gridColor = resolvedTheme === 'dark' ? '#262626' : '#e5e5e5';
  const barColor = '#2563eb'; // blue-600

  return (
    <div className="h-[350px] w-full mt-4 animate-in fade-in duration-500">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            formatter={(value: number) => [`${value} min`, 'Estudiado']}
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
  );
}
