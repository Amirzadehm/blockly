// Serializes an XML DOM node to a string.
exports.serialize = function(node) {
  var serializer = new XMLSerializer();
  return serializer.serializeToString(node);
};

// Parses a single root element string.
exports.parseElement = function(text) {
  var parser = new DOMParser();
  var dom = parser.parseFromString('<xml>' + text + '</xml>', 'text/xml');
  var errors = dom.getElementsByTagName("parsererror");
  var element = dom.firstChild;
  if (!element) {
    throw new Error('Nothing parsed');
  }
  if (errors.length > 0) {
    throw new Error(exports.serialize(errors[0]));
  }
  if (element !== dom.lastChild) {
    throw new Error('Parsed multiple elements');
  }
  return element;
};
