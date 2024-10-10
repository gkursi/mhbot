class CommandManager {

    constructor(bot, users, admins, owners) {
        this.bot = bot 
        this.commands = []
        this.commandNames = []
        this.commandLevels = []
        this.users = users
        this.admins = admins
        this.owners = owners
    }

    register(exec, name, level) {
        this.commands.push(exec)
        this.commandNames.push(name)
        this.commandLevels.push(level)
    }

    run(commandName, executorUsername) {
        let success = false;
        let validCommand = false;
        let ret = ""
        this.commandNames.forEach((value, index, array) => {
            if(value.toLowerCase() == commandName.toLowerCase()) {
                if(this.hasPermissionLevel(executorUsername, this.commandLevels[index])) {
                    this.commands[index](this.bot, executorUsername);
                    success = true;
                } else {
                    validCommand = true;
                    ret =  "No permission. (command requires lvl " + this.commandLevels[index] + " or higher)"
                }
            }
        })
        if(success) return ""
        else if(validCommand) return ret
        else return "Invalid command."
        
    }

    isStrInArray(str, array) {
        let is = false;
        array.forEach(element => {
            if(str == element) is = true;    
        });
        return is;
    }

    hasPermissionLevel(username, level) {
        let ownerL = 3
        let adminL = 2
        let userL = 1
        let allL = 0
        let usernameL = -1
        if(this.isStrInArray(username, this.owners)) usernameL = ownerL
        else if(this.isStrInArray(username, this.admins)) usernameL = adminL
        else if(this.isStrInArray(username, this.users)) usernameL = userL
        else usernameL = allL;

        return usernameL >= level;
    }
}
module.exports = CommandManager
