// This file was automatically generated from common.soy.
// Please don't edit this file by hand.

if (typeof apps == 'undefined') { var apps = {}; }


apps.messages = function(opt_data, opt_ignored, opt_ijData) {
  return '<div style="display: none"><span id="subtitle">a visual programming environment</span><span id="blocklyMessage">Blockly</span><span id="projectMessage">CS First</span><span id="codeTooltip">See generated JavaScript code. </span><span id="linkTooltip">Save and link to blocks.</span><span id="runTooltip">Run the program defined by the blocks in the \\nworkspace. </span><span id="runProgram">Run Program</span><span id="resetProgram">Reset</span><span id="dialogOk">OK</span><span id="dialogCancel">Cancel</span><span id="help">Help</span><span id="catLogic">Logic</span><span id="catLoops">Loops</span><span id="catMath">Math</span><span id="catText">Text</span><span id="catLists">Lists</span><span id="catColour">Colour</span><span id="catVariables">Variables</span><span id="catProcedures">Procedures</span><span id="httpRequestError">There was a problem with the request.</span><span id="linkAlert">Share your blocks with this link:\n\n%1</span><span id="hashError">Sorry, \'%1\' doesn\'t correspond with any saved program.</span><span id="xmlError">Could not load your saved file.  Perhaps it was created with a different version of Blockly?</span><span id="hintTitle">Hint:</span><span id="emptyBlocksErrorMessage">Remove empty blocks.</span><span id="tooFewBlocksMsg">You are using all of the necessary types of blocks, but try using more  of these types of blocks to complete this level.</span><span id="tooManyBlocksMsg">This level can be solved with <span id="idealNumberMessage"></span> blocks.</span><span id="missingBlocksErrorMsg">Try one or more of the blocks below to solve this level.</span><span id="levelIncompleteError">You are using all of the necessary types of blocks but not in the right way.</span><span id="nextLevelMsg">Congratulations! You have completed this level.</span><span id="finalLevelMsg">Congratulations! You have solved the final level.</span><span id="listVariable">list</span><span id="textVariable">text</span></div>';
};


apps.dialog = function(opt_data, opt_ignored, opt_ijData) {
  return '<div id="dialogShadow" class="dialogAnimate"></div><div id="dialogBorder"></div><div id="dialog"></div>';
};


apps.codeDialog = function(opt_data, opt_ignored, opt_ijData) {
  return '<div id="dialogCode" class="dialogHiddenContent"><pre id="containerCode"></pre>' + apps.ok(null, null, opt_ijData) + '</div>';
};


apps.storageDialog = function(opt_data, opt_ignored, opt_ijData) {
  return '<div id="dialogStorage" class="dialogHiddenContent"><div id="containerStorage"></div>' + apps.ok(null, null, opt_ijData) + '</div>';
};


apps.ok = function(opt_data, opt_ignored, opt_ijData) {
  return '<div class="farSide" style="padding: 1ex 3ex 0"><button class="secondary" onclick="BlocklyApps.hideDialog(true)">OK</button></div>';
};


apps.menu = function(opt_data, opt_ignored, opt_ijData) {
  return (! opt_data.menu) ? ' class="hide" ' : '';
};

;
// This file was automatically generated from template.soy.
// Please don't edit this file by hand.

if (typeof turtlepage == 'undefined') { var turtlepage = {}; }


turtlepage.interText = function(opt_data, opt_ignored, opt_ijData) {
  return '<span class="' + soy.$$escapeHtml(opt_data['class']) + 'Inter"><div id="reinfbubble"><span id="reinfMsg">' + soy.$$escapeHtml(opt_data.text) + '</span></div><img id="turtle" height=45 width=130 src="turtle.png"></span>';
};


turtlepage.prePicture = function(opt_data, opt_ignored, opt_ijData) {
  return '<span class="preInter"><div id="reinfbubble"><span id="reinfMsg">' + soy.$$escapeHtml(opt_data.text) + '</span></div><img id="turtle" height=45 width=130 src="turtle.png"><table><tr><br></tr><tr><td><img src="' + soy.$$escapeHtml(opt_data.image) + '"></td></tr><tr height=40><br><br></tr></table></span>';
};


turtlepage.preAnimation = function(opt_data, opt_ignored, opt_ijData) {
  return '<span class="preInter"><div id="reinfbubble"><span id="reinfMsg">' + soy.$$escapeHtml(opt_data.text) + '</span></div><img id="turtle" height=45 width=130 src="turtle.png"><p><button id="showButton" style="display: inline" class="launch" onclick="this.style.display = \'none\'; document.getElementById(\'animation\').style.display=\'inline\'; document.getElementById(\'continueButton\').style.display=\'inline\';">Show me</button></p><div id="animation" style="display: none"><table><tr><td><img src="' + soy.$$escapeHtml(opt_data.image) + '"></td></tr></table></div></span>';
};


