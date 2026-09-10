'use client'
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useEffect, useState } from "react";

import styles from './overlay.module.css'

import { apiFetch, hexToRGBA } from '@/lib/utils/utils';

import teamInfo from '@/data/team_info.json';
import { useSearchParams } from "next/navigation";
import { TeamLabel } from "@/components/client/team/team_label";
import { useConfig } from "@/components/providers/configProvider";
import { useStateOverlay, useStatePlacements, useStateStatus } from "@/components/providers/stateProvider";

export interface ITeamPlacement {
    place: number;
    name: string;
    score: number;
}

export default function OverlayClient() {
    const config = useConfig().general;
    const colours = useConfig().colours;

    const searchParams = useSearchParams();
    const displayOption = searchParams.get('display');
    const [gameData, setGameData] = useState<any>(null);

    const overlayData = useStateOverlay();
    const statusData = useStateStatus();
    const placementsData = useStatePlacements();


    useEffect(() => {
        // Preload all team icons
        Object.values(teamInfo).forEach(team => {
            const img = new Image();
            img.src = team.icon;
        })
    }, []);

    useEffect(() => {
        apiFetch('games').then(async res => {
            const json = await res.json();
            setGameData(json);
        });
    }, [])

    const getSide = () => {
        if (overlayData?.forcedSide != "none") return overlayData?.forcedSide;
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
        let headerText = `${config.overlay.header_text} ${statusData?.game_number || 1}`
        if (statusData?.game_number > config.info.game_amount) headerText = config.overlay.finale_text
        else if (config.overlay.toggle.multiplier) headerText += ` (${statusData?.current_multiplier})`

        // based on game number, configure the box
        const isHighlight = statusData?.game_number > config.info.game_amount
        
        return (
            <div className={`${styles.status_event} ${isHighlight ? "text-colour" : ""}`}
                style={isHighlight ? {"--text-colour": colours.highlight} as React.CSSProperties : undefined}>
                    {headerText}
                </div>
        )
    }

    const gameDisplay = () => {
        return (
            <div className={styles.status_game}>
                <img className={overlayData?.game == "DEFAULT" ? "opacity-50" : ""} src={gameData?.[overlayData?.game]?.logo} />
            </div>
        )
    }

    const placementsDisplay = (places: ITeamPlacement[]) => {
        if (!places) return;

        const lst = places
            .slice(0, config.overlay.placements)
            .map((place: ITeamPlacement) => {
                return (<TeamPlacement key={place.place} place={place.place} name={place.name} score={place.score} 
                                       scoreLimit={config.overlay.score_limit} colours={colours}/>)
            })

        return (
            <div className={transitionClassNames(overlayData.placementsVisible)}>
                {lst}
            </div>
        )
    }

    return (
        <div className={getSide() == "right" ? styles.main_right : styles.main}>
            <div className={transitionClassNames(overlayData?.statusVisible)}>
                <div className={styles.status}>
                    <div className={styles.status_icon} style={{"--bg-colour": colours.secondary} as React.CSSProperties}><img src={"/icon-event.png"}/></div>
                    {headerDisplay()}
                </div>
                {config.overlay.toggle.game_logo ? gameDisplay() : null}
            </div>
            {placementsDisplay(placementsData)}
        </div>
    );
}

// Placement component
function TeamPlacement({place, name, score, scoreLimit, colours} : {place: number, name: string, score: number, scoreLimit: number, colours: any}) {
    const config = useConfig().general;

    let placeIconColour = (place: number) => {
        const podiumColours: any = {
            1: colours?.gold,
            2: colours?.silver,
            3: colours?.bronze
        }
        const selectedColour = podiumColours[place] ?? colours?.black
        return hexToRGBA(selectedColour, 0.75)
    }

    return (
        <div className={styles.place}>
            <div className={`${styles.place_icon} bg-colour`} style={{"--bg-colour": placeIconColour(place)} as React.CSSProperties}>
                {place}
            </div>
            <div className="relative flex items-center h-12.5 w-72.5 left-13.75 -top-12.5 
                        text-[24px] bg-black/75">
                <TeamLabel team={name}/>
            </div>
            <div className={`${styles.place_points} ${score >= scoreLimit ? "text-colour" : ""}`}
                style={score >= scoreLimit ? {'--text-colour': colours.highlight} as React.CSSProperties: undefined}>
                {score == -1 ? (<img src={"/icon.png"}/>) : (<span>{score}</span>)}
            </div>
        </div>
    )
}
