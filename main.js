var roleHarvester = require('role.creep.harvester');
var roleUpgrader = require('role.creep.upgrader');
var roleMule = require('role.creep.mule');
var roleBuilder = require('role.creep.builder');
var roleRepairer = require('role.creep.repairer');
var roleScout = require('role.creep.scout');

module.exports.loop = function () {
    
    var roleControl = {};
    roleControl['harvester'] = 2;
    roleControl['mule'] = 4;
    roleControl['upgrader'] = 6;
    roleControl['builder'] = 3;
    roleControl['repairer'] = 1;
    roleControl['scout'] = 1;
    
    var roles = {};
    roles['harvester'] = roleHarvester;
    roles['mule'] = roleMule;
    roles['upgrader'] = roleUpgrader;
    roles['builder'] = roleBuilder;
    roles['builder'] = roleBuilder;
    roles['repairer'] = roleRepairer;
    roles['scout'] = roleScout;
    
    var spawn = Game.spawns['Master'];
    var room = spawn.room;
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    if (spawn.spawning == null) {
        
        for (var roleName in roleControl) {
            
            var creepsWithRole = _.filter(Game.creeps, (creep) => creep.memory.role == roleName);
            var requiredQuantity = roleControl[roleName];
           
           //console.log('Found ' + creepsWithRole.length + ' ' + roleName + '. Requires ' + requiredQuantity + '.');
       
           if (creepsWithRole.length < requiredQuantity) {
               var role = roles[roleName];
               var creepName = roleName + Game.time;
               
               
               if (spawn.spawnCreep(role.bodyParts, creepName, {memory: {role: roleName}}) == OK) {
                    console.log('Spawning new ' + roleName + ': ' + creepName);
                    
                    break;
               } else {
                   //console.log('Could not spawn...');
                   break;
               }
           }
        }
    }

    if(spawn.spawning) {
        var spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text(
            'ðŸ› ï¸' + spawningCreep.memory.role,
            spawn.pos.x + 1,
            spawn.pos.y,
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
        if (creep.memory.role == roleMule.name) {
            roleMule.run(creep);
        }
        if(creep.memory.role == roleBuilder.name) {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == roleRepairer.name) {
            roleRepairer.run(creep);
        }
        if(creep.memory.role == roleScout.name) {
            roleScout.run(creep);
        }
    }

    if (!spawn.memory.nextExtensionPos) {
        spawn.memory.nextExtensionPos = spawn.pos;
        spawn.memory.nextExtensionPos.x -= 1;
    }    

    if(!room.memory.roads) {
        var routePath = [];
        var spawnToControllerRoute = PathFinder.search(spawn.pos, room.controller.pos);    

        routePath = routePath.concat(spawnToControllerRoute.path);

        var goals = [];
        goals.push(room.controller.pos);

        var sources = room.find(FIND_SOURCES_ACTIVE);
        sources.forEach(function(source) {
            var spawnToSourceRoute = PathFinder.search(spawn.pos, source.pos);
            routePath = routePath.concat(spawnToSourceRoute.path);

            var controllerToSourceRoute = PathFinder.search(room.controller.pos, source.pos);
            routePath = routePath.concat(controllerToSourceRoute.path);
        });

        room.memory.roads = {};
        room.memory.roads.path = routePath;
        room.memory.roads.nextConstructionPathIdx = 0;   
    }

    var constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);    
    var roadConstructionSite = _.filter(constructionSites, (cs) => cs.structureType == STRUCTURE_ROAD);

    if (roadConstructionSite.length == 0) {
        var roomConstructionSitePos = room.memory.roads.path[room.memory.roads.nextConstructionPathIdx];

        if (roomConstructionSitePos) {
            var constructionSiteResult = room.createConstructionSite(roomConstructionSitePos.x, roomConstructionSitePos.y, STRUCTURE_ROAD);

            if (constructionSiteResult == OK) {
                console.log('Create new road at (' + roomConstructionSitePos.x + ',' + roomConstructionSitePos.y + ')');
                room.memory.roads.nextConstructionPathIdx++;
            } else if (constructionSiteResult == ERR_INVALID_TARGET) {
                room.memory.roads.nextConstructionPathIdx++;
            }
        }
    }

    

    var extensionLimit = [0,0,5,10,20,30,40,50,60];
    var extensionCount = room.find(STRUCTURE_EXTENSION).length;

    // if (extensionCount < extensionLimit[room.spawn.level]) {
    //     var result = room.createConstructionSite(
    //         spawn.memory.nextExtensionPos.x, 
    //         spawn.memory.nextExtensionPos.y, STRUCTURE_EXTENSION);

    //     spawn.memory.nextExtensionPos.x -= Math.floor((Math.random() * 2) + 1) - 1;
    //     spawn.memory.nextExtensionPos.y -= Math.floor((Math.random() * 2) + 1) - 1;

    //     if (spawn.memory.nextExtensionPos.x < 0 || spawn.memory.nextExtensionPos.y < 0) {
    //         spawn.memory.nextExtensionPos = null;
    //     }
    // }
}
