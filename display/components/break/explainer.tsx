import Image from "next/image";
import { getExplainerContent, getExplainerPicture } from "@/lib/client/breakInfo"

export default function Explainer({screen}: {screen: string}) {
    const getText = () => {
        const content = getExplainerContent(screen);
        
        const map = content.map((ele: string) => {
            return (
                <div key={ele.length} className="mb-10">
                    {ele}
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