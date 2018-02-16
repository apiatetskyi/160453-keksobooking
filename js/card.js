'use strict';

(function () {
  /**
   * @enum {number}
   */
  var KeyCodes = {
    ENTER: 13,
    ESC: 27
  };

  var currentCard;
  var housingTypes = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };
  var roomForms = {
    singular: 'комната',
    few: 'комнаты',
    many: 'комнат'
  };
  var guestForms = {
    singular: 'гостя',
    few: 'гостей',
    many: 'гостей'
  };

  /**
   * Создает карточку объявления
   * @param  {AdData} adData
   */
  var open = function (adData) {
    if (currentCard) {
      close();
    }
    var card = document.querySelector('template').content.querySelector('.popup').cloneNode(true);
    var closeButton = card.querySelector('.popup__close');
    var featuresContainer = card.querySelector('.popup__features');
    var picturesContainer = card.querySelector('.popup__pictures');

    card.querySelector('h3').textContent = adData.offer.title;
    card.querySelector('small').textContent = adData.offer.address;
    card.querySelector('.popup__price').innerHTML = adData.offer.price + ' &#x20bd;/ночь';
    card.querySelector('h4').textContent = housingTypes[adData.offer.type];
    card.querySelector('.popup__size').textContent = window.util.declensionOfNoun(adData.offer.rooms, roomForms) + ' для ' + window.util.declensionOfNoun(adData.offer.guests, guestForms);
    card.querySelector('.popup__time').textContent = 'Заезд после ' + adData.offer.checkin + ' , выезд до ' + adData.offer.checkout;
    card.querySelector('.popup__description').textContent = adData.offer.description;
    card.querySelector('.popup__avatar').src = adData.author.avatar;

    adData.offer.features.forEach(function (feature) {
      featuresContainer.appendChild(createFeature(feature));
    });

    adData.offer.photos.forEach(function (photo) {
      picturesContainer.appendChild(createPicture(photo));
    });

    closeButton.addEventListener('click', function () {
      close();
    });

    currentCard = card;
    window.map.element.appendChild(currentCard);
    document.addEventListener('keydown', escKeydownHandler);
  };

  /**
   * Закрывает текущую карточку объявления
   */
  var close = function () {
    if (currentCard) {
      window.map.element.removeChild(currentCard);
      currentCard = null;
      document.removeEventListener('keydown', escKeydownHandler);
    }
  };

  /**
   * Создает иконку доступного удобства в объявлении
   * @param  {string} featureData
   * @return {Node}
   */
  var createFeature = function (featureData) {
    var li = document.createElement('li');
    li.classList.add('feature', 'feature--' + featureData);

    return li;
  };

  /**
   * Создает фотографию к объявлению
   * @param  {string} pictureData
   * @return {Node}
   */
  var createPicture = function (pictureData) {
    var li = document.createElement('li');
    var img = document.createElement('img');
    img.src = pictureData;
    li.appendChild(img);

    return li;
  };

  /**
   * Обработчик нажатия на Escape
   * @param {Object} evt
   */
  var escKeydownHandler = function (evt) {
    if (evt.keyCode === KeyCodes.ESC) {
      close();
    }
  };

  window.card = {
    open: open,
    close: close
  };

})();
