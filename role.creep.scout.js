module.exports.__proto__ = require('role.creep')

module.exports.name = 'scout';
module.exports.bodyParts = [MOVE];
module.exports.states = {
    MOVING_TO_SOURCE : 0,
    PICK_UP_ENERGY : 1,
    TRANSFER_TO_TARGET : 2,
    DROP_TO_CONSTRUCTION_SITE : 3
};

module.exports.run = function(creep) {

    var spawn = Game.spawns['Master'];

    if (!spawn.memory.map[creep.room.name]) {
        var roomMap = {};

        roomMap.sources = [];

        creep.room.find(FIND_SOURCES).forEach(source => {
            roomMap.sources.push(source.id);
        });

        if (creep.room.controller) {
            roomMap.controller = creep.room.controller.id;
        } else {
            roomMap.controller = null;
        }
        

        spawn.memory.map[creep.room.name] = roomMap;
    }

    if (!creep.memory.destinationRoom || creep.memory.destinationRoom === creep.room.name) {


        var directions = [TOP, RIGHT, BOTTOM, LEFT];
        var direction = directions[Math.floor((Math.random() * 4) + 1) - 1];

        var exits = Game.map.describeExits(creep.room.name);

        while (!exits[direction]) {
            direction = directions[Math.floor((Math.random() * 4) + 1) - 1];
        }

        creep.memory.destinationRoom = exits[direction];
    }
    
    var target = new RoomPosition(25, 25, creep.memory.destinationRoom);

    creep.moveTo(target);
}

