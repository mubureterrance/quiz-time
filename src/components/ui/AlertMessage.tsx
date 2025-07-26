import { CheckCircle, AlertCircle, Info } from "lucide-react";

interface AlertMessageProps {
  message: string;
  type: "success" | "error" | "info";
}

export const AlertMessage = ({ message, type }: AlertMessageProps) => {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300",
    error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300",
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300",
  };

  const icons = {
    success: <CheckCircle className="h-4 w-4" />,
    error: <AlertCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
  };

  return (
    <div className={`mb-4 p-3 border rounded-lg flex items-center gap-2 ${styles[type]}`}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};