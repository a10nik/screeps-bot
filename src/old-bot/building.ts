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

export function calcBodyCost(body: BodyPartConstant[]) {
    return body.reduce((sum, part) => sum + BODYPART_COST[part], 0);
}

export const run = function (spawn: StructureSpawn) {
    if (spawn.spawning)
        return;

    const config = Memory.config || {
        "harvester": 3,
        "builder": 3,
        "upgrader": 3
    };

    build(spawn, STRUCTURE_EXTENSION);
    build(spawn, STRUCTURE_TOWER);

    var workerBody: BodyPartConstant[] = [];
    const bodyIteration = [MOVE, MOVE, WORK, CARRY];
    while (calcBodyCost(workerBody) + calcBodyCost(bodyIteration) <= spawn.room.energyAvailable &&
        workerBody.length + bodyIteration.length <= MAX_CREEP_SIZE) {
        workerBody = workerBody.concat(bodyIteration);
    }
    if (workerBody.length > 0) {
        let creepsByRole = _.countBy(Object.values(Game.creeps), c => c.memory.role);
        const rolesPriority: (keyof typeof config)[] = ["harvester", "upgrader", "builder"];
        const neededCreeps = rolesPriority.map((r) => ({
            role: r,
            wanted: config[r] - (creepsByRole[r] || 0),
        }));
        const { role, wanted } = _.sortByAll(neededCreeps, t => -t.wanted)[0];
        const cost = calcBodyCost(workerBody);
        if (wanted > 0 || spawn.room.energyCapacityAvailable === spawn.room.energyAvailable) {
            const code = spawn.spawnCreep(workerBody, role + Math.random(), { memory: { role } as CreepMemory });
            console.log("spawning", role, JSON.stringify({ cost, code }));
        }
    }
}
