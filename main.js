var roleHarvester = require('role.creep.harvester');
var roleUpgrader = require('role.creep.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    
    var roleControl = {};
    roleControl['harvester'] = 4;
    roleControl['upgrader'] = 6;
    roleControl['builder'] = 2;
    
    var roles = {};
    roles['harvester'] = roleHarvester;
    roles['upgrader'] = roleUpgrader;
    roles['builder'] = roleBuilder;
    
    var mainSpawn = Game.spawns['Master'];
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    if (mainSpawn.spawning == null) {
        
        for (var roleName in roleControl) {
            
            var creepsWithRole = _.filter(Game.creeps, (creep) => creep.memory.role == roleName);
            var requiredQuantity = roleControl[roleName];
           
           //console.log('Found ' + creepsWithRole.length + ' ' + roleName + '. Requires ' + requiredQuantity + '.');
       
           if (creepsWithRole.length < requiredQuantity) {
               var role = roles[roleName];
               var creepName = roleName + Game.time;
               
               
               if (mainSpawn.spawnCreep(role.bodyParts, creepName, {memory: {role: roleName}}) == OK) {
                    console.log('Spawning new ' + roleName + ': ' + creepName);
                    
                    break;
               } else {
                   //console.log('Could not spawn...');
                   break;
               }
           }
        }
    }

    if(mainSpawn.spawning) {
        var spawningCreep = Game.creeps[mainSpawn.spawning.name];
        mainSpawn.room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            mainSpawn.pos.x + 1,
            mainSpawn.pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == roleHarvester.name) {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == roleUpgrader.name) {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
