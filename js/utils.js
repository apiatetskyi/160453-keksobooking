'use strict';

(function () {

  var DEBOUNCE_INTERVAL = 500;
  var timeoutId;

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
   * Синхронизирует данные селекта с атрибутом инпута на основе словаря
   * @param {Node} select
   * @param {Node} input
   * @param {Object} dictionary
   * @param {string} attribute
   */
  var syncInputToSelect = function (select, input, dictionary, attribute) {
    input[attribute] = dictionary[select.value];
  };

  function debounce(callback) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(callback, DEBOUNCE_INTERVAL);
  }

  window.utils = {
    declensionOfNoun: declensionOfNoun,
    syncSelects: syncSelects,
    syncInputToSelect: syncInputToSelect,
    toggleFormFieldsState: toggleFormFieldsState,
    debounce: debounce
  };
})();
