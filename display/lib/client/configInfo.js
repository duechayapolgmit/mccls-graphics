import { getConfig } from '@/lib/helper/config'

const config = await getConfig();

export const getColours = () => config.colours;
export const getOverlayInfo = () => config.overlay;