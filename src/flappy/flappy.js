/**
 * Blockly App: Flappy
 *
 * Copyright 2013 Code.org
 *
 */

'use strict';

var BlocklyApps = require('../base');
var commonMsg = require('../../locale/current/common');
var flappyMsg = require('../../locale/current/flappy');
var skins = require('../skins');
var tiles = require('./tiles');
var codegen = require('../codegen');
var api = require('./api');
var page = require('../templates/page.html');
var feedback = require('../feedback.js');
var dom = require('../dom');

var Direction = tiles.Direction;
var SquareType = tiles.SquareType;

/**
 * Create a namespace for the application.
 */
var Flappy = module.exports;

// Don't start the game until first click
Flappy.firstClick = false;

Flappy.keyState = {};
Flappy.btnState = {};
Flappy.clickPending = false;

Flappy.birdVelocity = 0; // Measured in fractional grid squares
Flappy.gravity = 0.005; // Measured in fractional grid squares

var ButtonState = {
  UP: 0,
  DOWN: 1
};

var ArrowIds = {
  LEFT: 'leftButton',
  UP: 'upButton',
  RIGHT: 'rightButton',
  DOWN: 'downButton'
};

var Keycodes = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

var level;
var skin;

/**
 * Milliseconds between each animation frame.
 */
var stepSpeed;

//TODO: Make configurable.
BlocklyApps.CHECK_FOR_EMPTY_BLOCKS = true;

var getTile = function(map, x, y) {
  if (map && map[y]) {
    return map[y][x];
  }
};

//The number of blocks to show as feedback.
BlocklyApps.NUM_REQUIRED_BLOCKS_TO_FLAG = 1;

// Default Scalings
Flappy.scale = {
  'snapRadius': 1,
  'stepSpeed': 33
};

var loadLevel = function() {
  // Load maps.
  Flappy.map = level.map;
  Flappy.timeoutFailureTick = level.timeoutFailureTick || Infinity;
  Flappy.softButtons_ = level.softButtons || [];
  Flappy.respawnBalls = level.respawnBalls || false;
  BlocklyApps.IDEAL_BLOCK_NUM = level.ideal || Infinity;
  BlocklyApps.REQUIRED_BLOCKS = level.requiredBlocks;

  // Override scalars.
  for (var key in level.scale) {
    Flappy.scale[key] = level.scale[key];
  }

  // Measure maze dimensions and set sizes.
  // ROWS: Number of tiles down.
  Flappy.ROWS = Flappy.map.length;
  // COLS: Number of tiles across.
  Flappy.COLS = Flappy.map[0].length;
  // Initialize the wallMap.
  initWallMap();
  // Pixel height and width of each maze square (i.e. tile).
  Flappy.SQUARE_SIZE = 50;
  Flappy.PEGMAN_HEIGHT = skin.pegmanHeight;
  Flappy.PEGMAN_WIDTH = skin.pegmanWidth;
  Flappy.PEGMAN_Y_OFFSET = skin.pegmanYOffset;
  // Height and width of the goal and obstacles.
  Flappy.MARKER_HEIGHT = 43;
  Flappy.MARKER_WIDTH = 50;

  Flappy.MAZE_WIDTH = Flappy.SQUARE_SIZE * Flappy.COLS;
  Flappy.MAZE_HEIGHT = Flappy.SQUARE_SIZE * Flappy.ROWS;
  Flappy.PATH_WIDTH = Flappy.SQUARE_SIZE / 3;
};


var initWallMap = function() {
  Flappy.wallMap = new Array(Flappy.ROWS);
  for (var y = 0; y < Flappy.ROWS; y++) {
    Flappy.wallMap[y] = new Array(Flappy.COLS);
  }
};

/**
 * PIDs of async tasks currently executing.
 */
Flappy.pidList = [];

// Map each possible shape to a sprite.
// Input: Binary string representing Centre/North/West/South/East squares.
// Output: [x, y] coordinates of each tile's sprite in tiles.png.
var TILE_SHAPES = {
  '10010': [4, 0],  // Dead ends
  '10001': [3, 3],
  '11000': [0, 1],
  '10100': [0, 2],
  '11010': [4, 1],  // Vertical
  '10101': [3, 2],  // Horizontal
  '10110': [0, 0],  // Elbows
  '10011': [2, 0],
  '11001': [4, 2],
  '11100': [2, 3],
  '11110': [1, 1],  // Junctions
  '10111': [1, 0],
  '11011': [2, 1],
  '11101': [1, 2],
  '11111': [2, 2],  // Cross
  'null0': [4, 3],  // Empty
  'null1': [3, 0],
  'null2': [3, 1],
  'null3': [0, 3],
  'null4': [1, 3]
};

