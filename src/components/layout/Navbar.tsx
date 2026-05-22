'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlayCircle, BarChart2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Inicio', href: '/dashboard', icon: Home },
    { name: 'Estudiar', href: '/estudiar', icon: PlayCircle },
    { name: 'Estadísticas', href: '/stats', icon: BarChart2 },
    { name: 'Ajustes', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-around border-t border-neutral-200 bg-white/80 backdrop-blur-lg dark:border-neutral-800 dark:bg-neutral-950/80 md:bottom-auto md:left-0 md:top-0 md:h-screen md:w-20 md:flex-col md:justify-start md:border-r md:border-t-0 md:pt-8 lg:w-64">
      {/* Logo (solo visible en Desktop grande) */}
      <div className="hidden lg:flex w-full px-8 mb-8 items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
          <PlayCircle className="h-6 w-6" />
        </div>
        <span className="text-xl font-bold tracking-tight">Arca</span>
      </div>

      <div className="flex w-full items-center justify-around md:flex-col md:gap-4 md:px-3 lg:px-4">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-200",
                "md:w-full md:flex-row md:justify-center lg:justify-start lg:px-4 lg:py-3",
                "min-h-[44px] min-w-[44px]", 
                isActive 
                  ? "text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-500/10" 
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50 hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
              )}
            >
              <Icon className={cn("h-6 w-6 transition-transform group-hover:scale-110", isActive && "fill-blue-600/20")} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn(
                "text-[10px] font-medium md:hidden lg:block lg:text-sm lg:ml-3",
                isActive ? "font-semibold" : "font-medium"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
      
      {/* Theme Toggle (Abajo en Sidebar, o extra en móvil) */}
      <div className="hidden md:flex md:mt-auto md:mb-8 md:w-full md:justify-center lg:justify-start lg:px-8">
        <ThemeToggle />
      </div>
    </nav>
  );
}
