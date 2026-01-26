import multipliers from '@/data/game_multipliers.json';
import gameLogos from '@/data/game_logos.json';
import teamLabels from '@/data/team_labels.json';
import yaml from 'js-yaml';
import fs from 'fs';
import path from "path";
import { error } from 'console';

const statePath = path.join(process.cwd(), "state/overlay.json");
const stateDefaultPath = path.join(process.cwd(), "state/defaults/overlay.json")

const config = yaml.load(fs.readFileSync("config/general.yaml", "utf8"));

function load() {
    try {
        const raw = fs.readFileSync(statePath, "utf8");
        return JSON.parse(raw)
    } catch (err) {
        console.error("Can't load overlay state, trying defaults");
        try {
            const rawDefault = fs.readFileSync(stateDefaultPath, "utf8");
            return JSON.parse(rawDefault);
        } catch (err) {
            console.error("Can't load default overlay state.");
            return {}
        }
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
data.config = config; 

export function getOverlayData() {
    return data
}

/* Controls Game Numbers */
export function getGameNumber() {
    return data.gameNumber;
}

export function setGameNumber(gameNo) {
    data.gameNumber = gameNo

    // Check the multiplier associated and attach the multiplier with that (default x1.0)
    data.multiplier = multipliers[data.gameNumber] || "x1.0";
    save(data);
}

/* Controls Game Logos */
export function getGame() {
    return data.game;
}

export function setGame(game) {
    data.game = game

    // Check the game logo associated
    data.gameLogo = gameLogos[data.game] || "/game_logos/Default.png";
    save(data);
}

/* Controls Standings */
export function getFirstPlace() {
    return data.first
}

export function getSecondPlace() {
    return data.second
}

export function setFirstPlace(team) {
    data.first = team;

    // Check the label
    data.firstLabel = teamLabels[data.first] || "/team_labels/Blank.png";
    save(data);
}

export function setSecondPlace(team) {
    data.second = team;

    // Check the label
    data.secondLabel = teamLabels[data.second] || "/team_labels/Blank.png";
    save(data);
}

/* Controls DB score */
export function getFirstDBPoints() {
    return data.firstDB;
}

export function getSecondDBPoints() {
    return data.secondDB;
}

export function setFirstDBPoints(points) {
    data.firstDB = points;
    save(data);
}

export function setSecondDBPoints(points) {
    data.secondDB = points;
    save(data);
}

/* Controls animations */
export function getStatusDisplayOptions() {
    return data.statusVisible;
}

export function getPlacementsDisplayOptions() {
    return data.placementsVisible;
}

export function setStatusDisplayOptions(option) {
    if (typeof option != "boolean") return;

    data.statusVisible = option;
    save(data);
}

export function setPlacementsDisplayOptions(option) {
    if (typeof option != "boolean") return;

    data.placementsVisible = option;
    save(data);
}