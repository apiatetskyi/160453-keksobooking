'use strict';

var ADS_COUNT = 8;
var AD_PARAMS = {
  avatars: [
    'img/avatars/user01.png',
    'img/avatars/user02.png',
    'img/avatars/user03.png',
    'img/avatars/user04.png',
    'img/avatars/user05.png',
    'img/avatars/user06.png',
    'img/avatars/user07.png',
    'img/avatars/user08.png'
  ],
  titles: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  types: ['flat', 'house', 'bungalo'],
  times: ['12:00', '13:00', '14:00'],
  features: [
    'wifi', 'dishwasher', 'parking',
    'washer', 'elevator', 'conditioner'
  ],
  photos: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ]
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
var map = document.querySelector('.map');
var pinsContainer = document.querySelector('.map__pins');
var filtersContainer = document.querySelector('.map__filters-container');
var template = document.querySelector('template').content;
var housingTypes = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

/**
 * Возвращает случайное число в указанном диапазоне
 * @param  {number} start
 * @param  {number} end
 * @return {number}
 */
var getRandomNumber = function (start, end) {
  return Math.floor(Math.random() * (end - start) + start);
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

  var adData = {
    author: {
      avatar: AD_PARAMS.avatars[index]
    },

    offer: {
      title: AD_PARAMS.titles[index],
      address: locationX + ', ' + locationY,
      price: getRandomNumber(PriceParams.MIN, PriceParams.MAX),
      type: AD_PARAMS.types[getRandomNumber(0, AD_PARAMS.types.length - 1)],
      rooms: getRandomNumber(RoomsParams.MIN, RoomsParams.MAX),
      guests: getRandomNumber(1, RoomsParams.MAX * 2),
      checkin: AD_PARAMS.times[getRandomNumber(0, AD_PARAMS.times.length - 1)],
      checkout: AD_PARAMS.times[getRandomNumber(0, AD_PARAMS.times.length - 1)],
      features: AD_PARAMS.features.slice(0, getRandomNumber(1, AD_PARAMS.features.length - 1)),
      description: '',
      photos: AD_PARAMS.photos
    },

    location: {
      x: locationX,
      y: locationY
    }
  };

  return adData;
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

  return pinElement;
};

/**
 * Рендерит пины для всех объявлений в заданом родительском элементе
 * @param {Array} data
 * @param {Node} parentElement
 */
var renderPins = function (data, parentElement) {
  var fragment = document.createDocumentFragment();

  for (var j = 0; j < ADS_COUNT; j++) {
    fragment.appendChild(createPin(data[j]));
  }

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
  var featuresContainer = adElement.querySelector('.popup__features');
  var picturesContainer = adElement.querySelector('.popup__pictures');

  adElement.querySelector('h3').textContent = cardData.offer.title;
  adElement.querySelector('small').textContent = cardData.offer.address;
  adElement.querySelector('.popup__price').innerHTML = cardData.offer.price + ' &#x20bd;/ночь';
  adElement.querySelector('h4').textContent = housingTypes[cardData.offer.type];
  adElement.querySelector('.popup__size').textContent = cardData.offer.rooms + ' комнаты для ' + cardData.offer.guests + ' гостей';
  adElement.querySelector('.popup__time').textContent = 'Заезд после ' + cardData.offer.checkin + ' , выезд до ' + cardData.offer.checkout;
  adElement.querySelector('.popup__description').textContent = cardData.offer.description;
  adElement.querySelector('.popup__avatar').src = cardData.author.avatar;

  cardData.offer.features.forEach(function (feature) {
    featuresContainer.appendChild(createFeature(feature));
  });

  cardData.offer.photos.forEach(function (photo) {
    picturesContainer.appendChild(createPicture(photo));
  });

  return adElement;
};

adsData = getDataArray(ADS_COUNT);
map.classList.remove('map--faded');
renderPins(adsData, pinsContainer);
map.insertBefore(createCard(adsData[0]), filtersContainer);
