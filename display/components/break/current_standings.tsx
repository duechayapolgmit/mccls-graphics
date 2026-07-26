import { useEffect, useState } from "react";

import { ListEntry } from "../list"
import { TeamLabel } from "../team/team_label"
import { apiFetch } from "@/lib/utils/utils";

const SPLIT_THRESHOLD = 8;

export default function CurrentStandings() {
    const [placements, setPlacements] = useState<any[]>();

    useEffect(() => {
        apiFetch('event/placements').then(async res => {
            const json = await res.json();
            setPlacements(json);
        });
    }, [])

    const getPlacements = () => {
        if (placements == null) return;

        const useTwoColumns = placements.length > 8;

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
                                <div className="flex items-center pl-2.5 bg-black/75 w-150 text-[40px]">
                                    <TeamLabel team={ele.name} picSize={"40px"} />
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