'use strict';

function swapLogo() {
  const picture = document.querySelector('.logo');
  if (picture.getAttribute('src') == 'img/logo-header.png') {
    picture.src = 'img/logo-footer.png';
  } else {
    picture.src = 'img/logo-header.png';
  }
}
// Главное меню сайта
document.querySelector('.user-panel__btn--menu').onclick = function () {
  swapLogo();
  document.querySelector('.header').classList.toggle('header--menu');
  document.querySelector('body').classList.toggle('stop-scrolling');

  // Открытие списков в мобильном варианте
  const menuItem = document.querySelectorAll('.menu__link');
  for (let elem of menuItem) {
    elem.onclick = function () {
      if (this.parentElement.classList.contains('menu__item--active')) {
        this.parentElement.classList.remove('menu__item--active');
      } else {
        const allSibling = document.querySelectorAll('.menu__item');
        for (let elemSibling of allSibling) {
          elemSibling.classList.remove('menu__item--active');
        }
        this.parentElement.classList.add('menu__item--active');
      }
    };
  }
};

// Обработка "КОРЗИНЫ"
function Product(image, name, description, price) {
  this.image = image;
  this.name = name;
  this.description = description;
  this.price = price;
  this.quantity = 1;
}

function backToTop() {
  if (window.pageYOffset > 0) {
    window.scrollBy(0, -40);
    setTimeout(backToTop, 0);
  }
}

function addProductCart() {
  let productList = [];

  const allProduct = document.querySelectorAll('.item-product__btn');

  for (let product of allProduct) {
    product.onclick = function () {
      let imgProduct = this.querySelector('.iten-product__img').getAttribute('src');
      let nameProduct = this.querySelector('.item-product__name').innerText;
      let descriptionProduct = this.querySelector('.item-product__description').innerText;
      let priceProduct = this.querySelector('.item-product__price').innerText;

      let buyProduct = new Product(imgProduct, nameProduct, descriptionProduct, priceProduct);

      let allProductBtn = document.querySelectorAll('.item-product__btn');
      for (let elem of allProductBtn) {
        elem.insertAdjacentHTML('afterend', '<div class="item-product__block"></div>');
        setTimeout(() => elem.nextElementSibling.remove(), 5000);
      }

      // Показываем плашку с товаром
      document.body.insertAdjacentHTML(
        'beforeend',
        '<div class="popup-add">' +
          '<div class="popup-add__img"><img src="' +
          imgProduct +
          '" alt="' +
          nameProduct +
          '" /></div>' +
          '<div class="popup-add__name">' +
          nameProduct +
          '</div>' +
          '<div class="popup-add__description">' +
          descriptionProduct +
          '</div>' +
          '<div class="popup-add__price">' +
          priceProduct +
          '</div>' +
          '<button class="popup-add__btn">К корзине</button></div>'
      );

      const goTopBtn = document.querySelector('.popup-add__btn');
      goTopBtn.addEventListener('click', backToTop);

      setTimeout(() => document.querySelector('.popup-add').remove(), 5000);

      // Добовляем товар или меняем его кол-во
      if (productList.length != 0) {
        let numberItem = 0;
        for (let item of productList) {
          if (item.name == buyProduct.name) {
            item.quantity++;
            numberItem = 0;
            break;
          }
          numberItem++;
          if (productList.length == numberItem) {
            productList.push(buyProduct);
            numberItem = 0;
            break;
          }
        }
      } else {
        productList.push(buyProduct);
      }
      // Сбрасываем корзину
      document.querySelector('.popup-cart__list').innerHTML = '';

      let sumProduct = 0;
      // Считаем общие кол-во товара и переносим их из массива в корзину
      for (let item of productList) {
        sumProduct = sumProduct + item.quantity;

        document
          .querySelector('.popup-cart__list')
          .insertAdjacentHTML(
            'beforeend',
            '<li class="popup-cart__item">' +
              '<div class="popup-cart__img"><img src="' +
              item.image +
              '" alt="' +
              item.name +
              '" /></div> <div class="popup-cart__name">' +
              item.name +
              '</div>' +
              '<div class="popup-cart__description">' +
              item.description +
              '</div>' +
              '<div class="popup-cart__price">' +
              item.price +
              '</div>' +
              '<div class="popup-cart__quantity">' +
              item.quantity +
              '</div>' +
              '<button class="popup-cart__delete" aria-label="Удалить товар"></button></li>'
          );
      }

      const btnCart = document.querySelector('.user-panel__btn--cart');
      if (sumProduct === 1) {
        btnCart.classList.toggle('user-panel__btn--cart-null');
      }

      btnCart.innerHTML = sumProduct;

      const deleteProduct = document.querySelectorAll('.popup-cart__delete');

      for (let product of deleteProduct) {
        product.onclick = function () {
          let nameProductDelete = this.parentElement.querySelector('.popup-cart__name').innerText;
          let quantityProduct = this.parentElement.querySelector('.popup-cart__quantity').innerText;
          // Находим номер элемента в массиве и удаляем его
          let index = productList.findIndex((el) => el.name === nameProductDelete);
          productList.splice(index, 1);
          // Уменьшаем кол-во товаров в корзине
          sumProduct = sumProduct - quantityProduct;
          btnCart.innerHTML = sumProduct;
          this.parentElement.remove();
          // Скрываем корзину
          if (sumProduct == 0) {
            document.querySelector('.popup-cart').classList.toggle('popup-cart--show');
            btnCart.classList.toggle('user-panel__btn--cart-null');
          }
        };
      }

      // Клик по корзине
      btnCart.onmouseover = function () {
        if (sumProduct > 0) {
          document.querySelector('.popup-cart').classList.toggle('popup-cart--show');
          // Закрываем корзину когда указатель мыши покидает границу элемента
          document.querySelector('.popup-cart').onmouseleave = function () {
            document.querySelector('.popup-cart').classList.toggle('popup-cart--show');
          };
        }
      };
    };
  }
}

