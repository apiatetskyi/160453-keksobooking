'use strict';

(function () {
  var currentAlert = null;
  var timeoutId;

  /**
   * Показывает высплывающее сообщение
   * @param {string} message Текст сообщения
   * @param {string} type Тип сообщение (success, error, warning)
   */
  var showAlert = function (message, type) {
    if (currentAlert) {
      document.body.removeChild(currentAlert);
      clearTimeout(timeoutId);
      currentAlert = null;
    }

    currentAlert = document.createElement('p');
    currentAlert.classList.add('alert-box', 'alert-box--' + type);
    currentAlert.textContent = message;
    document.body.appendChild(currentAlert);

    timeoutId = setTimeout(function () {
      document.body.removeChild(currentAlert);
      currentAlert = null;
      clearTimeout(timeoutId);
    }, 4000);
  };

  window.showAlert = showAlert;
})();
