import Image from "next/image";
import { getBreakScreenDetails } from "@/lib/client/breakInfo"
import { getConfigColours } from "@/lib/client/config";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils/utils";

const colours = getConfigColours();

export default function Explainer({screen, isGame}: {screen: string, isGame?: boolean}) {
    const [gameData, setGameData] = useState<any>(null);
    
    const data = getBreakScreenDetails(screen);

    useEffect(() => {
        apiFetch('games').then(async res => {
            const json = await res.json();
            setGameData(json);
        });
    }, [])

    const getText = () => {
        const content = data?.content;
        
        const map = content.map((ele: string) => {
            return (
                <div key={ele.length} className="mb-10">
                    <ExplainerFormatter text={ele}/>
                </div>)
        })

        return (
            <div className="m-9">
                {map}
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-between h-212.5">
            <div className="font-metropolis text-white text-6xl self-start">
                {!isGame ? getText() : <ExplainerGameText text={data?.content}/>}
            </div>
            {!isGame ? "" :
                <Image className="absolute right-0 bottom-65 pointer-events-none"
                        alt={data?.game} width={400} height={150} src={gameData?.[data?.game]}/>}
            <Image className="h-65 object-cover" loading="eager"
                   alt={screen} width={1920} height={1080} src={data?.picture}/>
            
        </div>
    )
}

function ExplainerFormatter({text}: {text: string}) {
    const tokens = text.split(/(<\/?b>|<\/?h>|<br\/>)/g);

    let bold = false;
    let highlight = false;

    const output = tokens.map((token, idx) => {
        switch (token) {
            case "<b>":
                bold = true;
                return;
            case "</b>":
                bold = false;
                return;
            case "<h>":
                highlight = true;
                return;
            case "</h>":
                highlight = false;
                return;
            case "<br/>":
                return <br key={`br-${idx}`}/>
        }

        let element: React.ReactNode = token;

        if (highlight) {
            element = (
                <span key={`h-${idx}`} style={{ color: colours.highlight }}>
                    {element}
                </span>
            );
        }

        if (bold) {
            element = (
                <span key={`b-${idx}`} className="font-metropolis-black">
                    {element}
                </span>
            );
        }

        return element;
    })

    return <>{output}</>
}

function ExplainerGameText({text}: {text: any}) {
    
    const summary = <div className="mb-9">{text.summary}</div>;
    const goal = <div><span className="font-metropolis-black">Goal: </span><ExplainerFormatter text={text.goal}/></div>
    const scoring = text.scoring == null ? "" :
                    <div>
                        <span className="font-metropolis-black">Scoring: </span>
                        {text.scoring.map((ele: any) => <div>- <ExplainerFormatter text={ele}/></div>)}
                    </div>
                    
    
    
    return (
        <div className="m-9">
            {summary}
            {goal}
            {scoring}
        </div>
    )
}