exports.addReadyListener = function(callback) {
  if (document.readyState === "complete") {
    setTimeout(callback, 1);
  } else {
    window.addEventListener('load', callback, false);
  }
};

exports.getText = function(node) {
  return node.innerText || node.textContent;
};

exports.setText = function(node, string) {
  if (node.innerText) {
    node.innerText = string;
  } else {
    node.textContent = string;
  }
};

exports.addClickTouchEvent = function(element, handler) {
  if ('ontouchend' in document.documentElement) {
    element.addEventListener('touchend', handler, false);
  }
  element.addEventListener('click', handler, false);
};

// A map from standard touch events to various aliases.
var TOUCH_MAP = {
  //  Incomplete list, add as needed.
  'onmouseup': {
    'standard': 'ontouchend',
    'ie10': 'onmspointerup',
    'ie11': 'onpointerup'
  },
  'onmousedown': {
    'standard': 'ontouchstart',
    'ie10': 'onmspointerdown',
    'ie11': 'onpointerdown'
  }
};

// For the given element, extend the current mouse handler to handle touch
// events. This should be handled automatically by browser but Blockly captures
// certain touch events and keeps them from bubbling.
exports.aliasTouchToMouse = function(element, mouseEvent) {
  var aliases = TOUCH_MAP[mouseEvent];

  var isIE11Touch = window.navigator.pointerEnabled;
  var ie11TouchEvent = aliases.ie11;

  var isIE10Touch = window.navigator.msPointerEnabled;
  var ie10TouchEvent = aliases.ie10;

  var isStandardTouch = 'ontouchend' in document.documentElement;
  var standardTouchEvent = aliases.standard;

  if (isIE11Touch && !element[ie11TouchEvent]) {
    element[ie11TouchEvent] = element[mouseEvent];
  } else if (isIE10Touch && !element[ie10TouchEvent]) {
    element[ie10TouchEvent] = element[mouseEvent];
  } else if (isStandardTouch && !element[standardTouchEvent]) {
    element[standardTouchEvent] = element[mouseEvent];
  }
};

exports.isMobile = function() {
  var reg = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/;
  return reg.test(window.navigator.userAgent);
};
