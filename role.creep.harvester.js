module.exports.__proto__ = require('role.creep')

module.exports.name = 'harvester';
module.exports.bodyParts = [WORK,WORK,CARRY,MOVE];

module.exports.run = function(creep) {   

    if (creep.carry.energy < creep.carryCapacity) {
        this.assignSource(creep, creep.room);

        var source = Game.getObjectById(this.getSourceId(creep));

        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
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
    }
}

