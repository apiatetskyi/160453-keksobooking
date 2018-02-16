'use strict';

(function () {
  var ADS_COUNT = 8;

  var adsData;
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
   */
  var mainPinMouseupHandler = function () {
    activate();
    window.form.activate();
    renderPins(adsData, pinsContainer);
    window.form.setLocation(mainPin.offsetLeft, mainPin.offsetTop);
  };

  adsData = getDataArray(ADS_COUNT);
  mainPin.addEventListener('mouseup', mainPinMouseupHandler);

  window.map = {
    element: map,
    deactivate: deactivate
  };
})();
