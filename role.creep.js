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

    var randomSource = roomSources[Math.floor((Math.random() * roomSources.length) + 1) - 1];

    return randomSource.id;
}

module.exports.assignSource = function(creep, room) {
    if (!this.hasSource(creep)) {
        creep.memory.sourceId = this.findSource(creep, room);
    }
}

module.exports.hasReachedCarryCapacity = function(creep) {
    return creep.carry.energy === creep.carryCapacity;
}