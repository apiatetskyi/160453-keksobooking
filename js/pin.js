'use strict';

(function () {
  /**
   * Размеры пина
   * @enum {number}
   */
  var PinSize = {
    WIDTH: 50,
    HEIGHT: 70,
  };
  /**
   * Создает пин, исходя из данных в объявлении
   * @param  {AdData} adData
   * @return {Node}
   */
  var createPin = function (adData) {
    var pinTemplate = document.querySelector('template').content.querySelector('.map__pin').cloneNode(true);
    var pin = pinTemplate.cloneNode(true);

    pin.style.left = adData.location.x + 'px';
    pin.style.top = adData.location.y - PinSize.HEIGHT / 2 + 'px';
    pin.querySelector('img').src = adData.author.avatar;
    pin.addEventListener('click', function () {
      window.map.closeCard();
      window.map.currentCard = window.card.create(adData);
      window.map.element.appendChild(window.map.currentCard);
      document.addEventListener('keydown', window.map.escKeydownHandler);
    });

    return pin;
  };

  window.pin = createPin;
})();
