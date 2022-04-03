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
        var site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (site) {
            if (creep.build(site) == ERR_NOT_IN_RANGE)
                creep.moveTo(site);
        } else {
            const damaged = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function (object) {
                    if (object.structureType === STRUCTURE_WALL) {
                        return object.hits < 500;
                    }
                    return object.hits < object.hitsMax;
                }
            });
            if (damaged && creep.repair(damaged) === ERR_NOT_IN_RANGE) {
                creep.moveTo(damaged);
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

