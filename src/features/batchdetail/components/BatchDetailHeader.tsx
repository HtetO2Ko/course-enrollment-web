interface BatchDetailHeaderProps {
  title: string;
  batchCode: string;
  onBack: () => void;
}

export default function BatchDetailHeader({
  title,
  batchCode,
  onBack,
}: BatchDetailHeaderProps) {
  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-button-color hover:underline"
      >
        ← Back to Home
      </button>

      <h1 className="mt-4 text-2xl font-bold text-maincolor md:text-3xl">
        {title}
      </h1>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Batch: {batchCode}
      </p>
    </div>
  );
}
