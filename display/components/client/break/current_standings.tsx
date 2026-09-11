import { useEffect, useState } from "react";

import { ListEntry } from "../list"
import { TeamLabel } from "../team/team_label"
import { apiFetch } from "@/lib/utils/utils";
import { useConfig } from "@/components/providers/configProvider";
import { useStatePlacements } from "@/components/providers/stateProvider";

const SPLIT_THRESHOLD = 8;

export default function CurrentStandings() {
    const config = useConfig().general;
    
    const placements = useStatePlacements();

    const getPlacements = () => {
        if (placements == null) return;

        const useTwoColumns = placements.length > SPLIT_THRESHOLD;

        let columnOne = placements;
        let columnTwo: any[] = [];

        if (useTwoColumns) {
            const half = Math.ceil(placements.length / 2);
            columnOne = placements.slice(0, half);
            columnTwo = placements.slice(half);
        }

        const renderColumn = (column: any[]) =>
            column.map((ele) => (
                <ListEntry key={ele.place} rank={ele.place} currentStandings
                           body={
                                <div className="flex flex-row">
                                    <div className="flex items-center pl-2.5 bg-black/75 w-150 text-[40px]">
                                        <TeamLabel team={ele.name} picSize={"40px"} />
                                    </div>  
                                    { config.break_screens.toggle.current_standings_scores ?
                                        (<div className="w-17.5 bg-black/75 ml-2.5 px-2.5 flex justify-center items-center
                                                    font-metropolis-black text-[50px] text-white text-center leading-17.5">
                                            {ele.score == -1 ? 
                                                (<img className="w-12.5 h-12.5 mx-auto" src={"/icon.png"}/>) : 
                                                (<span>{ele.score}</span>)}
                                        </div>) : ""

                                    }
                                </div> 
                            }
                />
            ));

        return (
            <div className={useTwoColumns ? "grid grid-cols-2 gap-x-5" : ""}>
                <div>{renderColumn(columnOne)}</div>
                {useTwoColumns && <div>{renderColumn(columnTwo)}</div>}
            </div>
        );
    }

    return (
        <div>
            {getPlacements()}
        </div>
    )
}