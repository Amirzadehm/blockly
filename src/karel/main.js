window.BlocklyApps = require('../base');
window.Maze = require('./karel');
var blocks = require('./blocks');

window.karelMain = function(options) {

  if (!options) {
    options = {};
  }

  if (options.readonly) {
    document.write(karelpage.readonly({}, null, {}));
  } else {
    document.write(karelpage.start({}, null, {
      page: BlocklyApps.PAGE,
      level: BlocklyApps.LEVEL,
      menu: BlocklyApps.DISPLAY_NAV,
      maxLevel: BlocklyApps.MAX_LEVEL,
      skin: BlocklyApps.SKIN_ID,
      baseUrl: BlocklyApps.BASE_URL
    }));
  }

  blocks.install(Blockly);

  window.addEventListener('load', function() {
    if (options.readonly) {
      BlocklyApps.initReadonly();
    } else {
      Maze.init();
    }
  });

};
