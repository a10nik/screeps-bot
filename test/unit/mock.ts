export const Game: {
  creeps: { [name: string]: any };
  rooms: any;
  spawns: any;
  time: any;
} = {
  creeps: {},
  rooms: [],
  spawns: {},
  time: 12345
};

export const Memory: {
  creeps: { [name: string]: any };
} = {
  creeps: {}
};

const globals = require('@screeps/common/lib/constants.js');
for (const k in globals) {
  (global as any)[k] = globals[k];
}
