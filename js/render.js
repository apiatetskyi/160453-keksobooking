'use strict';

(function () {
  var draw = function (data, parentElement, renderedElements, callback) {
    var fragment = document.createDocumentFragment();

    data.forEach(function (item) {
      var elem = callback(item);
      renderedElements.push(elem);
      fragment.appendChild(elem);
    });

    parentElement.appendChild(fragment);
  };

  window.render = {
    draw: draw
  };
})();
