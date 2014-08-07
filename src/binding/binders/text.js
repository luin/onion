var utils = require('../../components/utils');

module.exports = function(el, value) {
  el[utils.isset(el.textContent) ? 'textContent' : 'innerText'] = utils.isset(value) ? value : '';
};
