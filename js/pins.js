'use strict';

(function () {
  var MAX_PINS = 5;

  /**
   * Размеры пина
   * @enum {number}
   */
  var PinSize = {
    WIDTH: 50,
    HEIGHT: 70,
  };

  var pins = [];

  /**
   * Создает пин, исходя из данных в объявлении
   * @param  {AdData} adData
   * @return {Node}
   */
  var create = function (adData) {
    var pinTemplate = document.querySelector('template').content.querySelector('.map__pin').cloneNode(true);
    var pin = pinTemplate.cloneNode(true);

    pin.style.left = adData.location.x + 'px';
    pin.style.top = adData.location.y - PinSize.HEIGHT / 2 + 'px';
    pin.querySelector('img').src = adData.author.avatar;
    pin.addEventListener('click', function () {
      var card = window.card.create(adData);
      window.card.open(card);
    });

    return pin;
  };

  var add = function (data, parentElement) {
    var fragment = document.createDocumentFragment();

    if (pins) {
      remove(parentElement);
    }

    data = (data.length < MAX_PINS) ? data : data.slice(0, MAX_PINS);

    data.forEach(function (item) {
      var element = create(item);
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

  window.pins = {
    add: add,
    remove: remove
  };
})();
