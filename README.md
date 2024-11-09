# Star Citizen Keybind Explorer

This tool provides an improved interface to explore available keybindings in Star Citizen.

Available at https://star-citizen-keybind-explorer.pages.dev

The core features are:

- A search bar where commands can be searched by name
- It shows the default keybindings in the game (if they are set) for each command
- It allows the user to upload his .xml exported profile from the game and see how commands have been rebinded
- It provides filters to show/hide commands depending on what is binded on a particular device (keyboard, joystick, mouse or gamepad)

## How to update keybindings after a Star Citizen update

The file `actions.json` contains a processed list of keybinds that have been extracted from the game installation files.

This file can be regenerated when a Star Citizen version may add new keybindings or change default keybinds.

To do so, the steps to follow are:

- Download the [unp4k utility](https://github.com/dolkensp/unp4k)
- Use it to extract from the installation folder two files and place them into the `src/sc-data` folder:
  - `defaultProfile.xml` located in `Data/Libs/Config`. This contains the list of keybinds in the game and their default value.
  - `global.ini` located in `Data/Localization/english`. This contains the english localization of the keybinds.
- Run the Node script `processSCData.js` located in `src/sc-data` (eg. `node processSCData.js`)
- The `actions.json` file should now be updated

## Libraries

- React https://github.com/facebook/react
- Shadcn - UI Toolkit https://ui.shadcn.com
- Vite - Frontend Tooling https://github.com/vitejs/vite
- Unp4k - Star Citizen Data Extraction Tool https://github.com/dolkensp/unp4k

## Disclaimer

I created this tool as a fun project to learn React and make something that may be useful to the Star Citizen community.

It does not follow best practices for clean code and I should probably refactor stuff and give better names to things.
