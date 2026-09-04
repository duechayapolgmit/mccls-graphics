import info from '@/config/break.json';
import { getData } from '../utils/dataHelper';

import mvpData from '@/data/break_data_mvp.json'

export const getTitle = (column) => info.mvp_columns[column].title || "";
export const getSubtitle = (column) => info.mvp_columns[column].subtitle || "";

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