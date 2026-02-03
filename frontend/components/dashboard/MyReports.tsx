"use client";

interface Report {
  id: string;
  title?: string;
  description?: string;
  latitude: number;
  longitude: number;
  status: string;
  severity?: number;
  createdAt: string;
  media: Array<{
    id: string;
    mediaUrl: string;
    mediaType: string;
    detections: Array<{
      id: string;
      confidence: number;
      detectedClass: string;
    }>;
  }>;
}

interface MyReportsProps {
  reports: Report[];
}

export default function MyReports({ reports }: MyReportsProps) {
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: "bg-blue-100 text-blue-800 border-blue-300",
      VERIFIED: "bg-amber-100 text-amber-800 border-amber-300",
      RESOLVED: "bg-green-100 text-green-800 border-green-300",
    };
    return styles[status] || styles.PENDING;
  };

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No Reports Yet
        </h3>
        <p className="text-gray-500">
          Submit your first pothole report to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Reports</h2>

      <div className="space-y-4">
        {reports.map((report) => {
          const originalMedia = report.media[0];
          const hasDetection = report.media.some(
            (m) => m.detections.length > 0,
          );
          const highestConfidence = Math.max(
            ...report.media.flatMap((m) =>
              m.detections.map((d) => d.confidence),
            ),
            0,
          );

          return (
            <div
              key={report.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  {originalMedia ? (
                    <div className="relative">
                      <img
                        src={originalMedia.mediaUrl}
                        alt="Report"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                      {hasDetection && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {report.title || "Pothole Report"}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(report.status)}`}
                    >
                      {report.status}
                    </span>
                  </div>

                  {report.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {report.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <p className="text-gray-700 font-medium">
                        {report.latitude.toFixed(4)},{" "}
                        {report.longitude.toFixed(4)}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500">Submitted:</span>
                      <p className="text-gray-700 font-medium">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {report.severity && (
                      <div>
                        <span className="text-gray-500">Severity:</span>
                        <p className="text-red-600 font-bold">
                          {report.severity} / 5
                        </p>
                      </div>
                    )}

                    {hasDetection && (
                      <div>
                        <span className="text-gray-500">AI Detection:</span>
                        <p className="text-green-600 font-medium">
                          ✓ {(highestConfidence * 100).toFixed(0)}% Confidence
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
