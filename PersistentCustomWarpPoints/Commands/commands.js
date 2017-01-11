// Yes, this is it. This is all you need for a minimal package.
console.log('Persistent Custom Waypoints V1.');

'use strict';
const utility = require('../../freeroam/gm/utility');
const fs = require('fs');

module.exports = ({ Command, manager }) => {
    console.log('commands.js executed')
    
    const markers = new Map();
    
    var locations = JSON.parse(fs.readFileSync("./packages/PersistentCustomWarpPoints/locations.json"));
    console.log(locations);
    locations.forEach(loc => {
        position = new Vector3f(loc.position.x, loc.position.y, loc.position.z)
        poi = new POI(20, new Vector3f(loc.position.x, loc.position.y, loc.position.z), `${loc.command} (/warp ${loc.command})`);
        console.log(position);
        console.log(poi);
        poi.minDistance = 10.0;
        poi.maxDistance = 100000.0;
        poi.clampedToScreen = false;
        markers.set(loc.command, poi);
    });

    manager.category('warp', 'warp commands')
      .add(new Command('setwarp')
      .description('creates a permanent warp point that allows other people to teleport there.')
      .parameter('name', 'string', 'warp name', { isTextParameter: true })
      .handler((player, name) => {
          if (markers.has(name)) {
              customWarp.chat.send(player, 'A Warp Point with that name already exists.', customWarp.config.colours.red);
              return;
          }

          const poi = new POI(20, player.position, `Server Waypoint "${name}" (/warp ${name})`);
          customWarp.chat.send(player, `Warp Point '${name}' created.`, customWarp.config.colours.green);
          customWarp.chat.broadcast(`${player.escapedNametagName} created Server Warp Point '${name}'. Use /warp ${name} to get there!`, customWarp.config.colours.orange);
          poi.minDistance = 10.0;
          poi.maxDistance = 100000.0;
          poi.clampedToScreen = false;
          markers.set(name, poi);
          saveMarkers(markers);
      }))

    .add(new Command(['warp', 'wp'])
      .parameter('name', 'string', 'warps to a waypoint')
      .description('teleports you to a map marker', { isTextParameter: true })
      .handler((player, name) => {
          if (!markers.has(name)) {
              customWarp.chat.send(player, 'This marker does not exist.', customWarp.config.colours.red);
              return;
          }

          customWarp.chat.send(player, `Warping you to Waypoint '${name}'`, customWarp.config.colours.green);
          player.position = markers.get(name).position;
      }))
}

function saveMarkers(markers){
    var saveableMarkers = [];
    markers.forEach(marker => {
        var saveableMarker = {};
        saveableMarker.position = {};
        saveableMarker.position.x = marker.position.x;
        saveableMarker.position.y = marker.position.y;
        saveableMarker.position.z = marker.position.z;
        saveableMarker.name = marker.command;
        saveableMarkers.push(saveableMarker);
    });
    fs.writeFile("./packages/PersistentCustomWarpPoints/locations.json", JSON.stringify(saveableMarkers, null, 2));
}

