import styles from './wins_leaderboard.module.css'

import config from '@/config/break-card_list.json'

import Card from "../player/card";
import { getTeamFromMember } from '@/lib/client/teamInfo';
import { resolveRule } from '@/lib/utils';

export default function WinsLeaderboard({lst} : {lst: string[]}){

    return (
        <div className={styles.grid}>
            Winning and Gaming
        </div>
    )
}