addProductCart();

function validateComments(input, label, bar) {
  if (input.value.length == 0) {
    label.classList.add('section-navigation__label--invalid');
    bar.classList.add('section-navigation__bar--invalid');
    label.textContent = 'Пустая строка!';
  } else {
    // Длина комментария отвечает требованию,
    // поэтому очищаем сообщение об ошибке
    label.classList.remove('section-navigation__label--invalid');
    bar.classList.remove('section-navigation__bar--invalid');
    label.textContent = 'Введите название города';
  }
}

// Функция ymaps.ready() будет вызвана, когда
// загрузятся все компоненты API, а также когда будет готово DOM-дерево.
ymaps.ready(init);
function init() {
  // Создание карты.
  let myMap = new ymaps.Map('section-navigation__map', {
    // Координаты центра карты.
    // Порядок по умолчанию: «широта, долгота».
    // Чтобы не определять координаты центра карты вручную,
    // воспользуйтесь инструментом Определение координат.
    center: [55.7, 37.61],
    // Уровень масштабирования. Допустимые значения:
    // от 0 (весь мир) до 19.
    zoom: 12,
  });
  // Массив объектов
  const myPoints = [
    { coords: [55.76, 37.61], text: 'москва' }, // Россия, Москва, Манежная площадь, 1с2
    { coords: [59.93, 30.31], text: 'санкт-петербург' }, // Санкт-Петербург, ​Малая Морская, 4
    { coords: [53.2, 50.2], text: 'самара' }, // Самара, ​Дыбенко, 30
    { coords: [55.83, 49.12], text: 'казань' }, // Казань, Ямашева проспект, 46
    { coords: [54.72, 20.5], text: 'калининград' }, // Калининград, ​Театральная, 30
  ];

  let myCollection = new ymaps.GeoObjectCollection(
    {},
    {
      preset: 'islands#redIcon', //все метки красные
    }
  );
  // Добавляем метки на карту
  for (let elem of myPoints) {
    myCollection.add(new ymaps.Placemark(elem.coords));
  }
  myMap.geoObjects.add(myCollection);

  const navForm = document.forms.formnav;
  const navInput = navForm.elements.inputnav;
  const navLabel = document.querySelector('.section-navigation__label');
  const navBar = document.querySelector('.section-navigation__bar');

  navInput.onfocus = function () {
    navLabel.classList.add('label__valid');
  };

  navInput.onblur = function () {
    if (navInput.value == '') {
      navLabel.classList.remove('label__valid');
    }
  };

  navForm.onsubmit = function () {
    event.preventDefault(); // убираем перезагрузку страницы
    validateComments(navInput, navLabel, navBar);
    let numberElem = 0;
    for (let elem of myPoints) {
      if (elem.text === navInput.value.toLowerCase()) {
        navLabel.classList.remove('section-navigation__label--invalid');
        navBar.classList.remove('section-navigation__bar--invalid');
        navLabel.textContent = 'Введите название города';
        numberElem++;
        // Перемещаем карту
        myMap.setCenter(elem.coords, 12, {
          checkZoomRange: true,
        });
      }

      if (numberElem == 0 && navInput.value.length != 0) {
        navLabel.classList.add('section-navigation__label--invalid');
        navBar.classList.add('section-navigation__bar--invalid');
        navLabel.textContent = 'В таком городе бутика нет!';
      }
    }
  };
}
