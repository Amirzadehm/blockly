var trophy = require('./templates/trophy.html');
var utils = require('./utils');
var readonly = require('./templates/readonly.html');
var codegen = require('./codegen');
var msg = require('../locale/current/common');

exports.displayFeedback = function(options) {
  options.numTrophies = numTrophiesEarned(options);

  var feedback = document.createElement('div');
  var feedbackMessage = getFeedbackMessage(options);
  var showCode = getShowCodeElement(options);
  var feedbackBlocks = new FeedbackBlocks(options);

  if (feedbackMessage) {
    feedback.appendChild(feedbackMessage);
  }
  if (options.numTrophies) {
    var trophies = getTrophiesElement(options);
    feedback.appendChild(trophies);
  }
  if (feedbackBlocks.div) {
    feedback.appendChild(feedbackBlocks.div);
  }
  if (showCode) {
    feedback.appendChild(showCode);
  }
  var canContinue = canContinueToNextLevel(options.feedbackType);
  feedback.appendChild(getFeedbackButtons(options.feedbackType,
                                          options.showPreviousLevelButton));

  var feedbackDialog = exports.createModalDialogWithIcon(options.Dialog,
                                                         feedback);
  var againButton = feedback.querySelector('#again-button');
  if (againButton) {
    utils.addClickTouchEvent(againButton, function() {
      feedbackDialog.hide();
    });
  }

  var previousLevelButton = feedback.querySelector('#back-button');
  if (previousLevelButton) {
    utils.addClickTouchEvent(previousLevelButton, function() {
      feedbackDialog.hide();
      options.backToPreviousLevel();
    });
  }

  var continueButton = feedback.querySelector('#continue-button');
  if (continueButton) {
    utils.addClickTouchEvent(continueButton, function() {
      feedbackDialog.hide();
      options.onContinue();
    });
  }

  feedbackDialog.show();

  if (feedbackBlocks.div) {
    feedbackBlocks.show();
  }
};

/**
 * Counts the number of blocks used.  Blocks are only counted if they are
 * not disabled, are deletable.
 * @return {number} Number of blocks used.
 */
exports.getNumBlocksUsed = function() {
  var i;
  if (BlocklyApps.editCode) {
    var codeLines = 0;
    // quick and dirty method to count non-blank lines that don't start with //
    var lines = getGeneratedCodeString().split("\n");
    for (i = 0; i < lines.length; i++) {
      if ((lines[i].length > 1) && (lines[i][0] != '/' || lines[i][1] != '/')) {
        codeLines++;
      }
    }
    return codeLines;
  }
  return getUserBlocks().length;
};

var getFeedbackButtons = function(feedbackType, showPreviousLevelButton) {
  var buttons = document.createElement('div');
  buttons.innerHTML = require('./templates/buttons.html')({
    data: {
      previousLevel:
        feedbackType ===
            BlocklyApps.TestResults.LEVEL_INCOMPLETE_FAIL &&
            showPreviousLevelButton,
      tryAgain: feedbackType !== BlocklyApps.TestResults.ALL_PASS,
      nextLevel: canContinueToNextLevel(feedbackType)
    }
  });

  return buttons;
};

