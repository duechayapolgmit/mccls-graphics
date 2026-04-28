'use client'
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useEffect, useState } from "react";

import config from '@/config/general.json'
import styles from './overlay.module.css'

import { getIconPath, getTeamName } from '@/lib/client/teamInfo';
import { hexToRGBA } from '@/lib/utils/utils';

import teamInfo from '@/data/team_info.json';

interface ITeamPlacement {
    place: number;
    name: string;
    score: number;
}

export default function Page() {
    const [overlayData, setOverlayData] = useState({
        gameNumber: 1,
        multiplier: "x1.0",
        game: "DEFAULT",
        gameLogo: "/game_logos/Default.png",
        placements: [{
            place: 0,
            name: "",
            score: -1
        }],
        statusVisible: true,
        placementsVisible: true
    });

    useEffect(() => {
        // Preload all team icons
        Object.values(teamInfo).forEach(team => {
            const img = new Image();
            img.src = team.icon;
        })
        
        // Register SSE
        const evtSrc = new EventSource('/api/overlay/subscribe')

        evtSrc.onmessage = (e) => {
            const evtData = JSON.parse(e.data)
            setOverlayData(evtData)
        }

        return () => evtSrc.close();
    }, []);

    if (!config) return null;

    const headerDisplay = () => {
        // Configure the text
        let headerText = `${config.overlay.header_text} ${overlayData.gameNumber}`
        if (overlayData.gameNumber > 8) headerText = "FINAL DUEL"
        else if (config.overlay.toggle.multiplier) headerText += ` (${overlayData.multiplier})`

        // based on game number, configure the box
        const isHighlight = overlayData.gameNumber > config.info.game_amount
        
        return (
            <div className={`${styles.status_event} ${isHighlight ? "text-colour" : ""}`}
                style={isHighlight ? {"--text-colour": config.colours.highlight} as React.CSSProperties : undefined}>
                    {headerText}
                </div>
        )
    }

    const gameDisplay = (
        <div className={styles.status_game}>
            <img className={overlayData.game == "DEFAULT" ? "opacity-50" : ""} src={overlayData.gameLogo} />
        </div>
    )

    const placementsDisplay = (places: ITeamPlacement[]) => {
        const lst = places.map((place: ITeamPlacement) => {
            return (<TeamPlacement key={place.place} place={place.place} name={place.name} score={place.score} scoreLimit={config.overlay.score_limit}/>)
        })
        return (
            <div className={overlayData.placementsVisible ? "transition-slide slide-right-in" : "transition-slide slide-left-out"}>
                {lst}
            </div>
        )
    }

    return (
        <div className={styles.main}>
            <div className={overlayData.statusVisible ? "transition-slide slide-right-in" : "transition-slide slide-left-out"}>
                <div className={styles.status}>
                    <div className={styles.status_icon} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}><img src={"/icon-event.png"}/></div>
                    {headerDisplay()}
                </div>
                {config.overlay.toggle.game_logo ? gameDisplay : null}
            </div>
            {placementsDisplay(overlayData.placements)}
        </div>
    );
}

// Placement component
function TeamPlacement({place, name, score, scoreLimit} : {place: number, name: string, score: number, scoreLimit: number}) {
    let placeIconColour = (place: number) => {
        switch (place) {
            case 1: return hexToRGBA(config.colours.gold, 0.75)
            case 2: return hexToRGBA(config.colours.silver, 0.75)
            default: return hexToRGBA(config.colours.black, 0.75);
        }
    }

    return (
        <div className={styles.place}>
            <div className={`${styles.place_icon} bg-colour`} style={{"--bg-colour": placeIconColour(place)} as React.CSSProperties}>
                {place}
            </div>
            <TeamLabel team={name}/>
            <div className={`${styles.place_points} ${score >= scoreLimit ? "text-colour" : ""}`}
                style={score >= scoreLimit ? {'--text-colour': config.colours.highlight} as React.CSSProperties: undefined}>
                {score == -1 ? (<img src={"/icon.png"}/>) : (<span>{score}</span>)}
            </div>
        </div>
    )
}

// Team label component
function TeamLabel({team} : {team : string}) {
    return (
        <div className={styles.place_label}>
            <img src={getIconPath(team)}/> {getTeamName(team)}
        </div>
    )
}