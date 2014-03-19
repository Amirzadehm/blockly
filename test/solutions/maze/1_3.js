module.exports = {
  "app": "maze",    
  "levelFile": "levels",
  "levelId": "1_3",
  "tests" : [
    {
      "description": "Verify solution",
      "expected": {
        "result": true,
        "testResult": 100
      },
      "xml": '<xml><block type="maze_forever" x="38" y="44"><statement name="DO"><block type="maze_moveForward" /></statement></block></xml>'
    }
  ]
}
