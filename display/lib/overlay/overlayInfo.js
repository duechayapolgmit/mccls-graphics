import multipliers from '@/data/game_multipliers.json';
import gameLogos from '@/data/game_logos.json';
import yaml from 'js-yaml';
import fs from 'fs';
import path from "path";

const statePath = path.join(process.cwd(), "state/overlay.json");
const stateDefaultPath = path.join(process.cwd(), "state/defaults/overlay.json")

const config = yaml.load(fs.readFileSync("config/general.yaml", "utf8"));

function load() {
    try {
        const raw = fs.readFileSync(statePath, "utf8");
        let obj = JSON.parse(raw);
        obj.config = config;
        return obj
    } catch (err) {
        console.error("Can't load overlay state, trying defaults");
        return loadDefaults();
    }
}

function loadDefaults() {
    try {
        const raw = fs.readFileSync(stateDefaultPath, "utf8");
        let obj = JSON.parse(raw);
        obj.config = config;
        return obj;
    } catch (err) {
        console.error("Can't load default overlay state.");
        return {}
    }
}

function save(state) {
    try {
        fs.writeFileSync(statePath, JSON.stringify(state, null, 2), "utf8");
    } catch (err) {
        console.error("Can't write overlay state", error);
    }
}

let data = load();

/* --------------
    GETTERS
----------------- */ 
export const getOverlayData = () => data;

export const getGameNumber = () => data.gameNumber;
export const getGame = () => data.game;

export const getFirstPlace = () => data.first;
export const getSecondPlace = () => data.second;

export const getFirstDBPoints = () => data.firstDB;
export const getSecondDBPoints = () => data.secondDB;

export const getStatusDisplayOptions = () => data.statusVisible;
export const getPlacementsDisplayOptions = () => data.placementsVisible;

/* --------------
    SETTERS
----------------- */ 
export function setGameNumber(gameNo) {
    data.gameNumber = gameNo
    // Check the multiplier associated and attach the multiplier with that (default x1.0)
    data.multiplier = multipliers[data.gameNumber] || "x1.0"; 
    save(data);
}

export function setGame(game) {
    data.game = game
    // Check the game logo associated
    data.gameLogo = gameLogos[data.game] || "/game_logos/Default.png";
    save(data);
}

export function setFirstPlace(team) {
    data.first = team;
    save(data);
}

export function setSecondPlace(team) {
    data.second = team;
    save(data);
}

export function setFirstDBPoints(points) {
    data.firstDB = points;
    save(data);
}

export function setSecondDBPoints(points) {
    data.secondDB = points;
    save(data);
}

export function setStatusDisplayOptions(option) {
    if (typeof option == "boolean") {
        data.statusVisible = option;
        save(data);
    } 
}

export function setPlacementsDisplayOptions(option) {
    if (typeof option == "boolean") {
        data.placementsVisible = option;
        save(data);
    }   
}

/* RESET */
export function resetOverlay() {
    data = loadDefaults();
    save(data);
}