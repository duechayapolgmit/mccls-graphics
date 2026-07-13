import { getData } from "../utils/dataHelper"

const configURLs = {
    "general": "/api/config",
    "break": "/api/config/break",
    "colours": "/api/config/colours"
}

const configRawGeneral = await getData(configURLs.general);
export const getConfig = () => configRawGeneral;

const configBreak = await getData(configURLs.break);
export const getConfigBreak = () => configBreak;

const configColours = await getData(configURLs.colours);
export const getConfigColours = () => configColours;