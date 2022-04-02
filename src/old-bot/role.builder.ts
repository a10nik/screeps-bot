export const run = function (creep: Creep) {

    if (creep.memory.building && creep.store.energy == 0) {
        creep.memory.building = false;
        creep.say('harvesting');
    }
    if (!creep.memory.building && creep.store.energy == creep.carryCapacity) {
        creep.memory.building = true;
        creep.say('building');
    }

    if (creep.memory.building) {
        var targets = _.sortBy(creep.room.find(FIND_CONSTRUCTION_SITES), 'structureType');
        if (targets.length) {
            if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        }
    }
    else {
        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }
}

