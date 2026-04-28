import config from '@/config/general.json';
import configBreak from '@/config/break.json';

import styles from './break.module.css'

import CardGrid from "@/components/break/card_grid";
import WinsLeaderboard from "@/components/break/wins_leaderboard";

import { getCardGridList, getType } from "@/lib/client/breakInfo";
import { getWinsLeaderboardFromAmount } from "@/lib/server/wins";
import { resolveRule } from "@/lib/utils/utils";
import { getGridColumnAmountFromMap } from "@/lib/utils/winsLeaderboardUtils";
import MVPTable from '@/components/break/mvp_table';

interface IRule {
    eq?: number;
    max?: number;
    value: string
}

const WINS_LEADERBOARD_ROWS = 3;
export default function BreakScreenBody({screen}: {screen: string}) {
    const getScaleSize = (rules: IRule[], amount: number) => Number(resolveRule(rules, amount));

    const type = getType(screen);

    let lst: string[] = [];
    let leaderboard = new Map<number, string[]>();
    let scale = 1;

    switch (type) {
        case "card_grid":
            lst = getCardGridList(screen);
            scale = getScaleSize(configBreak.grid_list_scale, lst.length);
            break;
        case "wins_leaderboard":
            leaderboard = getWinsLeaderboardFromAmount(config.break_screen.minimum_wins);
            const cols = getGridColumnAmountFromMap(leaderboard, WINS_LEADERBOARD_ROWS);
            scale = getScaleSize(configBreak.wins_leaderboard_scale, cols);
    }

    const getContent = () => {
        switch (type) {
            case "card_grid": 
                return <CardGrid lst={lst}/>
            case "wins_leaderboard": 
                return <WinsLeaderboard playersWins={leaderboard}/>
            case "mvp_table":
                return <MVPTable screen={screen}/>
            default: 
                return null;
        }
    }

    return (
        <div key={screen} className={styles.content_cards} style={{"--scale": scale} as React.CSSProperties}>
            {getContent()}
        </div>
    )
}