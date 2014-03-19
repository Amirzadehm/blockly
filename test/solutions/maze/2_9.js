module.exports = {
  "app": "maze",    
  "levelFile": "levels",
  "levelId": "2_9",
  "tests" : [
    {
      "description": "Verify solution",
      "expected": {
        "result": true,
        "testResult": 100
      },
      "xml": '<xml><block type="maze_forever" x="27" y="47"><statement name="DO"><block type="maze_moveForward" /></statement></block></xml>'
    }
  ]
}