turtlepage.polygon = function(opt_data, opt_ignored, opt_ijData) {
  return '<block type="procedures_defnoreturn" ' + opt_data.modifiers + '><mutation>' + ((opt_data.length == 0) ? '<arg name="length"></arg>' : '') + '</mutation><title name="NAME">' + opt_data.title + '</title><statement name="STACK"><block type="controls_repeat" ' + opt_data.modifiers + '><title name="TIMES">' + opt_data.sides + '</title><statement name="DO"><block type="draw_move" ' + opt_data.modifiers + '><value name="VALUE">' + ((opt_data.length == 0) ? '<block type="variables_get_length" ' + opt_data.modifiers + '></block>' : '<block type="math_number" ' + opt_data.modifiers + '><title name="NUM">' + opt_data.length + '</title></block>') + '</value><next><block type="draw_turn" ' + opt_data.modifiers + '><value name="VALUE"><block type="math_number" ' + opt_data.modifiers + '><title name="NUM">' + 360 / opt_data.sides + '</title></block></value></block></next></block></statement></block></statement></block>';
};


turtlepage.messages = function(opt_data, opt_ignored, opt_ijData) {
  return '<div id="MSG" style="display: none"><span id="colourTooltip">Changes the color of the pen.</span><span id="degrees">degrees</span><span id="hideTurtle">hide turtle</span><span id="moveBackward">move backward by</span><span id="moveForward">move forward by</span><span id="moveForwardTooltip">Moves the turtle forward.</span><span id="jumpBackward">jump backward by</span><span id="jumpForward">jump forward by</span><span id="jumpForwardTooltip">Moves the turtle forward without leaving any marks.</span><span id="moveTooltip">Moves the turtle forward or backward by the \\nspecified amount. </span><span id="penDown">pen down</span><span id="penTooltip">Lifts or lowers the pen, to start or stop drawing.</span><span id="penUp">pen up</span><span id="dots">dots</span><span id="setColour">set color</span><span id="setWidth">set width</span><span id="showTurtle">show turtle</span><span id="turnLeft">turn left by</span><span id="turnRightTooltip">Turns the turtle right by the specified angle.</span><span id="turnRight">turn right by</span><span id="turnTooltip">Turns the turtle left or right by the specified \\nnumber of degrees. </span><span id="turtleVisibilityTooltip">Makes the turtle (green circle and arrow) \\nvisible or invisible. </span><span id="widthTooltip">Changes the width of the pen.</span><span id="loopVariable">counter</span><span id="blocksUsed">Blocks used: %1</span><span id="notReadyForLevel">' + ((opt_ijData.page == 3 && opt_ijData.level == 8) ? 'You need to complete level 7 before doing this level.' : (opt_ijData.page == 3 && opt_ijData.level == 9) ? 'You need to complete levels 7 and 8 before doing this level.' : '') + '</span><span id="notBlackColour">You need to set a color other than black for this level.</span><span id="tooFewColours">You need to use at least %1 different colors on this level.  You used only %2.</span><span id="wrongColour">Your picture is the wrong color.  For this level, it needs to be %1.</span><span id="drawASquare">draw a square</span><span id="lengthParameter">length</span><span id="drawASnowman">draw a snowman</span><span id="heightParameter">height</span><span id="title">CS First: Turtle Graphics %1</span><span id="numBlocksNeeded">This level can be solved with %1 blocks.  You used %2.</span></div>';
};


