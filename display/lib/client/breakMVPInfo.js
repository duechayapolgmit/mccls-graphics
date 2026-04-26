import info from '@/data/break_mvp.json';
import mvpData from '@/data/break_mvp_data.json';

export const getTitle = (column) => info.columns[column].title || "";
export const getSubtitle = (column) => info.columns[column].subtitle || "";

export function getColumnKeys(screen) {
    let data = mvpData[screen]
    if (!data) return;

    return data.columns || [];
}

export function getPlayers(screen) {
    let data = mvpData[screen]
    if (!data) return [];

    return Object.keys(data.players);
}

export function getPlayerData(player, screen, column) {
    let data = mvpData[screen]
    if (!data) return;
    
    return data.players[player][column] || ""
}