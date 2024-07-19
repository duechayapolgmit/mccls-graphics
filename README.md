<img src="MCCLS-Logo-Long-Condensed.png" height="50" width="auto"/>

This repository contains some of the mechanics and graphics used for [MCC Live Show](https://www.youtube.com/@mccliveshow_) in its live commentary streams. This currently makes use of HTML, CSS, JavaScript and Node.JS, to help accommodate the graphics and mechanics needed.

## Features
This repository currently contains the following features:
* Break screens - automatic break screen switching with a timer

## Usage
Currently, this repository is to be served manually via `npx serve`. The user can then navigate to each file necessary via `localhost:3000` address.
* To access the break screens, `localhost:3000/breakscreen` is used, optionally followed by:
  * `?time=[time]` - define the timer of [time] seconds
 
## Resources
This repository uses the following resources:
* [Noxcrew - MC Championship](https://noxcrew.com/) - game logos, screenshots, and sound effects from MC Championship event
* [Transition.css](https://www.transition.style/) - animations and transitions for break screens
