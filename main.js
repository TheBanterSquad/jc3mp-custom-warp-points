
global.customWarp = {
    commands: jcmp.events.Call('get_command_manager')[0],
    chat: jcmp.events.Call('get_chat')[0],
    colours: require('../freeroam/vendor/randomColor'),
    config: require('../freeroam/gm/config')
};
console.log("Custom Warp Points Loaded");
customWarp.commands.loadFromDirectory(`${__dirname}/commands`, (f, ...a) 
=> require(f)(...a));
setInterval(() => { }, 500);
