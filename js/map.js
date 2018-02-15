'use strict';

var ADS_COUNT = 8;

var adParams = {
  AVATARS: [
    'img/avatars/user01.png',
    'img/avatars/user02.png',
    'img/avatars/user03.png',
    'img/avatars/user04.png',
    'img/avatars/user05.png',
    'img/avatars/user06.png',
    'img/avatars/user07.png',
    'img/avatars/user08.png'
  ],
  TITLES: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  TYPES: ['flat', 'house', 'bungalo'],
  TIMES: ['12:00', '13:00', '14:00'],
  FEATURES: [
    'wifi', 'dishwasher', 'parking',
    'washer', 'elevator', 'conditioner'
  ],
  PHOTOS: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ]
};

/**
 * @enum {number}
*/
var KeyCodes = {
  ENTER: 13,
  ESC: 27
};

/**
 * Параметры координат для пинов на карте
 * @enum {number}
 */
var LocationProps = {
  MIN_X: 300,
  MAX_X: 900,
  MIN_Y: 150,
  MAX_Y: 500
};

/**
 * Допустимое количество комнат
 * @enum {number}
 */
var RoomsParams = {
  MIN: 1,
  MAX: 5
};

/**
 * Допустимая стоимость жилья
 * @enum {number}
 */
var PriceParams = {
  MIN: 1000,
  MAX: 1000000
};

/**
 * Размеры пина
 * @enum {number}
 */
var PinSize = {
  WIDTH: 50,
  HEIGHT: 70,
};

var adsData;
var currentCard;
var similarPins = [];
var map = document.querySelector('.map');
var mainPin = map.querySelector('.map__pin--main');
var pinsContainer = document.querySelector('.map__pins');
var template = document.querySelector('template').content;
var noticeForm = document.querySelector('.notice__form');
var noticeFieldsets = noticeForm.querySelectorAll('fieldset');
var noticeInputs = noticeForm.querySelectorAll('.form__element input');
var resetButton = noticeForm.querySelector('.form__reset');
var address = noticeForm.querySelector('#address');
var housingType = noticeForm.querySelector('#type');
var pricePerNight = noticeForm.querySelector('#price');
var checkInTime = noticeForm.querySelector('#timein');
var checkOutTime = noticeForm.querySelector('#timeout');
var roomNumber = noticeForm.querySelector('#room_number');
var housingCapacity = noticeForm.querySelector('#capacity');

var housingTypes = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var roomForms = {
  singular: 'комната',
  few: 'комнаты',
  many: 'комнат'
};

var guestForms = {
  singular: 'гостя',
  few: 'гостей',
  many: 'гостей'
};

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

/**
 * Возвращает случайное число в указанном диапазоне
 * @param  {number} min
 * @param  {number} max
 * @return {number}
 */
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

/**
 * Склоняет существительное на основе числителя и переданных форм
 * @param  {number} number
 * @param  {Object} forms
 * @return {string}
 */
var declensionOfNoun = function (number, forms) {
  var result = '';

  if (number > 5 && number < 21) {
    result = number + ' ' + forms.many;
  } else if (number % 10 === 1) {
    result = number + ' ' + forms.singular;
  } else if (number % 10 < 5 && number % 10 > 0) {
    result = number + ' ' + forms.few;
  } else {
    result = number + ' ' + forms.many;
  }

  return result;
};

/**
 * Объект с данными для объявления
 * @typedef {Object} AdData
 * @property {Object} author Данные об авторе объявления
 * @property {Object} offer Контент объявления
 * @property {Object} location Координаты жилья на карте
 */

/**
 * Генерирует объект с данными для объявления
 * @param  {number} index
 * @return {AdData}
 */
var generateAdData = function (index) {
  var locationX = getRandomNumber(LocationProps.MIN_X, LocationProps.MAX_X);
  var locationY = getRandomNumber(LocationProps.MIN_Y, LocationProps.MAX_Y);

  return {
    author: {
      avatar: adParams.AVATARS[index]
    },

    offer: {
      title: adParams.TITLES[index],
      address: locationX + ', ' + locationY,
      price: getRandomNumber(PriceParams.MIN, PriceParams.MAX),
      type: adParams.TYPES[getRandomNumber(0, adParams.TYPES.length - 1)],
      rooms: getRandomNumber(RoomsParams.MIN, RoomsParams.MAX),
      guests: getRandomNumber(1, RoomsParams.MAX * 2),
      checkin: adParams.TIMES[getRandomNumber(0, adParams.TIMES.length - 1)],
      checkout: adParams.TIMES[getRandomNumber(0, adParams.TIMES.length - 1)],
      features: adParams.FEATURES.slice(0, getRandomNumber(1, adParams.FEATURES.length - 1)),
      description: '',
      photos: adParams.PHOTOS
    },

    location: {
      x: locationX,
      y: locationY
    }
  };
};

