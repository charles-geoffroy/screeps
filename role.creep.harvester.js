module.exports.__proto__ = require('role.creep')

module.exports.name = 'harvester';
module.exports.bodyParts = [WORK,WORK,MOVE];
module.exports.states = {
    MOVING_TO_SOURCE : 0,
    HARVEST_ENERGY : 1
};

module.exports.run = function(creep) {   

    if (!creep.memory.state) {
        creep.memory.state = this.states.MOVING_TO_SOURCE;
    }

    this.assignSource(creep, creep.room);    
    var source = Game.getObjectById(this.getSourceId(creep));

    if (creep.memory.state === this.states.MOVING_TO_SOURCE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});

        if (creep.pos.isNearTo(source)) {
            creep.memory.state = this.states.HARVEST_ENERGY;
        }
    }

    if (creep.memory.state === this.states.HARVEST_ENERGY) {
        creep.harvest(source);

        if (this.hasReachedCarryCapacity(creep)) {
            creep.drop(RESOURCE_ENERGY);
        }
    }
}

