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
        const ease = 0.02;

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            targetX = x * 30;
            targetY = y * 30;
        };

        const animate = () => {
            currentX += (targetX - currentX) * ease;
            currentY += (targetY - currentY) * ease;

            if (orbsRef.current) {
                orbsRef.current.style.transform = `translate3d(${-currentX * 1.5}px, ${-currentY * 1.5}px, 0)`;
            }
            if (gridRef.current) {
                gridRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
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
        <div className="absolute inset-0 top-0 left-0 w-full h-full -z-50 overflow-hidden bg-[#0a0a0f]">
            <div
                ref={orbsRef}
                className="absolute inset-[-20%] w-[140%] h-[140%] will-change-transform pointer-events-none"
            >
                <div
                    className="absolute top-[-10%] left-[10%] w-[70vw] h-[70vw] rounded-full mix-blend-screen animate-warp bg-indigo-500/40 blur-[120px]"
                />
                <div
                    className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full mix-blend-screen animate-warp-reverse bg-purple-500/30 blur-[120px]"
                    style={{ animationDelay: '-7s' }}
                />
                <div
                    className="absolute top-[20%] right-[15%] w-[40vw] h-[40vw] rounded-full mix-blend-screen animate-warp bg-blue-500/30 blur-[100px]"
                    style={{ animationDelay: '-12s' }}
                />
            </div>

            <div
                ref={gridRef}
                className="absolute inset-[-10%] w-[120%] h-[120%] will-change-transform pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), 
                        linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                    maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)'
                }}
            />
            
            <div className="absolute inset-0 bg-transparent pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80" />
            </div>
        </div>
    );
}
