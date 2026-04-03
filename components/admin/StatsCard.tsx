// components/admin/StatsCard.tsx
'use client';

import { cn } from '@/lib/utils';
import { Users, UserPlus, Calendar, AlertTriangle, Linkedin, XCircle, RefreshCw } from 'lucide-react';

const icons = {
  clients: Users,
  leads: UserPlus,
  meetings: Calendar,
  issues: AlertTriangle,
  linkedin: Linkedin,
  failed: XCircle,
  sync: RefreshCw,
};

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: keyof typeof icons;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function StatsCard({ title, value, description, icon, variant = 'default' }: StatsCardProps) {
  const Icon = icons[icon];
  
  const variantStyles = {
    default: 'bg-white border-gray-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    danger: 'bg-red-50 border-red-200',
  };

  const titleColors = {
    default: 'text-gray-500',
    success: 'text-green-700',
    warning: 'text-yellow-700',
    danger: 'text-red-700',
  };

  const valueColors = {
    default: 'text-gray-900',
    success: 'text-green-700',
    warning: 'text-yellow-700',
    danger: 'text-red-700',
  };

  const iconBgColors = {
    default: 'bg-gray-100',
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    danger: 'bg-red-100',
  };

  const iconColors = {
    default: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
  };

  return (
    <div className={cn('rounded-lg border p-5 shadow-sm', variantStyles[variant])}>
      <div className="flex items-center justify-between">
        <div>
          <p className={cn('text-sm font-medium', titleColors[variant])}>{title}</p>
          <p className={cn('text-3xl font-bold mt-1', valueColors[variant])}>{value.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-2">{description}</p>
        </div>
        <div className={cn('p-3 rounded-full', iconBgColors[variant])}>
          <Icon size={22} className={iconColors[variant]} />
        </div>
      </div>
    </div>
  );
}