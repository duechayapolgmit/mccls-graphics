import Image from "next/image";
import { getBreakScreenDetails } from "@/lib/client/breakInfo"
import { getConfigColours } from "@/lib/client/config";
import { getGameLogoPath } from "@/lib/client/gameInfo";

const colours = getConfigColours();

export default function Explainer({screen, isGame}: {screen: string, isGame?: boolean}) {
    const data = getBreakScreenDetails(screen);

    const getText = () => {
        const content = data?.content;
        
        const map = content.map((ele: string) => {
            return (
                <div key={ele.length} className="mb-10">
                    <ExplainerText text={ele}/>
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
                {getText()}
            </div>
            {!isGame ? "" :
                <Image className="absolute right-0 bottom-65 pointer-events-none"
                        alt={data?.game} width={400} height={150} src={getGameLogoPath(data?.game)}/>}
            <Image className="h-65 object-cover" loading="eager"
                   alt={screen} width={1920} height={1080} src={data?.picture}/>
            
        </div>
    )
}

function ExplainerText({text}: {text: string}) {
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