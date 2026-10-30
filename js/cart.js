(function () {
  'use strict';

  var KEY = 'ww_cart';

  // ── Storage helpers ──────────────────────────────────────────
  function getItems() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }

  function saveItems(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
  }

  // ── Cart actions ─────────────────────────────────────────────
  function addItem(product) {
    var items = getItems();
    var hit = false;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === product.id) { items[i].qty += 1; hit = true; break; }
    }
    if (!hit) { product.qty = 1; items.push(product); }
    saveItems(items);
    refreshNav();
  }

  function removeItem(id) {
    saveItems(getItems().filter(function (i) { return i.id !== id; }));
    refreshNav();
    renderCartPage();
  }

  function setQty(id, qty) {
    var items = getItems().map(function (i) {
      if (i.id === id) i.qty = qty;
      return i;
    }).filter(function (i) { return i.qty > 0; });
    saveItems(items);
    refreshNav();
    renderCartPage();
  }

  function totalCount() {
    return getItems().reduce(function (s, i) { return s + i.qty; }, 0);
  }

  function totalPrice() {
    return getItems().reduce(function (s, i) { return s + i.price * i.qty; }, 0);
  }

  // ── Nav badge ────────────────────────────────────────────────
  function refreshNav() {
    var n = totalCount();
    document.querySelectorAll('.nav-cart').forEach(function (el) {
      el.textContent = n > 0 ? 'Cart (' + n + ')' : 'Cart (0)';
    });
  }

  // ── Add-to-cart button on product pages ──────────────────────
  function initAddBtn() {
    var btn = document.querySelector('.btn-add-cart');
    if (!btn) return;
    btn.addEventListener('click', function () {
      addItem({
        id:    btn.dataset.id,
        name:  btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        img:   btn.dataset.img
      });
      btn.textContent = 'Added!';
      setTimeout(function () { btn.textContent = 'Add to Cart'; }, 1800);
    });
  }

  // ── Cart page renderer ───────────────────────────────────────
  function renderCartPage() {
    var wrap    = document.getElementById('cart-items');
    var summary = document.getElementById('cart-summary');
    if (!wrap) return;

    var items = getItems();

    if (items.length === 0) {
      wrap.innerHTML = '<p class="cart-empty">Your cart is empty. <a href="shop.html">Browse the shop &rarr;</a></p>';
      if (summary) summary.style.display = 'none';
      return;
    }

    if (summary) summary.style.display = '';

    wrap.innerHTML = items.map(function (item) {
      return (
        '<div class="cart-row">' +
          '<div class="cart-img"><img src="' + item.img + '" alt="' + item.name + '"></div>' +
          '<div class="cart-details">' +
            '<p class="cart-name">' + item.name + '</p>' +
            '<p class="cart-unit">£' + item.price.toFixed(2) + ' each</p>' +
          '</div>' +
          '<div class="cart-qty">' +
            '<button class="qty-btn" data-id="' + item.id + '" data-delta="-1">&#8722;</button>' +
            '<span class="qty-num">' + item.qty + '</span>' +
            '<button class="qty-btn" data-id="' + item.id + '" data-delta="1">+</button>' +
          '</div>' +
          '<p class="cart-line">£' + (item.price * item.qty).toFixed(2) + '</p>' +
          '<button class="cart-remove" data-id="' + item.id + '" aria-label="Remove">&times;</button>' +
        '</div>'
      );
    }).join('');

    // Bind qty buttons
    wrap.querySelectorAll('.qty-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id   = btn.dataset.id;
        var curr = getItems().filter(function (i) { return i.id === id; })[0];
        if (curr) setQty(id, curr.qty + parseInt(btn.dataset.delta, 10));
      });
    });

    // Bind remove buttons
    wrap.querySelectorAll('.cart-remove').forEach(function (btn) {
      btn.addEventListener('click', function () { removeItem(btn.dataset.id); });
    });

    var totalEl = document.getElementById('cart-total-price');
    if (totalEl) totalEl.textContent = '£' + totalPrice().toFixed(2);
  }

  // ── Boot ─────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    refreshNav();
    initAddBtn();
    renderCartPage();
  });

})();
