import teamInfo from '@/data/team_info.json';
import membersInfo from '@/data/team_members.json'

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

export function getTeamMembers(team) {
    let data = membersInfo.teams[team]

    if (data) return data
    return []
}

export function getMemberStatus(name) {
    let status = "none";

    if (membersInfo.new_players.find((member) => member == name)) status = "newcomer";
    else if (membersInfo.sub_players.find((member) => member == name)) status = "substitute";

    return status;
}