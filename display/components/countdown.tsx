import { getConfig } from "@/lib/client/config";
import { useLayoutEffect, useState } from "react";

const config = await getConfig();

export function Countdown({time, showMinutes = false, warning = false}: {time: any, showMinutes?: boolean, warning?: boolean}) {

    const [cdTime, setCdTime] = useState({
        days: 0, hours: 0, mins: 0, secs: 0
    })
    const [finish, setFinish] = useState(false);

    useLayoutEffect(() => countdown(), [time]);

    const countdown = () => {
        const targetTime = typeof time == "number" 
                ? new Date().getTime() + time * 1000
                : new Date(time).getTime();

        const interval = setInterval(() => {
            const currentTime = new Date().getTime();
            const remaining = targetTime - currentTime;

            const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
            const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((remaining % (1000 * 60)) / 1000)

            const running = {days: days, hours: hours, mins: mins, secs: secs};
            setCdTime(running)

            // warning ticks - only plays in OBS!
            const warningTime = (config?.countdown.warning_starts + 1) * 1000
            if (warning && (remaining < warningTime && remaining > 0)) {
                const audio = new Audio(config?.countdown.warning_tick_sound)
                audio.play();
            }

            if (remaining <= 0) {
                clearInterval(interval);
                setFinish(true);
                return;
            }
        }, 1000);

        return () => clearInterval(interval);
    }

    const leadingZero = (time: number) => (time > 9) ? time : `0${time}`

    const getTime = () => {
        return (
            <span>
                {cdTime.days > 0 ? `${cdTime.days}:` : ""}
                {cdTime.hours > 0 ? (cdTime.days > 0 ? `${leadingZero(cdTime.hours)}:` : `${cdTime.hours}:`) : (cdTime.days > 0 ? "00:" : "")}
                {cdTime.mins > 0 ? (cdTime.hours > 0 ? `${leadingZero(cdTime.mins)}:` : `${cdTime.mins}:`) : (cdTime.hours > 0 ? "00:" : (showMinutes ? "0:" : ""))}
                {cdTime.secs > 0 ? (cdTime.mins > 0 ? `${leadingZero(cdTime.secs)}` : (showMinutes ? leadingZero(cdTime.secs) : `${cdTime.secs}`)) : (cdTime.mins > 0 || showMinutes ? "00" : "0")}
            </span>
        )
    }

    return <>{finish ? "Soon" : getTime()}</>
}