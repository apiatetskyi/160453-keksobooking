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
    photos: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel1.jpg']
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

var ads = [];

for (var i = 0; i < 8; i++) {
  var locationX = getRandom(LocationProps.MIN_X, LocationProps.MAX_X);
  var locationY = getRandom(LocationProps.MIN_Y, LocationProps.MAX_Y);
  var ad = {
    author: {
      avatar: DATA.author.avatars[i]
    },

    offer: {
      title: DATA.offer.titles[i],
      address: locationX + ', ' + locationY,
      price: getRandom(MIN_PRICE, MAX_PRICE),
      type: DATA.offer.types[getRandom(0, DATA.offer.types.length - 1)],
      rooms: getRandom(MIN_ROOMS, MAX_ROOMS),
      guests: getRandom(1, MAX_ROOMS * 2),
      checkin: DATA.offer.checkins[getRandom(0, DATA.offer.checkins.length - 1)],
      checkout: DATA.offer.checkouts[getRandom(0, DATA.offer.checkouts.length - 1)],
      features: DATA.offer.features.slice(0, getRandom(1, DATA.offer.features.length - 1)),
      description: '',
      photos: DATA.offer.photos
    },

    location: {
      x: locationX,
      y: locationY
    }
  };

  ads[i] = ad;
}

var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var template = document.querySelector('template').content;
var pinTemplate = template.querySelector('.map__pin');
var fragment = document.createDocumentFragment();

map.classList.remove('map--faded');

var renderPin = function (pinData) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style.left = pinData.location.x + 'px';
  pinElement.style.top = pinData.location.y + 'px';
  pinElement.querySelector('img').src = pinData.author.avatar;
  return pinElement;
};

for (var j = 0; j < ads.length; j++) {
  fragment.appendChild(renderPin(ads[j]));
}

mapPins.appendChild(fragment);

