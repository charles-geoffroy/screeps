module.exports.__proto__ = require('role.creep')

module.exports.name = 'harvester';
module.exports.bodyParts = [WORK,WORK,MOVE];
module.exports.states = {
    HARVEST_ENERGY : 0
};

module.exports.run = function(creep) {   

    creep.memory.state = this.states.HARVEST_ENERGY;

    this.assignSource(creep, creep.room);    
    var source = Game.getObjectById(this.getSourceId(creep));

    this.moveToHarvest(creep, source);

    if (this.hasReachedCarryCapacity(creep)) {
        creep.drop(RESOURCE_ENERGY);
    }    
}

