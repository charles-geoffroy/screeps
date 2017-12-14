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

    this.assignTarget(creep, creep.room, this.findConstructionTarget);

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
        if (droppedResources.length > 0) {
            var droppedResourcePos = new RoomPosition(droppedResources[0].x, droppedResources[0].y, creep.room.name);

            var pickupTargets = creep.room.find(FIND_DROPPED_RESOURCES);
            pickupTargets =_.filter(pickupTargets, (pt) => pt.pos.x == droppedResourcePos.x && pt.pos.y == droppedResourcePos.y);

            if (pickupTargets.length > 0) {
                this.moveToPickup(creep, pickupTargets[0]);
            } else {
                creep.memory.state = this.states.BUILDING;
            }
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