import { getIconPath, getTeamName } from "@/lib/client/teamInfo";

export enum LabelOption {
    Column,
    Row
}

export function TeamLabel({team, picSize = "32px", fontSize = "1em", option = LabelOption.Column} : 
                          {team : string, picSize?: string, fontSize?: string, option?: LabelOption}) {
    
    const teamName = getTeamName(team)
    const teamIcon = getIconPath(team)

    switch (option) {
        case LabelOption.Row:
            return (
                <div className="h-[251px] mt-[10px] flex flex-col justify-center items-center gap-[10px]">
                    <img className="w-(--pic-size) h-(--pic-size)" 
                         style={{"--pic-size": picSize} as React.CSSProperties}
                         src={teamIcon}/>
                    <span className="font-metropolis-black uppercase text-white leading-15"
                          style={{fontSize: fontSize}}>{teamName}</span>
                </div>
            )
        case LabelOption.Column:
        default:
            return (
                <div className="flex items-center 
                        font-metropolis-bold uppercase text-white">
                    <img className="h-(--pic-size) px-1.25" 
                        style={{"--pic-size": picSize} as React.CSSProperties}
                        src={teamIcon}/>{teamName}
                </div>
            )
    }
}