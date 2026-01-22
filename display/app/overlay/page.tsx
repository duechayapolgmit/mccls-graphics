'use client'

import { useEffect, useState } from "react";

export default function Page() {
    const [overlayData, setOverlayData] = useState({
        gameNumber: 1,
        multiplier: "x1.0",
        game: "DEFAULT",
        gameLogo: "/game_logos/Default.png",
        first: "",
        firstLabel: "/team_labels/Blank.png",
        firstDB: -1,
        second: "",
        secondLabel: "/team_labels/Blank.png",
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
        <div className="overlay">
            <div className="header">
                <div className="ls-icon"><img src={"/icon-event.png"}/></div>
                <div className={overlayData.firstDB > -1 ? "event-status-final" : "event-status"}>{overlayData.firstDB > -1 ? (<span>FINAL DUEL</span>) : (<span>GAME {overlayData.gameNumber} ({overlayData.multiplier})</span>)}</div>
            </div>
            <div className="game">
                <img src={overlayData.gameLogo} />
            </div>
            <div className="first-place">
                <div className="first-icon">1</div>
                <div className="first-label"><img src={overlayData.firstLabel} /></div>
                <div className={overlayData.firstDB > 2 ? "finale-points-won" : "finale-points"}>{overlayData.firstDB == -1 ? (<img src={"/icon.png"}/>) : (<span>{overlayData.firstDB}</span>)}</div>
            </div>
            <div className="second-place">
                <div className="second-icon">2</div>
                <div className="second-label"><img src={overlayData.secondLabel} /></div>
                <div className={overlayData.secondDB > 2 ? "finale-points-won" : "finale-points"}>{overlayData.secondDB == -1 ? (<img src={"/icon.png"}/>) : (<span>{overlayData.secondDB}</span>)}</div>
            </div>
        </div>
    );
}