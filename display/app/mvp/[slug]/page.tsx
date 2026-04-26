'use client'
import { use, useEffect, useRef } from 'react';

import styles from '@/components/break/mvp_table.module.css'
import html2canvas from 'html2canvas';
import { getPlayerWins } from '@/lib/client/playerInfo';
import { checkTeam, getCardBackground, getTeamFromMember } from '@/lib/client/teamInfo';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/player/card';
import MVPTable from '@/components/break/mvp_table';

export default function Page({params}: {params: Promise<{ slug: string }>}) {
    const { slug } = use(params)

    const screen = "mvp_"+slug;
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
                    width: 1300,
                    height: 750
                });

                captureRef.current.classList.remove(styles.capture);

                // get the wins count
                const wins = getPlayerWins(slug);
                
                const link = document.createElement('a');
                link.download = `${screen}.png`;
                link.href = canvas.toDataURL();
                link.click();
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    if (screen == "mvp_event" || screen == "mvp_season") {
        return (
            <div ref={captureRef}>
                <MVPTable screen={screen}/>
            </div>
        )
    }

    return <div>Not a valid value!</div>
}