var getFeedbackMessage = function(options) {
  var feedback = document.createElement('p');
  feedback.className = 'congrats';
  var message;
  switch (options.feedbackType) {
    case BlocklyApps.TestResults.EMPTY_BLOCK_FAIL:
      message = msg.emptyBlocksErrorMsg();
      break;
    case BlocklyApps.TestResults.TOO_FEW_BLOCKS_FAIL:
      message = msg.tooFewBlocksMsg();
      break;
    case BlocklyApps.TestResults.LEVEL_INCOMPLETE_FAIL:
      message = options.levelIncompleteError ||
          msg.levelIncompleteError();
      break;
    // For completing level, user gets at least one star.
    case BlocklyApps.TestResults.OTHER_1_STAR_FAIL:
      message = options.message;
      break;
    // Two stars for using too many blocks.
    case BlocklyApps.TestResults.TOO_MANY_BLOCKS_FAIL:
      message = msg.numBlocksNeeded({ numBlocks: BlocklyApps.IDEAL_BLOCK_NUM });
      break;
    case BlocklyApps.TestResults.OTHER_2_STAR_FAIL:
      message = msg.tooMuchWork();
      break;
    case BlocklyApps.TestResults.MISSING_BLOCK_UNFINISHED:
      /* fallthrough */
    case BlocklyApps.TestResults.MISSING_BLOCK_FINISHED:
      message = msg.missingBlocksErrorMsg();
      break;
    case BlocklyApps.TestResults.ALL_PASS:
      var finalLevel = (options.response &&
          (options.response.message == "no more levels"));
      var stageCompleted = 0;
      if (options.response && options.response.stage_changing) {
        stageCompleted = options.response.stage_changing.previous.number;
      }
      var msgParams = {
        numTrophies: options.numTrophies,
        stageNumber: stageCompleted
      };
      if (options.numTrophies > 0) {
        message = finalLevel ? msg.finalStageTrophies(msgParams) :
                               stageCompleted ?
                                  msg.nextStageTrophies(msgParams) :
                                  msg.nextLevelTrophies(msgParams);
      } else {
        message = finalLevel ? msg.finalStage() :
                               stageCompleted ?
                                   msg.nextStage(msgParams) :
                                   msg.nextLevel();
      }
      break;
    // Free plays
    case BlocklyApps.TestResults.FREE_PLAY:
      message = msg.reinfFeedbackMsg();
      break;
  }
  feedback.innerHTML = message;
  return feedback;
};

var numTrophiesEarned = function(options) {
  if (options.response && options.response.trophy_updates) {
    return options.response.trophy_updates.length;
  } else {
    return 0;
  }
};

var getTrophiesElement = function(options) {
  var html = "";
  for (var i = 0; i < options.numTrophies; i++) {
    html += trophy({
      img_url: options.response.trophy_updates[i][2],
      concept_name: options.response.trophy_updates[i][0]
    });
  }
  var trophies = document.createElement('div');
  trophies.innerHTML = html;
  return trophies;
};

var getShowCodeElement = function(options) {
  if (utils.isMobile()) {
    return;
  }
  if (canContinueToNextLevel(options.feedbackType)) {
    var linesWritten = exports.getNumBlocksUsed();
    var showCodeDiv = document.createElement('div');
    var lines = document.createElement('span');
    lines.className = 'linesOfCodeMsg';
    lines.innerHTML = msg.numLinesOfCodeWritten({
      numLines: linesWritten
    });
    if (options.response && options.response.total_lines &&
        (options.response.total_lines !== linesWritten)) {
      lines.innerHTML += '<br>' + msg.totalNumLinesOfCodeWritten({
        numLines: options.response.total_lines
      });
    }

    var showCodeLink = document.createElement('div');
    showCodeLink.innerHTML = require('./templates/showCode.html')();
    var button = showCodeLink.querySelector('#show-code-button');

    button.addEventListener('click', function() {
      var codeDiv = getGeneratedCodeElement();
      showCodeDiv.appendChild(codeDiv);
      button.style.display = 'none';
    });

    showCodeDiv.appendChild(lines);
    showCodeDiv.appendChild(showCodeLink);

    return showCodeDiv;
  }
};

/**
 * Determines whether the user can proceed to the next level, based on the level feedback
 * @param {number} feedbackType A constant property of BlocklyApps.TestResults,
 *     typically produced by BlocklyApps.getTestResults().
 */
var canContinueToNextLevel = function(feedbackType) {
  return (feedbackType === BlocklyApps.TestResults.ALL_PASS ||
    feedbackType === BlocklyApps.TestResults.TOO_MANY_BLOCKS_FAIL ||
    feedbackType ===  BlocklyApps.TestResults.OTHER_2_STAR_FAIL ||
    feedbackType ===  BlocklyApps.TestResults.FREE_PLAY);
};

/**
 * Retrieve a string containing the user's generated Javascript code.
 */
var getGeneratedCodeString = function() {
  if (BlocklyApps.editCode) {
    var codeTextbox = document.getElementById('codeTextbox');
    return (codeTextbox.innerText || codeTextbox.textContent);
  }
  else {
    return codegen.workspaceCode(Blockly);
  }
};

