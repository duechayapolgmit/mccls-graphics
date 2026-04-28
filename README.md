<img src="MCCLS-Logo-Long-Condensed.png" height="50" width="auto"/>
> Version 0.4.0 | Release Date: 28th April 2026

This repository contains some of the graphics and other tools used for [MCC Live Show](https://www.youtube.com/@mccliveshow_) in its live commentary streams and development. This is a recoding of the earlier [legacy version](https://github.com/duechayapolgmit/mccls-graphics-legacy) of the project.

There is currently one main tool that has been developed for the live show:
* `display` = contains a Next.JS web application, displaying all graphics associated with the live commentary streams.

Each tool is located in its own separate folders.

## Features
This repository currently contains the following features:
* [Event Overlay](https://github.com/duechayapolgmit/mccls-graphics/wiki/Event-Overlay) - displays overlay containing information about the current event. This includes the game number, point multiplier, logo of the game being played, top teams and their scores.
* [Voting Screen](https://github.com/duechayapolgmit/mccls-graphics/wiki/Voting-Screen) - displays the voting screen, containing games that are up for voting in an event.
* [Teams Overview](https://github.com/duechayapolgmit/mccls-graphics/wiki/Teams-Overview) - displays the teams overview screen, consisting of all teams and players in an event.
* [Player Cards](https://github.com/duechayapolgmit/mccls-graphics/wiki/Player-Cards) - displays player's name, avatar, amount of wins, and team colour they are in.
* Break Screens - displays details about the event and the roster, and other miscellaneous full-screen graphics, to be used in "be right back" screens or called individually
* Countdown - a simple countdown to the event.

## Usage
For the `display` folder, the application can be deployed by going into the folder and running the application itself.
```
cd display
# Running via a development server
npm run dev
# Building and running a production-ready build
npm run build
npm run start
```
The user can then navigate to the application via `localhost:3000` address, which shows a control panel that sends GET requests to change the data in each feature of the `display` web application. They can go to each of the following route to display each of the graphics component:
* `localhost:3000/break` - displays the break screen
* `localhost:3000/countdown` - displays the countdown to the event
* `localhost:3000/mvp/[type]` - displays the MVP voting statistics for the event (used on MCC Live Show) `type` includes `event` and `season`
* `localhost:3000/overlay` - displays the event overlay
* `localhost:3000/player/card/[name]` - displays the player card of a player via `[name]`
* `localhost:3000/teams` - displays the teams overview screen
* `localhost:3000/voting` - displays the voting screen

### General Configurations
The application can also be configured via its JSON file (`config/general.json`)
* `info` - information about the event.
  * `event_name` - name of the tournament
  * `tagline` - an event's tagline
  * `date_time` - an event's date and time that it will take place - formatted as follows: `date month year hour minutes seconds timezone`
  * `game_amount` - how many games are played in the event.
* `colours` - determines the colour scheme of the graphics and overlay. 
  * Main colour scheme uses `primary` for brighter colour and `secondary` for darker colour. `secondary` is currently being used for the overlay.
  * Other colours include: `highlight` (yellow-ish gold), `gold`, `silver`, `bronze`, `black`
All other configuration details are located in each functionality's wiki page.

## Resources
This repository uses the following resources:
* [Noxcrew - MC Championship](https://noxcrew.com/) - game logos, and team icons from MC Championship event. All of them can be found in the organiser's assets folder. Most of the game logos are modified to fit within the area in the overlay.
* [Metropolis Font](https://www.1001fonts.com/metropolis-font.html) - the main font used for the display application as well as in MCC Live Show
* [Minecrafter Font](https://www.dafont.com/minecrafter.font) - font used for the player cards, displaying the wins of each player

Profile pictures and player avatars are not provided in this repository. They can manually be inserted in `/display/public/player` folder, with `/profile` for profile pictures (1:1 ratio only) and `/avatar` for player avatars (500x450 size)