var drawMap = function() {
  var svg = document.getElementById('svgBounce');
  var i, x, y, k, tile;

  // Draw the outer square.
  var square = document.createElementNS(Blockly.SVG_NS, 'rect');
  square.setAttribute('width', Flappy.MAZE_WIDTH);
  square.setAttribute('height', Flappy.MAZE_HEIGHT);
  square.setAttribute('fill', '#F1EEE7');
  square.setAttribute('stroke-width', 1);
  square.setAttribute('stroke', '#CCB');
  svg.appendChild(square);

  // Adjust outer element size.
  svg.setAttribute('width', Flappy.MAZE_WIDTH);
  svg.setAttribute('height', Flappy.MAZE_HEIGHT);

  // Adjust visualization and belowVisualization width.
  var visualization = document.getElementById('visualization');
  visualization.style.width = Flappy.MAZE_WIDTH + 'px';
  var belowVisualization = document.getElementById('belowVisualization');
  belowVisualization.style.width = Flappy.MAZE_WIDTH + 'px';

  // Adjust button table width.
  var buttonTable = document.getElementById('gameButtons');
  buttonTable.style.width = Flappy.MAZE_WIDTH + 'px';

  var hintBubble = document.getElementById('bubble');
  hintBubble.style.width = Flappy.MAZE_WIDTH + 'px';

  if (skin.background) {
    tile = document.createElementNS(Blockly.SVG_NS, 'image');
    tile.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                        skin.background);
    tile.setAttribute('height', Flappy.MAZE_HEIGHT);
    tile.setAttribute('width', Flappy.MAZE_WIDTH);
    tile.setAttribute('x', 0);
    tile.setAttribute('y', 0);
    svg.appendChild(tile);
  }

  if (skin.graph) {
    // Draw the grid lines.
    // The grid lines are offset so that the lines pass through the centre of
    // each square.  A half-pixel offset is also added to as standard SVG
    // practice to avoid blurriness.
    var offset = Flappy.SQUARE_SIZE / 2 + 0.5;
    for (k = 0; k < Flappy.ROWS; k++) {
      var h_line = document.createElementNS(Blockly.SVG_NS, 'line');
      h_line.setAttribute('y1', k * Flappy.SQUARE_SIZE + offset);
      h_line.setAttribute('x2', Flappy.MAZE_WIDTH);
      h_line.setAttribute('y2', k * Flappy.SQUARE_SIZE + offset);
      h_line.setAttribute('stroke', skin.graph);
      h_line.setAttribute('stroke-width', 1);
      svg.appendChild(h_line);
    }
    for (k = 0; k < Flappy.COLS; k++) {
      var v_line = document.createElementNS(Blockly.SVG_NS, 'line');
      v_line.setAttribute('x1', k * Flappy.SQUARE_SIZE + offset);
      v_line.setAttribute('x2', k * Flappy.SQUARE_SIZE + offset);
      v_line.setAttribute('y2', Flappy.MAZE_HEIGHT);
      v_line.setAttribute('stroke', skin.graph);
      v_line.setAttribute('stroke-width', 1);
      svg.appendChild(v_line);
    }
  }

  // Draw the tiles making up the maze map.

  // Return a value of '0' if the specified square is wall or out of bounds '1'
  // otherwise (empty, obstacle, start, finish).
  var normalize = function(x, y) {
    return ((Flappy.map[y] === undefined) ||
            (Flappy.map[y][x] === undefined) ||
            (Flappy.map[y][x] == SquareType.WALL)) ? '0' : '1';
  };

  // Compute and draw the tile for each square.
  var tileId = 0;
  for (y = 0; y < Flappy.ROWS; y++) {
    for (x = 0; x < Flappy.COLS; x++) {
      // Compute the tile index.
      tile = normalize(x, y) +
          normalize(x, y - 1) +  // North.
          normalize(x + 1, y) +  // West.
          normalize(x, y + 1) +  // South.
          normalize(x - 1, y);   // East.

      // Draw the tile.
      if (!TILE_SHAPES[tile]) {
        // Empty square.  Use null0 for large areas, with null1-4 for borders.
        if (tile == '00000' && Math.random() > 0.3) {
          Flappy.wallMap[y][x] = 0;
          tile = 'null0';
        } else {
          var wallIdx = Math.floor(1 + Math.random() * 4);
          Flappy.wallMap[y][x] = wallIdx;
          tile = 'null' + wallIdx;
        }
      }
      var left = TILE_SHAPES[tile][0];
      var top = TILE_SHAPES[tile][1];
      // Tile's clipPath element.
      var tileClip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
      tileClip.setAttribute('id', 'tileClipPath' + tileId);
      var tileClipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
      tileClipRect.setAttribute('width', Flappy.SQUARE_SIZE);
      tileClipRect.setAttribute('height', Flappy.SQUARE_SIZE);

      tileClipRect.setAttribute('x', x * Flappy.SQUARE_SIZE);
      tileClipRect.setAttribute('y', y * Flappy.SQUARE_SIZE);

      tileClip.appendChild(tileClipRect);
      svg.appendChild(tileClip);
      // Tile sprite.
      var tileElement = document.createElementNS(Blockly.SVG_NS, 'image');
      tileElement.setAttribute('id', 'tileElement' + tileId);
      tileElement.setAttributeNS('http://www.w3.org/1999/xlink',
                                 'xlink:href',
                                 skin.tiles);
      tileElement.setAttribute('height', Flappy.SQUARE_SIZE * 4);
      tileElement.setAttribute('width', Flappy.SQUARE_SIZE * 5);
      tileElement.setAttribute('clip-path',
                               'url(#tileClipPath' + tileId + ')');
      tileElement.setAttribute('x', (x - left) * Flappy.SQUARE_SIZE);
      tileElement.setAttribute('y', (y - top) * Flappy.SQUARE_SIZE);
      svg.appendChild(tileElement);
      // Tile animation
      var tileAnimation = document.createElementNS(Blockly.SVG_NS,
                                                   'animate');
      tileAnimation.setAttribute('id', 'tileAnimation' + tileId);
      tileAnimation.setAttribute('attributeType', 'CSS');
      tileAnimation.setAttribute('attributeName', 'opacity');
      tileAnimation.setAttribute('from', 1);
      tileAnimation.setAttribute('to', 0);
      tileAnimation.setAttribute('dur', '1s');
      tileAnimation.setAttribute('begin', 'indefinite');
      tileElement.appendChild(tileAnimation);

      tileId++;
    }
  }

  if (Flappy.birdVelocity) {
    var birdClip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
    birdClip.setAttribute('id', 'birdClipPath');
    var birdClipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
    birdClipRect.setAttribute('id', 'birdClipRect');
    birdClipRect.setAttribute('width', Flappy.PEGMAN_WIDTH);
    birdClipRect.setAttribute('height', Flappy.PEGMAN_HEIGHT);
    ballClip.appendChild(birdClipRect);
    svg.appendChild(birdClip);

    // Add bird.
    var birdIcon = document.createElementNS(Blockly.SVG_NS, 'image');
    birdIcon.setAttribute('id', 'bird');
    birdIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                            skin.avatar);
    birdIcon.setAttribute('height', Flappy.PEGMAN_HEIGHT);
    birdIcon.setAttribute('width', Flappy.PEGMAN_WIDTH * 21); // 49 * 21 = 1029
    birdIcon.setAttribute('clip-path', 'url(#birdClipPath' + i + ')');
    svg.appendChild(birdIcon);
  }

  if (Flappy.ballStart_) {
    for (i = 0; i < Flappy.ballCount; i++) {
      // Ball's clipPath element, whose (x, y) is reset by Flappy.displayBall
      var ballClip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
      ballClip.setAttribute('id', 'ballClipPath' + i);
      var ballClipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
      ballClipRect.setAttribute('id', 'ballClipRect' + i);
      ballClipRect.setAttribute('width', Flappy.PEGMAN_WIDTH);
      ballClipRect.setAttribute('height', Flappy.PEGMAN_HEIGHT);
      ballClip.appendChild(ballClipRect);
      svg.appendChild(ballClip);

      // Add ball.
      var ballIcon = document.createElementNS(Blockly.SVG_NS, 'image');
      ballIcon.setAttribute('id', 'ball' + i);
      ballIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.avatar);
      ballIcon.setAttribute('height', Flappy.PEGMAN_HEIGHT);
      ballIcon.setAttribute('width', Flappy.PEGMAN_WIDTH * 21); // 49 * 21 = 1029
      ballIcon.setAttribute('clip-path', 'url(#ballClipPath' + i + ')');
      svg.appendChild(ballIcon);
    }
  }

  if (Flappy.paddleStart_) {
    // Paddle's clipPath element, whose (x, y) is reset by Flappy.displayPaddle
    var paddleClip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
    paddleClip.setAttribute('id', 'paddleClipPath');
    var paddleClipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
    paddleClipRect.setAttribute('id', 'paddleClipRect');
    paddleClipRect.setAttribute('width', Flappy.PEGMAN_WIDTH);
    paddleClipRect.setAttribute('height', Flappy.PEGMAN_HEIGHT);
    paddleClip.appendChild(paddleClipRect);
    svg.appendChild(paddleClip);

    // Add paddle.
    var paddleIcon = document.createElementNS(Blockly.SVG_NS, 'image');
    paddleIcon.setAttribute('id', 'paddle');
    paddleIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.avatar);
    paddleIcon.setAttribute('height', Flappy.PEGMAN_HEIGHT);
    paddleIcon.setAttribute('width', Flappy.PEGMAN_WIDTH * 21); // 49 * 21 = 1029
    paddleIcon.setAttribute('clip-path', 'url(#paddleClipPath)');
    svg.appendChild(paddleIcon);
  }
  
  if (Flappy.paddleFinish_) {
    for (i = 0; i < Flappy.paddleFinishCount; i++) {
      // Add finish markers.
      var paddleFinishMarker = document.createElementNS(Blockly.SVG_NS, 'image');
      paddleFinishMarker.setAttribute('id', 'paddlefinish' + i);
      paddleFinishMarker.setAttributeNS('http://www.w3.org/1999/xlink',
                                        'xlink:href',
                                        skin.goal);
      paddleFinishMarker.setAttribute('height', Flappy.MARKER_HEIGHT);
      paddleFinishMarker.setAttribute('width', Flappy.MARKER_WIDTH);
      svg.appendChild(paddleFinishMarker);
    }
  }

  if (Flappy.ballFinish_) {
    // Add ball finish marker.
    var ballFinishMarker = document.createElementNS(Blockly.SVG_NS, 'image');
    ballFinishMarker.setAttribute('id', 'ballfinish');
    ballFinishMarker.setAttributeNS('http://www.w3.org/1999/xlink',
                                    'xlink:href',
                                    skin.goal);
    ballFinishMarker.setAttribute('height', Flappy.MARKER_HEIGHT);
    ballFinishMarker.setAttribute('width', Flappy.MARKER_WIDTH);
    svg.appendChild(ballFinishMarker);
  }

  // Add wall hitting animation
  if (skin.hittingWallAnimation) {
    var wallAnimationIcon = document.createElementNS(Blockly.SVG_NS, 'image');
    wallAnimationIcon.setAttribute('id', 'wallAnimation');
    wallAnimationIcon.setAttribute('height', Flappy.SQUARE_SIZE);
    wallAnimationIcon.setAttribute('width', Flappy.SQUARE_SIZE);
    wallAnimationIcon.setAttribute('visibility', 'hidden');
    svg.appendChild(wallAnimationIcon);
  }

  // Add obstacles.
  var obsId = 0;
  for (y = 0; y < Flappy.ROWS; y++) {
    for (x = 0; x < Flappy.COLS; x++) {
      if (Flappy.map[y][x] == SquareType.OBSTACLE) {
        var obsIcon = document.createElementNS(Blockly.SVG_NS, 'image');
        obsIcon.setAttribute('id', 'obstacle' + obsId);
        obsIcon.setAttribute('height', Flappy.MARKER_HEIGHT * skin.obstacleScale);
        obsIcon.setAttribute('width', Flappy.MARKER_WIDTH * skin.obstacleScale);
        obsIcon.setAttributeNS(
          'http://www.w3.org/1999/xlink', 'xlink:href', skin.obstacle);
        obsIcon.setAttribute('x',
                             Flappy.SQUARE_SIZE * (x + 0.5) -
                             obsIcon.getAttribute('width') / 2);
        obsIcon.setAttribute('y',
                             Flappy.SQUARE_SIZE * (y + 0.9) -
                             obsIcon.getAttribute('height'));
        svg.appendChild(obsIcon);
      }
      ++obsId;
    }
  }
};

