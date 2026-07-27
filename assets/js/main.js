/* ===============================================================
   JAY R BEES — interactions & GSAP animation
   =============================================================== */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  /* ---------- Navbar scroll state ---------- */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector(".hamburger");
  var menu = document.querySelector(".mobile-menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        burger.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Hero car reveal — car dissolves under the cursor to show the logo beneath ---------- */
  var heroReveal = document.getElementById("heroReveal");
  if (heroReveal) {
    var carLayer = heroReveal.querySelector(".hero-car");
    if (carLayer) {
      var move = function (e) {
        var r = heroReveal.getBoundingClientRect();
        carLayer.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        carLayer.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
        carLayer.style.setProperty("--r", "190px");
      };
      heroReveal.addEventListener("pointermove", move);
      heroReveal.addEventListener("pointerenter", move);
      heroReveal.addEventListener("pointerleave", function () {
        carLayer.style.setProperty("--r", "0px");
      });
    }
  }

  /* ---------- Promise section: color car under B&W, cursor reveals color ---------- */
  var promiseReveal = document.getElementById("promiseReveal");
  if (promiseReveal) {
    var bwLayer = promiseReveal.querySelector(".pr-bw");
    if (bwLayer) {
      var pmove = function (e) {
        var r = promiseReveal.getBoundingClientRect();
        bwLayer.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        bwLayer.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
        bwLayer.style.setProperty("--r", "340px");
      };
      promiseReveal.addEventListener("pointermove", pmove);
      promiseReveal.addEventListener("pointerenter", pmove);
      promiseReveal.addEventListener("pointerleave", function () {
        bwLayer.style.setProperty("--r", "0px");
      });
    }
  }

  /* ---------- Duplicate marquee track for seamless loop ---------- */
  document.querySelectorAll(".marquee-track").forEach(function (t) {
    t.innerHTML += t.innerHTML;
  });

  /* ---------- Contact form — emails submissions to the business inbox ---------- */
  var form = document.getElementById("quoteForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = form.querySelector(".form-success");
      var btn = form.querySelector('button[type="submit"]');
      var endpoint = "https://formsubmit.co/ajax/Baltagarcia333@gmail.com";
      if (btn) { btn.textContent = "Sending…"; btn.disabled = true; }
      fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      }).then(function (r) { return r.json(); }).then(function () {
        if (ok) ok.classList.add("show");
        if (btn) { btn.textContent = "Request Sent ✓"; }
        form.reset();
      }).catch(function () {
        if (btn) { btn.textContent = "Request My Free Quote"; btn.disabled = false; }
        // fall back to a normal POST submit if the fetch is blocked
        form.submit();
      });
    });
  }

  /* ---------- GSAP ---------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || typeof window.gsap === "undefined") return;

  var gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
  document.documentElement.classList.add("gsap-ready");

  /* Hero intro timeline */
  var heroEls = gsap.utils.toArray("[data-hero]");
  if (heroEls.length) {
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from("[data-hero='eyebrow']", { y: 24, opacity: 0, duration: .7 }, .1)
      .from("[data-hero='line']", { yPercent: 115, opacity: 0, duration: .95, stagger: .12 }, .18)
      .from("[data-hero='lead']", { y: 22, opacity: 0, duration: .7 }, .5)
      .from("[data-hero='badges'] > *", { y: 18, opacity: 0, duration: .5, stagger: .07 }, .6)
      .from("[data-hero='cta'] > *", { y: 18, opacity: 0, duration: .55, stagger: .1 }, .72)
      .from(".hero-scroll", { opacity: 0, duration: .6 }, .9);
  }

  /* Hero parallax on background */
  var heroBg = document.querySelector(".hero-bg img, .page-hero-bg img");
  if (heroBg && window.ScrollTrigger && !heroBg.closest(".hero--brand")) {
    gsap.to(heroBg, {
      yPercent: 16, ease: "none",
      scrollTrigger: { trigger: heroBg.closest(".hero, .page-hero"), start: "top top", end: "bottom top", scrub: true }
    });
  }

  /* Generic reveals */
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    gsap.to(el, {
      y: 0, opacity: 1, duration: .9, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 86%" }
    });
  });
  gsap.utils.toArray("[data-reveal-x]").forEach(function (el) {
    gsap.to(el, {
      x: 0, opacity: 1, duration: .9, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 86%" }
    });
  });

  /* Staggered groups */
  gsap.utils.toArray("[data-stagger]").forEach(function (group) {
    var kids = group.children;
    gsap.set(kids, { y: 40, opacity: 0 });
    gsap.to(kids, {
      y: 0, opacity: 1, duration: .7, ease: "power3.out", stagger: .08,
      scrollTrigger: { trigger: group, start: "top 82%" }
    });
  });

  /* Counters */
  gsap.utils.toArray("[data-count]").forEach(function (el) {
    var end = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var obj = { v: 0 };
    window.ScrollTrigger.create({
      trigger: el, start: "top 88%", once: true,
      onEnter: function () {
        gsap.to(obj, {
          v: end, duration: 1.6, ease: "power2.out",
          onUpdate: function () {
            el.textContent = (end % 1 === 0 ? Math.round(obj.v) : obj.v.toFixed(1)) + suffix;
          }
        });
      }
    });
  });

  /* Stacking banner scroll — first banner sticks, next two slide in from the right and stack over it, then release */
  var stackAreas = document.getElementById("stackAreas");
  if (stackAreas && window.ScrollTrigger) {
    var s2 = stackAreas.querySelector(".s2");
    var s3 = stackAreas.querySelector(".s3");
    gsap.set([s2, s3], { xPercent: 145 });
    var stl = gsap.timeline({
      scrollTrigger: {
        trigger: stackAreas,
        start: "top top",
        end: "+=2400",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
    stl.to(s2, { xPercent: 0, ease: "power2.out", duration: 1 })
       .to({}, { duration: 0.35 })
       .to(s3, { xPercent: 0, ease: "power2.out", duration: 1 })
       .to({}, { duration: 0.5 });
  }

  /* Recalculate triggers once images/fonts settle (prevents mis-fired positions) */
  if (window.ScrollTrigger) {
    window.addEventListener("load", function () { window.ScrollTrigger.refresh(); });
    setTimeout(function () { window.ScrollTrigger.refresh(); }, 500);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { window.ScrollTrigger.refresh(); });
    }
  }

  /* Failsafe: if anything is still hidden after 4s, reveal it so no content is ever lost */
  setTimeout(function () {
    gsap.utils.toArray("[data-reveal],[data-reveal-x]").forEach(function (el) {
      if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
        gsap.to(el, { opacity: 1, x: 0, y: 0, duration: .5, ease: "power2.out" });
      }
    });
    gsap.utils.toArray("[data-stagger]").forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (el) {
        if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
          gsap.to(el, { opacity: 1, x: 0, y: 0, duration: .5, ease: "power2.out" });
        }
      });
    });
  }, 4000);

})();
