'use strict';

(function () {
  /**
   * Диапазон цен
   * @enum {number}
   */
  var Price = {
    LOW: 10000,
    HIGH: 50000
  };

  var rangeToPrice = {
    middle: function (value) {
      return value > Price.LOW && value < Price.HIGH;
    },
    low: function (value) {
      return value <= Price.LOW;
    },
    high: function (value) {
      return value >= Price.HIGH;
    },
  };

  var filterForm = document.querySelector('.map__filters');
  var type = filterForm.querySelector('#housing-type');
  var price = filterForm.querySelector('#housing-price');
  var rooms = filterForm.querySelector('#housing-rooms');
  var guests = filterForm.querySelector('#housing-guests');
  var checkboxes = filterForm.querySelectorAll('input[type="checkbox"]');
  var features = Array.prototype.slice.call(checkboxes).filter(function (feature) {
    return feature.checked;
  });

  var filterType = function (ad) {
    return type.value === 'any' || ad.offer.type === type.value;
  };

  var filterPrice = function (ad) {
    return price.value === 'any' || rangeToPrice[price.value](ad.offer.price);
  };

  var filterRooms = function (ad) {
    return rooms.value === 'any' || ad.offer.rooms === parseInt(rooms.value, 10);
  };

  var filterGuests = function (ad) {
    return guests.value === 'any' || ad.offer.guests === parseInt(guests.value, 10);
  };

  var filterFeatures = function (ad) {
    return features.every(function (feature) {
      return ad.offer.features.indexOf(feature) !== -1;
    });
  };

  /**
   * Применяет фильтр к переданным данным
   * @param {Array} data
   * @return {Array} Возвращает отфильтрованные данные
   */
  var apply = function (data) {
    var filteredData = data.slice()
        .filter(filterType)
        .filter(filterPrice)
        .filter(filterRooms)
        .filter(filterGuests)
        .filter(filterFeatures);

    return filteredData;
  };

  window.filter = {
    element: filterForm,
    apply: apply
  };

})();
