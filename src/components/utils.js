/**
 * Flatten the given `arr`.
 *
 * @param {Array} arr
 * @return {Array}
 * @api private
 */

exports.flatten = function(arr, ret) {
  ret = ret || [];
  var len = arr.length;
  for (var i = 0; i < len; ++i) {
    if (Array.isArray(arr[i])) {
      exports.flatten(arr[i], ret);
    } else {
      ret.push(arr[i]);
    }
  }
  return ret;
};

exports.extend = function(defaultSettings, setttings) {
  setttings = setttings || {};
  defaultSettings = defaultSettings || {};

  var key;
  for (key in defaultSettings) {
    if (defaultSettings.hasOwnProperty(key) && !setttings.hasOwnProperty(key)) {
      setttings[key] = defaultSettings[key];
    }
  }
  return setttings;
};

exports.bindEvent = (function() {
  if ('addEventListener' in window) {
    return function(el, event, handler) {
      return el.addEventListener(event, handler, false);
    };
  }
  return function(el, event, handler) {
    return el.attachEvent('on' + event, handler);
  };
})();

exports.unbindEvent = (function() {
  if ('removeEventListener' in window) {
    return function(el, event, handler) {
      return el.removeEventListener(event, handler, false);
    };
  }
  return function(el, event, handler) {
    return el.detachEvent('on' + event, handler);
  };
})();

exports.getInputValue = function(el) {
  if (el.type === 'checkbox') {
    return el.checked;
  } else if (el.type === 'select-multiple') {
    return el.filter(function(item) {
      return item.selected;
    }).map(function(item) {
      return item.value;
    });
  } else {
    return el.value;
  }
};

exports.isset = function(v) {
  return typeof v !== 'undefined' && v !== null;
};
