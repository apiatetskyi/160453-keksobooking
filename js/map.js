'use strict';

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

var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;

var DATA = {
  author: {
    avatars: ['img/avatars/user01.png', 'img/avatars/user02.png', 'img/avatars/user03.png', 'img/avatars/user04.png', 'img/avatars/user05.png', 'img/avatars/user06.png', 'img/avatars/user07.png', 'img/avatars/user08.png']
  },

  offer: {
    titles: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
    types: ['flat', 'house', 'bungalo'],
    checkins: ['12:00', '13:00', '14:00'],
    checkouts: ['12:00', '13:00', '14:00'],
    features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    description: '',
    photos: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
  }
};

/**
 * Возвращает случайное число
 * @param  {number} start
 * @param  {number} end
 * @return {number}
 */
var getRandom = function (start, end) {
  return Math.floor(Math.random() * (end - start) + start);
};

/**
 * Возвращает массив данных для объявлений
 * @param  {Object} data
 * @return {Array}
 */
var generateAdsData = function (data) {
  var adsData = [];

  for (var i = 0; i < data.author.avatars.length; i++) {
    var locationX = getRandom(LocationProps.MIN_X, LocationProps.MAX_X);
    var locationY = getRandom(LocationProps.MIN_Y, LocationProps.MAX_Y);

    var adData = {
      author: {
        avatar: data.author.avatars[i]
      },

      offer: {
        title: data.offer.titles[i],
        address: locationX + ', ' + locationY,
        price: getRandom(MIN_PRICE, MAX_PRICE),
        type: data.offer.types[getRandom(0, data.offer.types.length - 1)],
        rooms: getRandom(MIN_ROOMS, MAX_ROOMS),
        guests: getRandom(1, MAX_ROOMS * 2),
        checkin: data.offer.checkins[getRandom(0, data.offer.checkins.length - 1)],
        checkout: data.offer.checkouts[getRandom(0, data.offer.checkouts.length - 1)],
        features: data.offer.features.slice(0, getRandom(1, data.offer.features.length - 1)),
        description: '',
        photos: data.offer.photos
      },

      location: {
        x: locationX,
        y: locationY
      }
    };

    adsData.push(adData);
  }

  return adsData;
};

/**
 * Создает пин исходя из данных в объявлении
 * @param  {Object} ad
 * @return {Node}
 */
var createPin = function (ad) {
  var pinTemplate = templates.querySelector('.map__pin');
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.left = ad.location.x + 'px';
  pinElement.style.top = ad.location.y + 'px';
  pinElement.querySelector('img').src = ad.author.avatar;

  return pinElement;
};

/**
 * Рендерит пины для всех объявлений в заданом родительском элементе
 * @param {Node} parentElement
 */
var renderPins = function (parentElement) {
  var fragment = document.createDocumentFragment();

  for (var j = 0; j < ads.length; j++) {
    fragment.appendChild(createPin(ads[j]));
  }

  parentElement.appendChild(fragment);
};

/**
 * Создает карточку первого объявления
 * @param  {Object} data
 * @return {Node}
 */
var createFirstCard = function (data) {
  var firstAd = data[0];
  var adElement = templates.querySelector('.popup').cloneNode(true);
  var fragment = document.createDocumentFragment();
  var housingTypes = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  /**
   * Создает иконку доступного удобства в объявлении
   * @param  {strinf} featureData
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

  adElement.querySelector('h3').textContent = firstAd.offer.title;
  adElement.querySelector('small').textContent = firstAd.offer.address;
  adElement.querySelector('.popup__price').innerHTML = firstAd.offer.price + ' &#x20bd;/ночь';
  adElement.querySelector('h4').textContent = housingTypes[firstAd.offer.type];
  adElement.querySelector('p:nth-of-type(3)').textContent = firstAd.offer.rooms + ' комнаты для ' + firstAd.offer.guests + ' гостей';
  adElement.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + firstAd.offer.checkin + ' , выезд до ' + firstAd.offer.checkout;
  adElement.querySelector('p:nth-of-type(5)').textContent = firstAd.offer.description;
  adElement.querySelector('.popup__avatar').src = firstAd.author.avatar;


  for (var i = 0; i < firstAd.offer.features.length; i++) {
    fragment.appendChild(createFeature(firstAd.offer.features[i]));
  }
  adElement.querySelector('.popup__features').appendChild(fragment);

  for (var j = 0; j < firstAd.offer.photos.length; j++) {
    fragment.appendChild(createPicture(firstAd.offer.photos[j]));
  }
  adElement.querySelector('.popup__pictures').appendChild(fragment);

  return adElement;
};

var ads = generateAdsData(DATA);
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var filters = document.querySelector('.map__filters-container');
var templates = document.querySelector('template').content;

map.classList.remove('map--faded');
renderPins(mapPins);
map.insertBefore(createFirstCard(ads), filters);