var FeedbackBlocks = function(options) {
  var missingBlocks = getMissingRequiredBlocks();
  if (missingBlocks.length === 0) {
    return;
  }
  if (options.feedbackType !== BlocklyApps.TestResults.MISSING_BLOCK_UNFINISHED &&
      options.feedbackType !== BlocklyApps.TestResults.MISSING_BLOCK_FINISHED) {
    return;
  }

  this.div = document.createElement('div');
  this.html = readonly({
    app: options.app,
    assetUrl: BlocklyApps.assetUrl,
    options: {
      readonly: true,
      locale: BlocklyApps.LOCALE,
      baseUrl: BlocklyApps.BASE_URL,
      cacheBust: BlocklyApps.CACHE_BUST,
      skinId: options.skin,
      blocks: generateXMLForBlocks(missingBlocks)
    }
  });
  this.iframe = document.createElement('iframe');
  this.iframe.setAttribute('id', 'feedbackBlocks');
  this.div.appendChild(this.iframe);
};

FeedbackBlocks.prototype.show = function() {
  var iframe = document.getElementById('feedbackBlocks');
  if (iframe) {
    var doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(this.html);
    doc.close();
  }
};

var getGeneratedCodeElement = function() {
  var infoMessage = BlocklyApps.editCode ?  "" : msg.generatedCodeInfo();
  var code = getGeneratedCodeString();

  var codeDiv = document.createElement('div');
  codeDiv.innerHTML = require('./templates/code.html')({
    message: infoMessage,
    code: code
  });

  return codeDiv;
};

exports.showGeneratedCode = function(Dialog) {
  var codeDiv = getGeneratedCodeElement();

  var buttons = document.createElement('div');
  buttons.innerHTML = require('./templates/buttons.html')({
    data: {
      ok: true
    }
  });
  codeDiv.appendChild(buttons);

  var dialog = exports.createModalDialogWithIcon(Dialog, codeDiv);

  var okayButton = buttons.querySelector('#ok-button');
  okayButton.addEventListener('click', function() {
    dialog.hide();
  });

  dialog.show();
};

/**
 * Check user's code for empty top-level blocks e.g. 'repeat'.
 * @return {boolean} true if block is empty (no blocks are nested inside).
 */
exports.hasEmptyTopLevelBlocks = function() {
  var code = codegen.workspaceCode(Blockly);
  return (/\{\s*\}/).test(code);
};

/**
 * Check whether the user code has all the blocks required for the level.
 * @return {boolean} true if all blocks are present, false otherwise.
 */
var hasAllRequiredBlocks = function() {
  return getMissingRequiredBlocks().length === 0;
};

/**
 * Get blocks that the user intends in the program, namely any that
 * are not disabled and can be deleted.
 * @return {Array<Object>} The blocks.
 */
var getUserBlocks = function() {
  var allBlocks = Blockly.mainWorkspace.getAllBlocks();
  var blocks = allBlocks.filter(function(block) {
    return !block.disabled && block.isDeletable();
  });
  return blocks;
};

/**
 * Check to see if the user's code contains the required blocks for a level.
 * This never returns more than BlocklyApps.NUM_REQUIRED_BLOCKS_TO_FLAG.
 * @return {!Array} array of array of strings where each array of strings is
 * a set of blocks that at least one of them should be used. Each block is
 * represented as the prefix of an id in the corresponding template.soy.
 */
var getMissingRequiredBlocks = function() {
  var missingBlocks = [];
  var code = null;  // JavaScript code, which is initalized lazily.
  if (BlocklyApps.REQUIRED_BLOCKS && BlocklyApps.REQUIRED_BLOCKS.length) {
    var blocks = getUserBlocks();
    // For each list of required blocks
    // Keep track of the number of the missing block lists. It should not be
    // bigger than BlocklyApps.NUM_REQUIRED_BLOCKS_TO_FLAG
    var missingBlockNum = 0;
    for (var i = 0;
         i < BlocklyApps.REQUIRED_BLOCKS.length &&
             missingBlockNum < BlocklyApps.NUM_REQUIRED_BLOCKS_TO_FLAG;
         i++) {
      var tests = BlocklyApps.REQUIRED_BLOCKS[i];
      // For each of the test
      // If at least one of the tests succeeded, we consider the required block
      // is used
      var usedRequiredBlock = false;
      for (var testId = 0; testId < tests.length; testId++) {
        var test = tests[testId].test;
        if (typeof test === 'string') {
          if (!code) {
            code = Blockly.Generator.workspaceToCode('JavaScript');
          }
          if (code.indexOf(test) !== -1) {
            // Succeeded, moving to the next list of tests
            usedRequiredBlock = true;
            break;
          }
        } else if (typeof test === 'function') {
          if (blocks.some(test)) {
            // Succeeded, moving to the next list of tests
            usedRequiredBlock = true;
            break;
          }
        } else {
          window.alert('Bad test: ' + test);
        }
      }
      if (!usedRequiredBlock) {
        missingBlockNum++;
        missingBlocks = missingBlocks.concat(BlocklyApps.REQUIRED_BLOCKS[i]);
      }
    }
  }
  return missingBlocks;
};

