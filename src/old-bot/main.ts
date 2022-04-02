import * as building from './building';
import * as roleBuilder from './role.builder';
import * as roleHarvester from './role.harvester';
import * as roleUpgrader from './role.upgrader';
import * as tower from './tower';

const drawRoom = function(t: RoomTerrain) {
    for (let y = 0; y < 50; y++) {
        let s = "";
        for (let x = 0; x < 50; x++) {
            s += t.get(x, y) === TERRAIN_MASK_WALL ? '#' : ' ';
        }
        console.log(s);
    }
    console.log("---------------------------------------")
}

export const loop = function () {
    // drawRoom(Game.spawns.Spawn1.room.getTerrain());
    building.run(Game.spawns.Spawn1);

    var towers = Game.spawns.Spawn1.room.find<StructureTower>(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER, my: true } });
    towers.forEach(tower.run);

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
