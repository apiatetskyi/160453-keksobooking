'use strict';
(function () {
  var EXTENTIONS = ['gif', 'jpg', 'jpeg', 'png'];
  var EVENT_NAMES = ['dragover', 'dragleave', 'drop'];
  var MAX_UPLOAD = 8;

  var uploadInputs = document.querySelectorAll('.upload input[type=file]');
  var avatarPreview = document.querySelector('.notice__preview');
  var housePhoto = document.querySelector('.form__photo-container .upload__preview');
  var dropZones = document.querySelectorAll('.drop-zone');
  var uploadedPhotos = 0;
  var draggedPhoto = null;
  var avatarPlaceholder = null;

  var uploaders = {
    'avatar': function (files) {
      renderPreview(files[0], avatarPreview, true);
    },
    'images': function (files) {
      Array.prototype.forEach.call(files, function (file) {
        uploadedPhotos++;
        if (uploadedPhotos <= MAX_UPLOAD) {
          renderPreview(file, housePhoto);
        } else {
          window.showAlert('Превышено максимальное количество фотографий: ' + MAX_UPLOAD, 'error');
        }
      });
    }
  };

  /**
   * Рендерит картинку в заданом контейнере для превью
   * @param {Object} file
   * @param {Node} previewContainer
   * @param {boolean} onlyOne
   */
  var renderPreview = function (file, previewContainer, onlyOne) {
    if (file && checkFileType(file.name)) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var photo = document.createElement('img');
        photo.classList.add('upload__img');
        photo.src = reader.result;
        photo.draggable = true;
        preventDefaultHandlers(photo);
        photo.addEventListener('dragstart', photoDragstartHandler);
        photo.addEventListener('dragend', photoDragendHandler);
        photo.addEventListener('drop', photoDropHandler);
        previewContainer.appendChild(photo);

        if (onlyOne) {
          var removedNode = previewContainer.removeChild(previewContainer.children[0]);
          if (removedNode.src.endsWith('img/muffin.png')) {
            avatarPlaceholder = removedNode;
          }
        }
      });

      reader.readAsDataURL(file);
    } else {
      window.showAlert('Неверный формат изображения', 'error');
    }
  };

  /**
   * Проверяет расширение файла
   * @param {string} fileName
   * @return {boolean}
  */
  var checkFileType = function (fileName) {
    return EXTENTIONS.some(function (extention) {
      return fileName.endsWith(extention);
    });
  };

  /**
   * Убирает дефолтные drag&drop обработчики
   * @param {Node} dropZone
   */
  var preventDefaultHandlers = function (dropZone) {
    EVENT_NAMES.forEach(function (eventName) {
      dropZone.addEventListener(eventName, function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
      });
    });
  };

  /**
   * Возвращает блоки с превью в исходное состояние
   */
  var clear = function () {
    while (housePhoto.firstChild) {
      housePhoto.removeChild(housePhoto.firstChild);
    }
    avatarPreview.removeChild(avatarPreview.children[0]);
    avatarPreview.appendChild(avatarPlaceholder);
  };

  var uploadChangeHandler = function (evt) {
    var files = evt.target.files;
    uploaders[evt.target.id](files);
  };

  var dropZoneDragoverHandler = function (evt) {
    evt.target.classList.add('drop-zone--dragover');
  };

  var dropZoneDragleaveHandler = function (evt) {
    evt.target.classList.remove('drop-zone--dragover');
  };

  var dropZoneDropHandler = function (evt) {
    evt.target.classList.remove('drop-zone--dragover');
    var data = evt.dataTransfer;
    var files = data.files;

    uploaders[evt.target.htmlFor](files);
  };

  var photoDragstartHandler = function (evt) {
    evt.target.classList.add('upload__img--placeholder');
    evt.dataTransfer.setDragImage(evt.target, 20, 20);
    evt.dataTransfer.dropEffect = 'move';
    draggedPhoto = evt.target;
  };

  var photoDragendHandler = function (evt) {
    evt.target.classList.remove('upload__img--placeholder');
  };

  var photoDropHandler = function (evt) {
    var element = evt.target;
    var elementMiddle = element.getBoundingClientRect().left + (element.getBoundingClientRect().right - element.getBoundingClientRect().left) / 2;

    if (evt.clientX > elementMiddle) {
      if (element.nextSibling) {
        element.parentElement.insertBefore(draggedPhoto, element.nextSibling);
      } else {
        element.parentElement.appendChild(draggedPhoto);
      }
    } else {
      element.parentElement.insertBefore(draggedPhoto, element);
    }
    draggedPhoto = null;
  };

  dropZones.forEach(function (dropZone) {
    preventDefaultHandlers(dropZone);
    dropZone.addEventListener('dragover', dropZoneDragoverHandler);
    dropZone.addEventListener('dragleave', dropZoneDragleaveHandler);
    dropZone.addEventListener('drop', dropZoneDropHandler);
  });

  uploadInputs.forEach(function (input) {
    input.addEventListener('change', uploadChangeHandler);
  });

  window.uploadPhoto = {
    clear: clear
  };
})();
