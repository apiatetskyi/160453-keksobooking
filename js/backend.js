'use strict';

(function () {
  var secondsForms = {
    singular: 'секунду',
    few: 'секунды',
    many: 'секунд'
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
   * @param {string} url
   * @param {Object} data
   * @param {requestSuccess} successHandler
   * @param {requestError} errorHandler
   */
  var upload = function (url, data, successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        successHandler(xhr.status);
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

    xhr.timeout = 10000;
    xhr.open('POST', url);
    xhr.send(data);
  };

  /**
   * Получает данные с сервера
   * @param {string} url
   * @param {onSuccess} successHandler
   * @param {onError} errorHandler
   */
  var download = function (url, successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        successHandler(xhr.response);
      } else {
        errorHandler('Ошибка сервера. Не удалось загрузить похожие объявления.');
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения.');
    });

    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + ' ' + window.utils.declensionOfNoun(Math.ceil(xhr.timeout / 1000), secondsForms) + '.');
    });
    xhr.timeout = 10000;
    xhr.open('GET', url);
    xhr.send();
  };

  window.backend = {
    upload: upload,
    download: download,
  };
})();