Flappy.calcDistance = function(xDist, yDist) {
  return Math.sqrt(xDist * xDist + yDist * yDist);
};

var essentiallyEqual = function(float1, float2, opt_variance) {
  var variance = opt_variance || 0.01;
  return (Math.abs(float1 - float2) < variance);
};

/**
 * @param scope Object :  The scope in which to execute the delegated function.
 * @param func Function : The function to execute
 * @param data Object or Array : The data to pass to the function. If the function is also passed arguments, the data is appended to the arguments list. If the data is an Array, each item is appended as a new argument.
 */
var delegate = function(scope, func, data)
{
  return function()
  {
    var args = Array.prototype.slice.apply(arguments).concat(data);
    func.apply(scope, args);
  };
};

Flappy.onTick = function() {
  Flappy.tickCount++;

  if (Flappy.clickPending) {
    try { Flappy.whenClick(BlocklyApps, api); } catch (e) { }
    Flappy.clickPending = false;
  }

  // Run key event handlers for any keys that are down:
  for (var key in Keycodes) {
    if (Flappy.keyState[Keycodes[key]] &&
        Flappy.keyState[Keycodes[key]] == "keydown") {
      switch (Keycodes[key]) {
        case Keycodes.LEFT:
          try { Flappy.whenLeft(BlocklyApps, api); } catch (e) { }
          break;
        case Keycodes.UP:
          try { Flappy.whenUp(BlocklyApps, api); } catch (e) { }
          break;
        case Keycodes.RIGHT:
          try { Flappy.whenRight(BlocklyApps, api); } catch (e) { }
          break;
        case Keycodes.DOWN:
          try { Flappy.whenDown(BlocklyApps, api); } catch (e) { }
          break;
      }
    }
  }

  for (var btn in ArrowIds) {
    if (Flappy.btnState[ArrowIds[btn]] &&
        Flappy.btnState[ArrowIds[btn]] == ButtonState.DOWN) {
      switch (ArrowIds[btn]) {
        case ArrowIds.LEFT:
          try { Flappy.whenLeft(BlocklyApps, api); } catch (e) { }
          break;
        case ArrowIds.UP:
          try { Flappy.whenUp(BlocklyApps, api); } catch (e) { }
          break;
        case ArrowIds.RIGHT:
          try { Flappy.whenRight(BlocklyApps, api); } catch (e) { }
          break;
        case ArrowIds.DOWN:
          try { Flappy.whenDown(BlocklyApps, api); } catch (e) { }
          break;
      }
    }
  }

  if (Flappy.firstClick) {
    Flappy.birdVelocity += Flappy.gravity;
    Flappy.paddleY = Flappy.paddleY + Flappy.birdVelocity;
  }

  Flappy.displayPaddle(Flappy.paddleX, Flappy.paddleY, 0);

  if (Flappy.allFinishesComplete()) {
    Flappy.result = ResultType.SUCCESS;
    Flappy.onPuzzleComplete();
  } else if (Flappy.timedOut()) {
    BlocklyApps.playAudio('failure', {volume: 0.5});
    Flappy.result = ResultType.FAILURE;
    Flappy.onPuzzleComplete();
  }
};

