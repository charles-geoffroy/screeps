module.exports.__proto__ = require('role.creep')

module.exports.name = 'builder';
module.exports.bodyParts = [CARRY,MOVE,WORK,WORK];
module.exports.states = {
    MOVE_TO_TION_SITE : 0,
    PICK_UP_ENERGY : 1,
    BUILDING : 2,
    IDLE : 3
};

module.exports.run = function(creep) {

    this.assignTarget(creep, creep.room, this.findtionTarget);

    if (this.hasTarget(creep)) {
        var target = this.getTarget(creep);

        if (target.progress == target.progressTotal) {
            this.clearTarget(creep);
            creep.memory.state = this.states.IDLE;
            return;
        }

        creep.memory.state = this.states.PICK_UP_ENERGY;
    }

    if (creep.memory.state === this.states.PICK_UP_ENERGY) {

        if (this.hasReachedCarryCapacity(creep)) {
            creep.memory.state = this.states.BUILDING;
            return;
        }

        var droppedResources = creep.room.lookForAtArea(LOOK_ENERGY,  target.pos.y - 1, target.pos.x - 1, target.pos.y + 1, target.pos.x + 1, true);

        if (droppedResources > 0) {
            creep.moveTo(droppedResources[0].x, droppedResources[0].y);

            if (creep.pos.x == droppedResources[0].x && creep.pos.y == droppedResources[0].y) {
                creep.pickup(); // MEH!
            }

            this.moveToPickup(creep, droppedResources[0]);
        } else {
            creep.memory.state = this.states.BUILDING;
        }     
    }

    if (creep.memory.state === this.states.BUILDING) {

        if (this.hasEnergy(creep)) {
            this.moveToBuild(creep, creep.memory.target);
        } else {
            creep.memory.state = this.states.PICK_UP_ENERGY;
        }
    }
}