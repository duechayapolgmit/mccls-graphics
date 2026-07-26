import { getData } from '../utils/dataHelper';

const gameInfo = await getData('/api/games')

export const checkGame = (game) => gameInfo?.[game] ? true : false