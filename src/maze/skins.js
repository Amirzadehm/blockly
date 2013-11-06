/**
 * Load Skin for Maze.
 */
// tiles: A 250x200 set of 20 map images.
// goal: A 20x34 goal image.
// background: Number of 400x400 background images. Randomly select one if
// specified, otherwise, use background.png.
// graph: Colour of optional grid lines, or false.
// look: Colour of sonar-like look icon.

var skinsBase = require('../skins');

var CONFIGS = {

  farmer: {
    look: '#000',
    transparentTileEnding: true,
    nonDisappearingPegmanHittingObstacle: true,
    background: 4,
    dirtSound: true
  },

  farmer_night: {
    look: '#FFF',
    transparentTileEnding: true,
    nonDisappearingPegmanHittingObstacle: true,
    background: 4,
    dirtSound: true
  },

  pvz: {
    look: '#FFF',
    obstacleScale: 1.4
  },

  birds: {
    look: '#FFF',
    largerObstacleAnimationArea: true,
    obstacleScale: 1.2,
    additionalWallSound: true
  }

};

exports.load = function(assetUrl, id) {
  var skin = skinsBase.load(assetUrl, id);
  var config = CONFIGS[skin.id];
  // Images
  skin.tiles = skin.assetUrl('tiles.png');
  skin.goal = skin.assetUrl('goal.png');
  skin.goalAnimation = skin.assetUrl('goal.gif');
  skin.obstacle = skin.assetUrl('obstacle.png');
  skin.obstacleAnimation = skin.assetUrl('obstacle.gif');
  skin.maze_forever = skin.assetUrl('maze_forever.png');
  if (config.largerObstacleAnimationArea) {
    skin.largerObstacleAnimationArea = true;
  } else {
    skin.largerObstacleAnimationArea = false;
  }
  if (config.transparentTileEnding) {
    skin.transparentTileEnding = true;
  } else {
    skin.transparentTileEnding = false;
  }
  if (config.nonDisappearingPegmanHittingObstacle) {
    skin.nonDisappearingPegmanHittingObstacle = true;
  } else {
    skin.nonDisappearingPegmanHittingObstacle = false;
  }
  skin.obstacleScale = config.obstacleScale || 1.0;
  // Sounds
  skin.obstacleSound =
      [skin.assetUrl('obstacle.mp3'), skin.assetUrl('obstacle.ogg')];
  skin.wallSound = [skin.assetUrl('wall.mp3'), skin.assetUrl('wall.ogg')];
  skin.wall0Sound = [skin.assetUrl('wall0.mp3'), skin.assetUrl('wall0.ogg')];
  skin.wall1Sound = [skin.assetUrl('wall1.mp3'), skin.assetUrl('wall1.ogg')];
  skin.wall2Sound = [skin.assetUrl('wall2.mp3'), skin.assetUrl('wall2.ogg')];
  skin.wall3Sound = [skin.assetUrl('wall3.mp3'), skin.assetUrl('wall3.ogg')];
  skin.wall4Sound = [skin.assetUrl('wall4.mp3'), skin.assetUrl('wall4.ogg')];
  skin.fillSound = [skin.assetUrl('fill.mp3'), skin.assetUrl('fill.ogg')];
  skin.digSound = [skin.assetUrl('dig.mp3'), skin.assetUrl('dig.ogg')];
  skin.additionalWallSound = config.additionalWallSound ? true : false;
  skin.dirtSound = config.dirtSound ? true : false;
  // Settings
  skin.graph = config.graph;
  skin.look = config.look;
  skin.dirt = function(n) {
    var MAX = 10;
    var MIN = -MAX;
    var prefix;
    if (n < MIN) {
      prefix = '-';
    } else if (n > MAX) {
      prefix = '';
    } else {
      prefix = '' + n;
    }
    //TODO: This really should be a dirt sprite sheet.
    return skin.assetUrl(prefix + 'check.png');
  };
  if (config.background !== undefined) {
    var index = Math.floor(Math.random() * config.background);
    skin.background = skin.assetUrl('background' + index + '.png');
  } else {
    skin.background = skin.assetUrl('background.png');
  }
  return skin;
};
