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

export function getPlayerAvatar(name) {
    let data = playerInfo[name]

    if (data) return data.avatar;
    return "";
}

export function getPlayerWins(name) {
    let data = playerInfo[name]

    if (data) return data.wins || 0; // undefined = 0
    return 0;
}
