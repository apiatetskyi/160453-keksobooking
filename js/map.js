'use strict';

(function () {
  var ADS_COUNT = 8;
  var MIN_Y = 150;
  var MAX_Y = 500;
  var POINTER_HEIGHT = 19;

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
    window.form.deactivate();
    mainPin.style = false;
    activated = false;
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
   * Обработчик mouseup на главном пине
   * @param {Object} evt
   */
  var mainPinMousedownHandler = function (evt) {
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mousemoveHandler = function (moveEvt) {
      var offset = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if (mainPin.offsetTop < MIN_Y) {
        mainPin.style.top = MIN_Y + 'px';
      } else if (mainPin.offsetTop > MAX_Y) {
        mainPin.style.top = MAX_Y + 'px';
      } else {
        mainPin.style.top = mainPin.offsetTop - offset.y + 'px';
      }

      if (mainPin.offsetLeft < 0) {
        mainPin.style.left = 0;
      } else if (mainPin.offsetLeft > pinsContainer.offsetWidth) {
        mainPin.style.left = pinsContainer.offsetWidth + 'px';
      } else {
        mainPin.style.left = mainPin.offsetLeft - offset.x + 'px';
      }

      window.form.setLocation(mainPin.offsetLeft, mainPin.offsetTop);
    };

    var mouseupHandler = function () {
      if (!activated) {
        activate();
        window.form.activate();
        renderPins(adsData, pinsContainer);
        activated = true;
        mainPin.style.transform = 'translate(-50%, calc(-100% - ' + POINTER_HEIGHT + 'px))';
      }
      window.form.setLocation(mainPin.offsetLeft, mainPin.offsetTop);
      document.removeEventListener('mousemove', mousemoveHandler);
      document.removeEventListener('mouseup', mouseupHandler);
    };

    document.addEventListener('mousemove', mousemoveHandler);
    document.addEventListener('mouseup', mouseupHandler);
  };

  adsData = getDataArray(ADS_COUNT);
  mainPin.addEventListener('mousedown', mainPinMousedownHandler);

  window.map = {
    element: map,
    deactivate: deactivate
  };
})();
