export async function fetchRoadInfo(lat: number, lng: number) {
  const query = `
    [out:json];
    way(around:20, ${lat}, ${lng})["highway"];
    out tags 1;
  `;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });

  if (!response.ok) return null;

  const data = await response.json();

  if (!data.elements || data.elements.length === 0) return null;

  const tags = data.elements[0].tags;

  return {
    roadName: tags.name || null,
    roadType: tags.highway || null,
    speedLimit: tags.maxspeed ? parseInt(tags.maxspeed) : null,
    osmData: tags,
  };
}