turtlepage.showInterstitials = function(opt_data, opt_ignored, opt_ijData) {
  var output = '<div id="interstitial" style="display: none;"><div style="margin-left: 50px;">';
  if (opt_ijData.page == 1) {
    switch (opt_ijData.level) {
      case 2:
        output += turtlepage.prePicture({text: 'I can draw in different colors.  Choose what color you would like me to use with the "set color" block.  Blocks for changing color don\'t count to your block count used for scoring, so go wild!', image: 'set-colour.png'}, null, opt_ijData);
        break;
      case 3:
        output += turtlepage.preAnimation({text: 'Tired of dragging and dropping?  Let the "repeat" block do the work for you.', image: 'repeat-intro.gif'}, null, opt_ijData);
        break;
      case 4:
        output += turtlepage.prePicture({text: 'Do you like surprises?  Use the "random color" block to let me pick the color.', image: 'random-colour.png'}, null, opt_ijData);
        break;
      case 5:
        output += turtlepage.interText({text: 'Did you know you can copy and paste a block?', class: 'pre'}, null, opt_ijData);
        break;
      case 6:
        output += turtlepage.interText({text: 'I can move backward, not just forward.', class: 'pre'}, null, opt_ijData);
        break;
      case 8:
        output += turtlepage.prePicture({text: 'Do you ever get tired of waiting for me?  You can make me move faster (or slower) with the speed slider.', image: 'slider.gif'}, null, opt_ijData);
        break;
      case 10:
        output += turtlepage.prePicture({text: 'Congratulations on completing this tutorial.  Just for fun, here\'s a new block that changes how wide of lines I draw.  We\'ve been using a default width of 5.', image: 'set-width.png'}, null, opt_ijData);
        break;
    }
  } else if (opt_ijData.page == 2) {
    switch (opt_ijData.level) {
      case 1:
        output += turtlepage.interText({text: 'To make room for new blocks, we\'ve put the blocks into categories.  You may have to look around for your old favorite blocks, but they\'re all there.', class: 'pre'}, null, opt_ijData);
        break;
      case 2:
        output += turtlepage.interText({text: 'We\'ve added a new category for "Functions", a powerful new type of block.', class: 'pre'}, null, opt_ijData);
        break;
      case 3:
        output += turtlepage.interText({text: 'Wondering why it\'s better to use "repeat" than copying and pasting the blocks three times?  See why on the next level', class: 'pre'}, null, opt_ijData);
        break;
      case 4:
        output += turtlepage.prePicture({text: 'Here\'s how I solved the previous level.  Make sure you understand it before proceeding.', image: 'three-squares.png'}, null, opt_ijData);
        break;
      case 5:
        output += turtlepage.interText({text: 'Let\'s explore what we can do with squares of different sizes...', class: 'pre'}, null, opt_ijData);
        break;
      case 6:
        output += turtlepage.prePicture({text: 'Wouldn\'t it be nice if you could tell me to count by tens from 50 to 100, drawing a square each time?  Well you can -- with the new "count with" block.  The programs on the left and right do the same thing.', image: 'count-loop-square.png'}, null, opt_ijData);
        break;
      case 7:
        output += turtlepage.prePicture({text: 'This code draws a boxy spiral.  You\'ll need to figure out what should go in the blanks on the "count with" block to do it with fewer blocks on the next level.', image: 'spiral-quiz.png'}, null, opt_ijData);
        break;
      case 8:
        output += turtlepage.interText({text: 'We\'ve given you two new blocks: "jump forward", which moves the turtle without leaving a trail, and "draw a snowman", which draws an elephant -- just kidding.', class: 'pre'}, null, opt_ijData);
        break;
      case 9:
        output += turtlepage.interText({text: 'You don\'t need to always count from a low number to a high number.  You can count from high to low too.', class: 'pre'}, null, opt_ijData);
        break;
    }
  } else if (opt_ijData.page == 3) {
    switch (opt_ijData.level) {
      case 1:
        output += turtlepage.interText({text: 'You\'ll now learn how to create new blocks, which are called "functions".', class: 'pre'}, null, opt_ijData);
        break;
      case 2:
        output += turtlepage.preAnimation({text: 'Here\'s how the "draw a square" block was created.  On this level, you\'ll create your own "draw a triangle" block.', image: 'define-draw-a-square.gif'}, null, opt_ijData) + turtlepage.interText({text: 'Congratulations on adding a new block!  That\'s a huge step for a programmer.  Dividing big tasks into bite-sized pieces is what makes large programs possible.', class: 'post'}, null, opt_ijData);
        break;
      case 5:
        output += turtlepage.interText({text: 'The new blocks that you define can be used just like the built-in blocks, including being used within another block definition...', class: 'pre'}, null, opt_ijData);
        break;
      case 6:
        output += turtlepage.preAnimation({text: 'Let me show you how the input was added to "draw a square".  You\'ll need to know this for this level, where you\'ll add an input to "draw a triangle".', image: 'draw-a-square-add-input.gif'}, null, opt_ijData);
        break;
      case 8:
        output += turtlepage.interText({text: 'It can be useful for a function to put the turtle at a good ending position, to help with building up bigger pictures.', class: 'pre'}, null, opt_ijData);
        break;
      case 9:
        output += turtlepage.interText({text: 'You now know how to control the turtle, use loops ("repeat" and "count from"), and write and use functions.  Congratulations on becoming a programmer!', class: 'post'}, null, opt_ijData);
        break;
    }
  }
  output += '</div></div>';
  return output;
};


