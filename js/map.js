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
var map = document.querySelector('.map');
var mainPin = map.querySelector('.map__pin--main');
var pinsContainer = document.querySelector('.map__pins');
var template = document.querySelector('template').content;
var notice = document.querySelector('.notice');
var noticeForm = notice.querySelector('.notice__form');
var noticeFieldsets = noticeForm.querySelectorAll('fieldset');
var noticeAddress = notice.querySelector('#address');
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
  nodes.forEach(function (node) {
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
};

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
  noticeAddress.value = x + ', ' + y;
};

/**
 * Обработчик mouseup на главном пине
 * @param {Object} evt
 */
var mainPinMouseupHandler = function () {
  activatePage();
  renderPins(adsData, pinsContainer);
  setLocation(mainPin.offsetLeft, mainPin.offsetTop);
  mainPin.removeEventListener('mouseup', mainPinMouseupHandler);
};

adsData = getDataArray(ADS_COUNT);
toggleFormFieldsState(noticeFieldsets, true);
mainPin.addEventListener('mouseup', mainPinMouseupHandler);
