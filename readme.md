# MinehutBot
Minehut bot made to automatically play a server. (WIP)

### Features:
- Chat relay

### Feature todo:
- Automatically detect server type
- Automatically gather resources based on server type
- Auto server discovery (via minehut api)
- Box server support
- Auto raid
- Multiple instance easier management (web ui?)


### WIP (work in progress) features:
- Commands
- PvP


### Using the bot
#### Installation
0. Requirements: NodeJs, NPM
1. Clone / Download this repo
2. Run `installer.cmd` if you are on Windows, `installer.sh` if you are on Linux
#### Usage
3. To run the bot, in the repo directory
    - (Windows) open Powershell, type `$env:USERNAME='PUT MICROSOFT EMAIL HERE';` and press enter. Then type `node .` and press enter. 
    - (Linux) open a terminal of choice, type `USERNAME="PUT MICROSOFT EMAIL HERE" node .`
4. The bot should now be running.
#### Configuring
5. There are 2 main things you might want to change
    - Minecraft account email
    - Chat relay webhook url \
5.1. The account email can be changed by setting the env variable "USERNAME". \
5.2. The chat relay url can be changed by setting the env variable "CHAT_RELAY". \
5.3. You can view all config values **[here](./wiki/config.md)**
6. To avoid setting the variables each time manually, we can create a `.env` file and change all values there.
6.1 Example file: \
**.env**
    ```env
    USERAME="john.doe@gmail.com"
    CHAT_RELAY="https://discord.com/api/webhooks/696969696/aaaaaaaaaaaaaaaaa/"
    ```
    This file must be located in the root of the repo's directory.

## Credit
- installer.sh + idea - [meinbot](https://github.com/Meindo/meinbot)
- PvP library - [mineflayer-custom-pvp](https://github.com/nxg-org/mineflayer-custom-pvp/)