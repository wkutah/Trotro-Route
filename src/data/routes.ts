export interface Station {
    id: string;
    name: string;
    coords: [number, number]; // [lat, lng]
}

export interface RouteStep {
    from: Station;
    to: Station;
    fare: number;
    duration: string;
    description: string;
}

export interface RouteResult {
    id: string;
    totalFare: number;
    totalDuration: string;
    steps: RouteStep[];
}

export const STATIONS: Station[] = [
    { id: 'circle', name: 'Kwame Nkrumah Circle', coords: [5.5560, -0.2057] },
    { id: 'achimota', name: 'Achimota New Station', coords: [5.6128, -0.2222] },
    { id: 'madina', name: 'Madina Zongo Junction', coords: [5.6675, -0.1659] },
    { id: 'accra', name: 'Accra Tema Station', coords: [5.5458, -0.2051] },
    { id: 'kaneshie', name: 'Kaneshie Market', coords: [5.5658, -0.2319] },
];

export const MOCK_ROUTES: Record<string, RouteResult> = {
    'circle-madina': {
        id: 'r1',
        totalFare: 15.00,
        totalDuration: '45 mins',
        steps: [
            {
                from: STATIONS.find(s => s.id === 'circle')!,
                to: STATIONS.find(s => s.id === 'madina')!,
                fare: 15.00,
                duration: '45 mins',
                description: 'Take a direct trotro from the Overheads station heading to Madina.'
            }
        ]
    },
    'achimota-accra': {
        id: 'r2',
        totalFare: 12.50,
        totalDuration: '30 mins',
        steps: [
            {
                from: STATIONS.find(s => s.id === 'achimota')!,
                to: STATIONS.find(s => s.id === 'circle')!,
                fare: 8.00,
                duration: '20 mins',
                description: 'Board a "Circle" car.'
            },
            {
                from: STATIONS.find(s => s.id === 'circle')!,
                to: STATIONS.find(s => s.id === 'accra')!,
                fare: 4.50,
                duration: '10 mins',
                description: 'Transfer to an Accra-bound vehicle at the Circle station.'
            }
        ]
    }
};
