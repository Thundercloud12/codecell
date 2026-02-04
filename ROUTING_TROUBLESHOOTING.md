# Routing Troubleshooting Guide

## Overview

This guide helps resolve issues with the Dijkstra routing system.

## Recent Fixes Applied

### ✅ Issue: 504 Gateway Timeout from Overpass API

**Symptoms:**

- Error: "Overpass API error: 504"
- Route calculation fails
- Straight line shown instead of road route

**Root Cause:**

- Overpass API server overloaded
- Query timeout too short (25s)
- Search radius too large (3-5km)

**Fixes Applied:**

1. **Multiple API Mirrors** - Added 3 Overpass API endpoints with automatic fallback:
   - `https://overpass-api.de/api/interpreter` (primary)
   - `https://overpass.kumi.systems/api/interpreter` (fallback 1)
   - `https://overpass.openstreetmap.ru/api/interpreter` (fallback 2)

2. **Increased Timeout** - Changed from 25s to 90s:

   ```
   [out:json][timeout:90];
   ```

3. **Reduced Search Radius** - Changed from 3km to 2km default:

   ```typescript
   radiusMeters = 2000; // Was 3000
   ```

4. **Better Error Messages** - Frontend now shows specific errors:
   - "Route service is busy. Showing direct path. Please try again in a moment." (504 errors)
   - "No roads found in this area. Showing direct path." (No network found)
   - Full error details logged to console

5. **Improved Logging** - Added debug logs:
   - Which Overpass endpoint is being tried
   - Success/failure for each endpoint
   - Graph building progress
   - Path calculation results

## How to Test the Fixes

### 1. Clear Cache (if needed)

The system caches road graphs for 30 minutes. If you need fresh data:

- Restart the Next.js dev server
- Or wait 30 minutes for cache to expire

### 2. Test Route Calculation

1. Navigate to worker page: `/workers/[workerId]`
2. Update your location (click "Update Location" button)
3. Click "Navigate" on any pothole marker
4. Watch the browser console for logs:
   ```
   Calculating route: { from: "19.0760, 72.8777", to: "19.1234, 72.8567", radiusMeters: 2000 }
   Trying Overpass API: https://overpass-api.de/api/interpreter
   Successfully fetched data from https://overpass-api.de/api/interpreter
   Built graph with 234 nodes and 234 connected nodes
   Found path with 45 nodes
   Route found: 45 nodes, 2.5 km
   ```

### 3. Expected Behavior

- **Loading state** appears: "Calculating optimal route..."
- **Blue route line** appears on map (not straight line)
- **Route info banner** shows: "2.5 km · 5 min"
- Console logs show success messages

### 4. If Route Still Fails

Check console for specific error:

**Error: "All Overpass API endpoints failed"**

- All 3 API mirrors are down (very rare)
- Check internet connection
- Try again in 5-10 minutes
- Fallback: Straight line will be shown

**Error: "No road network found in the area"**

- Location is in unmapped area (ocean, remote desert, etc.)
- Increase radius: Modify `radiusMeters` in request
- Fallback: Straight line will be shown

**Error: "No path found between locations"**

- Start and end are on disconnected road networks
- One location is on an island or gated community
- Try moving start/end location slightly
- Fallback: Straight line will be shown

## Performance Tips

### Fast Route Calculation (100-500ms)

- Second request to same area (cache hit)
- Small search radius (1-2km)
- Urban areas with good OSM data

### Slow Route Calculation (3-8 seconds)

- First request to new area (cache miss)
- Large search radius (3-5km)
- Rural areas with sparse OSM data

### Optimize for Your Use Case

**For Urban Areas (good OSM coverage):**

```typescript
radiusMeters: 1500; // Very fast, usually sufficient
```

**For Rural Areas (sparse OSM coverage):**

```typescript
radiusMeters: 3000; // Slower but more likely to find route
```

**For Long Distance Routes:**

```typescript
radiusMeters: 5000; // Slowest but covers more area
```

## Monitoring Route Quality

### Good Route

- ✅ Blue line follows visible roads on map
- ✅ Distance seems reasonable (not 10x straight line)
- ✅ Route goes through major roads when available
- ✅ Console shows 20+ nodes in path

### Straight Line (Fallback)

