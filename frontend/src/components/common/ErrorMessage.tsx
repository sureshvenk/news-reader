interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  icon?: string;
}

export const ErrorMessage = ({
  title = 'Error',
  message,
  onRetry,
  icon = '⚠️',
}: ErrorMessageProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
      <p className="text-red-700 mb-6">{message}</p>
      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        )}
        <button
          onClick={() => window.location.href = '/'}
          className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};
