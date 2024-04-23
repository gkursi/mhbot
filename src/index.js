require('dotenv').config()
const mineflayer = require('mineflayer')
const XMLHttpRequest = require('xhr2');

// config
const relay = process.env.CHAT_RELAY
const logMode = process.env.LOG_MODE
const logRelay = process.env.LOG_RELAY
const debug = process.env.DEBUG == 'true'

// chat relay / logs
const discord_message = (webHookURL, message, username, server) => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", webHookURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    const cdate = new Date()
    xhr.send(JSON.stringify({
        'content': `${username}: ${message} (${cdate.getDate()}/${cdate.getMonth()}/${cdate.getFullYear()} ${cdate.getHours()}:${cdate.getMinutes()})`,
        'username':`${server}`,
    }));
}

const bot = mineflayer.createBot({
  host: 'minehut.gg', // minecraft server ip
  username: process.env.USERNAME, // real
  auth: 'microsoft'
})

const _log = (txt, ddebug=false) => {
  if(txt=="") return
  if(ddebug) {
    console.log(`[DEBUG] ${txt}`);
    return
  }
  switch (logMode) {
    case 'all':
      console.log(txt)
      if(bot) bot.chat(txt);      
      discord_message(logRelay, txt, "MinehutBot", "Logs")
      break;
    case 'webhook':
      discord_message(logRelay, txt, "MinehutBot", "Logs")
      break;
    case 'console':
      console.log(txt)
      break;
    case 'none':
      break
    default:
      console.log(txt)
      break;
  }
}
// load plugins
bot.loadPlugin(require('@nxg-org/mineflayer-custom-pvp/lib/index.js').default)
bot.loadPlugin(require('mineflayer-armor-manager'))
bot.loadPlugin(require('mineflayer-auto-eat').plugin)
bot.loadPlugin(require('mineflayer-pathfinder').pathfinder)
bot.loadPlugin(require('mineflayer-cmd').plugin)

bot.on('chat', (username, message) => {
  if (username === bot.username) return
  // _log(`${username}: ${message}`)
  if(relay) {
    discord_message(relay, message, username, "Chat Relay")
  }
})

bot.on("login", () => {_log("Logged in!")})
bot.on("game", () => {
  _log(debug ? "World loaded!" : "", true)
})

// Log errors and kick reasons:
bot.on('kicked', _log)
bot.on('error', _log)
