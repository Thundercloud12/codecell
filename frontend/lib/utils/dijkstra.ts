/**
 * Graph structure: { nodeId: [{ id: neighborId, weight: distance }] }
 */
export interface GraphNode {
  id: string;
  weight: number;
}

export type Graph = Map<string, GraphNode[]>;

/**
 * Dijkstra's algorithm to find shortest path between two nodes
 * Returns array of node IDs representing the path, or null if no path exists
 */
export function dijkstra(
  graph: Graph,
  startNode: string,
  endNode: string,
): string[] | null {
  // Priority queue implementation using array (simple but works)
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set<string>();

  // Initialize distances
  for (const node of graph.keys()) {
    distances.set(node, Infinity);
    previous.set(node, null);
    unvisited.add(node);
  }

  distances.set(startNode, 0);

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let currentNode: string | null = null;
    let minDistance = Infinity;

    for (const node of unvisited) {
      const dist = distances.get(node) ?? Infinity;
      if (dist < minDistance) {
        minDistance = dist;
        currentNode = node;
      }
    }

    // No path found
    if (currentNode === null || minDistance === Infinity) {
      break;
    }

    // Reached destination
    if (currentNode === endNode) {
      break;
    }

    unvisited.delete(currentNode);

    // Update distances to neighbors
    const neighbors = graph.get(currentNode) ?? [];
    const currentDistance = distances.get(currentNode) ?? Infinity;

    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.id)) continue;

      const newDistance = currentDistance + neighbor.weight;
      const neighborDistance = distances.get(neighbor.id) ?? Infinity;

      if (newDistance < neighborDistance) {
        distances.set(neighbor.id, newDistance);
        previous.set(neighbor.id, currentNode);
      }
    }
  }

  // Reconstruct path
  if (!previous.has(endNode) || previous.get(endNode) === null) {
    return null; // No path found
  }

  const path: string[] = [];
  let current: string | null = endNode;

  while (current !== null) {
    path.unshift(current);
    current = previous.get(current) ?? null;
  }

  return path.length > 0 && path[0] === startNode ? path : null;
}

/**
 * Calculate total distance of a path
 */
export function calculatePathDistance(path: string[], graph: Graph): number {
  let totalDistance = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const currentNode = path[i];
    const nextNode = path[i + 1];
    const neighbors = graph.get(currentNode) ?? [];
    const edge = neighbors.find((n) => n.id === nextNode);

    if (edge) {
      totalDistance += edge.weight;
    }
  }

  return totalDistance;
}