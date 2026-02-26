import gameLogos from '@/data/game_logos.json';

export const getGameLogoPath = (game) => gameLogos[game] || null;