import playerInfo from '@/data/player_info.json';

export function getPlayerName(name) {
    let data = playerInfo[name]

    if (data) return data.name;
    return name;
}

export function getPlayerProfile(name) {
    let data = playerInfo[name]

    if (data) return data.profile;
    return "/player/profile/default.png";
}