Flappy.onMouseDown = function (e) {
  if (Flappy.intervalId) {
    // todo - validate inside window
    Flappy.clickPending = true;
    Flappy.firstClick = true;
  }
};

Flappy.onKey = function(e) {
  // Store the most recent event type per-key
  Flappy.keyState[e.keyCode] = e.type;

  // If we are actively running our tick loop, suppress default event handling
  if (Flappy.intervalId &&
      e.keyCode >= Keycodes.LEFT && e.keyCode <= Keycodes.DOWN) {
    e.preventDefault();
  }
};

Flappy.onArrowButtonDown = function(e, idBtn) {
  // Store the most recent event type per-button
  Flappy.btnState[idBtn] = ButtonState.DOWN;
  e.preventDefault();  // Stop normal events so we see mouseup later.
};

Flappy.onArrowButtonUp = function(e, idBtn) {
  // Store the most recent event type per-button
  Flappy.btnState[idBtn] = ButtonState.UP;
};

Flappy.onMouseUp = function(e) {
  // Reset btnState on mouse up
  Flappy.btnState = {};
};

/**
 * Initialize Blockly and the Flappy app.  Called on page load.
 */
Flappy.init = function(config) {
  Flappy.clearEventHandlersKillTickLoop();
  skin = config.skin;
  level = config.level;
  loadLevel();
  
  window.addEventListener("keydown", Flappy.onKey, false);
  window.addEventListener("keyup", Flappy.onKey, false);

  config.html = page({
    assetUrl: BlocklyApps.assetUrl,
    data: {
      localeDirection: BlocklyApps.localeDirection(),
      visualization: require('./visualization.html')(),
      controls: require('./controls.html')({assetUrl: BlocklyApps.assetUrl}),
      blockUsed: undefined,
      idealBlockNumber: undefined,
      blockCounterClass: 'block-counter-default'
    }
  });

  config.loadAudio = function() {
    Blockly.loadAudio_(skin.winSound, 'win');
    Blockly.loadAudio_(skin.startSound, 'start');
    Blockly.loadAudio_(skin.failureSound, 'failure');
    Blockly.loadAudio_(skin.obstacleSound, 'obstacle');
    // Load wall sounds.
    Blockly.loadAudio_(skin.wallSound, 'wall');
    if (skin.additionalSound) {
      Blockly.loadAudio_(skin.wall0Sound, 'wall0');
      Blockly.loadAudio_(skin.wall1Sound, 'wall1');
      Blockly.loadAudio_(skin.wall2Sound, 'wall2');
      Blockly.loadAudio_(skin.wall3Sound, 'wall3');
      Blockly.loadAudio_(skin.wall4Sound, 'wall4');
      Blockly.loadAudio_(skin.winGoalSound, 'winGoal');
    }
  };

  config.afterInject = function() {
    // Connect up arrow button event handlers
    for (var btn in ArrowIds) {
      dom.addClickTouchEvent(document.getElementById(ArrowIds[btn]),
                             delegate(this,
                                      Flappy.onArrowButtonUp,
                                      ArrowIds[btn]));
      dom.addMouseDownTouchEvent(document.getElementById(ArrowIds[btn]),
                                 delegate(this,
                                          Flappy.onArrowButtonDown,
                                          ArrowIds[btn]));
    }
    document.addEventListener('mouseup', Flappy.onMouseUp, false);
    document.addEventListener('mousedown', Flappy.onMouseDown, false);

    /**
     * The richness of block colours, regardless of the hue.
     * MOOC blocks should be brighter (target audience is younger).
     * Must be in the range of 0 (inclusive) to 1 (exclusive).
     * Blockly's default is 0.45.
     */
    Blockly.HSV_SATURATION = 0.6;

    Blockly.SNAP_RADIUS *= Flappy.scale.snapRadius;

    Flappy.ballCount = 0;
    Flappy.paddleFinishCount = 0;

    // Locate the start and finish squares.
    for (var y = 0; y < Flappy.ROWS; y++) {
      for (var x = 0; x < Flappy.COLS; x++) {
        if (Flappy.map[y][x] == SquareType.PADDLEFINISH) {
          if (0 === Flappy.paddleFinishCount) {
            Flappy.paddleFinish_ = [];
          }
          Flappy.paddleFinish_[Flappy.paddleFinishCount] = {x: x, y: y};
          Flappy.paddleFinishCount++;
        } else if (Flappy.map[y][x] == SquareType.BALLSTART) {
          if (0 === Flappy.ballCount) {
            Flappy.ballStart_ = [];
            Flappy.ballX = [];
            Flappy.ballY = [];
            Flappy.ballD = [];
          }
          Flappy.ballStart_[Flappy.ballCount] =
              {x: x, y: y, d: level.ballDirection || 0};
          Flappy.ballCount++;
        } else if (Flappy.map[y][x] == SquareType.PADDLESTART) {
          Flappy.paddleStart_ = {x: x, y: y};
        } else if (Flappy.map[y][x] == SquareType.BALLFINISH) {
          Flappy.ballFinish_ = {x: x, y: y};
        } else if (Flappy.map[y][x] == SquareType.GOAL) {
          Flappy.goalLocated_ = true;
        }
      }
    }

    drawMap();
  };

  config.getDisplayWidth = function() {
    var visualization = document.getElementById('visualization');
    return visualization.getBoundingClientRect().width;
  };

  BlocklyApps.init(config);
};

