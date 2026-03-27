import { AlertCircle, CheckCircle, X } from "lucide-react";

export default function ResponseMessage({ response, setResponse }) {
  if (!response) return null;

  // Determine type
  const isFullSuccess = response?.success && !response?.payload?.partialSuccess;
  const isPartialSuccess = response?.payload?.partialSuccess;

  // Colors
  const bgColor = isFullSuccess
    ? "bg-green-100"
    : isPartialSuccess
    ? "bg-yellow-100"
    : "bg-red-100";

  const textColor = isFullSuccess
    ? "text-green-700"
    : isPartialSuccess
    ? "text-yellow-700"
    : "text-red-700";

  // Icon
  const Icon = isFullSuccess ? CheckCircle : isPartialSuccess ? AlertCircle : AlertCircle;

  return (
    <div className={`${bgColor} rounded p-3 flex flex-col mb-4 border`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${textColor}`} />
          <p className={`text-sm font-semibold m-0`}>{response?.message}</p>
        </div>
        <X
          size={18}
          className="cursor-pointer"
          onClick={() => setResponse?.(null)}
        />
      </div>

      {/* Partial success details */}
      {isPartialSuccess && response?.payload && (
        <div className="text-sm ml-7 space-y-1">
          {response?.payload?.successCount > 0 && (
            <p className="text-green-700">
              ✅ Successfully deleted IDs: {response?.payload?.successfulIds?.join(", ")}
            </p>
          )}
          {response?.payload?.errorCount > 0 && (
            <div className="text-red-700">
              ❌ Errors:
              <ul className="list-disc ml-5">
                {response?.payload?.errors?.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}