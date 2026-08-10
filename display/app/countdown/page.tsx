import styles from './countdown.module.css'
import { getConfig } from "@/lib/server/config"
import { Countdown } from "@/components/countdown";

export default async function Page(){
    const config = await getConfig("general");
    const colours = await getConfig("colours");

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