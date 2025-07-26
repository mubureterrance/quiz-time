import React from 'react';
import Button from '../ui/Button';
import { BadgePreview } from './BadgePreview';
import type { Badge } from './types';

interface BadgeItemProps {
  badge: Badge;
  onEdit: (badge: Badge) => void;
  onDelete: (id: string) => void;
}

export const BadgeItem: React.FC<BadgeItemProps> = ({ 
  badge, 
  onEdit, 
  onDelete 
}) => (
  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors group">
    <div className="relative">
      <BadgePreview badge={badge} />
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
          {badge.name}
        </h3>
        <span className="px-2 py-1 text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded">
          {badge.id}
        </span>
      </div>
      {badge.description && (
        <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
          {badge.description}
        </p>
      )}
    </div>

    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        onClick={() => onEdit(badge)}
        className="px-3 py-1.5 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
      >
        Edit
      </Button>
      <Button
        onClick={() => onDelete(badge.id)}
        className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
      >
        Delete
      </Button>
    </div>
  </div>
);