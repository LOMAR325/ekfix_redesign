(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  var header = document.querySelector(".site-header");
  if (toggle && nav && header) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      var expanded = nav.classList.contains("open");
      toggle.setAttribute("aria-expanded", String(expanded));
      header.classList.toggle("nav-open", expanded);
      document.body.classList.toggle("nav-locked", expanded);
      if (!expanded) {
        nav.querySelectorAll(".nav-item.open").forEach(function (item) { item.classList.remove("open"); });
      }
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        header.classList.remove("nav-open");
        document.body.classList.remove("nav-locked");
        nav.querySelectorAll(".nav-item.open").forEach(function (item) { item.classList.remove("open"); });
      });
    });
  }

  // Nav dropdowns (desktop: hover/focus via CSS; touch/mobile: tap to toggle)
  document.querySelectorAll(".nav-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var item = trigger.closest(".nav-item");
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".nav-item.open").forEach(function (other) {
        if (other !== item) other.classList.remove("open");
      });
      item.classList.toggle("open", !wasOpen);
      trigger.setAttribute("aria-expanded", String(!wasOpen));
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-item")) {
      document.querySelectorAll(".nav-item.open").forEach(function (item) { item.classList.remove("open"); });
    }
  });

  // Side rail + nav active-section tracking (home page only)
  var sections = document.querySelectorAll("section[id]");
  var railLinks = document.querySelectorAll(".side-rail a");
  var navLinks = document.querySelectorAll(".main-nav a[data-section]");
  if (sections.length && (railLinks.length || navLinks.length)) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        railLinks.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + id);
        });
        navLinks.forEach(function (a) {
          a.classList.toggle("active", a.dataset.section === id);
        });
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    sections.forEach(function (s) { obs.observe(s); });
  }

  // Book form: appliance pre-select from repair grid cards
  document.querySelectorAll("[data-appliance]").forEach(function (card) {
    card.addEventListener("click", function () {
      var select = document.getElementById("appliance");
      if (select) select.value = card.dataset.appliance;
    });
  });

  // Book form: local "sent" state (no backend wired up yet)
  var form = document.getElementById("book-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var thanks = document.getElementById("book-thanks");
      form.classList.add("hidden");
      if (thanks) thanks.classList.remove("hidden");
    });
  }
})();
