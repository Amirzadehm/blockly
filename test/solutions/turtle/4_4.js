module.exports = {
  app: "turtle",
  levelFile: "levels",
  levelId: "4_4",
  tests: [
    {
      description: "Top Solve: Repeat 10x",
      expected: {
        result: true,
        testResult: 100
      },
      missingBlocks: [],
      xml: '<xml><block type="controls_repeat"><title name="TIMES">10</title><statement name="DO"><block type="draw_colour" inline="true" deletable="false" movable="false" editable="false"><value name="COLOUR"><block type="colour_random" deletable="false" movable="false" editable="false"></block></value><next><block type="controls_repeat" deletable="false" movable="false" editable="false"><title name="TIMES">3</title><statement name="DO"><block type="draw_move_by_constant" deletable="false" movable="false" editable="false"><title name="DIR">moveForward</title><title name="VALUE">100</title><next><block type="draw_turn_by_constant" deletable="false" movable="false" editable="false"><title name="DIR">turnRight</title><title name="VALUE">120</title></block></next></block></statement><next><block type="draw_turn_by_constant" deletable="false" movable="false" editable="false"><title name="DIR">turnRight</title><title name="VALUE">36</title></block></next></block></next></block></statement></block></xml>'
    }
  ]
};