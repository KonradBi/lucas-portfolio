'use client';

import { useEffect, useRef } from 'react';
import Globe from 'globe.gl';
import dynamic from 'next/dynamic'
import { FC } from 'react'

interface CityData {
    city: string;
    lat: number;
    lng: number;
    size: number;
    color: string;
    collection: string;
}

interface ArcData {
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    color: string;
}

interface GlobeInstance {
    controls: () => {
        autoRotate: boolean;
        autoRotateSpeed: number;
        enableZoom: boolean;
        enablePan: boolean;
        minDistance: number;
        maxDistance: number;
        enableDamping: boolean;
        dampingFactor: number;
    };
    pointOfView: (coords: { lat: number; lng: number; altitude: number }) => void;
    _destructor: () => void;
}

// Sample data of private art collectors
const citiesData: CityData[] = [
    { city: 'Manhattan', lat: 40.7831, lng: -73.9712, size: 0.5, color: '#ff9b9b', collection: 'Private Collection' },
    { city: 'Mayfair', lat: 51.5074, lng: -0.1528, size: 0.5, color: '#ff9b9b', collection: 'Private Gallery' },
    { city: 'Shibuya', lat: 35.6619, lng: 139.7041, size: 0.5, color: '#ff9b9b', collection: 'Private Collection' },
    { city: 'Le Marais', lat: 48.8566, lng: 2.3522, size: 0.5, color: '#ff9b9b', collection: 'Private Gallery' },
    { city: 'Charlottenburg', lat: 52.5200, lng: 13.3385, size: 0.5, color: '#ff9b9b', collection: 'Private Collection' },
    { city: 'Double Bay', lat: -33.8779, lng: 151.2410, size: 0.5, color: '#ff9b9b', collection: 'Private Gallery' },
    { city: 'Beverly Hills', lat: 34.0736, lng: -118.4004, size: 0.5, color: '#ff9b9b', collection: 'Private Collection' },
    { city: 'Ginza', lat: 35.6762, lng: 139.7690, size: 0.5, color: '#ff9b9b', collection: 'Private Gallery' },
    { city: 'South Beach', lat: 25.7825, lng: -80.1340, size: 0.5, color: '#ff9b9b', collection: 'Private Collection' },
    { city: 'Roppongi', lat: 35.6625, lng: 139.7316, size: 0.5, color: '#ff9b9b', collection: 'Private Gallery' },
    { city: 'Polanco', lat: 19.4319, lng: -99.1932, size: 0.5, color: '#ff9b9b', collection: 'Private Collection' },
    { city: 'Victoria Peak', lat: 22.2759, lng: 114.1455, size: 0.5, color: '#ff9b9b', collection: 'Private Gallery' },
    { city: 'Jardins', lat: -23.5778, lng: -46.6691, size: 0.5, color: '#ff9b9b', collection: 'Private Collection' },
    { city: 'Dubai Marina', lat: 25.0805, lng: 55.1403, size: 0.5, color: '#ff9b9b', collection: 'Private Gallery' },
    { city: 'Kolonaki', lat: 37.9792, lng: 23.7166, size: 0.5, color: '#ff9b9b', collection: 'Private Collection' },
    { city: 'Östermalm', lat: 59.3350, lng: 18.0890, size: 0.5, color: '#ff9b9b', collection: 'Private Gallery' },
    { city: 'Salamanca', lat: 40.4255, lng: -3.6832, size: 0.5, color: '#ff9b9b', collection: 'Private Collection' },
    { city: 'Gangnam', lat: 37.5172, lng: 127.0473, size: 0.5, color: '#ff9b9b', collection: 'Private Gallery' },
    { city: 'Altstadt', lat: 48.1375, lng: 11.5750, size: 0.5, color: '#ff9b9b', collection: 'Private Collection' },
    { city: 'Brera', lat: 45.4720, lng: 9.1866, size: 0.5, color: '#ff9b9b', collection: 'Private Gallery' }
];

