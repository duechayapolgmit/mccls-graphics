'use client'
import { use, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import html2canvas from 'html2canvas';

import styles from '@/components/player/card.module.css'
import Card from '@/components/player/card';

import { getPlayerWins } from '@/lib/client/playerInfo';
import { getTeamFromMember } from '@/lib/client/teamInfo';

export default function Page({params}: {params: Promise<{ slug: string }>}) {
    const { slug } = use(params)
    
    const searchParams = useSearchParams()
    const team = searchParams.get('team') || getTeamFromMember(slug) || "DEFAULT";

    const captureRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Screenshotting
        const handleKey = async (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 's') {
                if (!captureRef.current) return;

                captureRef.current.classList.add(styles.capture);

                await document.fonts.ready;

                await new Promise(r => requestAnimationFrame(r))

                const canvas = await html2canvas(captureRef.current, {
                    scale: 1,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: null,
                    width: 500,
                    height: 550
                });

                captureRef.current.classList.remove(styles.capture);

                // get the wins count
                const wins = getPlayerWins(slug);
                
                const link = document.createElement('a');
                link.download = `${wins}-${slug}.png`;
                link.href = canvas.toDataURL();
                link.click();
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    return (
        <div ref={captureRef}>
            <Card player={slug} team={team}/>
        </div>
    )
}
