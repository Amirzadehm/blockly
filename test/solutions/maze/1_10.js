module.exports = {
  app: "maze",
  levelFile: "levels",
  levelId: "1_10",
  tests: [
    {
      description: "Verify solution",
      expected: {
        result: true,
        testResult: 100
      },
      xml: '<xml><block type="maze_forever" x="26" y="50"><statement name="DO"><block type="maze_ifElse"><title name="DIR">isPathForward</title><statement name="DO"><block type="maze_moveForward" /></statement><statement name="ELSE"><block type="maze_turn"><title name="DIR">turnRight</title></block></statement></block></statement></block></xml>'
    }
  ]
};
