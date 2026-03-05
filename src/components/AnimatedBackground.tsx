'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
    const gridRef = useRef<HTMLDivElement>(null);
    const orbsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animationFrameId: number;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        const ease = 0.03; // Smooth easing factor for the parallax (0.05 speed requested, 0.03 is very smooth)

        const handleMouseMove = (e: MouseEvent) => {
            // Calculate mouse position relative to center of screen (-1 to 1)
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            // Parallax intensity
            targetX = x * 40; // Max movement in pixels
            targetY = y * 40;
        };

        const animate = () => {
            // Interpolate towards target
            currentX += (targetX - currentX) * ease;
            currentY += (targetY - currentY) * ease;

            if (orbsRef.current) {
                // Orbs move slightly opposite to mouse to create deep background effect
                orbsRef.current.style.transform = `translate3d(${-currentX * 1.2}px, ${-currentY * 1.2}px, 0)`;
            }
            if (gridRef.current) {
                // Grid moves slightly with mouse to create foreground depth
                gridRef.current.style.transform = `translate3d(${currentX * 1.5}px, ${currentY * 1.5}px, 0)`;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 top-0 left-0 w-full h-full -z-50 overflow-hidden bg-[#020B1A]">
            {/* Container for glowing orbs */}
            <div
                ref={orbsRef}
                className="absolute inset-[-20%] w-[140%] h-[140%] will-change-transform pointer-events-none"
            >
                {/* Cobalt Blue Orb */}
                <div
                    className="absolute top-0 left-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen animate-warp bg-[rgb(0,71,171)] opacity-70 blur-[120px]"
                />

                {/* Electric Purple Orb */}
                <div
                    className="absolute bottom-0 right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen animate-warp-reverse bg-[rgb(191,0,255)] opacity-60 blur-[120px]"
                    style={{
                        animationDelay: '-5s'
                    }}
                />

                {/* Deep Indigo accent center/bottom */}
                <div
                    className="absolute top-[30%] left-[20%] w-[50vw] h-[50vw] rounded-full mix-blend-screen animate-warp bg-[rgb(79,70,229)] opacity-60 blur-[130px]"
                    style={{
                        animationDelay: '-10s'
                    }}
                />
            </div>

            {/* Grid Overlay */}
            <div
                ref={gridRef}
                className="absolute inset-[-10%] w-[120%] h-[120%] will-change-transform pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), 
            linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
                    backgroundSize: '100px 100px',
                    maskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 100%)'
                }}
            />
        </div>
    );
}
