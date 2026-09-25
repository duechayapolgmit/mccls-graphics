'use client'
import { LabelOption, TeamLabel } from "@/components/client/team/team_label";
import { useConfig } from "@/components/providers/configProvider";
import { useStatePlacements } from "@/components/providers/stateProvider";
import { getTeamName } from "@/lib/client/teamInfo";
import { apiFetch } from "@/lib/utils/utils";
import { useEffect, useState } from "react";

const SHORT_LIMIT = 16;

export default function Page() {
    const config = useConfig().general;
    
    const placementsData = useStatePlacements();
    const [gameData, setGameData] = useState<any>(null);
    
    useEffect(() => {
        apiFetch('games').then(async res => {
            const json = await res.json();
            setGameData(json);
        });
    }, [])

    const getTeamLabelTop = (place: number) => {
        const placeInfo = placementsData?.find((ele: any) => ele.place == place)
        const teamName = getTeamName(placeInfo?.name)

        const textSize = () => {
            if (teamName.length > SHORT_LIMIT) return '3.5em'
            else return '4em'
        }

        return (
            <TeamLabel team={placeInfo?.name} picSize="125px" fontSize={textSize()} option={LabelOption.Row}/>
        )
    }

    const getScore = (place: number) => {
        const placeInfo = placementsData?.find((ele: any) => ele.place == place)

        const scoreOnPic = '/On.png';
        const scoreOffPic = '/Off.png';

        let scores = []
        for (let i = 0; i < config.overlay.score_limit; i++) {
            if (i < placeInfo?.score) {
                scores.push((
                    <img className="w-[50px] h-[50px]" src={scoreOnPic}/>
                ))
            } else {
                scores.push((
                    <img className="w-[50px] h-[50px]" src={scoreOffPic}/>
                ))
            }
        }

        return (
            <div className="flex justify-center">
                {scores}
            </div>
        )
    }

    return (
        <div className="w-[1920px] h-[1080px] p-[15px]">
            <div className="flex gap-[19px]">
                <div>
                    {getTeamLabelTop(1)}
                    <div className="bg-black w-[933px] h-[525px]"></div>
                    <div className="flex bg-black/75 w-[195px] h-[70px] justify-center items-center">{getScore(1)}</div>
                </div>
                <div className="flex flex-col">
                    {getTeamLabelTop(2)}
                    <div className="bg-black w-[933px] h-[525px]"></div>
                    <div className="flex bg-black/75 w-[195px] h-[70px] justify-center items-center self-end">{getScore(2)}</div>
                </div>
            </div>
            <div className="flex w-[1885px] justify-center">
                <img className="h-[300px] -translate-y-22" src={gameData?.["DB"].logo}/>
            </div>
        </div>
    )
}