import { Users, UserCheck, Shield } from "lucide-react";
import type { UserData } from "../../types/user";

interface UserStatsProps {
  users: UserData[];
  className?: string;
}

export default function UserStats({ users, className = "" }: UserStatsProps) {
  const totalUsers = users.length;
  const regularUsers = users.filter(u => u.role === 'user').length;
  const adminUsers = users.filter(u => u.role === 'admin').length;

  const stats = [
    {
      icon: Users,
      value: totalUsers,
      label: "Total Users",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600"
    },
    {
      icon: UserCheck,
      value: regularUsers,
      label: "Regular Users",
      bgColor: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600"
    },
    {
      icon: Shield,
      value: adminUsers,
      label: "Administrators",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className={`w-6 h-6 ${stat.bgColor} rounded flex items-center justify-center`}>
                <Icon className={`w-3.5 h-3.5 ${stat.iconColor}`} />
              </div>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {stat.value}
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-300">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}