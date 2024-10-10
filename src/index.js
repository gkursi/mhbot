require('dotenv').config()
const mineflayer = require('mineflayer')
const XMLHttpRequest = require('xhr2');
const CommandManager = require('./bot/commands');
const blessed = require('blessed');
const { goals } = require('mineflayer-pathfinder');

// config
const relay = process.env.CHAT_RELAY
const logMode = process.env.LOG_MODE
const logRelay = process.env.LOG_RELAY
const debug = process.env.DEBUG == 'true'
const server = process.env.SERVER
const port = "24934"
const command = process.env.COMMAND

// vars
let spawned = false;
let COMMANDS;
let gbox = undefined;
let gscreen = undefined;
let maxLines = 0;
let lines = ["", "", ""]

if(server == undefined) {
  server = "minehut.gg"
}

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

const _log = (txt, ddebug=false) => {
  if(txt=="") return
  if(ddebug) {
    if(debug) console.log(`[DEBUG] ${txt}`);
    return
  }
  switch (logMode) {
    case 'all':
      if(gbox != undefined) {
        maxLines = gbox.height;
        lines.unshift(txt)
        lines.forEach((value, index, a) => {
          if(index >= maxLines) return;
          gbox.setLine(index, value)
        })
        gscreen.render()
      } else {
        console.log(txt)
      }
      // if(bot) bot.chat(txt);      
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

if(debug) {
  _log(`relay:${relay}`)
  _log(`logRelay:${logRelay}`)
  _log(`logMode:${logMode}`)
  _log(`debug:${debug}`)
  _log(`server:${server}`)
  _log(`port:${port}`)
}

const run = (botName) => {
  const bot = mineflayer.createBot({
    host: server, // minecraft server ip
    username: botName, // real
    auth: 'offline',
    port: Number.parseInt(port)
  })
  
  COMMANDS = new CommandManager(bot, [""], ["Angel0fInfinity", "WizardV10"], ["ItsBookxYT"])
  
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
    // _log(debug ? "World loaded!" : "", true)
  })
  
  // Log errors and kick reasons:
  bot.on('kicked', (reason, loggedIn) => {
    _log(`Got kicked because of ${reason}!`)
    _log(`Reconnecting in 5s`)
    spawned = false;
    setTimeout(() => run(), 5000)
  })
  bot.on('error', (err) => {
    gbox.setContent('{right}Bot {red-fg}crashed{/red-fg}!!!{/right}\n');
  })

  bot.once("spawn", () => {
    bot.addChatPattern("allChat", /(.*?)/, { parse: false, repeat: true })
  })

  bot.on("spawn", () => {
      _log("Spawned in!")
      if(command != undefined && !spawned) { 
        bot.chat(command);
        // bot.autoEat.enable();
      }
      spawned = true;
  })

  bot.on("death", () => {
    _log("I was killed!")
  })

  bot.on("playerJoined", (player) => {
    _log("[+] " + player.username)
  })

  bot.on("playerLeft", (player) => {
    _log("[-] " + player.username)
  })

  bot.on("allChat", (ch) => {
    _log(ch)
  })


  COMMANDS.register((bt, username) => {
      _log("Test works!")
  }, "test", 3)

  COMMANDS.register((bt, username) => {
    _log("Toggled auto eat")
    if(bot.autoEat.disabled) bot.autoEat.enable()
    else bot.autoEat.disable()
  }, "toggleEat", 2)

  COMMANDS.register((bt, username) => {
    const target = bot.players[username] ? bot.players[username].entity : null
    if(target == null) {
      bot.chat("I can\'t see you!")
    } else {
      const p = target.position

      bot.pathfinder.setMovements(defaultMove)
      bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1))
    }
  }, "come", 1)

  COMMANDS.register((bt, username) => {
    let msg = "commands: "
    COMMANDS.commandNames.forEach(element => {
      msg += element + ", "
    });
  }, "help", 0)


}

const createUI = () => {
  // Create a screen object.
  var screen = blessed.screen({
    smartCSR: true
  });

  screen.title = 'my window title';

  // Create a box perfectly centered horizontally and vertically.
  var box = blessed.box({
    top: 'center',
    left: 'center',
    width: '50%',
    height: '50%',
    content: 'Hello {bold}world{/bold}!',
    tags: true,
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      bg: 'magenta',
      border: {
        fg: '#f0f0f0'
      },
      hover: {
        bg: 'green'
      }
    }
  });

  // Append our box to the screen.
  screen.append(box);

  // If box is focused, handle `enter`/`return` and give us some more content.
  box.setContent('{right}Bot {green-fg}running{/green-fg}!{/right}\n');
  gscreen = screen
  gbox = box

  // Quit on Escape, q, or Control-C.
  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  // Focus our element.
  box.focus();

  // Render the screen.
  screen.render();
}

createUI();
for(let i = 0; i < 10; i++) {
  setTimeout(() => run("bott" + i), 3000 * i)
}