'use client'
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useEffect, useState } from "react";

import styles from './overlay.module.css'

import { getIconPath, getTeamName } from '@/lib/client/teamInfo';
import { hexToRGBA } from '@/lib/utils/utils';

import teamInfo from '@/data/team_info.json';
import { getGameLogoPath } from "@/lib/client/gameInfo";
import { getConfig, getConfigColours } from "@/lib/client/config";
import { useSearchParams } from "next/navigation";

const config = await getConfig();
const colours = await getConfigColours();

interface ITeamPlacement {
    place: number;
    name: string;
    score: number;
}

export default function Page() {
    const searchParams = useSearchParams();
    const displayOption = searchParams.get('display');

    const [overlayData, setOverlayData] = useState({
        gameNumber: 1,
        multiplier: "x1.0",
        game: "DEFAULT",
        placements: [{
            place: 0,
            name: "",
            score: -1
        }],
        statusVisible: true,
        placementsVisible: true,
        forcedSide: "none"
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

    const getSide = () => {
        if (overlayData.forcedSide != "none") return overlayData.forcedSide;
        return displayOption || "left";
    }

    const transitionClassNames = (status: boolean) => {
        if (status) {
            if (getSide() == "right") return "transition-slide slide-left-in"
            return "transition-slide slide-right-in"
        }

        if (getSide() == "right") return "transition-slide slide-right-out"
        return "transition-slide slide-left-out"
    }

    const headerDisplay = () => {
        // Configure the text
        let headerText = `${config.overlay.header_text} ${overlayData.gameNumber}`
        if (overlayData.gameNumber > config.info.game_amount) headerText = config.overlay.finale_text
        else if (config.overlay.toggle.multiplier) headerText += ` (${overlayData.multiplier})`

        // based on game number, configure the box
        const isHighlight = overlayData.gameNumber > config.info.game_amount
        
        return (
            <div className={`${styles.status_event} ${isHighlight ? "text-colour" : ""}`}
                style={isHighlight ? {"--text-colour": colours.highlight} as React.CSSProperties : undefined}>
                    {headerText}
                </div>
        )
    }

    const gameDisplay = (
        <div className={styles.status_game}>
            <img className={overlayData.game == "DEFAULT" ? "opacity-50" : ""} src={getGameLogoPath(overlayData.game)} />
        </div>
    )

    const placementsDisplay = (places: ITeamPlacement[]) => {
        const lst = places.map((place: ITeamPlacement) => {
            return (<TeamPlacement key={place.place} place={place.place} name={place.name} score={place.score} scoreLimit={config.overlay.score_limit}/>)
        })
        return (
            <div className={transitionClassNames(overlayData.placementsVisible)}>
                {lst}
            </div>
        )
    }

    return (
        <div className={getSide() == "right" ? styles.main_right : styles.main}>
            <div className={transitionClassNames(overlayData.statusVisible)}>
                <div className={styles.status}>
                    <div className={styles.status_icon} style={{"--bg-colour": colours.secondary} as React.CSSProperties}><img src={"/icon-event.png"}/></div>
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
            case 1: return hexToRGBA(colours.gold, 0.75)
            case 2: return hexToRGBA(colours.silver, 0.75)
            default: return hexToRGBA(colours.black, 0.75);
        }
    }

    return (
        <div className={styles.place}>
            <div className={`${styles.place_icon} bg-colour`} style={{"--bg-colour": placeIconColour(place)} as React.CSSProperties}>
                {place}
            </div>
            <TeamLabel team={name}/>
            <div className={`${styles.place_points} ${score >= scoreLimit ? "text-colour" : ""}`}
                style={score >= scoreLimit ? {'--text-colour': colours.highlight} as React.CSSProperties: undefined}>
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