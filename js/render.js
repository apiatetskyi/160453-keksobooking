'use strict';

(function () {
  var render = function (data, parentElement, callback) {
    var fragment = document.createDocumentFragment();

    if (window.map.pins) {
      window.map.pins.forEach(function (element) {
        parentElement.removeChild(element);
      });
      window.map.pins = [];
    }

    data.forEach(function (item) {
      var element = callback(item);
      window.map.pins.push(element);
      fragment.appendChild(element);
    });

    parentElement.appendChild(fragment);
  };

  window.render = render;
})();
