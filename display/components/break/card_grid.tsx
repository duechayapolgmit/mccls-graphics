import styles from './card_grid.module.css'

import config from '@/config/break-card_list.json'

import Card from "../player/card";
import { getTeamFromMember } from '@/lib/client/teamInfo';
import { resolveRule } from '@/lib/utils/utils';

export default function CardGrid({lst} : {lst: string[]}){

    const getColumns = () => {
        const items = lst.length;
        const rule = resolveRule(config.columns, items);

        if (rule === "n") return items;
        if (rule.includes("/")) {
            const [num, den] = rule.split("/");
            return Math[den === "2" ? "round" : "ceil"](items / Number(den));
        }

        return Number(rule);
    }


    const divList = lst.map((player: string) => {
        return (<div key={player}><Card player={player} team={getTeamFromMember(player)}/></div>)
    })

    return (
        <div className={styles.grid} style={{"--columns": getColumns()} as React.CSSProperties}>
            {divList}
        </div>
    )
}