/**
 * Генерирует массив данных для объявлений
 * @param  {number} adsNumber
 * @return {Array}
 */
var getDataArray = function (adsNumber) {
  var result = [];

  for (var i = 0; i < adsNumber; i++) {
    result.push(generateAdData(i));
  }

  return result;
};

/**
 * Создает пин, исходя из данных в объявлении
 * @param  {AdData} adData
 * @return {Node}
 */
var createPin = function (adData) {
  var pinTemplate = template.querySelector('.map__pin');
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.left = adData.location.x + 'px';
  pinElement.style.top = adData.location.y - PinSize.HEIGHT / 2 + 'px';
  pinElement.querySelector('img').src = adData.author.avatar;
  pinElement.addEventListener('click', function () {
    closeCurrentCard();
    currentCard = createCard(adData);
    map.appendChild(currentCard);
    document.addEventListener('keydown', escKeydownHandler);
  });

  similarPins.push(pinElement);

  return pinElement;
};

/**
 * Рендерит пины для всех объявлений в заданом родительском элементе
 * @param {Array} ads
 * @param {Node} parentElement
 */
var renderPins = function (ads, parentElement) {
  var fragment = document.createDocumentFragment();

  ads.forEach(function (ad) {
    fragment.appendChild(createPin(ad));
  });

  parentElement.appendChild(fragment);
};

/**
 * Создает иконку доступного удобства в объявлении
 * @param  {string} featureData
 * @return {Node}
 */
var createFeature = function (featureData) {
  var li = document.createElement('li');
  li.classList.add('feature', 'feature--' + featureData);

  return li;
};

/**
 * Создает фотографию к объявлению
 * @param  {string} pictureData
 * @return {Node}
 */
var createPicture = function (pictureData) {
  var li = document.createElement('li');
  var img = document.createElement('img');
  img.src = pictureData;
  li.appendChild(img);

  return li;
};

/**
 * Создает карточку объявления
 * @param  {AdData} cardData
 * @return {Node}
 */
var createCard = function (cardData) {
  var adElement = template.querySelector('.popup').cloneNode(true);
  var close = adElement.querySelector('.popup__close');
  var featuresContainer = adElement.querySelector('.popup__features');
  var picturesContainer = adElement.querySelector('.popup__pictures');

  adElement.querySelector('h3').textContent = cardData.offer.title;
  adElement.querySelector('small').textContent = cardData.offer.address;
  adElement.querySelector('.popup__price').innerHTML = cardData.offer.price + ' &#x20bd;/ночь';
  adElement.querySelector('h4').textContent = housingTypes[cardData.offer.type];
  adElement.querySelector('.popup__size').textContent = declensionOfNoun(cardData.offer.rooms, roomForms) + ' для ' + declensionOfNoun(cardData.offer.guests, guestForms);
  adElement.querySelector('.popup__time').textContent = 'Заезд после ' + cardData.offer.checkin + ' , выезд до ' + cardData.offer.checkout;
  adElement.querySelector('.popup__description').textContent = cardData.offer.description;
  adElement.querySelector('.popup__avatar').src = cardData.author.avatar;

  cardData.offer.features.forEach(function (feature) {
    featuresContainer.appendChild(createFeature(feature));
  });

  cardData.offer.photos.forEach(function (photo) {
    picturesContainer.appendChild(createPicture(photo));
  });

  close.addEventListener('click', function () {
    closeCurrentCard();
  });

  return adElement;
};

/**
 * Переключает активное состояние полей форм
 * @param {NodeList} nodes
 * @param {boolean} state
 */
var toggleFormFieldsState = function (nodes, state) {
  Array.prototype.forEach.call(nodes, function (node) {
    node.disabled = state;
  });
};

/**
 * Активирует страницу
 */
