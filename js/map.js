'use strict';

(function () {
  var MIN_Y = 150;
  var MAX_Y = 500;

  /**
   * Размеры главного пина
   * @enum {number}
  */
  var PinSize = {
    WIDTH: 62,
    HEIGHT: 62,
    POINTER_HEIGHT: 18
  };

  var adsData;
  var pageActivated = false;
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
    window.render.remove(pinsContainer);
    map.classList.add('map--faded');
    mainPin.style = '';
    pageActivated = false;
    window.form.deactivate();
    window.form.setLocation(mainPin.offsetLeft, mainPin.offsetTop);
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
    var correction = PinSize.HEIGHT / 2 + PinSize.POINTER_HEIGHT;

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

      if (!pageActivated) {
        activate();
        window.form.activate();
        window.render.draw(adsData.slice(0, 5), pinsContainer, window.createPin);
        pageActivated = true;
      }

      addressY = mainPin.offsetTop - shift.y;
      addressX = mainPin.offsetLeft - shift.x;

      if (addressY + correction > MAX_Y || addressY + correction < MIN_Y) {
        addressY = mainPin.offsetTop;
      }

      if (addressX > pinsContainer.offsetWidth || addressX < 0) {
        addressX = mainPin.offsetLeft;
      }

      mainPin.style.top = addressY + 'px';
      mainPin.style.left = addressX + 'px';

      window.form.setLocation(addressX, addressY + correction);
    };

    /**
     * Обработчик mouseup — завершение перетаскивания пина
     */
    var mouseupHandler = function () {
      if (!pageActivated) {
        activate();
        window.form.activate();
        window.render.draw(adsData.slice(0, 5), pinsContainer, window.createPin);
        pageActivated = true;
      }
      window.form.setLocation(addressX, addressY + correction);
      document.removeEventListener('mousemove', mousemoveHandler);
      document.removeEventListener('mouseup', mouseupHandler);
    };

    document.addEventListener('mousemove', mousemoveHandler);
    document.addEventListener('mouseup', mouseupHandler);
  };

  /**
   * Обработчик успешного ответа от сервера
   * @param {Object} response
   */
  var dataSuccessHandler = function (response) {
    adsData = response;
    mainPin.addEventListener('mousedown', mainPinMousedownHandler);
  };

  /**
   * Обработчик ошибки ответа от сервера
   * @param {string} message
   */
  var dataErrorHandler = function (message) {
    window.showAlert(message, 'error');
  };

  /**
   * Обработчик изменения фильтра
   */
  var filterChangeHandler = function () {
    window.utils.debounce(function () {
      var filteredData = window.filter.apply(adsData).slice(0, 5);
      if (filteredData.length === 0) {
        window.showAlert('Не найдено похожих объявлений. Измените настройки фильтра.', 'error');
      }
      window.card.close();
      window.render.draw(filteredData, pinsContainer, window.createPin);
    });
  };


  window.filter.element.addEventListener('change', filterChangeHandler);
  window.backend.download(dataSuccessHandler, dataErrorHandler);
  window.form.setLocation(mainPin.offsetLeft, mainPin.offsetTop);

  window.map = {
    element: map,
    deactivate: deactivate
  };
})();
