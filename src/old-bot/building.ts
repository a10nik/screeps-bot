function getRandomFreePos(startPos: RoomPosition, distance: number) {
    var x, y;
    var terrain = Game.map.getRoomTerrain(startPos.roomName);
    do {
        x = startPos.x + Math.floor(Math.random() * (distance * 2 + 1)) - distance;
        y = startPos.y + Math.floor(Math.random() * (distance * 2 + 1)) - distance;
    }
    while ((x + y) % 2 != (startPos.x + startPos.y) % 2 || terrain.get(x, y) == TERRAIN_MASK_WALL);
    return new RoomPosition(x, y, startPos.roomName);
}

function build(spawn: StructureSpawn, structureType: BuildableStructureConstant) {
    var structures = spawn.room.find(FIND_STRUCTURES, { filter: { structureType, my: true } });
    for (var i = 0; i < CONTROLLER_STRUCTURES[structureType][spawn.room.controller?.level || 1] - structures.length; i++) {
        getRandomFreePos(spawn.pos, 5).createConstructionSite(structureType);
    }
}

function calcBodyCost(body: BodyPartConstant[]) {
    return _.reduce(body, (sum, part) => sum + BODYPART_COST[part], 0);
}

export const run = function (spawn: StructureSpawn) {

    build(spawn, STRUCTURE_EXTENSION);
    build(spawn, STRUCTURE_TOWER);

    var workerBody: BodyPartConstant[] = [];
    const bodyIteration = [MOVE, MOVE, WORK, CARRY];
    while (calcBodyCost(workerBody) + calcBodyCost(bodyIteration) <= Game.spawns.Spawn1.room.energyAvailable &&
        workerBody.length + bodyIteration.length <= MAX_CREEP_SIZE) {
        workerBody = workerBody.concat(bodyIteration);
    }

    spawn.spawnCreep(workerBody, 'u2', { memory: { role: 'upgrader' } as CreepMemory });
    spawn.spawnCreep(workerBody, 'u1', { memory: { role: 'upgrader' } as CreepMemory });
    if (spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0) {
        spawn.spawnCreep(workerBody, 'b1', { memory: { role: 'builder' } as CreepMemory });
    }
    spawn.spawnCreep(workerBody, 'h2', { memory: { role: 'harvester' } as CreepMemory });
    spawn.spawnCreep(workerBody, 'h1', { memory: { role: 'harvester' } as CreepMemory });
}
