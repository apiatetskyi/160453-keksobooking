'use strict';

(function () {
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
   * @param  {AdData} cardData
   * @return {Node}
   */
  var create = function (cardData) {
    var card = document.querySelector('template').content.querySelector('.popup').cloneNode(true);
    var closeButton = card.querySelector('.popup__close');
    var featuresContainer = card.querySelector('.popup__features');
    var picturesContainer = card.querySelector('.popup__pictures');

    card.querySelector('h3').textContent = cardData.offer.title;
    card.querySelector('small').textContent = cardData.offer.address;
    card.querySelector('.popup__price').innerHTML = cardData.offer.price + ' &#x20bd;/ночь';
    card.querySelector('h4').textContent = housingTypes[cardData.offer.type];
    card.querySelector('.popup__size').textContent = window.util.declensionOfNoun(cardData.offer.rooms, roomForms) + ' для ' + window.util.declensionOfNoun(cardData.offer.guests, guestForms);
    card.querySelector('.popup__time').textContent = 'Заезд после ' + cardData.offer.checkin + ' , выезд до ' + cardData.offer.checkout;
    card.querySelector('.popup__description').textContent = cardData.offer.description;
    card.querySelector('.popup__avatar').src = cardData.author.avatar;

    cardData.offer.features.forEach(function (feature) {
      featuresContainer.appendChild(createFeature(feature));
    });

    cardData.offer.photos.forEach(function (photo) {
      picturesContainer.appendChild(createPicture(photo));
    });

    closeButton.addEventListener('click', function () {
      window.map.closeCard();
    });

    return card;
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

  window.card = {
    create: create
  };

})();
