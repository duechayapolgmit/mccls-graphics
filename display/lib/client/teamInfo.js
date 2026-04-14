import config from '@/config/general.json'

import teamInfo from '@/data/team_info.json';
import membersInfo from '@/data/team_members.json'

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
    return config.colours.secondary;
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