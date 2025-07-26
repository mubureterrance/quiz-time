interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  message = "Loading...", 
  className = "" 
}: LoadingSpinnerProps) {
  return (
    <div className={`bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-screen ${className}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
}