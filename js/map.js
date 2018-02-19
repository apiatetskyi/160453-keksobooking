'use strict';

(function () {
  var ADS_COUNT = 8;
  var MIN_Y = 150;
  var MAX_Y = 500;

  /**
   * Размеры главного пина
   * @enum {number}
  */
  var PinSize = {
    WIDTH: 65,
    HEIGHT: 65,
    POINTER_HEIGHT: 22
  };

  var adsData;
  var activated = false;
  var pins = [];
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var pinsContainer = map.querySelector('.map__pins');

  /**
   * Активирует страницу
   */
  var activate = function () {
    map.classList.remove('map--faded');
  };

  /**
   * Деактивирует страницу
   */
  var deactivate = function () {
    window.card.close();
    pins.forEach(function (pin) {
      pinsContainer.removeChild(pin);
    });
    pins = [];
    map.classList.add('map--faded');
    mainPin.style = false;
    activated = false;
    window.form.deactivate();
    window.form.setLocation(mainPin.offsetLeft, mainPin.offsetTop);
  };

  /**
   * Генерирует массив данных для объявлений
   * @param  {number} adsNumber
   * @return {Array}
   */
  var getDataArray = function (adsNumber) {
    var result = [];

    for (var i = 0; i < adsNumber; i++) {
      result.push(window.getData(i));
    }

    return result;
  };

  /**
   * Рендерит пины для всех объявлений в заданом родительском элементе
   * @param {Array} ads
   * @param {Node} parentElement
   */
  var renderPins = function (ads, parentElement) {
    var fragment = document.createDocumentFragment();

    ads.forEach(function (ad) {
      var pin = window.createPin(ad);
      pins.push(pin);
      fragment.appendChild(pin);
    });

    parentElement.appendChild(fragment);
  };

  /**
   * Обработчик mousedown на главном пине
   * @param {Object} evt
   */
  var mainPinMousedownHandler = function (evt) {
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var addressY = mainPin.offsetTop;
    var addressX = mainPin.offsetLeft;

    /**
     * Обработчик перетаскивания пина по карте
     * @param {Object} moveEvt
     */
    var mousemoveHandler = function (moveEvt) {
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if (!activated) {
        activate();
        window.form.activate();
        renderPins(adsData, pinsContainer);
        activated = true;
      }

      addressY = mainPin.offsetTop - shift.y + PinSize.HEIGHT / 2 + PinSize.POINTER_HEIGHT;
      if (addressY > MAX_Y) {
        mainPin.style.top = mainPin.offsetTop + 'px';
        addressY = MAX_Y;
      } else if (addressY < MIN_Y) {
        mainPin.style.top = mainPin.offsetTop + 'px';
        addressY = MIN_Y;
      } else {
        mainPin.style.top = mainPin.offsetTop - shift.y + 'px';
      }

      addressX = mainPin.offsetLeft - shift.x;
      if (addressX > pinsContainer.offsetWidth) {
        mainPin.style.left = pinsContainer.offsetWidth + 'px';
        addressX = pinsContainer.offsetWidth;
      } else if (addressX < 0) {
        mainPin.style.left = '0';
        addressX = 0;
      } else {
        mainPin.style.left = mainPin.offsetLeft - shift.x + 'px';
      }

      window.form.setLocation(addressX, addressY);
    };

    /**
     * Обработчик mouseup — завершение перетаскивания пина
     */
    var mouseupHandler = function () {
      if (!activated) {
        activate();
        window.form.activate();
        renderPins(adsData, pinsContainer);
        activated = true;
      }
      window.form.setLocation(addressX, addressY);
      document.removeEventListener('mousemove', mousemoveHandler);
      document.removeEventListener('mouseup', mouseupHandler);
    };

    document.addEventListener('mousemove', mousemoveHandler);
    document.addEventListener('mouseup', mouseupHandler);
  };

  adsData = getDataArray(ADS_COUNT);
  mainPin.addEventListener('mousedown', mainPinMousedownHandler);
  window.form.setLocation(mainPin.offsetLeft, mainPin.offsetTop);

  window.map = {
    element: map,
    deactivate: deactivate
  };
})();
