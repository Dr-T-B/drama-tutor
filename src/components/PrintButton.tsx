interface PrintButtonProps {
  label?: string;
  className?: string;
}

export function PrintButton({ label = "Print / Save as PDF", className = "" }: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`print-hide inline-flex items-center rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors ${className}`}
    >
      {label}
    </button>
  );
}