turtlepage.startBlocks = function(opt_data, opt_ignored, opt_ijData) {
  var output = '<div id="start_blocks" style="display: none">';
  if (opt_ijData.page == 1) {
    switch (opt_ijData.level) {
      case 1:
      case 2:
        output += '<block type="draw_move_inline" x="20" y="20"></block>';
        break;
      case 3:
      case 4:
      case 5:
      case 6:
        output += '<block type="controls_repeat" x="20" y="20"><title name="TIMES">' + ((opt_ijData.level == 3) ? '4' : '3') + '</title></block>';
        break;
      case 7:
        output += '<block type="draw_turn_inline" x="20" y="20"><title name="DIR">turnRight</title><title name="VALUE">90</title></block>';
        break;
      case 8:
        output += '<block type="draw_colour" x="20" y="100"><value name="COLOUR"><block type="colour_random"></block></value><next><block type="draw_move_inline"><title name="DIR">moveForward</title><title name="VALUE">100</title><next><block type="draw_move_inline"><title name="DIR">moveBackward</title><title name="VALUE">100</title><next><block type="draw_turn_inline"><title name="DIR">turnRight</title><title name="VALUE">45</title></block></next></block></next></block></next></block>';
        break;
      case 9:
        output += '<block type="controls_repeat" deletable="false" movable="false" x="20" y="20"><title name="TIMES">??</title><statement name="DO"><block type="draw_move" editable="false" deletable="false" movable="false"><value name="VALUE"><block type="math_number" editable="false" deletable="false" movable="false"><title name="NUM">1</title></block></value><next><block type="draw_turn" editable="false" deletable="false" movable="false"><value name="VALUE"><block type="math_number" editable="false" deletable="false" movable="false"><title name="NUM">1</title></block></value></block></next></block></statement></block>';
        break;
      case 10:
        output += '<block type="draw_move_inline" x="20" y="20"><title name="DIR">moveForward</title><title name="VALUE">100</title></block>';
        break;
    }
  } else if (opt_ijData.page == 2) {
    if (opt_ijData.level == 3 || opt_ijData.level == 5) {
      output += '<block type="draw_a_square" inline="true"><value name="VALUE"><block type="math_number"><title name="NUM">' + ((opt_ijData.level == 3) ? '100' : '50') + '</title></block></value></block>';
    } else if (opt_ijData.level == 4) {
      output += '<block type="controls_repeat" deletable="false" movable="false"><title name="TIMES">???</title><statement name="DO"><block type="draw_colour"><value name="COLOUR"><block type="colour_random"></block></value><next><block type="draw_a_square" inline="true" editable="false" deletable="false" movable="false"><value name="VALUE"><block type="math_number" deletable="false" movable="false"><title name="NUM">???</title></block></value><next><block type="draw_turn" editable="false" deletable="false" movable="false"><value name="VALUE"><block type="math_number" deletable="false" movable="false"><title name="NUM">???</title></block></value></block></next></block></next></block></statement></block>';
    } else if (opt_ijData.level == 6) {
      output += '<block type="controls_for_counter" inline="true" x="20" y="20"><title name="VAR">counter</title><value name="FROM"><block type="math_number"><title name="NUM">' + ((opt_ijData.level == 6) ? '50' : '10') + '</title></block></value><value name="TO"><block type="math_number"><title name="NUM">' + ((opt_ijData.level == 6) ? '90' : '100') + '</title></block></value><value name="BY"><block type="math_number"><title name="NUM">10</title></block></value><statement name="DO"><block type="draw_a_square" inline="true"><value name="VALUE"><block type="math_number"><title name="NUM">10</title></block></value></block></statement></block>';
    } else if (opt_ijData.level == 7) {
      for (var i524 = 25; i524 < 61; i524 += 5) {
        output += '<block type="draw_move" ' + ((i524 == 25) ? 'x="300" y="100"' : '') + ' inline="false" editable="false" disabled="true"><title name="DIR">moveForward</title><value name="VALUE"><block type="math_number" disabled="true"><title name="NUM">' + soy.$$escapeHtml(i524) + '</title></block></value><next><block type="draw_turn" inline="false" editable="false" disabled="true"><title name="DIR">turnRight</title><value name="VALUE"><block type="math_number" disabled="true"><title name="NUM">90</title></block></value><next>';
      }
      for (var i532 = 5; i532 < 25; i532 += 5) {
        output += '</block></next></block></next>';
      }
    } else if (opt_ijData.level == 8 || opt_ijData.level == 9) {
      output += '<block type="draw_a_snowman" x="20" y="20"><value name="VALUE"><block type="math_number"><title name="NUM">150</title></block></value></block>';
    } else if (opt_ijData.level == 10) {
      output += '<block type="draw_width" inline="false" x="158" y="67"><value name="WIDTH"><block type="math_number"><title name="NUM">1</title></block></value><next><block type="controls_for_counter" inline="true"><title name="VAR">length</title><value name="FROM"><block type="math_number"><title name="NUM">1</title></block></value><value name="TO"><block type="math_number"><title name="NUM">100</title></block></value><value name="BY"><block type="math_number"><title name="NUM">1</title></block></value><statement name="DO"><block type="draw_move" inline="false"><title name="DIR">moveForward</title><value name="VALUE"><block type="variables_get_length"></block></value><next><block type="draw_turn" inline="false"><title name="DIR">turnRight</title><value name="VALUE"><block type="math_number"><title name="NUM">91</title></block></value></block></next></block></statement></block></next></block>';
    }
  } else {
    output += turtlepage.polygon({title: 'draw a square', modifiers: 'x="20" y="20" editable="false" deletable="false" movable="false"', sides: 4, length: (opt_ijData.level >= 6) ? '0' : '100'}, null, opt_ijData) + ((opt_ijData.level == 1) ? turtlepage.polygon({title: 'draw a circle', modifiers: 'x="340" y="20" editable="false" deletable="false" movable="false"', sides: 360, length: '1'}, null, opt_ijData) : '') + ((opt_ijData.level == 2) ? '<block type="procedures_defnoreturn" x="20" y="175"><title name="NAME">draw a triangle</title></block>' : (opt_ijData.level >= 3) ? turtlepage.polygon({title: 'draw a triangle', modifiers: (opt_ijData.level == 6) ? 'x="20" y="190"' : 'x="360" y="20" editable="false" deletable="false"', sides: 3, length: (opt_ijData.level >= 7) ? '0' : '100'}, null, opt_ijData) : '') + ((opt_ijData.level == 7) ? '<block type="procedures_defnoreturn" x="20" y="200"><mutation>' + ((opt_ijData.level == 11) ? '<arg name="length"></arg>' : '') + '</mutation><title name="NAME">draw a house</title><statement name="STACK"><block type="procedures_callnoreturn" inline="false"><mutation name="draw a square"><arg name="length"></mutation><value name="ARG0">' + ((opt_ijData.level == 7) ? '<block type="math_number"><title name="NUM">100</title></block>' : '<block type="variables_get_length"></block>') + '</value><next><block type="draw_move" inline="true"><title name="DIR">moveForward</title><value name="VALUE">' + ((opt_ijData.level == 7) ? '<block type="math_number"><title name="NUM">100</title></block>' : '<block type="variables_get_length"></block>') + '</value><next><block type="draw_turn" inline="true"><title name="DIR">turnRight</title><value name="VALUE"><block type="math_number"><title name="NUM">30</title></block></value><next><block type="procedures_callnoreturn" inline="false"><mutation name="draw a triangle"><arg name="length"></arg></mutation><value name="ARG0">' + ((opt_ijData.level == 7) ? '<block type="math_number"><title name="NUM">100</title></block>' : '<block type="variables_get_length"></block>') + '</value></block></next></block></next></block></next></block></statement></block>' : '');
  }
  output += '</div>';
  return output;
};


