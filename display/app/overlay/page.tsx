'use client'

import { useEffect, useState } from "react";

export default function Page() {
    const [overlayData, setOverlayData] = useState({
        gameNumber: 1,
        multiplier: "x1.0",
        game: "DEFAULT",
        gameLogo: "/game_logos/Default.png"
    });

    useEffect(() => {
        const fetcher = setInterval(async () => {
            const res = await fetch('/api/overlay', { cache: "no-store"});
            const json = await res.json();
            setOverlayData(json);
        }, 1000);

        return () => clearInterval(fetcher);
    }, [])

    return (
        <div>
            Game {overlayData.gameNumber} ({overlayData.multiplier})
            <img src={overlayData.gameLogo} />
        </div>
    );
}