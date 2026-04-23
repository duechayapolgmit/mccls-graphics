'use client'
import { use, useEffect, useRef } from 'react';

import styles from '@/components/player/card.module.css'
import html2canvas from 'html2canvas';
import { getPlayerWins } from '@/lib/client/playerInfo';
import { checkTeam, getCardBackground, getTeamFromMember } from '@/lib/client/teamInfo';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/player/card';

export default function Page({params}: {params: Promise<{ slug: string }>}) {
    const { slug } = use(params)
    
    const searchParams = useSearchParams()
    const team = searchParams.get('team') || "DEFAULT";

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

    const getBackground = (player: string) => {
        let override = searchParams.get('team');
        let url = ""

        if (override && checkTeam(override)) url = getCardBackground(override)
        else url = getCardBackground(getTeamFromMember(player))

        return {"--bg-image": `url(${url})`} as React.CSSProperties
    }

    return (
        <div ref={captureRef}>
            <Card player={slug} team={team}/>
        </div>
    )
}
