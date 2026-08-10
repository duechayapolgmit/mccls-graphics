import styles from './countdown.module.css'
import { Countdown } from "@/components/client/countdown";
import { useConfig } from '@/components/providers/configProvider';

export default async function Page(){
    const config = useConfig().general;
    const colours = useConfig().colours;

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <div className={styles.header_logo} style={{"--bg-colour": colours.secondary} as React.CSSProperties}><img src={"/icon-event.png"}/></div>
                <div className={styles.header_text}>NEXT MCC</div>
            </div>
            <div className={styles.countdown}>
                <Countdown time={config.info.date_time}/>
            </div>
        </div>
    )
}