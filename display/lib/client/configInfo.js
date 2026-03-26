import { getConfig } from '@/lib/helper/config'

const config = await getConfig();

export const getInfo = () => config.info;
export const getColours = () => config.colours;
export const getOverlayInfo = () => config.overlay;
export const getTeamBackground = () => config.teams.background;