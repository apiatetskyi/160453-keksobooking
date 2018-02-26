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
      return (value > Price.LOW && value < Price.HIGH) ? true : false;
    },
    low: function (value) {
      return (value <= Price.LOW) ? true : false;
    },
    high: function (value) {
      return (value >= Price.HIGH) ? true : false;
    },
  };

  var filterForm = document.querySelector('.map__filters');
  var selects = filterForm.querySelectorAll('select');
  var checkboxes = filterForm.querySelectorAll('input[type="checkbox"]');
  var compareTemplate = {
    features: []
  };

  /**
   * Применяет фильтр к переданным данным
   * @param {Array} data
   * @return {Array} Возвращает отфильтрованные данные
   */
  var apply = function (data) {
    var filteredData = data.slice();

    selects.forEach(function (select) {
      var keyName = select.id.replace('housing-', '');

      if ((keyName === 'rooms' || keyName === 'guests') && select.value !== 'any') {
        compareTemplate[keyName] = parseInt(select.value, 10);
      } else {
        compareTemplate[keyName] = select.value;
      }
    });

    checkboxes.forEach(function (checkbox) {
      if (checkbox.checked) {
        compareTemplate.features.push(checkbox.value);
      }
    });

    filteredData = filteredData.filter(function (ad) {
      var featureCompare = compareTemplate.features.every(function (feature) {
        return ad.offer.features.indexOf(feature) !== -1;
      });

      var priceCompare = (compareTemplate.price === 'any') ? true : rangeToPrice[compareTemplate.price](ad.offer.price);

      for (var key in compareTemplate) {
        if (compareTemplate.hasOwnProperty(key) && compareTemplate[key] !== 'any') {

          if (key === 'price' && !priceCompare || key === 'features' && !featureCompare) {
            return false;
          } else if (ad.offer[key] !== compareTemplate[key] && key !== 'features' && key !== 'price') {
            return false;
          }
        }
      }

      return true;
    });

    return filteredData;
  };

  window.filter = {
    element: filterForm,
    apply: apply
  };

})();
