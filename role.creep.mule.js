module.exports.__proto__ = require('role.creep')

module.exports.name = 'mule';
module.exports.bodyParts = [CARRY,CARRY,MOVE,MOVE];
module.exports.states = {
    MOVING_TO_SOURCE : 0,
    PICK_UP_ENERGY : 1,
    TRANSFER_TO_TARGET : 2
};

module.exports.run = function(creep) {

    if (!creep.memory.state) {
        creep.memory.state = this.states.MOVING_TO_SOURCE;
    }

    if (creep.memory.state === this.states.MOVING_TO_SOURCE) {        
        this.assignSource(creep, creep.room);

        var source = Game.getObjectById(this.getSourceId(creep));

        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});

        if (creep.pos.isNearTo(source)) {
            creep.memory.state = this.states.PICK_UP_ENERGY;
        }
    }

    if (creep.memory.state === this.states.PICK_UP_ENERGY) {
        var droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
        
        for (var i = 0; i < droppedResources.length; i++) {
            var droppedResource = droppedResources[i];

            if (creep.pos.isNearTo(droppedResource)) {
                creep.pickup(droppedResource);
                break;
            } else if (creep.pos.isRangeTo(droppedResource, 3)) {
                creep.moveTo(droppedResource);
                break;
            }
        }

        if (this.hasReachedCarryCapacity(creep)) {
            creep.memory.state = this.states.TRANSFER_TO_TARGET;
        }
    }

    if (creep.memory.state === this.states.TRANSFER_TO_TARGET) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
        if(targets.length > 0) {
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }

        if (creep.carry.energy == 0) {
            creep.memory.state = this.states.MOVING_TO_SOURCE;
        }
    }
}