/**
 * Clear the event handlers and stop the onTick timer.
 */
Flappy.clearEventHandlersKillTickLoop = function() {
  Flappy.whenWallCollided = null;
  Flappy.whenBallInGoal = null;
  Flappy.whenBallMissesPaddle = null;
  Flappy.whenPaddleCollided = null;
  Flappy.whenDown = null;
  Flappy.whenLeft = null;
  Flappy.whenRight = null;
  Flappy.whenUp = null;
  if (Flappy.intervalId) {
    window.clearInterval(Flappy.intervalId);
  }
  Flappy.intervalId = 0;
};

/**
 * Move ball to a safe place off of the screen.
 * @param {int} i Index of ball to be moved.
 */
Flappy.moveBallOffscreen = function(i) {
  Flappy.ballX[i] = 100;
  Flappy.ballY[i] = 100;
  Flappy.ballD[i] = Math.PI / 2;
};

/**
 * Play a start sound and reset the ball at index i and redraw it.
 * @param {int} i Index of ball to be reset.
 */
Flappy.playSoundAndResetBall = function(i) {
  Flappy.resetBall(i);
  BlocklyApps.playAudio('start', {volume: 0.5});
};

/**
 * Reset the ball from index i to the start position and redraw it.
 * @param {int} i Index of ball to be reset.
 */
Flappy.resetBall = function(i) {
  Flappy.ballX[i] = Flappy.ballStart_[i].x;
  Flappy.ballY[i] = Flappy.ballStart_[i].y;
  Flappy.ballD[i] = Flappy.ballStart_[i].d || 1.25 * Math.PI;
  
  Flappy.displayBall(i, Flappy.ballX[i], Flappy.ballY[i], 8);
};

/**
 * Reset the app to the start position and kill any pending animation tasks.
 * @param {boolean} first True if an opening animation is to be played.
 */
