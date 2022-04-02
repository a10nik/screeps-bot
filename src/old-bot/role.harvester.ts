
export function run(creep: Creep) {
    if (creep.memory.unloading && creep.store.energy == 0) {
        creep.memory.unloading = false;
        creep.say('harvesting');
    }
    if (!creep.memory.unloading && creep.store.energy == creep.carryCapacity) {
        creep.memory.unloading = true;
        creep.say('unloading');
    }
    if (!creep.memory.unloading) {
        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }
    else {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
}
