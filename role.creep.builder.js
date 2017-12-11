module.exports.__proto__ = require('role.creep')

module.exports.name = 'builder';
module.exports.bodyParts = [CARRY,MOVE,WORK,WORK];
module.exports.states = {
    PICK_UP_ENERGY : 0,
    HARVEST_ENERGY : 1,
    BUILDING : 2,
    REPAIRING : 3
};

module.exports.run = function(creep) {
    
    if (!creep.memory.state) {
        creep.memory.state = this.states.PICK_UP_ENERGY;
    }

    this.assignSource(creep, creep.room);    
    var source = Game.getObjectById(this.getSourceId(creep));

    var constructionTarget = creep.memory.constructionTarget;

    if (constructionTarget.progress == constructionTarget.progressTotal) {
        constructionTarget = null;
    }

    if (!constructionTarget) {
        constructionTarget = this.findConstructionTarget(creep, creep.room);
    }

    creep.memory.constructionTarget = constructionTarget;





    if (creep.memory.state === this.states.PICK_UP_ENERGY) {

        if (!constructionTarget) {
            creep.memory.state = this.states.HARVEST_ENERGY;
        }

        if (this.hasReachedCarryCapacity(creep)) {
            creep.memory.state = this.states.BUILDING;
        }

        var droppedResources = creep.room.lookAt(constructionTarget.pos, LOOK_ENERGY);

        if (droppedResources > 0) {
            this.moveToPickup(creep, droppedResources[0]);
        } else {
            creep.memory.state = this.states.HARVEST_ENERGY;
        }        
    }

    if (creep.memory.state === this.states.HARVEST_ENERGY) {
        this.moveToHarvest(creep, source);

        if (this.hasReachedCarryCapacity(creep)) {
            creep.memory.state = this.states.BUILDING;
        }
    }

    if (creep.memory.state === this.states.BUILDING) {
        if (!creep.memory.constructionTarget) {
            creep.memory.state = this.states.REPAIRING;
            return;
        }

        if (this.hasEnergy(creep)) {
            this.moveToBuild(creep, creep.memory.constructionTarget);
        } else {
            creep.memory.state = this.states.PICK_UP_ENERGY;
        }
    }

    if (creep.memory.state === this.states.REPAIRING) {
        if (creep.memory.constructionTarget) {
            creep.memory.state = this.states.BUILDING;
            return;
        }

        // Actual repair stuff here...
    }

}