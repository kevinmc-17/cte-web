"use strict";

const body = document.body;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"], .site-nav a[href*=".html#"]');
const revealElements = document.querySelectorAll(".reveal");
const statNumbers = document.querySelectorAll(".stat-number");
const hero = document.getElementById("hero");

const closeMobileMenu = () => {
  if (!menuToggle || !siteNav) return;
  menuToggle.classList.remove("open");
  siteNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
};

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("open");
    siteNav.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!siteNav.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMobileMenu();
    }
  });
}

if (header) {
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

if (navLinks.length) {
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.includes("#")) return;
      const id = href.split("#")[1];
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMobileMenu();
    });
  });
}

if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}

const animateCount = (el) => {
  const finalValue = Number(el.dataset.count || 0);
  const duration = 1600;
  const startTime = performance.now();

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * finalValue);
    el.textContent = String(value);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = String(finalValue);
    }
  };

  requestAnimationFrame(step);
};

if (statNumbers.length) {
  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = "true";
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.55 }
  );
  statNumbers.forEach((stat) => statsObserver.observe(stat));
}

if (hero && window.matchMedia("(min-width: 1024px)").matches) {
  hero.addEventListener("mousemove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const moveX = (event.clientX - bounds.left - bounds.width / 2) / bounds.width;
    const moveY = (event.clientY - bounds.top - bounds.height / 2) / bounds.height;
    hero.style.transform = `translate3d(${moveX * -6}px, ${moveY * -5}px, 0)`;
  });

  hero.addEventListener("mouseleave", () => {
    hero.style.transform = "translate3d(0, 0, 0)";
  });
}

const secret = "CTE";
let keyBuffer = "";

document.addEventListener("keydown", (event) => {
  keyBuffer = `${keyBuffer}${event.key.toUpperCase()}`.slice(-secret.length);
  if (keyBuffer === secret) {
    body.classList.add("cte-easter");
    setTimeout(() => body.classList.remove("cte-easter"), 1200);
  }
});
