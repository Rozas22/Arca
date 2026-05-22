'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Square, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const DEFAULT_MINUTES = 25;

export default function EstudiarPage() {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<'idle' | 'running' | 'paused'>('idle');

  // Manejo del temporizador
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setSessionStatus('idle');
      // Aquí se podría reproducir un sonido de fin
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Protección contra cierre de pestaña accidental
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRunning) {
        e.preventDefault();
        e.returnValue = ''; // Requerido para navegadores modernos
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    setSessionStatus(!isRunning ? 'running' : 'paused');
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSessionStatus('idle');
    setTimeLeft(DEFAULT_MINUTES * 60);
  };

  const adjustTime = (minutes: number) => {
    if (sessionStatus === 'idle') {
      setTimeLeft((prev) => Math.max(60, prev + minutes * 60));
    }
  };

  // Formato del tiempo (MM:SS)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculamos progreso para un anillo visual (opcional)
  const totalSeconds = DEFAULT_MINUTES * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center transition-all duration-500",
        // Si está corriendo, se convierte en un Overlay de pantalla completa bloqueando todo
        isRunning 
          ? "fixed inset-0 z-[100] bg-neutral-50 dark:bg-neutral-950 px-4" 
          : "min-h-[80vh] px-4 w-full"
      )}
    >
      <div className={cn("max-w-md w-full flex flex-col items-center", isRunning && "scale-110 transition-transform duration-500")}>
        
        {/* Título y Estado */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {isRunning ? 'Enfocado' : sessionStatus === 'paused' ? 'Pausado' : 'Listo para Empezar'}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            {isRunning ? 'No cierres esta ventana' : 'Ajusta tu tiempo y dale a play'}
          </p>
        </div>

        {/* Círculo del Temporizador */}
        <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 mb-12">
          {/* Anillos decorativos */}
          <div className="absolute inset-0 rounded-full border-4 border-neutral-100 dark:border-neutral-800"></div>
          
          {isRunning && (
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-blue-500 opacity-20"
              />
            </svg>
          )}

          <div className="z-10 flex flex-col items-center">
            <span className="text-6xl md:text-8xl font-black tracking-tighter text-neutral-900 dark:text-neutral-50 tabular-nums">
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Efecto Pulse si está corriendo */}
          {isRunning && (
            <div className="absolute inset-0 rounded-full bg-blue-500/5 dark:bg-blue-500/10 animate-ping" style={{ animationDuration: '3s' }}></div>
          )}
        </div>

        {/* Controles de Tiempo (solo visibles cuando no corre) */}
        {!isRunning && (
          <div className="flex gap-4 mb-8 animate-in fade-in">
            <Button variant="outline" size="icon" onClick={() => adjustTime(-5)} disabled={timeLeft <= 300}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="flex items-center text-sm font-medium text-neutral-500">Ajustar (5m)</span>
            <Button variant="outline" size="icon" onClick={() => adjustTime(5)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex items-center gap-4">
          <Button 
            size="lg" 
            className={cn(
              "h-16 rounded-full text-lg shadow-lg transition-all",
              isRunning 
                ? "px-8 bg-orange-500 hover:bg-orange-600 text-white" 
                : "px-12 bg-blue-600 hover:bg-blue-700 text-white"
            )}
            onClick={toggleTimer}
          >
            {isRunning ? (
              <><Pause className="mr-2 h-6 w-6" /> Pausar</>
            ) : (
              <><Play className="mr-2 h-6 w-6 fill-current" /> {sessionStatus === 'paused' ? 'Reanudar' : 'Iniciar'}</>
            )}
          </Button>

          {sessionStatus !== 'idle' && (
            <Button 
              size="lg" 
              variant="outline" 
              className="h-16 w-16 rounded-full"
              onClick={resetTimer}
              title="Detener y reiniciar"
            >
              <Square className="h-5 w-5 text-neutral-500" />
            </Button>
          )}
        </div>

        {/* Botón Volver (solo visible si no está corriendo) */}
        {!isRunning && (
          <div className="mt-12">
            <Link href="/dashboard" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 underline underline-offset-4">
              Volver al Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
