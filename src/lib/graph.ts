
import { STATIONS, MOCK_ROUTES, Station, RouteStep } from "@/data/routes";

// Priority Queue for Dijkstra
class PriorityQueue<T> {
    private items: { element: T; priority: number }[];

    constructor() {
        this.items = [];
    }

    enqueue(element: T, priority: number) {
        const queueElement = { element, priority };
        let added = false;
        for (let i = 0; i < this.items.length; i++) {
            if (queueElement.priority < this.items[i].priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }
        if (!added) {
            this.items.push(queueElement);
        }
    }

    dequeue(): { element: T; priority: number } | undefined {
        return this.items.shift();
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }
}

interface GraphEdge {
    to: string; // Station ID
    weight: number; // Fare
    routeId: string;
    description: string;
    step: RouteStep;
}

export class RouteGraph {
    private adjacencyList: Map<string, GraphEdge[]>;

    constructor() {
        this.adjacencyList = new Map();
        this.initializeGraph();
    }

    private initializeGraph() {
        // 1. Add Nodes (Stations)
        STATIONS.forEach(station => {
            this.adjacencyList.set(station.id, []);
        });

        // 2. Add Edges (Routes)
        const allRoutes = Object.values(MOCK_ROUTES);

        // Also include LocalStorage routes if available (Merging logic needed elsewhere or passed in)
        // For now, let's just use MOCK_ROUTES global + we can inject custom routes later. 
        // In a real app, we'd pass routes into the constructor.

        allRoutes.forEach(route => {
            route.steps.forEach(step => {
                this.addEdge(step.from.id, step.to.id, step.fare, route.id, step.description, step);
            });
        });

        // We should also check for "trotro_approved_routes" from Storage if we are client-side?
        // Since this might run on server or client, let's keep it pure for now. 
        // We will make a method `injectRoutes(routes: any[])` to add dynamic ones.
    }

    public injectRoutes(routes: any[]) {
        routes.forEach(route => {
            // Check if route has steps
            if (route.steps) {
                route.steps.forEach((step: any) => {
                    // Ensure stations exist in our adjacency list, if not add them
                    // (New stations might come from user submissions)
                    if (!this.adjacencyList.has(step.from.id)) this.adjacencyList.set(step.from.id, []);
                    if (!this.adjacencyList.has(step.to.id)) this.adjacencyList.set(step.to.id, []);

                    this.addEdge(step.from.id, step.to.id, step.fare || 0, route.id, step.description || 'Custom Route', step);
                });
            } else if (route.from && route.to) {
                // Simple Object structure from LocalStorage (Submission style where steps might not be explicit)
                // We fake a step
                if (!this.adjacencyList.has(route.from.toLowerCase())) this.adjacencyList.set(route.from.toLowerCase(), []);
                if (!this.adjacencyList.has(route.to.toLowerCase())) this.adjacencyList.set(route.to.toLowerCase(), []);

                // Note: ID matching for stations is key. User input might be "Madina" but ID is "madina".
                // We need to normalize.
                const fromId = route.from.toLowerCase();
                const toId = route.to.toLowerCase();

                this.addEdge(fromId, toId, parseFloat(route.fare), route.id, route.notes || 'Direct', {
                    from: { id: fromId, name: route.from, coords: [0, 0] },
                    to: { id: toId, name: route.to, coords: [0, 0] },
                    fare: parseFloat(route.fare),
                    duration: 'N/A',
                    description: route.notes
                });
            }
        });
    }

    private addEdge(from: string, to: string, weight: number, routeId: string, description: string, step: RouteStep) {
        if (!this.adjacencyList.has(from)) {
            this.adjacencyList.set(from, []);
        }
        this.adjacencyList.get(from)?.push({ to, weight, routeId, description, step });
    }

    public findShortestPath(startId: string, endId: string) {
        const distances = new Map<string, number>();
        const previous = new Map<string, { node: string; edge: GraphEdge } | null>();
        const pq = new PriorityQueue<string>();

        // Init
        this.adjacencyList.forEach((_, node) => {
            distances.set(node, Infinity);
            previous.set(node, null);
        });

        distances.set(startId, 0);
        pq.enqueue(startId, 0);

        while (!pq.isEmpty()) {
            const currentObj = pq.dequeue();
            if (!currentObj) break;
            const current = currentObj.element;

            if (current === endId) {
                // Done! Reconstruct path
                return this.reconstructPath(previous, endId);
            }

            const neighbors = this.adjacencyList.get(current) || [];

            for (const neighbor of neighbors) {
                const alt = distances.get(current)! + neighbor.weight;
                if (alt < distances.get(neighbor.to)!) {
                    distances.set(neighbor.to, alt);
                    previous.set(neighbor.to, { node: current, edge: neighbor });
                    pq.enqueue(neighbor.to, alt);
                }
            }
        }

        return null; // No path found
    }

    private reconstructPath(previous: Map<string, { node: string; edge: GraphEdge } | null>, endId: string) {
        const path: any[] = [];
        let current: string | null = endId;
        let totalFare = 0;

        while (current) {
            const prev = previous.get(current);
            if (prev) {
                path.unshift(prev.edge); // Add to front
                totalFare += prev.edge.weight;
                current = prev.node;
            } else {
                current = null;
            }
        }

        return {
            steps: path.map(p => p.step),
            totalFare,
            totalDuration: 'Calculated', // TODO: Sum duration
            // Generate a summary description
            description: `found a path via ${path.length} connection(s)`
        };
    }
}

export const routeGraph = new RouteGraph();
