import { AlertCircle, CheckCircle, X } from "lucide-react";
import { useEffect } from "react";

export default function ResponseMessage({ response, setResponse }) {
  if (!response) return null;

  // ✅ Detect if it's a bulk response
  const isBulk = response?.payload?.successCount !== undefined;

  // Counts (only valid for bulk)
  const successCount = isBulk ? response?.payload?.successCount || 0 : 0;
  const errorCount = isBulk ? response?.payload?.errorCount || 0 : 0;

  // ✅ STATUS LOGIC (FIXED)
  const isFullSuccess = isBulk
    ? (response?.success && successCount > 0 && errorCount === 0)
    : response?.success;

  const isPartialSuccess = isBulk
    ? (successCount > 0 && errorCount > 0)
    : false;

  const isFullFailure = isBulk
    ? (successCount === 0 && errorCount > 0)
    : !response?.success;

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
  const Icon = isFullSuccess ? CheckCircle : AlertCircle;

  // Auto close (3 minutes)
  useEffect(() => {
    const timer = setTimeout(() => {
      setResponse(null);
    }, 3 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [setResponse]);

  return (
    <div className={`${bgColor} rounded p-3 flex flex-col mb-4 border`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${textColor}`} />
          <p className="text-sm font-semibold m-0">
            {response?.message}
          </p>
        </div>

        <X
          size={18}
          className="cursor-pointer"
          onClick={() => setResponse(null)}
        />
      </div>

      {/* ✅ BULK DETAILS ONLY */}
      {isBulk && (isPartialSuccess || isFullFailure) && (
        <div className="text-sm ml-7 space-y-2 max-h-40 overflow-y-auto pr-2">

          {/* Success IDs */}
          {successCount > 0 && (
            <p className="text-green-700">
              ✅ Successfully processed IDs:{" "}
              {response?.payload?.successfulIds?.join(", ")}
            </p>
          )}

          {/* Errors */}
          {errorCount > 0 && (
            <div className="text-red-700">
              ❌ Errors ({errorCount}):
              <ul className="list-disc ml-5 mt-1 space-y-1">
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