var Types = exports.Types = {
  TEXT: 0,
  BINDING: 1
};

exports.parse = function(data, delimiters) {
  var tokens = [];
  var length = data.length;
  var index = 0;
  var lastIndex = 0;

  while (lastIndex < length) {
    index = data.indexOf(delimiters[0], lastIndex);

    if (index < 0) {
      tokens.push({
        type: Types.TEXT,
        value: data.slice(lastIndex)
      });
      break;
    } else {
      if (index > 0 && lastIndex < index) {
        tokens.push({
          type: Types.TEXT,
          value: data.slice(lastIndex, index)
        });
      }

      lastIndex = index + delimiters[0].length;
      index = data.indexOf(delimiters[1], lastIndex);

      if (index < 0) {
        substring = data.slice(lastIndex - delimiters[1].length);
        lastToken = tokens[tokens.length - 1];

        if (lastToken && (lastToken.type === Types.TEXT)) {
          lastToken.value += substring;
        } else {
          tokens.push({
            type: Types.TEXT,
            value: substring
          });
        }

        break;
      }

      value = data.slice(lastIndex, index).trim();
      tokens.push({
        type: Types.BINDING,
        value: value
      });
      lastIndex = index + delimiters[1].length;
    }
  }
  return tokens;
};
