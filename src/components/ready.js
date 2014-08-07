var ready = module.exports = function(handler) {
  if (document.readyState === 'complete') {
    setTimeout(handler, 0);
  } else {
    ready.handlers.push(handler);
  }
};

document.addEventListener('DOMContentLoaded', completed, false);
window.addEventListener('load', completed, false);

ready.handlers = [];

function completed() {
  document.removeEventListener('DOMContentLoaded', completed, false);
  window.removeEventListener('load', completed, false);
  ready.handlers.forEach(function(handler) {
    handler();
  });
}
