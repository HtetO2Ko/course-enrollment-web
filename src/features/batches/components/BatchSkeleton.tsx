export default function BatchSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl shadow-md">
      <div className="h-48 bg-gray-300 dark:bg-gray-700" />

      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-4 w-2/3 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  );
}