- ⚠️ Direct line from start to end
- ⚠️ Does not follow roads
- ⚠️ Alert shown: "Showing direct path"
- ⚠️ Console shows error

### Indirect Route

- 🤔 Route seems longer than necessary
- 🤔 Takes detour through side streets
- **Possible causes:**
  - Missing OSM data (incomplete road network)
  - One-way restrictions not in OSM
  - Recent road construction not mapped
- **Solutions:**
  - Increase radius to find better connections
  - Report missing roads to OpenStreetMap
  - Use straight line as fallback

## Advanced Debugging

### Check OSM Data Coverage

1. Visit [OpenStreetMap.org](https://www.openstreetmap.org)
2. Navigate to your route area
3. Verify roads are mapped
4. Check if major roads are present
5. If roads missing: Contribute to OSM!

### Test Overpass API Directly

```bash
curl -X POST https://overpass-api.de/api/interpreter \
  -d "[out:json][timeout:90];(way["highway"~"primary|secondary|residential"](19.0,72.8,19.1,72.9););out body;>;out skel qt;"
```

Expected response: JSON with roads data

### Inspect Graph in Console

Add temporary logging:

```typescript
// In app/api/route/dijkstra/route.ts
console.log("Graph sample:", Array.from(graph.entries()).slice(0, 5));
console.log("Nodes sample:", Array.from(nodes.entries()).slice(0, 5));
```

### Test Different API Mirrors

Manually test each mirror:

- https://overpass-api.de/api/status (Status page)
- https://overpass.kumi.systems/api/status
- https://overpass.openstreetmap.ru/api/status

## Common Issues & Solutions

### Issue: "Cannot read properties of undefined"

**Cause:** Graph building returned empty data
**Solution:** Check console for Overpass API errors, verify coordinates are valid

### Issue: Route looks weird/jagged

**Cause:** Missing OSM data creates gaps in road network
**Solution:** Increase radius or improve OSM data

### Issue: Very slow (10+ seconds)

**Cause:** Large search radius + dense urban area = huge graph
**Solution:** Reduce radius to 1500-2000m

### Issue: Different route each time

**Cause:** Cache expiring between requests
**Solution:** Normal behavior, but can extend CACHE_DURATION in osmGraphBuilder.ts

### Issue: No route in rural area

**Cause:** OSM road data sparse or missing
**Solution:** Increase radius to 3000-5000m, or accept straight line fallback

## API Response Examples

### Successful Response

```json
{
  "success": true,
  "path": [
    { "lat": 19.0760, "lng": 72.8777 },
    { "lat": 19.0765, "lng": 72.8785 },
    ...
  ],
  "distance": 2450.5,
  "duration": 245,
  "pathNodes": 42,
  "summary": {
    "distanceKm": "2.45",
    "durationMinutes": 4
  }
}
```

### Error Response (API Timeout)

```json
{
  "error": "Failed to calculate route",
  "details": "Failed to fetch road data from all Overpass API mirrors. Last error: Overpass API error: 504"
}
```

### Error Response (No Path)

```json
{
  "error": "No path found between locations"
}
```

## Getting Help

### Before Reporting Issues

1. ✅ Check browser console for errors
2. ✅ Verify coordinates are valid
3. ✅ Test with different locations
4. ✅ Try again after 5 minutes (in case of API issues)
5. ✅ Check OSM data coverage

### Include in Bug Report

- Error message from console
- Start and end coordinates
- Timestamp of request
- Browser and version
- Network tab screenshot (if API error)
- Did it work before?

## Future Improvements

### Planned Enhancements

- [ ] Automatic radius adjustment based on distance
- [ ] Local OSM data caching for offline routing
- [ ] Alternative route suggestions
- [ ] Traffic-aware routing
- [ ] Turn-by-turn directions
- [ ] Route replay/tracking

### Performance Optimizations

- [ ] WebWorker for graph building
- [ ] IndexedDB for persistent caching
- [ ] Compressed graph format
- [ ] Incremental graph updates

## Summary

The routing system now has:

- ✅ 3 Overpass API mirrors with automatic fallback
- ✅ 90-second timeout (was 25s)
- ✅ 2km default radius (was 3-5km)
- ✅ Better error messages
- ✅ Comprehensive logging
- ✅ Graceful fallback to straight line

**Result:** More reliable routing with better error handling and faster performance.
