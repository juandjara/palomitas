# Palomitas

## Archive note
This project is no longer being supported or worked on. The sources used for fetching data for the project are no longer available so this project is being archived.

## Running source

To start a live server that reloads on file changes run `npm start`

To bundle the project for production run `npm run`

To see other available scripts check the `scripts` field on `package.json`

## Services

This project uses the following services
* https://palomitas-dl.fuken.xyz/
* https://subdown.fuken.xyz/
* Popcorn Time API (not mantained or developed by me)

## Deployment

Deployment is set to automatically detect git pushes to the `master` branch.
It run the `build` command and deploys the minified assets to https://now.sh
