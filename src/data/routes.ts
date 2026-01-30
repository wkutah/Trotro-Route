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
    { id: 'lapaz', name: 'Lapaz Remote Station', coords: [5.5925, -0.2378] },
    { id: '37', name: '37 Military Hospital', coords: [5.5874, -0.1837] },
    { id: 'osu', name: 'Osu Oxford Street', coords: [5.5560, -0.1760] },
    { id: 'tema', name: 'Tema Station', coords: [5.6667, 0.0000] },
    { id: 'spintex', name: 'Spintex Coca-Cola', coords: [5.6300, -0.1200] }
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
    },
    'circle-lapaz': {
        id: 'r3',
        totalFare: 7.00,
        totalDuration: '25 mins',
        steps: [
            {
                from: STATIONS.find(s => s.id === 'circle')!,
                to: STATIONS.find(s => s.id === 'lapaz')!,
                fare: 7.00,
                duration: '25 mins',
                description: 'Board a "Lapaz" car under the bridge.'
            }
        ]
    },
    'lapaz-kaneshie': {
        id: 'r4',
        totalFare: 8.00,
        totalDuration: '20 mins',
        steps: [
            {
                from: STATIONS.find(s => s.id === 'lapaz')!,
                to: STATIONS.find(s => s.id === 'kaneshie')!,
                fare: 8.00,
                duration: '20 mins',
                description: 'Take a car from the main highway heading towards Kaneshie.'
            }
        ]
    },
    '37-madina': {
        id: 'r5',
        totalFare: 10.00,
        totalDuration: '25 mins',
        steps: [
            {
                from: STATIONS.find(s => s.id === '37')!,
                to: STATIONS.find(s => s.id === 'madina')!,
                fare: 10.00,
                duration: '25 mins',
                description: 'Board a Madina car at the 37 Trotro Station.'
            }
        ]
    },
    'accra-osu': {
        id: 'r6',
        totalFare: 5.00,
        totalDuration: '15 mins',
        steps: [
            {
                from: STATIONS.find(s => s.id === 'accra')!,
                to: STATIONS.find(s => s.id === 'osu')!,
                fare: 5.00,
                duration: '15 mins',
                description: 'Take a "Danquah Circle" or "Osu" car.'
            }
        ]
    },
    'circle-tema': {
        id: 'r7',
        totalFare: 22.00,
        totalDuration: '1 hr 10 mins',
        steps: [
            {
                from: STATIONS.find(s => s.id === 'circle')!,
                to: STATIONS.find(s => s.id === 'tema')!,
                fare: 22.00,
                duration: '1 hr 10 mins',
                description: 'Board a "Tema" bus at the Circle Neoplan Station.'
            }
        ]
    }
};
