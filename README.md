<img src="MCCLS-Logo-Long-Condensed.png" height="50" width="auto"/>

This repository contains some of the graphics and other tools used for [MCC Live Show](https://www.youtube.com/@mccliveshow_) in its live commentary streams and development. This is a recoding of the earlier [legacy version](https://github.com/duechayapolgmit/mccls-graphics-legacy) of the project.

There is currently one main tool that has been developed for the live show:
* `display` = contains a Next.JS web application, displaying all graphics associated with the live commentary streams.

Each tool is located in its own separate folders.

## Features
This repository currently contains the following features:
* [Event Overlay](https://github.com/duechayapolgmit/mccls-graphics/wiki/Event-Overlay) - displays overlay containing information about the current event. This includes the game number, point multiplier, logo of the game being played, top teams and their scores.
* [Voting Screen](https://github.com/duechayapolgmit/mccls-graphics/wiki/Voting-Screen) - displays the voting screen, containing games that are up for voting in an event.

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
* `localhost:3000/overlay` - displays the event overlay
* `localhost:3000/voting` - displays the voting screen

### General Configurations
The application can also be configured via its YAML file (`config/general.yaml`)
* `colours` - determines the colour scheme of the graphics and overlay. `primary` for brighter colour and `secondary` for darker colour.
  * `secondary` is currently being used for the overlay.
All other configuration details are located in each functionality's wiki page.

## Resources
This repository uses the following resources:
* [Noxcrew - MC Championship](https://noxcrew.com/) - game logos, and team icons from MC Championship event. All of them can be found in the organiser's assets folder. Most of the game logos are modified to fit within the area in the overlay.
* [Metropolis Font](https://www.1001fonts.com/metropolis-font.html) - the main font used for the display application as well as in MCC Live Show

Profile pictures and player avatars are not provided in this repository. They can manually be inserted in `/display/public/player` folder, with `/profile` for profile pictures (1:1 ratio only) and `/avatar` for player avatars (500x450 size)