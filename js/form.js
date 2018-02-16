'use strict';

(function () {
  var form = document.querySelector('.notice__form');
  var fieldsets = form.querySelectorAll('fieldset');
  var inputs = form.querySelectorAll('.form__element input');
  var resetButton = form.querySelector('.form__reset');
  var address = form.querySelector('#address');
  var housingType = form.querySelector('#type');
  var pricePerNight = form.querySelector('#price');
  var checkInTime = form.querySelector('#timein');
  var checkOutTime = form.querySelector('#timeout');
  var roomNumber = form.querySelector('#room_number');
  var housingCapacity = form.querySelector('#capacity');

  var typePrices = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var roomNumberDependency = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0'],
  };

  var activate = function () {
    form.classList.remove('notice__form--disabled');
    window.utils.toggleFormFieldsState(fieldsets, false);
    housingType.addEventListener('change', housingTypeChangeHandler);
    checkInTime.addEventListener('change', checkInTimeChangeHandler);
    checkOutTime.addEventListener('change', checkOutTimeChangeHandler);
    roomNumber.addEventListener('change', roomNumberChangeHandler);
    resetButton.addEventListener('click', resetButtonClickHandler);
    inputs.forEach(function (input) {
      input.addEventListener('keyup', inputKeyupHandler);
    });
    form.addEventListener('invalid', formInvalidHandler, true);
    window.utils.syncInputToSelect(housingType, pricePerNight, typePrices, 'min');
    window.utils.syncSelects(roomNumber, housingCapacity, function () {
      housingCapacity.value = roomNumberDependency[roomNumber.value][0];
    });
  };

  var deactivateForm = function () {
    form.classList.add('notice__form--disabled');
    window.utils.toggleFormFieldsState(fieldsets, true);
    housingType.removeEventListener('change', housingTypeChangeHandler);
    checkInTime.removeEventListener('change', checkInTimeChangeHandler);
    checkOutTime.removeEventListener('change', checkOutTimeChangeHandler);
    roomNumber.removeEventListener('change', roomNumberChangeHandler);
    resetButton.removeEventListener('click', resetButtonClickHandler);
    inputs.forEach(function (input) {
      input.classList.remove('invalid');
      input.removeEventListener('keyup', inputKeyupHandler);
    });
    form.removeEventListener('invalid', formInvalidHandler, true);
  };

  /**
   * Устанавливает координаты главного пина в поля формы «Адрес»
   * @param {number} x
   * @param {number} y
   */
  var setLocation = function (x, y) {
    address.value = x + ', ' + y;
  };

  /**
   * Обработчик неправильных данных в форме
   * @param {Object} evt
   */
  var formInvalidHandler = function (evt) {
    evt.target.classList.add('invalid');
  };

  /**
   * Обработчик изменения значения количества комнат
   */
  var roomNumberChangeHandler = function () {
    window.utils.syncSelects(roomNumber, housingCapacity, function () {
      housingCapacity.value = roomNumberDependency[roomNumber.value][0];
    });

    Array.prototype.forEach.call(housingCapacity.options, function (option) {
      option.disabled = !roomNumberDependency[roomNumber.value].includes(option.value);
    });
  };

  /**
   * Обработчик изменения типа жилья
   */
  var housingTypeChangeHandler = function () {
    window.utils.syncInputToSelect(housingType, pricePerNight, typePrices, 'min');
  };

  /**
   * Обработчик изменения времени заезда
   */
  var checkInTimeChangeHandler = function () {
    window.utils.syncSelects(checkInTime, checkOutTime);
  };

  /**
   * Обработчик изменения времени выезда
   */
  var checkOutTimeChangeHandler = function () {
    window.utils.syncSelects(checkOutTime, checkInTime);
  };

  /**
   * Обработчик ввода данных в инпут
   * @param {Object} evt
   */
  var inputKeyupHandler = function (evt) {
    if (evt.target.checkValidity()) {
      evt.target.classList.remove('invalid');
    }
  };

  /**
   * Обработчик клика по кнопке сброса формы
   */
  var resetButtonClickHandler = function () {
    window.map.deactivate();
    deactivateForm();
  };

  window.utils.toggleFormFieldsState(fieldsets, true);

  window.form = {
    activate: activate,
    deactivate: deactivateForm,
    setLocation: setLocation
  };
})();
