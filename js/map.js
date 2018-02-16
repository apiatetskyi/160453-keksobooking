'use strict';

(function () {
  var ADS_COUNT = 8;

  /**
   * @enum {number}
   */
  var KeyCodes = {
    ENTER: 13,
    ESC: 27
  };

  var currentCard;
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
      result.push(window.data(i));
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
      pins.push(window.pin(ad));
      fragment.appendChild(window.pin(ad));
    });

    parentElement.appendChild(fragment);
  };

  /**
   * Устанавливает координаты главного пина в поля формы «Адрес»
   * @param {number} x
   * @param {number} y
   */
  var setLocation = function (x, y) {
    window.form.address.value = x + ', ' + y;
  };

  /**
 * Обработчик mouseup на главном пине
 */
  var mainPinMouseupHandler = function () {
    activate();
    window.form.activate();
    renderPins(adsData, pinsContainer);
    setLocation(mainPin.offsetLeft, mainPin.offsetTop);
  };

  /**
   * Закрывает текущую карточку объявления
   */
  var closeCard = function () {
    if (window.map.currentCard) {
      map.removeChild(window.map.currentCard);
      window.map.currentCard = null;
      document.removeEventListener('keydown', escKeydownHandler);
    }
  };

  /**
   * Обработчик нажатия на Escape
   * @param {Object} evt
   */
  var escKeydownHandler = function (evt) {
    if (evt.keyCode === KeyCodes.ESC) {
      closeCard();
    }
  };

  adsData = getDataArray(ADS_COUNT);
  mainPin.addEventListener('mouseup', mainPinMouseupHandler);

  window.map = {
    element: map,
    deactivate: deactivate,
    pins: pins,
    closeCard: closeCard,
    currentCard: currentCard,
    escKeydownHandler: escKeydownHandler
  };
})();
