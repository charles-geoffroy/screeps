module.exports.__proto__ = require('role.creep')

module.exports.name = 'repairer';
module.exports.bodyParts = [CARRY,CARRY,MOVE,MOVE,WORK];
module.exports.states = {
    MOVING_TO_SOURCE : 0,
    PICK_UP_ENERGY : 1,
    REPAIRING : 2
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
            } else if (creep.pos.inRangeTo(droppedResource, 3)) {
                creep.moveTo(droppedResource);
                break;
            }
        }

        if (this.hasReachedCarryCapacity(creep)) {
            creep.memory.state = this.states.REPAIRING;
        }
    }

    if (creep.memory.state === this.states.REPAIRING) {
        
        if (creep.carry.energy == 0) {
            this.clearTarget(creep);
            creep.memory.state = this.states.MOVING_TO_SOURCE;
            return;
        }

        this.assignTarget(creep, creep.room, this.findStructureToRepair);

        if (this.hasTarget(creep)) {
            var target = this.getTarget(creep);

            if (target.hits < target.hitsMax) {
                this.moveToRepair(creep, target);
            } else {
                this.clearTarget(creep);
            }

        }
    }
}

