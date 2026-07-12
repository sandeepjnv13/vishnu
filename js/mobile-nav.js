"use strict";
/* ==========================================================================
   Unified mobile navigation drawer (behavior only; styling is in
   css/mobile-nav.css). Builds the SAME drawer on every page so mobile
   navigation is consistent. Desktop is untouched — the elements are
   display:none above 768px.
   ========================================================================== */
(function () {
  if (window.__mnavInit) return;
  window.__mnavInit = true;

  // Product Supply sub-pages (the collapsible group).
  var PRODUCTS = [
    ['product-catalog.html#product-supply-overview', 'OVERVIEW'],
    ['product-catalog.html#kitchen-cabinets-product', 'KITCHEN CABINETS &amp; VANITIES'],
    ['product-catalog.html#counter-tops', 'COUNTERTOPS'],
    ['product-catalog.html#flooring-block', 'FLOORING'],
    ['product-catalog.html#tiles-block', 'TILES'],
    ['product-catalog.html#showerdoors-block', 'SHOWER DOORS'],
    ['product-catalog.html#doors-block', 'DOORS'],
    ['product-catalog.html#custom-furniture', 'CUSTOM FURNITURE']
  ];

  function build() {
    var header = document.querySelector('#site-header') || document.querySelector('header');
    if (!header || document.querySelector('.mnav-drawer')) return;

    // Hamburger — sits in the header, inherits its text color.
    var toggle = document.createElement('button');
    toggle.className = 'mnav-toggle';
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span>';
    header.appendChild(toggle);

    var overlay = document.createElement('div');
    overlay.className = 'mnav-overlay';

    var products = PRODUCTS.map(function (p) {
      return '<a href="' + p[0] + '">' + p[1] + '</a>';
    }).join('');

    var drawer = document.createElement('aside');
    drawer.className = 'mnav-drawer';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML =
      '<div class="mnav-head">' +
        '<button class="mnav-close" aria-label="Close menu">&times;</button>' +
      '</div>' +
      '<div class="mnav-main">' +
        '<a href="index.html#about">ABOUT US</a>' +
        '<a href="our-services.html">OUR SERVICES</a>' +
        '<a href="our-work-gallery.html">OUR WORK</a>' +
        '<a href="contact.html">CONTACT</a>' +
      '</div>' +
      '<div class="mnav-title">Our Services</div>' +
      '<div class="mnav-services">' +
        '<a href="interior-design.html#interior-design">INTERIOR DESIGN</a>' +
        '<div class="mnav-group">' +
          '<button class="mnav-group-toggle" aria-expanded="false">' +
            'PRODUCT SUPPLY<span class="mnav-chevron">&#9662;</span>' +
          '</button>' +
          '<div class="mnav-sub">' + products + '</div>' +
        '</div>' +
        '<a href="turnkey-execution.html#turnkey-execution">TURNKEY EXECUTION</a>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    function open() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.classList.add('mnav-open');
      toggle.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
    }
    function close() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.classList.remove('mnav-open');
      toggle.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    }

    toggle.addEventListener('click', open);
    overlay.addEventListener('click', close);
    drawer.querySelector('.mnav-close').addEventListener('click', close);

    // Collapsible Product Supply group.
    var group = drawer.querySelector('.mnav-group');
    var groupToggle = drawer.querySelector('.mnav-group-toggle');
    groupToggle.addEventListener('click', function () {
      var expanded = group.classList.toggle('open');
      groupToggle.setAttribute('aria-expanded', String(expanded));
    });

    // Any destination link closes the drawer.
    Array.prototype.forEach.call(drawer.querySelectorAll('a'), function (a) {
      a.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
