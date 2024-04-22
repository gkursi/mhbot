// Todo: implement
// bot.loadPlugin(require('mineflayer-pvp').plugin)
// bot.loadPlugin(require('mineflayer-armor-manager'))
// bot.loadPlugin(require('mineflayer-auto-eat').plugin)
// bot.loadPlugin(require('mineflayer-pathfinder').pathfinder)

const mineflayer = require('mineflayer')
const relay = process.env.CHAT_RELAY
const XMLHttpRequest = require('xhr2');

function discord_message(webHookURL, message, username, server) {
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


bot.on('chat', (username, message) => {
  if (username === bot.username) return
  console.log(`${username}: ${message}`)
  if(relay) {
    discord_message(relay, message, username, "Chat Relay")
  }
})

// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)