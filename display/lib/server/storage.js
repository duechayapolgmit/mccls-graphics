import { loadFolder } from "../utils/localDataManager";

/* --------------
    CONFIG FOLDER
----------------- */ 
const CONFIG_FOLDER = 'config';
const configContentMap = loadFolder(CONFIG_FOLDER)

// Get the content based on the file name with no extensions
export const getRawConfig = (file) => configContentMap[file] || {};

/* --------------
    DATA FOLDER
----------------- */ 
const DATA_FOLDER = 'data';
const dataContentMap = loadFolder(DATA_FOLDER)

// Get the content based on the file name with no extensions
export const getData = (file) => dataContentMap[file] || {};
