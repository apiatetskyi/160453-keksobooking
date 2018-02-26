'use strict';

(function () {
  var pins = [];
  var draw = function (data, parentElement, callback) {
    var fragment = document.createDocumentFragment();

    if (pins) {
      remove(parentElement);
    }

    data.forEach(function (item) {
      var element = callback(item);
      pins.push(element);
      fragment.appendChild(element);
    });

    parentElement.appendChild(fragment);
  };

  var remove = function (parentElement) {
    pins.forEach(function (element) {
      parentElement.removeChild(element);
    });
    pins = [];
  };

  window.render = {
    draw: draw,
    remove: remove
  };
})();
