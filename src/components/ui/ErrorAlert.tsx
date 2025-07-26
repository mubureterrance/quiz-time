interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export default function ErrorAlert({ 
  message, 
  onDismiss, 
  className = "" 
}: ErrorAlertProps) {
  return (
    <div className={`p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between ${className}`}>
      <span className="text-red-700 dark:text-red-400">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200 ml-4 text-xl leading-none"
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
}