turtlepage.showInstructions = function(opt_data, opt_ignored, opt_ijData) {
  var output = '';
  switch (opt_ijData.page) {
    case 1:
      switch (opt_ijData.level) {
        case 1:
          output += 'I\'m a turtle with chalk on my belly. Stack up blocks and press "Run Program" to make me draw the shown picture.';
          break;
        case 2:
          output += 'Draw a square, making each side a different color.';
          break;
        case 3:
          output += 'Make a square using only 3 blocks.  (Remember that blocks to set color are free.)';
          break;
        case 4:
          output += 'Draw a triangle whose sides are all 100 dots and are in random colors.  You\'ll have to figure out how far to turn.';
          break;
        case 5:
          output += 'Draw a triangle and then a square to draw an envelope.';
          break;
        case 6:
          output += 'Can you figure out how draw this triangle and square?';
          break;
        case 7:
          output += 'See if you can draw these green glasses.';
          break;
        case 8:
          output += 'After trying out these blocks, see what happens if you make them repeat 8 times.  It should look a little different every time you run it.';
          break;
        case 9:
          output += 'Figure out what number to replace the question marks with to draw a circle.';
          break;
        case 10:
          output += 'Draw anything you want. Some ideas are a stick figure, snowflake, or spiral.  You could also try out the new "set width" block.  Have fun!';
          break;
      }
      break;
    case 2:
      switch (opt_ijData.level) {
        case 1:
          output += 'Find the familiar blocks in the new categories to draw a square in your favorite color.';
          break;
        case 2:
          output += 'Use the new "draw a square" block, found in the "Functions" category, to draw a small green square.';
          break;
        case 3:
          output += 'Use the "repeat" block to draw 3 squares of size 100, each 120 degrees apart, in random colors.';
          break;
        case 4:
          output += 'Now change the code to draw 36 squares, each 10 degrees apart.';
          break;
        case 5:
          output += 'Draw squares with sides of 50, 60, 70, 80, and 90 dots.  You\'ll need lots of blocks.';
          break;
        case 6:
          output += 'Modify this program with the "counter" block (found in the Variables category) to draw the same series of squares with fewer blocks than on the previous level.';
          break;
        case 7:
          output += 'Replace the pale (disabled) blocks with a "count with" block (in the Loops category) and "counter" block (in the Variables category) to draw the same spiral.';
          break;
        case 8:
          output += 'Draw three snowmen 150 dots tall in different colors, 100 dots apart.  Use the new "draw a snowman" function and "jump forward" block.';
          break;
        case 9:
          output += 'Use a "count with" loop to draw a family of snowmen with heights of 110, 100, 90, 80, and 70 dots, each 60 dots apart.';
          break;
        case 10:
          output += 'Draw whatever you want.  One idea is experimenting with different types of spirals.  What happens if you change the turn amount, rather than the move amount?  TODO: Add starting blocks.';
          break;
      }
      break;
    case 3:
      switch (opt_ijData.level) {
        case 1:
          output += 'You can now see how the "draw a square" and "draw a circle" functions are defined.  Defining a function doesn\'t run its blocks.  You have to pull out the "draw a square" block to actually draw a square.';
          break;
        case 2:
          output += 'Using the "draw a square" function as an example, create a "draw a triangle" function and use it.';
          break;
        case 3:
          output += 'Draw triangular fences around the cats and a square fence around the cow.  Tip: Test the program as you go along.';
          break;
        case 4:
          output += 'See if you can figure out how to use "draw a square" and "draw a triangle" (and some other blocks) to draw a house around the lion.';
          break;
        case 5:
          output += 'Now create a "draw a house" function and use it house two cats.';
          break;
        case 6:
          output += 'Using "draw a square" as an example, add an input named "length" to "draw a triangle".  Then, draw triangles in different colors around the animals.';
          break;
        case 7:
          output += 'Add a "height" input to "draw a house" and build a big house for the elephant.';
          break;
        case 8:
          output += 'Here are all of the blocks from the previous level.  Modify "draw a house" so the turtle ends up at the bottom right corner of the new house.  Use this modified function to house all the animals.';
          break;
        case 9:
          output += 'Use a "count with" block and your code from the previous level to draw houses of size 50, 100, and 150 in different colors.';
          break;
        case 10:
          output += 'You\'re now free to do whatever you want.  One idea is to try running this program with different turn amounts (higher or lower than 90).  Other ideas are to draw a star, circle, heart, or animal.';
          break;
      }
      break;
  }
  return output;
};


