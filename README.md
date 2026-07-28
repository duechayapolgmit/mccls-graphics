<img src="MCCLS-Logo-Long-Condensed.png" height="50" width="auto"/>

> Version 0.5.0 | Release Date: 28th July 2026

This repository contains some of the graphics and other tools used for [MCC Live Show](https://www.youtube.com/@mccliveshow_) in its live commentary streams and development. This is a recoding of the earlier [legacy version](https://github.com/duechayapolgmit/mccls-graphics-legacy) of the project.

The tools and graphics are located in one central web application under the `display` folder. This web application uses Next.JS web technology, based off React. All frontend and backend of the application are located in the folder itself.

## Features
This repository currently contains the following features:
* [Event Overlay](https://github.com/duechayapolgmit/mccls-graphics/wiki/Event-Overlay) (`/overlay`) - displays overlay containing information about the current event. This includes the game number, point multiplier, logo of the game being played, top teams and their scores.
* [Voting Screen](https://github.com/duechayapolgmit/mccls-graphics/wiki/Voting-Screen) (`/voting`) - displays the voting screen, containing games that are up for voting in an event.
* [Teams Overview](https://github.com/duechayapolgmit/mccls-graphics/wiki/Teams-Overview) (`/teams`) - displays the teams overview screen, consisting of all teams and players in an event.
* [Player Cards](https://github.com/duechayapolgmit/mccls-graphics/wiki/Player-Cards) (`/player/card/[player_name]`) - displays player's name, avatar, amount of wins, and team colour they are in.
* Break Screens (`/break`) - displays details about the event and the roster, and other miscellaneous full-screen graphics, to be used as a breakfiller of a stream or displayed individually
* Countdown (`/countdown`) - a simple countdown to the event.
* Card Grid (`/card_grid`) - displays a simple grid with player cards, via the `roster` break screen
* MVP Results (`/mvp/[event/season]`) - displays the results of the top five MVPs of each MCC event and season (voted on MCC Live Show)

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
The user can then navigate to the application via `localhost:3000` address, which shows a control panel that sends GET requests to change the state data in some of the features of the `display` web application. Furthermore, users can access the above features by navigating through each route as stated above, e.g. `localhost:3000/overlay` for the event overlay.

All configurations and data files can also be adjusted. Each file's details can be accessed via going to the "General Configurations" wiki page.

## Resources
This repository uses the following resources:
* [Noxcrew - MC Championship](https://noxcrew.com/) - game logos, and team icons from MC Championship event. All of them can be found in the organiser's assets folder. Most of the game logos are modified to fit within the area in the overlay.
* [Metropolis Font](https://www.1001fonts.com/metropolis-font.html) - the main font used for the display application as well as in MCC Live Show
* [Minecrafter Font](https://www.dafont.com/minecrafter.font) - font used for the player cards, displaying the wins of each player

Profile pictures and player avatars are not provided in this repository. They can manually be inserted in `/display/public/player` folder, with `/profile` for profile pictures (1:1 ratio only) and `/avatar` for player avatars (500x450 size)
