interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({
  message,
}: ErrorMessageProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-lg text-red-500">⚠️</span>

        <h4 className="font-medium text-red-700">
          Ocurrió un problema
        </h4>
      </div>

      <p className="mt-2 text-sm text-red-600">
        {message}
      </p>
    </div>
  );
}