import {assert} from "chai";
import {helper} from "./helper";

describe("main", () => {
  it("runs a server and matches the game tick", async function () {
    for (let i = 1; i < 500; i += 1) {
      assert.equal(await helper.server.world.gameTime, i);
      await helper.server.tick();
    }
    const objects = await helper.server.world.roomObjects("W0N1");
    assert.isAtLeast(objects.filter((o: any) => o.type === "creep").length, 2);
  });

  it("writes constans and reads to memory", async function () {
    await helper.player.console(`Memory.foo = STRUCTURE_EXTENSION`);
    await helper.server.tick();
    const memory = JSON.parse(await helper.player.memory);
    assert.equal(memory.foo, 'extension');
  });

});
