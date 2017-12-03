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

module.exports.hasReachedCarryCapacity = function(creep) {
    return creep.carry.energy === creep.carryCapacity;
}