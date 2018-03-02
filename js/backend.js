'use strict';

(function () {
  var RESPONCE_TIMEOUT = 15000;
  /**
   * Коды ответа сервера
   * @enum {number}
   */
  var Code = {
    SUCCESS: 200
  };

  /**
   * Адреса запросов
   */
  var DefaultUrls = {
    SEND_FORM: 'https://js.dump.academy/keksobooking',
    GET_DATA: 'https://js.dump.academy/keksobooking/data'
  };

  var secondsForms = {
    singular: 'секунду',
    few: 'секунды',
    many: 'секунд'
  };

  /**
   * Создает объект запроса
   * @param {requestSuccess} successHandler
   * @param {requestError} errorHandler
   * @return {Object}
   */
  var initRequest = function (successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = RESPONCE_TIMEOUT;
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === Code.SUCCESS) {
        successHandler(xhr.response);
      } else {
        errorHandler();
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения.');
    });

    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + ' ' + window.utils.declensionOfNoun(Math.ceil(xhr.timeout / 1000), secondsForms) + '.');
    });

    return xhr;
  };

  /**
   * Обработчик успешного запроса от сервера
   *
   * @callback requestSuccess
   * @param {Object} xhr
   */

  /**
   * Обработчик ошибки запроса от сервера
   *
   * @callback requestError
   * @param {Object} xhr
   */

  /**
   * Отправляет данные на сервер
   * @param {Object} data
   * @param {requestSuccess} successHandler
   * @param {requestError} errorHandler
   */
  var upload = function (data, successHandler, errorHandler) {
    var xhr = initRequest(successHandler, errorHandler);
    xhr.open('POST', DefaultUrls.SEND_FORM);
    xhr.send(data);
  };

  /**
   * Получает данные с сервера
   * @param {onSuccess} successHandler
   * @param {onError} errorHandler
   */
  var download = function (successHandler, errorHandler) {
    var xhr = initRequest(successHandler, errorHandler);
    xhr.open('GET', DefaultUrls.GET_DATA);
    xhr.send();
  };

  window.backend = {
    upload: upload,
    download: download,
  };
})();
