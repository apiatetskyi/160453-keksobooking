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
  var selects = Array.prototype.slice.call(filterForm.querySelectorAll('select'));
  var features = Array.prototype.slice.call(filterForm.querySelectorAll('input[type="checkbox"]:checked'));

  var filters = {
    'housing-type': function (ad) {
      return ad.offer.type === type.value;
    },
    'housing-price': function (ad) {
      return rangeToPrice[price.value](ad.offer.price);
    },
    'housing-rooms': function (ad) {
      return ad.offer.rooms === parseInt(rooms.value, 10);
    },
    'housing-guests': function (ad) {
      return ad.offer.guests === parseInt(guests.value, 10);
    },
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
    var filteredData = data.slice();

    selects.filter(function (select) {
      return select.value !== 'any';
    }).forEach(function (select) {
      filteredData = filteredData.filter(filters[select.id]);
    });

    filteredData = filteredData.filter(filterFeatures);

    return filteredData;
  };

  window.filter = {
    element: filterForm,
    apply: apply
  };

})();
