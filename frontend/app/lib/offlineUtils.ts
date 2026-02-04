// Offline utilities for PWA functionality

export interface OfflineReport {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  description?: string;
  severity?: string;
  images?: string[];
  createdAt: string;
  synced: boolean;
}

const OFFLINE_REPORTS_KEY = 'offline-reports';
const OFFLINE_IMAGES_KEY = 'offline-images';

export function saveOfflineReport(report: Omit<OfflineReport, 'id' | 'createdAt' | 'synced'>): void {
  try {
    const offlineReports = getOfflineReports();
    const newReport: OfflineReport = {
      ...report,
      id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      synced: false,
    };

    offlineReports.push(newReport);
    localStorage.setItem(OFFLINE_REPORTS_KEY, JSON.stringify(offlineReports));
  } catch (error) {
    console.error('Failed to save offline report:', error);
  }
}

export function getOfflineReports(): OfflineReport[] {
  try {
    const stored = localStorage.getItem(OFFLINE_REPORTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get offline reports:', error);
    return [];
  }
}

export function markReportAsSynced(reportId: string): void {
  try {
    const reports = getOfflineReports();
    const updatedReports = reports.map(report =>
      report.id === reportId ? { ...report, synced: true } : report
    );
    localStorage.setItem(OFFLINE_REPORTS_KEY, JSON.stringify(updatedReports));
  } catch (error) {
    console.error('Failed to mark report as synced:', error);
  }
}

export function removeOfflineReport(reportId: string): void {
  try {
    const reports = getOfflineReports();
    const filteredReports = reports.filter(report => report.id !== reportId);
    localStorage.setItem(OFFLINE_REPORTS_KEY, JSON.stringify(filteredReports));
  } catch (error) {
    console.error('Failed to remove offline report:', error);
  }
}

export async function syncOfflineReports(): Promise<void> {
  if (!navigator.onLine) return;

  const offlineReports = getOfflineReports().filter(report => !report.synced);

  for (const report of offlineReports) {
    try {
      const formData = new FormData();

      // Add report data
      Object.entries(report).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'synced' && key !== 'createdAt' && value !== undefined) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await fetch('/api/reports', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        markReportAsSynced(report.id);
      }
    } catch (error) {
      console.error('Failed to sync report:', report.id, error);
    }
  }
}

export function saveOfflineImage(file: File): string {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const imageId = `offline-image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      try {
        const offlineImages = JSON.parse(localStorage.getItem(OFFLINE_IMAGES_KEY) || '{}');
        offlineImages[imageId] = reader.result;
        localStorage.setItem(OFFLINE_IMAGES_KEY, JSON.stringify(offlineImages));
        resolve(imageId);
      } catch (error) {
        console.error('Failed to save offline image:', error);
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
}

export function getOfflineImage(imageId: string): string | null {
  try {
    const offlineImages = JSON.parse(localStorage.getItem(OFFLINE_IMAGES_KEY) || '{}');
    return offlineImages[imageId] || null;
  } catch (error) {
    console.error('Failed to get offline image:', error);
    return null;
  }
}

// Auto-sync when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncOfflineReports();
  });
}