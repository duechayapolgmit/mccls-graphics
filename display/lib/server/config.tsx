'use server'
import { loadFolder } from "../utils/localDataManager";

const CONFIG_FOLDER = 'config';

let config: any = null;

// Loaders
export async function getAllConfig() {
    if (!config) config = await loadFolder(CONFIG_FOLDER);
    
    return config;
}

export async function getConfig(type?: string) {
    if (!type) type = "general"

    if (!config) config = await loadFolder(CONFIG_FOLDER)
    return config?.[type]
}