<img src="MCCLS-Logo-Long-Condensed.png" height="50" width="auto"/>

This repository contains some of the graphics and other tools used for [MCC Live Show](https://www.youtube.com/@mccliveshow_) in its live commentary streams and development. This is a recoding of the earlier [legacy version](https://github.com/duechayapolgmit/mccls-graphics-legacy) of the project.

There is currently one main tool that has been developed for the live show:
* `display` = contains a Next.JS web application, displaying all graphics associated with the live commentary streams.

Each tool is located in its own separate folders.

## Features
This repository currently contains the following features:
* Event Overlay - displays overlay containing information about the current event. This includes the game number, point multiplier, logo of the game being played, top 2 teams and Dodgebolt scores. All of which are related to the MC Championship event.

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
The user can then navigate to the application via `localhost:3000` address, which shows a very temporary (containing only a `hi` message) landing page. They can go to each of the following route to display each of the graphics component:
* `localhost:3000/overlay` - displays the event overlay

The overlay can be changed via sending GET requests can be sent via the applications API endpoint (`localhost:3000/api/overlay`) with the attached queries affecting the event overlay. 
Note that this is done due to Streamdeck's limitation of only being able to send GET requests:
* `?gameNo` - changes the game number, either `increase` to increase the count, `reset` to reset the count back to 1, or any number from 1-8.
  * Setting the number to 9 or above will make the "header" displays "FINAL DUEL" instead.
  * Setting the number between 1-8 will also trigger the process of selecting its respective point multiplier to be displayedd. Each game number and its respective point multiplier can be found in `data/game_multipliers.json`.
  * Invalid game numbers will display "x1.0" as the multiplier.
* `?game` - changes the game logo to be displayed. All event logos and their respective keys can be found in `data/game_logos.json`.
  * Invalid game key will display the default logo of MCC Live Show.
* `?place` - changes information about the team in the place specified, e.g. `place=1` for first place. Placements must be in the range between 1 and the number specified in the configuration file (`config/overlay.yaml`) This is to be used in conjunction with one of the following queries:
  * `&placeName` - changes the name and icon of the team in specified place. All team labels and their respective keys can be found in `data/team_info.json`. Invalid team key will display nothing.
  * `&placeScore` - changes the score of the team in specified place, either `increase` to increase the score by 1 or the points themselves. Default is `-1` to display the logo.
* `?dodgebolt` - changes the "play" icons to display points in the finale instead, if the value is `true`.
* `?status` - triggers the display of the status portion of the overlay (header and game logo) either `show` to show the status portion or `hide` to hide the status portion. Animations will be played if the request is sent when the overlay is still active.
* `?placements` - triggers the display of the placements portion of the overlay (top 2 teams) either `show` to show the placements portion  or `hide` to hide the placements portion. Animations will be played if the request is sent when the overlay is still active.
* `?reset` - when value is `true`, reset all the values of each component of the overlay to its default. The default values can be found in `state/defaults/overlay.json`

The overlay can also be configured via its YAML file (`config/general.yaml`)
* `colours` - determines the colour scheme of the graphics and overlay. `primary` for brighter colour and `secondary` for darker colour.
  * `secondary` is currently being used for the overlay.
* `overlay` - configuration details for the overlay.
  * `placements` - the amount of placements to be shown
 
## Resources
This repository uses the following resources:
* [Noxcrew - MC Championship](https://noxcrew.com/) - game logos, and team icons from MC Championship event. All of them can be found in the organiser's assets folder. Most of the game logos are modified to fit within the area in the overlay.
