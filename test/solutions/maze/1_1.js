var reqBlocks = function () {
  // stick this inside a function so that it's only loaded when needed
  return require('../../../src/maze/requiredBlocks.js');
};

module.exports = {
  app: "maze",
  levelFile: "levels",
  levelId: "1_1",
  tests: [
    {
      description: "Verify solution",
      expected: {
        result: true,
        testResult: 100
      },
      missingBlocks: [],
      xml: '<xml><block type="maze_moveForward" x="70" y="70"><next><block type="maze_moveForward" /></next></block></xml>'
    },
    {
      description: "Verify empty set",
      expected: {
        result: false,
        testResult: 4
      },
      missingBlocks: [reqBlocks().MOVE_FORWARD],
      xml: ""
    },
    {
      description: "One of two required moveForwards results in fail with no missingBlocks",
      expected: {
        result: false,
        testResult: 2
      },
      missingBlocks: [],
      xml: '<xml><block type="maze_moveForward" x="70" y="70"></block></xml>'

    }
  ]
};
