'use client'
import { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas-pro';

import styles from './teams.module.css'

import { getConfig } from '@/lib/client/config';
import TeamsOverview from '@/components/team/teams_overview';

const config = await getConfig();

export default function Page() {
    const captureRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Screenshotting
        const handleKey = async (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 's') {
                if (!captureRef.current) return;

                captureRef.current.classList.add("capture");

                await document.fonts.ready;

                await new Promise(r => requestAnimationFrame(r))

                const canvas = await html2canvas(captureRef.current, {
                    scale: 1,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: null,
                    width: 1920,
                    height: 1080
                });

                captureRef.current.classList.remove("capture");
                
                const link = document.createElement('a');
                link.download = 'teams.png';
                link.href = canvas.toDataURL();
                link.click();
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);
    if (!config) return null;

    const getPageBackground = () => {
        let bgPath = config.teams.background;

        if (bgPath == "none") return {} as React.CSSProperties
        return {"--bg-image": `url(${bgPath})`} as React.CSSProperties
    }

    return (
        <div className={styles.main} ref={captureRef} style={getPageBackground()}>
            <div className="pt-10">
                <TeamsOverview />
                <div className="teams-overview-event-name relative bg-black/75 w-236.25 h-15.5 pb-10.5
                                font-metropolis-black text-white uppercase text-center text-[42px]">
                    <p>{config.info.event_name}: <span className={styles.event_tagline}>{config.info.tagline}</span></p>
                </div>
            </div>
        </div>
    )
}