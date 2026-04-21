import styles from './card_grid.module.css'

import config from '@/config/break-card_list.json'

import Card from "../player/card";
import { getTeamFromMember } from '@/lib/client/teamInfo';

interface IRule {
    eq?: number;
    max?: number;
    value: string
}

export default function CardGrid({lst} : {lst: string[]}){

    const resolveRule = (rules: IRule[], n: number) => {
        for (const rule of rules) {
            if (rule.eq !== undefined && rule.eq === n) return rule.value;
            if (rule.max !== undefined && n <= rule.max) return rule.value;
        }
        return n.toString();
    }

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

    const getScaleSize = () => {
        const items = lst.length;
        return Number(resolveRule(config.scale, items));
    };


    const divList = lst.map((player: string) => {
        return (<div key={player}><Card player={player} team={getTeamFromMember(player)}/></div>)
    })

    return (
        <div className={styles.main}>
            <div className={styles.grid} style={{"--columns": getColumns(), "--scale": getScaleSize()} as React.CSSProperties}>{divList}</div>
        </div>
    )
}