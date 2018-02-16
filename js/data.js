'use strict';

(function () {
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
    var locationX = window.utils.getRandomNumber(LocationProps.MIN_X, LocationProps.MAX_X);
    var locationY = window.utils.getRandomNumber(LocationProps.MIN_Y, LocationProps.MAX_Y);

    return {
      author: {
        avatar: adParams.AVATARS[index]
      },

      offer: {
        title: adParams.TITLES[index],
        address: locationX + ', ' + locationY,
        price: window.utils.getRandomNumber(PriceParams.MIN, PriceParams.MAX),
        type: adParams.TYPES[window.utils.getRandomNumber(0, adParams.TYPES.length - 1)],
        rooms: window.utils.getRandomNumber(RoomsParams.MIN, RoomsParams.MAX),
        guests: window.utils.getRandomNumber(1, RoomsParams.MAX * 2),
        checkin: adParams.TIMES[window.utils.getRandomNumber(0, adParams.TIMES.length - 1)],
        checkout: adParams.TIMES[window.utils.getRandomNumber(0, adParams.TIMES.length - 1)],
        features: adParams.FEATURES.slice(0, window.utils.getRandomNumber(1, adParams.FEATURES.length - 1)),
        description: '',
        photos: adParams.PHOTOS
      },

      location: {
        x: locationX,
        y: locationY
      }
    };
  };

  window.getData = generateAdData;
})();
