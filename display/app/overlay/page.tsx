'use client'

import { useEffect, useState } from "react";
import { getIconPath, getTeamName } from '@/lib/overlay/teamInfo';

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
        placementsVisible: true,
        config: {
            colours: {
                primary: "#b51a14",
                secondary: "#760804"
            },
            overlay: {
                toggle: {
                    multiplier: true,
                    game_logo: true
                },
                header_text: "GAME",
                score_limit: 3
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

    const headerDisplay = () => {
        // Configure the box
        let headerClassNames = "event-status";
        if (overlayData.gameNumber > 8) headerClassNames = "event-status-final"

        // Configure the text
        let headerText = `${overlayData.config.overlay.header_text} ${overlayData.gameNumber}`
        if (overlayData.gameNumber > 8) headerText = "FINAL DUEL"
        else if (overlayData.config.overlay.toggle.multiplier) headerText += ` (${overlayData.multiplier})`

        return (
            <div className={headerClassNames}>{headerText}</div>
        )
    }

    const gameDisplay = (
        <div className="game">
            <img className={overlayData.game == "DEFAULT" ? "opacity-50" : ""} src={overlayData.gameLogo} />
        </div>
    )

    const placementsDisplay = (places: ITeamPlacement[]) => {
        const lst = places.map((place: ITeamPlacement) => {
            return (<TeamPlacement key={place.place} place={place.place} name={place.name} score={place.score} scoreLimit={overlayData.config.overlay.score_limit}/>)
        })
        return (
            <div className={overlayData.placementsVisible ? "placements-transition slide-in" : "placements-transition slide-out"}>
                {lst}
            </div>
        )
    }

    return (
        <div className="overlay">
            <div className={overlayData.statusVisible ? "status slide-in" : "status slide-out"}>
                <div className="header">
                    <div className="ls-icon" style={{"--bg-colour": overlayData.config.colours.secondary} as React.CSSProperties}><img src={"/icon-event.png"}/></div>
                    {headerDisplay()}
                </div>
                {overlayData.config.overlay.toggle.game_logo ? gameDisplay : null}
            </div>
            {placementsDisplay(overlayData.placements)}
        </div>
    );
}

// Placement component
function TeamPlacement({place, name, score, scoreLimit} : {place: number, name: string, score: number, scoreLimit: number}) {
    let placeIconClass = (place: number) => {
        switch (place) {
            case 1: return "place-icon first-place-icon"
            case 2: return "place-icon second-place-icon"
        }
    }

    return (
        <div className="placement">
            <div className={placeIconClass(place) || "place-icon"}>{place}</div>
            <TeamLabel team={name}/>
            <div className={score >= scoreLimit ? "finale-points-won" : "finale-points"}>{score == -1 ? (<img src={"/icon.png"}/>) : (<span>{score}</span>)}</div>
        </div>
    )
}

// Team label component
function TeamLabel({team} : {team : string}) {
    return (
        <div className="label">
            <img src={getIconPath(team)}/> {getTeamName(team)}
        </div>
    )
}