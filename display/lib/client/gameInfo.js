import { getData } from '../utils/dataHelper';

const gameInfo = await getData('/api/games')

export const getGameLogoPath = (game) => gameInfo[game] || null;

export const checkGame = (game) => gameInfo?.[game] ? true : false