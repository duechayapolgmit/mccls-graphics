import teamInfo from '@/data/team_info.json';
import {getConfig} from '@/lib/helper/config';
import { getColours } from './configInfo';

const config = await getConfig();

export function getTeamName(team) {
    let data = teamInfo[team];

    if (data) return data.name;
    return "";
}

export function getIconPath(team) {
    let data = teamInfo[team];

    if (data) return data.icon
    return null;
}

export function getBackground(team) {
    let data = teamInfo[team]

    if (data) return data.colour;
    return getColours().secondary;
}