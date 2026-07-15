import Image from "next/image";
import { getExplainerContent, getExplainerPicture } from "@/lib/client/breakInfo"
import { getConfigColours } from "@/lib/client/config";

const colours = getConfigColours();

export default function Explainer({screen}: {screen: string}) {
    const getText = () => {
        const content = getExplainerContent(screen);
        
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
            <Image className="h-65 object-cover" loading="eager"
                   alt={screen} width={1920} height={1080} src={getExplainerPicture(screen)}/>
            
        </div>
    )
}

function ExplainerText({text}: {text: string}) {
    const tokens = text.split(/(<\/?b>|<\/?h>)/g);

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