turtlepage.start = function(opt_data, opt_ignored, opt_ijData) {
  var output = turtlepage.messages(null, null, opt_ijData) + turtlepage.startBlocks(null, null, opt_ijData) + '<script type="text/javascript" src="../blockly_compressed.js"><\/script><script type="text/javascript" src="../javascript_compressed.js"><\/script><script type="text/javascript" src="../' + soy.$$escapeHtml(opt_ijData.langSrc) + '"><\/script><script type="text/javascript" src="blocks.js"><\/script><script type="text/javascript" src="../slider.js"><\/script><script type="text/javascript" src="answers.js"><\/script><table width="100%" ' + apps.menu({menu: opt_ijData.menu}, null, opt_ijData) + ' style="border-bottom: 1px solid #DBDBDB;"><tr><td><h1><span id="title"><a href="https://sites.google.com/site/computersciencefirst/">CS First</a> : ';
  switch (opt_ijData.page) {
    case 1:
      output += 'Turtle 1';
      break;
    case 2:
      output += 'Turtle 2';
      break;
    case 3:
      output += 'Turtle 3';
      break;
  }
  output += '</span> &nbsp; ';
  for (var i728 = 1; i728 < 11; i728++) {
    output += ' ' + ((i728 == opt_ijData.level) ? (i728 > 9) ? '<span class="selected doubleDigit tab">' + soy.$$escapeHtml(i728) + '</span>' : '<span class="selected tab">' + soy.$$escapeHtml(i728) + '</span>' : (i728 < opt_ijData.level) ? '<a class="tab previous" href="?lang=' + soy.$$escapeHtml(opt_ijData.lang) + '&page=' + soy.$$escapeHtml(opt_ijData.page) + '&level=' + soy.$$escapeHtml(i728) + '">' + soy.$$escapeHtml(i728) + '</a>' : '<a class="tab" href="?lang=' + soy.$$escapeHtml(opt_ijData.lang) + '&page=' + soy.$$escapeHtml(opt_ijData.page) + '&level=' + soy.$$escapeHtml(i728) + '">' + soy.$$escapeHtml(i728) + '</a>');
  }
  output += '</h1></td><td class="farSide"><button id="helpButton" onclick="BlocklyApps.showHelp(true, ' + soy.$$escapeHtml(opt_ijData.level) + ', false);">Help</button></td></tr></table><div id="bubble"><div id="prompt">' + turtlepage.showInstructions(null, null, opt_ijData) + '</div></div><div id="blockCount"></div><div id="visualization"><canvas id="scratch" width="400" height="400" style="display: none"></canvas><canvas id="answer" width="400" height="400" style="display: none"></canvas><canvas id="images" width="400" height="400" style="display: none"></canvas><canvas id="display" width="400" height="400"></canvas></div><table style="padding-top: 1em;" width=400><tr><td style="width: 190px; text-align: center"><svg id="slider" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="150" height="50"><!-- Slow icon. --><clipPath id="slowClipPath"><rect width=26 height=12 x=5 y=14 /></clipPath><image xlink:href="icons.png" height=42 width=84 x=-21 y=-10 clip-path="url(#slowClipPath)" /><!-- Fast icon. --><clipPath id="fastClipPath"><rect width=26 height=16 x=120 y=10 /></clipPath><image xlink:href="icons.png" height=42 width=84 x=120 y=-11 clip-path="url(#fastClipPath)" /></svg></td><td style="width: 15px;"><img id="spinner" style="visibility: hidden;" src="loading.gif" height=15 width=15></td><td style="width: 190px; text-align: center"><button id="runButton" class="launch" onclick="Turtle.runButtonClick();"><img src="../media/1x1.gif" class="run icon21">Run</button><button id="resetButton" class="launch" onclick="BlocklyApps.resetButtonClick();" style="display: none"><img src="../media/1x1.gif" class="stop icon21">Reset</button></td></tr></table><div id="toolbarDiv"><button title="See generated JavaScript code. " onclick="BlocklyApps.showCode(this);"><img src=\'../media/1x1.gif\' class="code icon21"></button><button id="linkButton" title="See generated JavaScript code. " onclick="BlocklyStorage.link();"><img src=\'../media/1x1.gif\' class="link icon21"></button></div>' + turtlepage.toolbox(null, null, opt_ijData) + '<div id="blockly"></div>' + turtlepage.feedback(null, null, opt_ijData);
  return output;
};


