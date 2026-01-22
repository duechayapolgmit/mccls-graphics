'use client'

import { useEffect, useState } from "react";

export default function Page() {
    const [overlayData, setOverlayData] = useState({
        gameNumber: 1,
        multiplier: "x1.0",
        game: "DEFAULT",
        gameLogo: "/game_logos/Default.png",
        first: "",
        firstLabel: undefined,
        firstDB: -1,
        second: "",
        secondLabel: undefined,
        secondDB: -1
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
            1. <img src={overlayData.firstLabel} /> - 
            {overlayData.firstDB == -1 ? (<img src={"/icon.png"}/>) : (<span>{overlayData.firstDB}</span>)}
            2. <img src={overlayData.secondLabel} /> - 
            {overlayData.secondDB == -1 ? (<img src={"/icon.png"}/>) : (<span>{overlayData.secondDB}</span>)}
        </div>
    );
}