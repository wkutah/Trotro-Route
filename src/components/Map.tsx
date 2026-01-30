"use client"

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { RouteResult } from '@/data/routes'

// Fix for default marker icons in Next.js/Leaflet
import L from 'leaflet'

const iconUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Props {
    route?: RouteResult | null;
}

// Component to handle map view updates
function MapUpdater({ route }: Props) {
    const map = useMap();

    useEffect(() => {
        if (route && route.steps.length > 0) {
            // Collect all coordinates
            const points: [number, number][] = [];

            // Add start point
            points.push(route.steps[0].from.coords);

            // Add all end points
            route.steps.forEach(step => {
                points.push(step.to.coords);
            });

            // Create bounds and fit map
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [route, map]);

    return null;
}

export default function Map({ route }: Props) {
    // Center on Accra, Ghana
    const position: [number, number] = [5.6037, -0.1870];

    // Calculate polylines if route exists
    const polylines = route?.steps.map(step => [step.from.coords, step.to.coords] as [number, number][]) || [];

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Default Marker if no route */}
                {!route && (
                    <Marker position={position}>
                        <Popup>
                            Welcome to Accra! <br /> Start your journey here.
                        </Popup>
                    </Marker>
                )}

                {/* Route Visualization */}
                {route && (
                    <>
                        <MapUpdater route={route} />

                        {/* Start Marker */}
                        <Marker position={route.steps[0].from.coords}>
                            <Popup>Start: {route.steps[0].from.name}</Popup>
                        </Marker>

                        {/* End Markers for each step */}
                        {route.steps.map((step, idx) => (
                            <Marker key={idx} position={step.to.coords}>
                                <Popup>
                                    {idx === route.steps.length - 1 ? "Destination: " : "Transfer: "}
                                    {step.to.name}
                                </Popup>
                            </Marker>
                        ))}

                        {/* Path Lines */}
                        {polylines.map((positions, idx) => (
                            <Polyline
                                key={idx}
                                positions={positions}
                                pathOptions={{ color: 'blue', weight: 5, opacity: 0.7 }}
                            />
                        ))}
                    </>
                )}
            </MapContainer>
        </div>
    )
}
