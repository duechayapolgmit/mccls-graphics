import { loadFolder } from "../utils/localDataManager";

const CONFIG_FOLDER = 'config';
const config = loadFolder(CONFIG_FOLDER);

// Loaders
export async function getAllConfig() {
    return await config;
}

export async function getConfig(type: string = "general") {
    const configResolve = await config;
    return configResolve?.[type]
}