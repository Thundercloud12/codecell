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
      PENDING: "bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/30",
      VERIFIED: "bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/30",
      RESOLVED: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30",
    };
    return styles[status] || styles.PENDING;
  };

  if (reports.length === 0) {
    return (
      <div className="bg-[#141B2A] rounded-lg border border-[#1F2937] p-8 text-center">
        <div className="text-[#9CA3AF] mb-4">
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
        <h3 className="text-xl font-semibold text-[#E5E7EB] mb-2 uppercase tracking-wide">
          No Reports Yet
        </h3>
        <p className="text-[#9CA3AF]">
          Submit your first pothole report to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#141B2A] rounded-lg border border-[#1F2937] p-6">
      <h2 className="text-2xl font-bold text-[#E5E7EB] mb-6 uppercase tracking-wide">My <span className="text-[#22C55E]">Reports</span></h2>

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
              className="border border-[#1F2937] rounded-lg p-4 hover:border-[#22C55E]/50 transition-all bg-[#0A0F1A]"
            >
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  {originalMedia ? (
                    <div className="relative">
                      <img
                        src={originalMedia.mediaUrl}
                        alt="Report"
                        className="w-32 h-32 object-cover rounded-lg border border-[#1F2937]"
                      />
                      {hasDetection && (
                        <div className="absolute -top-2 -right-2 bg-[#22C55E] text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-[#1F2937] rounded-lg flex items-center justify-center text-[#9CA3AF]">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-[#E5E7EB]">
                      {report.title || "Pothole Report"}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(report.status)}`}
                    >
                      {report.status}
                    </span>
                  </div>

                  {report.description && (
                    <p className="text-[#9CA3AF] text-sm mb-3 line-clamp-2">
                      {report.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#9CA3AF]">Location:</span>
                      <p className="text-[#E5E7EB] font-medium font-mono">
                        {report.latitude.toFixed(4)},{" "}
                        {report.longitude.toFixed(4)}
                      </p>
                    </div>

                    <div>
                      <span className="text-[#9CA3AF]">Submitted:</span>
                      <p className="text-[#E5E7EB] font-medium">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {report.severity && (
                      <div>
                        <span className="text-[#9CA3AF]">Severity:</span>
                        <p className="text-[#F87171] font-bold">
                          {report.severity} / 5
                        </p>
                      </div>
                    )}

                    {hasDetection && (
                      <div>
                        <span className="text-[#9CA3AF]">AI Detection:</span>
                        <p className="text-[#22C55E] font-medium">
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