var activatePage = function () {
  map.classList.remove('map--faded');
  noticeForm.classList.remove('notice__form--disabled');
  toggleFormFieldsState(noticeFieldsets, false);

  housingType.addEventListener('change', housingTypeChangeHandler);
  checkInTime.addEventListener('change', checkInTimeChangeHandler);
  checkOutTime.addEventListener('change', checkOutTimeChangeHandler);
  roomNumber.addEventListener('change', roomNumberChangeHandler);
  resetButton.addEventListener('click', resetButtonClickHandler);
  noticeInputs.forEach(function (input) {
    input.addEventListener('keyup', inputKeyupHandler);
  });
  noticeForm.addEventListener('invalid', noticeFormInvalidHandler, true);
};

/**
 * Деактивирует страницу
*/
var deactivatePage = function () {
  closeCurrentCard();
  similarPins.forEach(function (pin) {
    pinsContainer.removeChild(pin);
  });
  similarPins = [];
  map.classList.add('map--faded');
  noticeForm.classList.add('notice__form--disabled');
  toggleFormFieldsState(noticeFieldsets, true);

  housingType.removeEventListener('change', housingTypeChangeHandler);
  checkInTime.removeEventListener('change', checkInTimeChangeHandler);
  checkOutTime.removeEventListener('change', checkOutTimeChangeHandler);
  roomNumber.removeEventListener('change', roomNumberChangeHandler);
  resetButton.removeEventListener('click', resetButtonClickHandler);
  noticeInputs.forEach(function (input) {
    input.classList.remove('invalid');
    input.removeEventListener('keyup', inputKeyupHandler);
  });
  noticeForm.removeEventListener('invalid', noticeFormInvalidHandler, true);
};

/**
 * Закрывает текущую карточку объявления
*/
var closeCurrentCard = function () {
  if (currentCard) {
    map.removeChild(currentCard);
    currentCard = null;
    document.removeEventListener('keydown', escKeydownHandler);
  }
};

/**
 * Обработчик нажатия на Escape
 * @param {Object} evt
 */
var escKeydownHandler = function (evt) {
  if (evt.keyCode === KeyCodes.ESC) {
    closeCurrentCard();
  }
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
 * Синхронизирует данные селекта с атрибутом инпута на основе словаря
 * @param {Node} select
 * @param {Node} input
 * @param {Object} dictionary
 * @param {string} attribute
 */
var syncInputToSelect = function (select, input, dictionary, attribute) {
  input[attribute] = dictionary[select.value];
};

/**
 * Синхронизирует поля с одиноковыми value или по кастомным правилам
 * @param {Node} srcElement
 * @param {Node} outputElement
 * @param {Function} customSyncRule
 */
var syncSelects = function (srcElement, outputElement, customSyncRule) {
  if (typeof customSyncRule === 'function') {
    customSyncRule();
  } else {
    outputElement.value = srcElement.value;
  }
};

/**
 * Обработчик mouseup на главном пине
 */
var mainPinMouseupHandler = function () {
  activatePage();
  renderPins(adsData, pinsContainer);
  setLocation(mainPin.offsetLeft, mainPin.offsetTop);
  syncInputToSelect(housingType, pricePerNight, typePrices, 'min');
  syncSelects(roomNumber, housingCapacity, function () {
    housingCapacity.value = roomNumberDependency[roomNumber.value][0];
  });
};

/**
 * Обработчик неправильных данных в форме
 * @param {Object} evt
 */
var noticeFormInvalidHandler = function (evt) {
  evt.target.classList.add('invalid');
};

/**
 * Обработчик изменения значения количества комнат
 */
var roomNumberChangeHandler = function () {
  syncSelects(roomNumber, housingCapacity, function () {
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
  syncInputToSelect(housingType, pricePerNight, typePrices, 'min');
};

/**
 * Обработчик изменения времени заезда
*/
var checkInTimeChangeHandler = function () {
  syncSelects(checkInTime, checkOutTime);
};

/**
 * Обработчик изменения времени выезда
*/
var checkOutTimeChangeHandler = function () {
  syncSelects(checkOutTime, checkInTime);
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
  deactivatePage();
};

adsData = getDataArray(ADS_COUNT);
toggleFormFieldsState(noticeFieldsets, true);
mainPin.addEventListener('mouseup', mainPinMouseupHandler);