// Generate arcs between cities
const generateArcs = () => {
    const arcs: ArcData[] = [];
    for (let i = 0; i < citiesData.length; i++) {
        const startCity = citiesData[i];
        const endCity = citiesData[(i + 1) % citiesData.length];
        arcs.push({
            startLat: startCity.lat,
            startLng: startCity.lng,
            endLat: endCity.lat,
            endLng: endCity.lng,
            color: 'rgba(255, 155, 155, 0.3)' // Softer, more transparent arcs
        });
    }
    return arcs;
};

const WorldMapComponent: FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const globeRef = useRef<GlobeInstance | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize globe
        globeRef.current = Globe()
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
            .backgroundColor('rgba(1,2,8,0.0)')
            .pointsData(citiesData)
            .pointAltitude(0.01)
            .pointRadius('size')
            .pointColor('color')
            .pointsMerge(true)
            .labelsData(citiesData)
            .labelText('city')
            .labelSize(1.2)
            .labelDotRadius(0.3)
            .labelColor(() => '#ff9b9b')
            .labelResolution(2)
            .labelAltitude(0.01)
            .arcsData(generateArcs())
            .arcColor('color')
            .arcAltitude(0.15)
            .arcStroke(0.5)
            .arcDashLength(0.5)
            .arcDashGap(2)
            .arcDashAnimateTime(3000)
            .atmosphereColor('#ffffff')
            .atmosphereAltitude(0.15)
            (containerRef.current);

        // Configure controls
        const controls = globeRef.current.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.25;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.minDistance = 2.5;
        controls.maxDistance = 2.5;
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;

        // Set initial position
        globeRef.current.pointOfView({ lat: 39.6, lng: -98.5, altitude: 2.5 });

        // Prevent touch events from being captured
        if (containerRef.current) {
            containerRef.current.style.touchAction = 'none';
            containerRef.current.addEventListener('touchmove', (e) => {
                e.preventDefault();
            }, { passive: false });
        }

        // Cleanup
        return () => {
            if (globeRef.current) {
                if (containerRef.current) {
                    containerRef.current.removeEventListener('touchmove', (e) => {
                        e.preventDefault();
                    });
                }
                globeRef.current._destructor();
            }
        };
    }, []);

    return (
        <section className="relative w-full bg-[#010208] pb-32">
            <div className="max-w-[1800px] mx-auto px-8">
                {/* Section Title */}
                <div className="text-center mb-8 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-light text-white tracking-wider">
                        GLOBAL COLLECTORS
                    </h2>
                    <div className="h-[1px] w-16 bg-white/20 mx-auto" />
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Lukas Vandeverre&apos;s digital artworks are housed in distinguished private collections across the globe
                    </p>
                </div>

                {/* Globe Container with fade effect */}
                <div className="relative mb-32 pointer-events-none">
                    {/* Radial fade effect */}
                    <div className="absolute inset-0 -inset-x-[50%] -inset-y-[50%]">
                        <div className="absolute inset-0 bg-[#010208] opacity-0" style={{
                            background: 'radial-gradient(circle at center, transparent 30%, #010208 70%)'
                        }} />
                    </div>

                    {/* Purple glow with fade */}
                    <div className="absolute inset-0 -inset-x-[25%] -inset-y-[25%]">
                        <div className="absolute inset-0" style={{
                            background: 'radial-gradient(circle at center, rgba(147, 51, 234, 0.2) 0%, transparent 70%)',
                            filter: 'blur(40px)'
                        }} />
                    </div>

                    {/* Globe */}
                    <div className="relative">
                        <div 
                            ref={containerRef} 
                            className="relative w-full aspect-[21/9] max-h-[400px]"
                            style={{ zIndex: 10 }}
                        />
                    </div>
                </div>
            </div>

            {/* Add spacing at the bottom to prevent overlap */}
            <div className="h-24" />
        </section>
    );
};

// Exportiere eine neue dynamisch geladene Version der Komponente mit deaktiviertem SSR
export const WorldMap = dynamic(() => Promise.resolve(WorldMapComponent), {
    ssr: false
})

export default WorldMap;