/**
 * Runs the tests and returns results.
 * @return {number} The appropriate property of BlocklyApps.TestResults.
 */
exports.getTestResults = function() {
  if (BlocklyApps.CHECK_FOR_EMPTY_BLOCKS && exports.hasEmptyTopLevelBlocks()) {
    return BlocklyApps.TestResults.EMPTY_BLOCK_FAIL;
  }
  if (!hasAllRequiredBlocks()) {
    if (BlocklyApps.levelComplete) {
      return BlocklyApps.TestResults.MISSING_BLOCK_FINISHED;
    } else {
      return BlocklyApps.TestResults.MISSING_BLOCK_UNFINISHED;
    }
  }
  var numBlocksUsed = exports.getNumBlocksUsed();
  if (!BlocklyApps.levelComplete) {
    if (BlocklyApps.IDEAL_BLOCK_NUM &&
        numBlocksUsed < BlocklyApps.IDEAL_BLOCK_NUM) {
      return BlocklyApps.TestResults.TOO_FEW_BLOCKS_FAIL;
    }
    return BlocklyApps.TestResults.LEVEL_INCOMPLETE_FAIL;
  }
  if (BlocklyApps.IDEAL_BLOCK_NUM &&
      numBlocksUsed > BlocklyApps.IDEAL_BLOCK_NUM) {
    return BlocklyApps.TestResults.TOO_MANY_BLOCKS_FAIL;
  } else {
    return BlocklyApps.TestResults.ALL_PASS;
  }
};

exports.createModalDialogWithIcon = function(Dialog, contentDiv) {
  var imageDiv = document.createElement('img');
  imageDiv.className = "modal-image";
  imageDiv.src = BlocklyApps.ICON;

  var modalBody = document.createElement('div');
  modalBody.appendChild(imageDiv);
  contentDiv.className += ' modal-content';
  modalBody.appendChild(contentDiv);

  return new Dialog({ body: modalBody });
};

/**
 * Creates the XML for blocks to be displayed in a read-only frame.
 * @param {Array} blocks An array of blocks to display (with optional args).
 * @return {string} The generated string of XML.
 */
var generateXMLForBlocks = function(blocks) {
  var blockXMLStrings = [];
  var blockX = 10;  // Prevent left output plugs from being cut off.
  var blockY = 0;
  var blockXPadding = 200;
  var blockYPadding = 120;
  var blocksPerLine = 2;
  var k, name;
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i];
    blockXMLStrings.push('<block', ' type="', block.type, '" x="',
                        blockX.toString(), '" y="', blockY, '">');
    if (block.titles) {
      var titleNames = Object.keys(block.titles);
      for (k = 0; k < titleNames.length; k++) {
        name = titleNames[k];
        blockXMLStrings.push('<title name="', name, '">',
                            block.titles[name], '</title>');
      }
    }
    if (block.values) {
      var valueNames = Object.keys(block.values);
      for (k = 0; k < valueNames.length; k++) {
        name = valueNames[k];
        blockXMLStrings.push('<value name="', name, '">',
                            block.values[name], '</value>');
      }
    }
    if (block.extra) {
      blockXMLStrings.push(block.extra);
    }
    blockXMLStrings.push('</block>');
    if ((i + 1) % blocksPerLine === 0) {
      blockY += blockYPadding;
      blockX = 0;
    } else {
      blockX += blockXPadding;
    }
  }
  return blockXMLStrings.join('');
};