turtlepage.feedback = function(opt_data, opt_ignored, opt_ijData) {
  return apps.dialog(null, null, opt_ijData) + apps.codeDialog(null, null, opt_ijData) + apps.storageDialog(null, null, opt_ijData) + '<div id="help" class="dialogHiddenContent"><div style="padding-bottom: 0.7ex;"><br><img class="stars feedback" id="star1" src="../star1.png"><img class="stars feedback" id="star2" src="../star2.png"><img class="stars feedback" id="star3" src="../star3.png"><ul id="levelFeedbackText"><span id="hintTitle" class="feedback" style="display: none; margin-left: -30px">Hints:</span><li id="nextLevelMsg" style="display: none; margin-left: -40px;">Congratulations! You have completed this level.</li><li id="finalLevelMsg" style="display: none; margin-left: -40px;">Congratulations! You have solved the final level.</li><li id="emptyBlocksError" class="feedback" style="display: none">Remove empty blocks.</li><li id="missingBlocksError" class="feedback" style="display: none">Try one or more of the blocks below to solve this level.</li><li id="tooManyBlocksError" class="feedback" style="display: none">This level can be solved with <span id="idealNumberMessage"></span> blocks.</li><li id="tooFewBlocksError" class="feedback" style="display: none">You are using all of the necessary types of blocks, but try using more  of these types of blocks to complete this level.</li><li id="levelIncompleteError" class="feedback" style="display: none">You are using all of the necessary types of blocks but not in the right way.</li><li id="appSpecificOneStarFeedback" class="feedback" style="display: none"></li><li id="appSpecificTwoStarFeedback" class="feedback" style="display: none">You made me do a lot of work!  Could you try repeating fewer times?</li></ul><iframe id="feedbackBlocks" class="feedback" style="margin-left: 50px; height: 80px; width: 500px; border: none; display: none;" src=""></iframe>' + turtlepage.showInterstitials(null, null, opt_ijData) + '</div><div id="returnToLevelButton" style="display: none;">' + apps.ok(null, null, opt_ijData) + '</div><div style="text-align: center"><button id="tryAgainButton" class="launch" style="display: none" onclick="BlocklyApps.goToNextLevelOrReset(false);">Try again</button><button id="continueButton" class="launch" style="display: none" onclick="BlocklyApps.goToNextLevelOrReset(true);">Continue</button></div></div>';
};