BlocklyApps.reset = function(first) {
  var i;
  Flappy.clearEventHandlersKillTickLoop();

  // Kill all tasks.
  for (i = 0; i < Flappy.pidList.length; i++) {
    window.clearTimeout(Flappy.pidList[i]);
  }
  Flappy.pidList = [];

  // Soft buttons
  var softButtonCount = 0;
  for (i = 0; i < Flappy.softButtons_.length; i++) {
    document.getElementById(Flappy.softButtons_[i]).style.display = 'inline';
    softButtonCount++;
  }
  if (softButtonCount) {
    var softButtonsCell = document.getElementById('soft-buttons');
    softButtonsCell.className = 'soft-buttons-' + softButtonCount;
  }
  
  // Reset the score.
  Flappy.playerScore = 0;
  Flappy.opponentScore = 0;
  if (Flappy.goalLocated_) {
    var scoreCell = document.getElementById('score-cell');
    scoreCell.className = 'score-cell-enabled';
    Flappy.displayScore();
  }

  Flappy.birdVelocity = 0;
  
  // Move Ball into position.
  if (Flappy.ballStart_) {
    for (i = 0; i < Flappy.ballCount; i++) {
      Flappy.resetBall(i);
    }
  }
  
  // Move Paddle into position.
  Flappy.paddleX = Flappy.paddleStart_.x;
  Flappy.paddleY = Flappy.paddleStart_.y;
  
  Flappy.displayPaddle(Flappy.paddleX, Flappy.paddleY, 0);

  var svg = document.getElementById('svgBounce');

  if (Flappy.paddleFinish_) {
    for (i = 0; i < Flappy.paddleFinishCount; i++) {
      // Mark each finish as incomplete.
      Flappy.paddleFinish_[i].finished = false;

      // Move the finish icons into position.
      var paddleFinishIcon = document.getElementById('paddlefinish' + i);
      paddleFinishIcon.setAttribute(
          'x',
          Flappy.SQUARE_SIZE * (Flappy.paddleFinish_[i].x + 0.5) -
          paddleFinishIcon.getAttribute('width') / 2);
      paddleFinishIcon.setAttribute(
          'y',
          Flappy.SQUARE_SIZE * (Flappy.paddleFinish_[i].y + 0.9) -
          paddleFinishIcon.getAttribute('height'));
      paddleFinishIcon.setAttributeNS(
          'http://www.w3.org/1999/xlink',
          'xlink:href',
          skin.goal);
    }
  }

  if (Flappy.ballFinish_) {
    // Move the finish icon into position.
    var ballFinishIcon = document.getElementById('ballfinish');
    ballFinishIcon.setAttribute(
        'x',
        Flappy.SQUARE_SIZE * (Flappy.ballFinish_.x + 0.5) -
        ballFinishIcon.getAttribute('width') / 2);
    ballFinishIcon.setAttribute(
        'y',
        Flappy.SQUARE_SIZE * (Flappy.ballFinish_.y + 0.9) -
        ballFinishIcon.getAttribute('height'));
    ballFinishIcon.setAttributeNS(
        'http://www.w3.org/1999/xlink',
        'xlink:href',
        skin.goal);
  }

  // Reset the obstacle image.
  var obsId = 0;
  var x, y;
  for (y = 0; y < Flappy.ROWS; y++) {
    for (x = 0; x < Flappy.COLS; x++) {
      var obsIcon = document.getElementById('obstacle' + obsId);
      if (obsIcon) {
        obsIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                               skin.obstacle);
      }
      ++obsId;
    }
  }

  // Reset the tiles
  var tileId = 0;
  for (y = 0; y < Flappy.ROWS; y++) {
    for (x = 0; x < Flappy.COLS; x++) {
      // Tile's clipPath element.
      var tileClip = document.getElementById('tileClipPath' + tileId);
      tileClip.setAttribute('visibility', 'visible');
      // Tile sprite.
      var tileElement = document.getElementById('tileElement' + tileId);
      tileElement.setAttributeNS(
          'http://www.w3.org/1999/xlink', 'xlink:href', skin.tiles);
      tileElement.setAttribute('opacity', 1);
      tileId++;
    }
  }
};

/**
 * Click the run button.  Start the program.
 */
// XXX This is the only method used by the templates!
BlocklyApps.runButtonClick = function() {
  // Only allow a single top block on some levels.
  if (level.singleTopBlock &&
      Blockly.mainWorkspace.getTopBlocks().length > 1) {
    window.alert(commonMsg.oneTopBlock());
    return;
  }
  var runButton = document.getElementById('runButton');
  var resetButton = document.getElementById('resetButton');
  // Ensure that Reset button is at least as wide as Run button.
  if (!resetButton.style.minWidth) {
    resetButton.style.minWidth = runButton.offsetWidth + 'px';
  }
  runButton.style.display = 'none';
  resetButton.style.display = 'inline';
  Blockly.mainWorkspace.traceOn(true);
  BlocklyApps.reset(false);
  BlocklyApps.attempts++;
  Flappy.execute();
};

/**
 * Outcomes of running the user program.
 */
var ResultType = {
  UNSET: 0,
  SUCCESS: 1,
  FAILURE: -1,
  TIMEOUT: 2,
  ERROR: -2
};

/**
 * App specific displayFeedback function that calls into
 * BlocklyApps.displayFeedback when appropriate
 */
var displayFeedback = function() {
  if (!Flappy.waitingForReport) {
    BlocklyApps.displayFeedback({
      app: 'flappy', //XXX
      skin: skin.id,
      feedbackType: Flappy.testResults,
      response: Flappy.response,
      level: level
    });
  }
};

/**
 * Function to be called when the service report call is complete
 * @param {object} JSON response (if available)
 */
Flappy.onReportComplete = function(response) {
  Flappy.response = response;
  Flappy.waitingForReport = false;
  // Disable the run button until onReportComplete is called.
  var runButton = document.getElementById('runButton');
  runButton.disabled = false;
  displayFeedback();
};

/**
 * Execute the user's code.  Heaven help us...
 */
