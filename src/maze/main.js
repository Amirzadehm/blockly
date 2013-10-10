var appMain = require('../appMain');
window.Maze = require('./maze');
var blocks = require('./blocks');
var skins = require('../skins');
var levels = require('./levels');

window.mazeMain = function(options) {
  options.skin = skins.load(options.baseUrl, options.skinId);
  options.blocksModule = blocks;
  appMain(window.Maze, levels, options);
};
