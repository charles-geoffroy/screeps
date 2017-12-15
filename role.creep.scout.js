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

    if (!creep.memory.destinationRoom) {
        creep.memory.destinationRoom = Game.map.describeExits(creep.room.name)[RIGHT];
    }
    
    var target = new RoomPosition(25, 25, creep.memory.destinationRoom);

    creep.moveTo(target);
}