Flappy.execute = function() {
  BlocklyApps.log = [];
  BlocklyApps.ticks = 100; //TODO: Set higher for some levels
  var code = Blockly.Generator.workspaceToCode('JavaScript', 'bounce_whenRun');
  Flappy.result = ResultType.UNSET;
  Flappy.testResults = BlocklyApps.TestResults.NO_TESTS_RUN;
  Flappy.waitingForReport = false;
  Flappy.response = null;

  // Check for empty top level blocks to warn user about bugs,
  // especially ones that lead to infinite loops.
  if (feedback.hasEmptyTopLevelBlocks()) {
    Flappy.testResults = BlocklyApps.TestResults.EMPTY_BLOCK_FAIL;
    displayFeedback();
    return;
  }

  if (level.editCode) {
    var codeTextbox = document.getElementById('codeTextbox');
    code = dom.getText(codeTextbox);
    // Insert aliases from level codeBlocks into code
    if (level.codeFunctions) {
      for (var i = 0; i < level.codeFunctions.length; i++) {
        var codeFunction = level.codeFunctions[i];
        if (codeFunction.alias) {
          code = codeFunction.func +
              " = function() { " + codeFunction.alias + " };" + code;
        }
      }
    }
  }

  var codeClick = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'flappy_whenClick');
  var whenClickFunc = codegen.functionFromCode(
                                     codeClick, {
                                      BlocklyApps: BlocklyApps,
                                      Flappy: api } );




  var codeWallCollided = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'bounce_whenWallCollided');
  var whenWallCollidedFunc = codegen.functionFromCode(
                                     codeWallCollided, {
                                      BlocklyApps: BlocklyApps,
                                      Flappy: api } );

  var codeBallInGoal = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'bounce_whenBallInGoal');
  var whenBallInGoalFunc = codegen.functionFromCode(
                                     codeBallInGoal, {
                                      BlocklyApps: BlocklyApps,
                                      Flappy: api } );

  var codeBallMissesPaddle = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'bounce_whenBallMissesPaddle');
  var whenBallMissesPaddleFunc = codegen.functionFromCode(
                                     codeBallMissesPaddle, {
                                      BlocklyApps: BlocklyApps,
                                      Flappy: api } );

  var codePaddleCollided = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'bounce_whenPaddleCollided');
  var whenPaddleCollidedFunc = codegen.functionFromCode(
                                     codePaddleCollided, {
                                      BlocklyApps: BlocklyApps,
                                      Flappy: api } );

  var codeLeft = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'bounce_whenLeft');
  var whenLeftFunc = codegen.functionFromCode(
                                     codeLeft, {
                                      BlocklyApps: BlocklyApps,
                                      Flappy: api } );

  var codeRight = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'bounce_whenRight');
  var whenRightFunc = codegen.functionFromCode(
                                     codeRight, {
                                      BlocklyApps: BlocklyApps,
                                      Flappy: api } );

  var codeUp = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'bounce_whenUp');
  var whenUpFunc = codegen.functionFromCode(
                                     codeUp, {
                                      BlocklyApps: BlocklyApps,
                                      Flappy: api } );

  var codeDown = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'bounce_whenDown');
  var whenDownFunc = codegen.functionFromCode(
                                     codeDown, {
                                      BlocklyApps: BlocklyApps,
                                      Flappy: api } );

  BlocklyApps.playAudio('start', {volume: 0.5});

  BlocklyApps.reset(false);

  // Set event handlers and start the onTick timer
  Flappy.whenClick = whenClickFunc;

  Flappy.whenWallCollided = whenWallCollidedFunc;
  Flappy.whenBallInGoal = whenBallInGoalFunc;
  Flappy.whenBallMissesPaddle = whenBallMissesPaddleFunc;
  Flappy.whenPaddleCollided = whenPaddleCollidedFunc;
  Flappy.whenLeft = whenLeftFunc;
  Flappy.whenRight = whenRightFunc;
  Flappy.whenUp = whenUpFunc;
  Flappy.whenDown = whenDownFunc;
  Flappy.tickCount = 0;
  Flappy.intervalId = window.setInterval(Flappy.onTick, Flappy.scale.stepSpeed);
};

Flappy.onPuzzleComplete = function() {
  // Stop everything on screen
  Flappy.clearEventHandlersKillTickLoop();

  // If we know they succeeded, mark levelComplete true
  // Note that we have not yet animated the succesful run
  BlocklyApps.levelComplete = (Flappy.result == ResultType.SUCCESS);
  
  Flappy.testResults = BlocklyApps.getTestResults();
  
  if (level.editCode) {
    Flappy.testResults = BlocklyApps.levelComplete ?
      BlocklyApps.TestResults.ALL_PASS :
      BlocklyApps.TestResults.TOO_FEW_BLOCKS_FAIL;
  }
  
  if (level.failForOther1Star && !BlocklyApps.levelComplete) {
    Flappy.testResults = BlocklyApps.TestResults.OTHER_1_STAR_FAIL;
  }
  
  var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  var textBlocks = Blockly.Xml.domToText(xml);
  
  Flappy.waitingForReport = true;
  
  // Report result to server.
  BlocklyApps.report({
                     app: 'flappy',
                     level: level.id,
                     result: Flappy.result === ResultType.SUCCESS,
                     testResult: Flappy.testResults,
                     program: encodeURIComponent(textBlocks),
                     onComplete: Flappy.onReportComplete
                     });
};

/**
 * Replace the tiles surronding the obstacle with broken tiles.
 */
Flappy.updateSurroundingTiles = function(obstacleY, obstacleX, brokenTiles) {
  var tileCoords = [
    [obstacleY - 1, obstacleX - 1],
    [obstacleY - 1, obstacleX],
    [obstacleY - 1, obstacleX + 1],
    [obstacleY, obstacleX - 1],
    [obstacleY, obstacleX],
    [obstacleY, obstacleX + 1],
    [obstacleY + 1, obstacleX - 1],
    [obstacleY + 1, obstacleX],
    [obstacleY + 1, obstacleX + 1]
  ];
  for (var idx = 0; idx < tileCoords.length; ++idx) {
    var tileIdx = tileCoords[idx][1] + Flappy.COLS * tileCoords[idx][0];
    var tileElement = document.getElementById('tileElement' + tileIdx);
    if (tileElement) {
      tileElement.setAttributeNS(
          'http://www.w3.org/1999/xlink', 'xlink:href', brokenTiles);
    }
  }
};

