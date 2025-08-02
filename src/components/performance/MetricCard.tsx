import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  className?: string;
  iconColor?: string;
  textColor?: string;
  subtitle?: string;
}

export function MetricCard({ 
  icon: Icon, 
  title, 
  value, 
  className = "bg-gray-50 dark:bg-gray-800",
  iconColor = "text-gray-600",
  textColor = "text-gray-900 dark:text-gray-100",
  subtitle
}: MetricCardProps) {
  return (
    <div className={`${className} rounded-lg p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        <span className={`text-sm font-medium ${textColor}`}>
          {title}
        </span>
      </div>
      <div className={`text-2xl font-bold ${textColor}`}>
        {value}
      </div>
      {subtitle && (
        <div className={`text-sm font-medium ${iconColor} mt-1`}>
          {subtitle}
        </div>
      )}
    </div>
  );
}