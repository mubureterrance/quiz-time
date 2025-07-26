import { Star, CheckCircle, Target, XCircle } from "lucide-react";

export function getPerformanceLevel(percentage: number) {
  if (percentage >= 80) return { 
    level: "Excellent", 
    color: "text-emerald-600", 
    bg: "bg-emerald-50", 
    icon: Star 
  };
  if (percentage >= 60) return { 
    level: "Good", 
    color: "text-green-600", 
    bg: "bg-green-50", 
    icon: CheckCircle 
  };
  if (percentage >= 40) return { 
    level: "Fair", 
    color: "text-yellow-600", 
    bg: "bg-yellow-50", 
    icon: Target 
  };
  return { 
    level: "Needs Work", 
    color: "text-red-600", 
    bg: "bg-red-50", 
    icon: XCircle 
  };
}