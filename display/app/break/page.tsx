import styles from './break.module.css'

import config from '@/config/general.json'
import configBreakCardList from '@/config/break-card_list.json'

import CardGrid from '@/components/break/card_grid';
import { getCardGridList } from '@/lib/client/breakInfo';
import { resolveRule } from '@/lib/utils';

export default function Page() {

    const lst = getCardGridList("no_wins");

    const getScaleSize = () => {
        const items = lst.length;
        return Number(resolveRule(configBreakCardList.scale, items));
    };

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <div className={styles.icon} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}><img src={"/icon-event.png"}/></div>
                <div className={styles.header_text}>TESTTESTTESTTEST</div>
                <div className={styles.right_text}>1:00</div>
                <div className={`${styles.icon} ${styles.right_icon}`} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}></div>
            </div>
            <div className={styles.body}>
                <div className={styles.content_cards} style={{"--scale": getScaleSize()} as React.CSSProperties}>
                    <CardGrid lst={lst}/>
                </div>
            </div>
            <div className={styles.footer}>
                <div className={styles.icon} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}></div>
                <div className={styles.header_text}>{config.info.event_name}: <span className='text-colour' style={{"--text-colour": config.colours.highlight} as React.CSSProperties}>{config.info.tagline}</span></div>
                <div className={styles.right_text}>MCC Live Show</div>
                <div className={`${styles.icon} ${styles.right_icon}`} style={{"--bg-colour": config.colours.secondary} as React.CSSProperties}></div>        
            </div>
        </div>
    )
}