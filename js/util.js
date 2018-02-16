'use strict';

(function () {


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

  window.util = {
    getRandomNumber: getRandomNumber,
    declensionOfNoun: declensionOfNoun,
    syncSelects: syncSelects,
    syncInputToSelect: syncInputToSelect,
    toggleFormFieldsState: toggleFormFieldsState
  };
})();