/**
 * Set the tiles to be transparent gradually.
 */
Flappy.setTileTransparent = function() {
  var tileId = 0;
  for (var y = 0; y < Flappy.ROWS; y++) {
    for (var x = 0; x < Flappy.COLS; x++) {
      // Tile sprite.
      var tileElement = document.getElementById('tileElement' + tileId);
      var tileAnimation = document.getElementById('tileAnimation' + tileId);
      if (tileElement) {
        tileElement.setAttribute('opacity', 0);
      }
      if (tileAnimation) {
        tileAnimation.beginElement();
      }
      tileId++;
    }
  }
};

/**
 * Display Ball at the specified location, facing the specified direction.
 * @param {number} i Ball index..
 * @param {number} x Horizontal grid (or fraction thereof).
 * @param {number} y Vertical grid (or fraction thereof).
 * @param {number} d Direction (0 - 15) or dance (16 - 17).
 */
Flappy.displayBall = function(i, x, y, d) {
  var ballIcon = document.getElementById('ball' + i);
  ballIcon.setAttribute('x',
                        x * Flappy.SQUARE_SIZE - d * Flappy.PEGMAN_WIDTH + 1);
  ballIcon.setAttribute('y',
                        y * Flappy.SQUARE_SIZE + Flappy.PEGMAN_Y_OFFSET - 8);

  var ballClipRect = document.getElementById('ballClipRect' + i);
  ballClipRect.setAttribute('x', x * Flappy.SQUARE_SIZE + 1);
  ballClipRect.setAttribute('y', ballIcon.getAttribute('y'));
};

/**
 * Display Paddle at the specified location
 * @param {number} x Horizontal grid (or fraction thereof).
 * @param {number} y Vertical grid (or fraction thereof).
 * @param {number} d Direction (0 - 15) or dance (16 - 17).
 */
// todo - introduce animation frame for bird (and rename to displayBird)
Flappy.displayPaddle = function(x, y, d) {
  var paddleIcon = document.getElementById('paddle');
  paddleIcon.setAttribute('x',
                          x * Flappy.SQUARE_SIZE - d * Flappy.PEGMAN_WIDTH + 1);
  paddleIcon.setAttribute('y',
                          y * Flappy.SQUARE_SIZE + Flappy.PEGMAN_Y_OFFSET - 8);

  var paddleClipRect = document.getElementById('paddleClipRect');
  paddleClipRect.setAttribute('x', x * Flappy.SQUARE_SIZE + 1);
  paddleClipRect.setAttribute('y', paddleIcon.getAttribute('y'));
};

/**
 * Display the score in the span element below the visualization.
 */
Flappy.displayScore = function() {
  var scoreElement = document.getElementById('bounce-score');
  scoreElement.innerText = flappyMsg.scoreText({
    playerScore: Flappy.playerScore,
    opponentScore: Flappy.opponentScore
  });
};

/**
 * Keep the direction within 0-3, wrapping at both ends.
 * @param {number} d Potentially out-of-bounds direction value.
 * @return {number} Legal direction value.
 */
Flappy.constrainDirection4 = function(d) {
  if (d < 0) {
    d += 4;
  } else if (d > 3) {
    d -= 4;
  }
  return d;
};

/**
 * Keep the direction within 0-15, wrapping at both ends.
 * @param {number} d Potentially out-of-bounds direction value.
 * @return {number} Legal direction value.
 */
Flappy.constrainDirection16 = function(d) {
  if (d < 0) {
    d += 16;
  } else if (d > 15) {
    d -= 16;
  }
  return d;
};

Flappy.timedOut = function() {
  return Flappy.tickCount > Flappy.timeoutFailureTick;
};

Flappy.allFinishesComplete = function() {
  var i;
  if (Flappy.paddleFinish_) {
    var finished, playSound;
    for (i = 0, finished = 0; i < Flappy.paddleFinishCount; i++) {
      if (!Flappy.paddleFinish_[i].finished) {
        if (essentiallyEqual(Flappy.paddleX, Flappy.paddleFinish_[i].x, 0.2) &&
            essentiallyEqual(Flappy.paddleY, Flappy.paddleFinish_[i].y, 0.2)) {
          Flappy.paddleFinish_[i].finished = true;
          finished++;
          playSound = true;

          // Change the finish icon to goalSuccess.
          var paddleFinishIcon = document.getElementById('paddlefinish' + i);
          paddleFinishIcon.setAttributeNS(
              'http://www.w3.org/1999/xlink',
              'xlink:href',
              skin.goalSuccess);
        }
      } else {
        finished++;
      }
    }
    if (playSound) {
      BlocklyApps.playAudio(
          (finished == Flappy.paddleFinishCount) ? 'win' : 'winGoal',
          {volume: 0.5});
    }
    return (finished == Flappy.paddleFinishCount);
  }
  else if (Flappy.ballFinish_) {
    for (i = 0; i < Flappy.ballCount; i++) {
      if (essentiallyEqual(Flappy.ballX[i], Flappy.ballFinish_.x, 0.2) &&
          essentiallyEqual(Flappy.ballY[i], Flappy.ballFinish_.y, 0.2)) {
        // Change the finish icon to goalSuccess.
        var ballFinishIcon = document.getElementById('ballfinish');
        ballFinishIcon.setAttributeNS(
            'http://www.w3.org/1999/xlink',
            'xlink:href',
            skin.goalSuccess);

        BlocklyApps.playAudio('win', {volume: 0.5});
        return true;
      }
    }
  }
  return false;
};
