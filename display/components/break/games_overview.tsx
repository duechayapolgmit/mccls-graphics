import { apiFetch } from "@/lib/utils/utils";
import { TextFormatter } from "@/lib/utils/utilsComp";
import { useEffect, useState } from "react";

export function GamesOverview({title, lst}: {title: string, lst: string[]}) {

    const [gameData, setGameData] = useState<any>();

    useEffect(() => {
        apiFetch('games').then(async res => {
            const json = await res.json();
            setGameData(json);
        });
    }, [])

    const getGamesGrid = () => {
        if (!lst) return;
        const lstDiv = lst.map((ele) => {
            return (
                <div key={ele} className="flex bg-black/50 w-125 h-40 align-middle items-center justify-center">
                    <img className="h-50" src={gameData?.[ele]}/>
                </div>
            )
        })
        return (
            <div className="grid gap-2.5 grid-cols-3">
                {lstDiv}
            </div>
        )
    }

    return (
        <div>
            <div className="font-metropolis text-white text-center text-6xl text-shadow-2xs pb-10">
                <TextFormatter text={title}/>
            </div>
            {getGamesGrid()}
        </div>
    )
}