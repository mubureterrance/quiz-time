import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  description 
}) => (
  <div className="text-center py-12">
    {icon && (
      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
    )}
    <p className="text-slate-600 font-medium">{title}</p>
    {description && (
      <p className="text-slate-500 text-sm mt-1">{description}</p>
    )}
  </div>
);