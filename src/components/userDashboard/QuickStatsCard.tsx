// src/components/useDashboard/QuickStatsCard.tsx
import type { LucideIcon } from "lucide-react";
import Card from "../ui/Card";

interface QuickStatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor: string;
  iconBgColor: string;
}

export function QuickStatsCard({
  icon: Icon,
  label,
  value,
  iconColor,
  iconBgColor,
}: QuickStatsCardProps) {
  return (
    <Card>
      <div className="flex items-center">
        <div className={`${iconBgColor} p-2 rounded-lg mr-3`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}
