var tiles = require('./tiles');
var Direction = tiles.Direction;
var SquareType = tiles.SquareType;

exports.PaddleSpeed = {
  VERY_SLOW: 0.04,
  SLOW: 0.06,
  NORMAL: 0.1,
  FAST: 0.15,
  VERY_FAST: 0.23
};

exports.BallSpeed = {
  VERY_SLOW: 0.04,
  SLOW: 0.06,
  NORMAL: 0.1,
  FAST: 0.15,
  VERY_FAST: 0.23
};

exports.random = function (values) {
  var key = Math.floor(Math.random() * values.length); 
  return values[key];
};

exports.setBallSpeed = function (id, value) {
  BlocklyApps.highlight(id);
  for (var i = 0; i < Bounce.ballCount; i++) {
    Bounce.ballS[i] = value;
  }
};

exports.setPaddleSpeed = function (id, value) {
  BlocklyApps.highlight(id);
  Bounce.paddleSpeed = value;
};

exports.playSound = function(id, soundName) {
  BlocklyApps.highlight(id);
  BlocklyApps.playAudio(soundName, {volume: 0.5});
};

exports.moveLeft = function(id) {
  BlocklyApps.highlight(id);
  Bounce.paddleX -= Bounce.paddleSpeed;
  if (Bounce.paddleX < 0) {
    Bounce.paddleX = 0;
  }
};

exports.moveRight = function(id) {
  BlocklyApps.highlight(id);
  Bounce.paddleX += Bounce.paddleSpeed;
  if (Bounce.paddleX > (Bounce.COLS - 1)) {
    Bounce.paddleX = Bounce.COLS - 1;
  }
};

exports.moveUp = function(id) {
  BlocklyApps.highlight(id);
  Bounce.paddleY -= Bounce.paddleSpeed;
  if (Bounce.paddleY < 0) {
    Bounce.paddleY = 0;
  }
};

exports.moveDown = function(id) {
  BlocklyApps.highlight(id);
  Bounce.paddleY += Bounce.paddleSpeed;
  if (Bounce.paddleY > (Bounce.ROWS - 1)) {
    Bounce.paddleY = Bounce.ROWS - 1;
  }
};

exports.incrementOpponentScore = function(id) {
  BlocklyApps.highlight(id);
  Bounce.opponentScore++;
  Bounce.displayScore();
};

exports.incrementPlayerScore = function(id) {
  BlocklyApps.highlight(id);
  Bounce.playerScore++;
  Bounce.displayScore();
};

exports.bounceBall = function(id) {
  BlocklyApps.highlight(id);

  var i;
  for (i = 0; i < Bounce.ballCount; i++) {
    if (Bounce.ballX[i] < 0) {
      Bounce.ballX[i] = 0;
      Bounce.ballD[i] = 2 * Math.PI - Bounce.ballD[i];
    } else if (Bounce.ballX[i] > (Bounce.COLS - 1)) {
      Bounce.ballX[i] = Bounce.COLS - 1;
      Bounce.ballD[i] = 2 * Math.PI - Bounce.ballD[i];
    }

    if (Bounce.ballY[i] < tiles.Y_TOP_BOUNDARY) {
      Bounce.ballY[i] = tiles.Y_TOP_BOUNDARY;
      Bounce.ballD[i] = Math.PI - Bounce.ballD[i];
    }

    var xPaddleBall = Bounce.ballX[i] - Bounce.paddleX;
    var yPaddleBall = Bounce.ballY[i] - Bounce.paddleY;
    var distPaddleBall = Bounce.calcDistance(xPaddleBall, yPaddleBall);

    if (distPaddleBall < tiles.PADDLE_BALL_COLLIDE_DISTANCE) {
      // paddle ball collision
      if (Math.cos(Bounce.ballD[i]) < 0) {
        // rather than just bounce the ball off a flat paddle, we offset the
        // angle after collision based on whether you hit the left or right side
        // of the paddle.  And then we cap the resulting angle to be in a
        // certain range of radians so the resulting angle isn't too flat
        var paddleAngleBias = (3 * Math.PI / 8) *
            (xPaddleBall / tiles.PADDLE_BALL_COLLIDE_DISTANCE);
        // Add 5 PI instead of PI to ensure that the resulting angle is positive
        // to simplify the ternary operation in the next statement
        Bounce.ballD[i] = ((Math.PI * 5) + paddleAngleBias - Bounce.ballD[i]) %
                           (Math.PI * 2);
        Bounce.ballD[i] = (Bounce.ballD[i] < Math.PI) ?
                            Math.min((Math.PI / 2) - 0.2, Bounce.ballD[i]) :
                            Math.max((3 * Math.PI / 2) + 0.2, Bounce.ballD[i]);
      }
    }
  }
};