turtlepage.toolbox = function(opt_data, opt_ignored, opt_ijData) {
  return '<xml id="toolbox" style="display: none;">' + ((opt_ijData.page == 1) ? '<block type="draw_move_inline"></block>"><block type="draw_turn_inline' + ((opt_ijData.level <= 8) ? '_restricted' : '') + '"><title name="VALUE">90</title></block>' + ((opt_ijData.level >= 2) ? '<block type="draw_colour"><value name="COLOUR"><block type="colour_picker"></block></value></block>' : '') + ((opt_ijData.level >= 4) ? '<block type="draw_colour"><value name="COLOUR"><block type="colour_random"></block></value></block>' : '') + ((opt_ijData.level >= 3) ? '<block type="controls_repeat"><title name="TIMES">4</title></block>' : '') + ((opt_ijData.level == 10) ? '<block type="draw_width" inline="false" x="158" y="67"><value name="WIDTH"><block type="math_number"><title name="NUM">1</title></block></value></block>' : '') : (opt_ijData.page == 2 || opt_ijData.page == 3) ? '<category name="Actions"><block type="draw_move"><value name="VALUE"><block type="math_number"><title name="NUM">100</title></block></value></block>' + ((opt_ijData.page == 2 && opt_ijData.level >= 8) ? '<block type="jump"><value name="VALUE"><block type="math_number"><title name="NUM">50</title></block></value></block>' : '') + '<block type="draw_turn"><value name="VALUE"><block type="math_number"><title name="NUM">90</title></block></value></block></category><category name="Color"><block type="draw_colour"><value name="COLOUR"><block type="colour_picker"></block></value></block><block type="draw_colour"><value name="COLOUR"><block type="colour_random"></block></value></block></category>' + ((opt_ijData.page == 2 && opt_ijData.level >= 2) ? '<category name="Functions"><block type="draw_a_square" inline="true"><value name="VALUE"><block type="math_number"><title name="NUM">100</title></block></value></block>' + ((opt_ijData.level >= 8) ? '<block type="draw_a_snowman" inline="true"><value name="VALUE"><block type="math_number"><title name="NUM">100</title></block></value></block>' : '') + '</category>' : (opt_ijData.page == 3) ? (opt_ijData.level == 1) ? '<category name="Functions"><block type="procedures_callnoreturn"><mutation name="draw a circle"></mutation></block><block type="procedures_callnoreturn"><mutation name="draw a square"></mutation></block></category>' : '<category name="Functions" custom="PROCEDURE"></category>' : '') + '<category name="Loops">' + ((opt_ijData.page == 2 && opt_ijData.level >= 5 || opt_ijData.page == 3 && opt_ijData.level >= 9) ? '<block type="controls_for_counter"><value name="FROM"><block type="math_number"><title name="NUM">1</title></block></value><value name="TO"><block type="math_number"><title name="NUM">100</title></block></value><value name="BY"><block type="math_number"><title name="NUM">10</title></block></value></block>' : '') + '<block type="controls_repeat"><title name="TIMES">4</title></block></category><category name="Math"><block type="math_number"></block>' + ((opt_ijData.level == 10) ? '<block type="math_arithmetic" inline="true"></block><block type="math_random_int"><value name="FROM"><block type="math_number"><title name="NUM">1</title></block></value><value name="TO"><block type="math_number"><title name="NUM">100</title></block></value></block><block type="math_random_float"></block>' : '') + '</category>' + ((opt_ijData.page == 2 && opt_ijData.level >= 6) ? '<category name="Variables"><block type="variables_get_counter"></block></category>' : (opt_ijData.page == 3 && opt_ijData.level >= 6) ? '<category name="Variables">' + ((opt_ijData.level >= 9) ? '<block type="variables_get_counter"></block>' : '') + ((opt_ijData.level >= 7) ? '<block type="variables_get_height"></block>' : '') + ((opt_ijData.level == 6 || opt_ijData.level == 10) ? '<block type="variables_get_length"></block>' : '') + '</category>' : '') : '') + '</xml>';
};


turtlepage.readonly = function(opt_data, opt_ignored, opt_ijData) {
  return turtlepage.messages(null, null, opt_ijData) + '<script type="text/javascript" src="../blockly_compressed.js"><\/script><script type="text/javascript" src="../' + soy.$$escapeHtml(opt_ijData.langSrc) + '"><\/script><script type="text/javascript" src="blocks.js"><\/script><div id="blockly"></div>';
};
