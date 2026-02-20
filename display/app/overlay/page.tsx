'use client'

import { useEffect, useState } from "react";
import { getIconPath, getTeamName } from '@/lib/overlay/teamInfo';

import teamInfo from '@/data/team_info.json';

export default function Page() {
    const [overlayData, setOverlayData] = useState({
        gameNumber: 1,
        multiplier: "x1.0",
        game: "DEFAULT",
        gameLogo: "/game_logos/Default.png",
        first: "",
        firstDB: -1,
        second: "",
        secondDB: -1,
        statusVisible: true,
        placementsVisible: true,
        config: {
            colours: {
                primary: "#b51a14",
                secondary: "#760804"
            }
        }
    });

    useEffect(() => {
        // Preload all team icons
        Object.values(teamInfo).forEach(team => {
            const img = new Image();
            img.src = team.icon;
        })

        // syncing
        const fetcher = setInterval(async () => {
            const res = await fetch('/api/overlay', { cache: "no-store"});
            const json = await res.json();
            setOverlayData(json);
        }, 1000);

        return () => clearInterval(fetcher);
    }, [])

    return (
        <div className="overlay">
            <div className={overlayData.statusVisible ? "status slide-in" : "status slide-out"}>
                <div className="header">
                    <div className="ls-icon" style={{"--bg-colour": overlayData.config.colours.secondary} as React.CSSProperties}><img src={"/icon-event.png"}/></div>
                    <div className={overlayData.gameNumber > 8 ? "event-status-final" : "event-status"}>{overlayData.gameNumber > 8 ? (<span>FINAL DUEL</span>) : (<span>GAME {overlayData.gameNumber} ({overlayData.multiplier})</span>)}</div>
                </div>
                <div className="game">
                    <img className={overlayData.game == "DEFAULT" ? "opacity-50" : ""} src={overlayData.gameLogo} />
                </div>
            </div>
            <div className={overlayData.placementsVisible ? "placements slide-in" : "placements slide-out"}>
                <div className="first-place">
                    <div className="first-icon">1</div>
                    <TeamLabel team={overlayData.first}/>
                    <div className={overlayData.firstDB > 2 ? "finale-points-won" : "finale-points"}>{overlayData.firstDB == -1 ? (<img src={"/icon.png"}/>) : (<span>{overlayData.firstDB}</span>)}</div>
                </div>
                <div className="second-place">
                    <div className="second-icon">2</div>
                    <TeamLabel team={overlayData.second}/>
                    <div className={overlayData.secondDB > 2 ? "finale-points-won" : "finale-points"}>{overlayData.secondDB == -1 ? (<img src={"/icon.png"}/>) : (<span>{overlayData.secondDB}</span>)}</div>
                </div>
            </div>
        </div>
    );
}

// Team label component
function TeamLabel({team} : {team : string}) {
    return (
        <div className="label">
            <img src={getIconPath(team)}/> {getTeamName(team)}
        </div>
    )
}