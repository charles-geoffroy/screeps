// SOURCE

module.exports.hasSource = function(creep) {
    return this.getSourceId(creep) != null;
}

module.exports.getSourceId = function(creep) {
    if (creep.memory.sourceId) {
        return creep.memory.sourceId;
    }
    return null;
}

module.exports.findSource = function(creep, room) {
    var roomSources = room.find(FIND_SOURCES_ACTIVE);

    if (roomSources.length == 0) {
        return null;
    } 
    
    if (roomSources.length == 1) {
        return roomSources[0].id
    }

    var assignedSource = null;
    var assignedSourceCreepCount = 0;
    var otherCreeps = _.filter(Game.creeps, (c) => c.memory.role == creep.memory.role);
    var self = this;

    roomSources.forEach(function(source) {
        var sourceCreepCount = _.filter(otherCreeps, (c) => self.getSourceId(c) == source.id).length;

        if (assignedSource == null || sourceCreepCount < assignedSourceCreepCount) {
            assignedSource = source;
            assignedSourceCreepCount = sourceCreepCount;
        }
    });

    return assignedSource.id;
}

module.exports.assignSource = function(creep, room) {
    if (!this.hasSource(creep)) {
        creep.memory.sourceId = this.findSource(creep, room);
    }
}

// TARGET

module.exports.hasTarget = function(creep) {
    return this.getTargetId(creep) != null;
}

module.exports.getTargetId = function(creep) {
    if (creep.memory.targetId) {
        return creep.memory.targetId;
    }
    return null;
}

module.exports.getTarget = function(creep) {
    if (this.hasTarget(creep)) {
        return Game.getObjectById(this.getTargetId(creep));;
    }
    return null;
}


module.exports.assignTarget = function(creep, room, findCallback) {
    if (!this.hasTarget(creep)) {
        creep.memory.targetId = findCallback(creep, room);
    }
}

module.exports.clearTarget = function(creep) {
    creep.memory.targetId = null;
}

module.exports.findStructureToTransferEnergy = function(creep, room) {
    var transferTargets = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });

    return transferTargets.length > 0 ? transferTargets[0].id : null;
}

module.exports.findStructureToRepair = function(creep, room) {
    var repairTargets = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.hits < structure.hitsMax;
        }
    });

    return repairTargets.length > 0 ? repairTargets[0].id : null;
}

// OTHER

module.exports.findConstructionTarget = function(creep, room) {
    var constructionTargets = room.find(FIND_CONSTRUCTION_SITES);

    return constructionTargets.length > 0 ? constructionTargets[0].id : null;
}



module.exports.findRepairTarget = function(creep, room) {
    var repairTargets = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.hits < structure.hitsMax;
        }
    });

    return repairTargets.length > 0 ? repairTargets[0] : null;
}

module.exports.hasEnergy = function(creep) {
    return creep.carry.energy > 0;
}

module.exports.hasReachedCarryCapacity = function(creep) {
    return creep.carry.energy === creep.carryCapacity;
}

module.exports.moveToHarvest = function(creep, target) {
    if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
    }
}

module.exports.moveToTransfer = function(creep, target, resourceType) {
    if(creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
    }
}

module.exports.moveToRepair = function(creep, target) {
    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
    }
}

module.exports.moveToBuild = function(creep, target) {
    if(creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
    }
}

module.exports.moveToPickup = function(creep, target) {
    if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
    }
}

module.exports.moveToDrop = function(creep, target, range) {
    if (creep.pos.inRangeTo(target, range)) {
        creep.drop(RESOURCE_ENERGY);
    } else {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
    }
}

