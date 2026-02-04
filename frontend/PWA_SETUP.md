# PWA Setup Instructions

This document provides instructions for setting up the Progressive Web App (PWA) functionality for the Citizen Portal.

## Features Added

- **Offline Support**: The app works offline and caches reports locally
- **Install Button**: Cross-browser install button that works on Chrome, Firefox, Safari, and Edge
- **Responsive Design**: Improved mobile-first responsive design with proper scaling
- **Service Worker**: Caches static assets and API responses for offline use
- **Background Sync**: Automatically syncs offline reports when connection is restored

## Setup Steps

### 1. Generate PNG Icons

The app currently uses SVG icons. For better browser compatibility, generate PNG versions:

```bash
# Install a tool like sharp or use online converters
npm install -g sharp

# Convert SVG to PNG
sharp icon-192x192.svg -o icon-192x192.png --format=png
sharp icon-512x512.svg -o icon-512x512.png --format=png
```

Or use online tools like:
- https://cloudconvert.com/svg-to-png
- https://convertio.co/svg-png/

### 2. Update Manifest.json

After generating PNG icons, update `public/manifest.json` to include PNG versions:

```json
{
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 3. Test PWA Features

1. **Install Button**: The install button appears in the navigation bar when the app is installable
2. **Offline Mode**: Disconnect from internet and try to access the app
3. **Report Submission**: Submit reports while offline - they will be saved locally and synced when online
4. **Responsive Design**: Test on different screen sizes and orientations

## Browser Support

### Install Button Behavior

- **Chrome/Edge**: Shows native install prompt
- **Firefox**: Shows instructions for manual installation
- **Safari**: Shows instructions for "Add to Home Screen"
- **Already Installed**: Button is hidden when app is already installed

### Offline Features

- **Cache Strategy**: Network-first for API calls, cache-first for static assets
- **Background Sync**: Uses Service Worker sync API when available
- **Local Storage**: Reports are stored locally when offline
- **Auto-sync**: Automatically syncs when connection is restored

## Technical Details

### Service Worker (`public/sw.js`)

- Caches static files on install
- Implements network-first strategy for API calls
- Falls back to cache when offline
- Handles background sync for reports

### PWA Hook (`app/hooks/usePWA.ts`)

- Detects installability across browsers
- Handles beforeinstallprompt event
- Tracks online/offline status
- Manages app installation state

### Offline Utils (`app/lib/offlineUtils.ts`)

- Saves reports to localStorage when offline
- Syncs reports when back online
- Handles offline image storage
- Provides utilities for offline data management

### Components

- **InstallButton**: Cross-browser install functionality
- **OfflineIndicator**: Shows offline status and warnings

## Development Notes

- The app registers the service worker automatically on page load
- Offline reports are marked with an orange indicator
- The install button is disabled when offline
- Responsive design uses Tailwind CSS breakpoints

## Testing Checklist

- [ ] App loads in offline mode
- [ ] Install button appears on supported browsers
- [ ] Reports can be submitted offline
- [ ] Offline reports sync when online
- [ ] Responsive design works on mobile
- [ ] PWA can be installed as standalone app
- [ ] Service worker is registered
- [ ] Cache works for static assets