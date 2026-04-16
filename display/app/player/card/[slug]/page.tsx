'use client'
import { use, useEffect, useRef, useState } from 'react';

import styles from './card.module.css'
import html2canvas from 'html2canvas';
import { getPlayerAvatar, getPlayerWins } from '@/lib/client/playerInfo';
import { getCardBackground, getTeamFromMember } from '@/lib/client/teamInfo';

export default function Page({params}: {params: Promise<{ slug: string }>}) {
    const { slug } = use(params)

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
                    width: 1920,
                    height: 1080
                });

                captureRef.current.classList.remove(styles.capture);
                
                const link = document.createElement('a');
                link.download = `${slug}.png`;
                link.href = canvas.toDataURL();
                link.click();
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    return (
        <div className={styles.main} ref={captureRef} style={{"--bg-image": `url(${getCardBackground(getTeamFromMember(slug))})`} as React.CSSProperties}>
            <div className={styles.avatar} style={{"--avatar-image": `url(${getPlayerAvatar(slug)})`} as React.CSSProperties}>
                <Wins player={slug}/>
            </div>
            <div className={slug == "GoodTimesWithScar" ? `${styles.name} ${styles.name_small}` : `${styles.name}`}>
                <div>{slug}</div>
            </div>
        </div>
    )
}

function Wins({player} : {player:string}) {
    const wins = getPlayerWins(player)

    if (wins <= 0) return;
    else return (
        <div className={styles.wins_box}>
            <div className={styles.wins}><span className={styles.x}>X</span>{wins}</div>
            <img src={"/crown-shadow.png"}/>
        </div>
    )
}