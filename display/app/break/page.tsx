import styles from './break.module.css'

import config from '@/config/general.json'

import CardGrid from '@/components/break/card_grid';
import { getCardGridList } from '@/lib/client/breakInfo';

export default function Page() {
    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <div className={styles.header_icon} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}><img src={"/icon-event.png"}/></div>
                <div className={styles.header_text}>TESTTESTTESTTEST</div>
            </div>
            <div className={styles.body}>
                
            </div>
            <div className={styles.footer}>
                <div className={styles.header_icon} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}></div>
                <div className={styles.header_text}>MC Championship: Project G.L.O.P.</div>                
            </div>
        </div>
    )
}