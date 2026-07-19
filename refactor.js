const fs = require('fs');

const htmlPath = 'template.html';
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(/\r\n/g, '\n');

// Add the CSS that I added before because git checkout wiped it:
html = html.replace('/* ========================================', 
`/* Responsive Video Slides */
      @media (min-width: 768px) {
        .mobile-video-slide { display: none !important; }
      }
      @media (max-width: 767px) {
        .desktop-video-slide { display: none !important; }
      }

      /* ========================================`);


// Replacements
html = html.replace('<!-- SEO_INJECTION -->', '<!-- SEO_INJECTION -->\n'); // Make sure it exists. Wait, it doesn't exist yet!

// I will insert it in <head>
html = html.replace(/<head>/, '<head>\n    <!-- SEO_INJECTION -->');

// Replace <html lang="en">
html = html.replace(/<html lang="en">/, '<html lang="en">'); // build.js replaces this via regex

// Language toggles
html = html.replace(
  /<div class="lang-toggle">[\s\S]*?<\/div>/,
  `<div class="lang-toggle">
            <a href="/es/" class="lang-btn {{active_es}}">ES</a>
            <a href="/" class="lang-btn {{active_en}}">EN</a>
          </div>`
);

// We need to replace all texts based on en.json
const enData = JSON.parse(fs.readFileSync('lang/en.json', 'utf8'));

function flattenObject(ob) {
  var toReturn = {};
  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;
    if ((typeof ob[i]) == 'object' && ob[i] !== null) {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

const flat = flattenObject(enData);

// Manual complex replacements
html = html.replace(
  /<h1 class="hero-title" id="heroTitle">[\s\S]*?<\/h1>/,
  `<h1 class="hero-title" id="heroTitle">
          <span class="word" data-text="{{hero.words.0}}">{{hero.words.0}}</span>
          <span class="word" data-text="{{hero.words.1}}">{{hero.words.1}}</span>
          <span class="word" data-text="{{hero.words.2}}">{{hero.words.2}}</span>
        </h1>`
);

// We will drop the JS section completely
html = html.replace(/<script>[\s\S]*?<\/script>/g, function(match) {
  if (match.includes('let translations = {}') || match.includes('let currentLang = "en"')) {
    // Return a smaller script that only initializes swipers and UI things
    return `<script>
      // Smooth scroll helper
      function scrollToSection(id) {
        document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "start" });
      }

      document.getElementById("currentYear").textContent = new Date().getFullYear();

      // Header scroll effect
      const header = document.getElementById("header");
      window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      });

      // Mobile menu toggle
      const mobileMenuToggle = document.getElementById("mobileMenuToggle");
      const mainMenu = document.getElementById("mainMenu");

      mobileMenuToggle.addEventListener("click", () => {
        mainMenu.classList.toggle("active");
        mobileMenuToggle.classList.toggle("active");
      });

      document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
          mainMenu.classList.remove("active");
          mobileMenuToggle.classList.remove("active");
        });
      });

      // Fade in animation
      const fadeElements = document.querySelectorAll(".fade-in");
      const fadeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              fadeObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );
      fadeElements.forEach((el) => fadeObserver.observe(el));

      // Swiper Initializations
      function getVideoView() {
        return window.innerWidth < 768 ? "mobile" : "desktop";
      }

      function updateActiveVideoTitle() {
        if (!window.videoSwiper || !window.videoSwiper.slides.length) return;
        const slide = window.videoSwiper.slides[window.videoSwiper.activeIndex];
        document.getElementById("activeVideoTitle").textContent = slide.getAttribute("data-title");
      }

      function updateActiveOtherVideoTitle() {
        if (!window.otherSwiper || !window.otherSwiper.slides.length) return;
        const slide = window.otherSwiper.slides[window.otherSwiper.activeIndex];
        document.getElementById("activeOtherVideoTitle").textContent = slide.getAttribute("data-title");
      }

      document.addEventListener("DOMContentLoaded", function () {
        new Swiper("#appImagesSwiper", {
          effect: "slide",
          slidesPerView: 1,
          loop: true,
          speed: 400,
          grabCursor: true,
          autoplay: { delay: 4000, disableOnInteraction: true, pauseOnMouseEnter: true },
          pagination: { el: ".app-gallery-pagination", clickable: true },
          touchRatio: 1.5,
          touchAngle: 45,
          simulateTouch: true,
          allowTouchMove: true,
          threshold: 5,
        });

        window.videoSwiper = new Swiper("#videoSwiper", {
          effect: "fade",
          fadeEffect: { crossFade: true },
          slidesPerView: 1,
          loop: false,
          navigation: { nextEl: "#videoSwiperNext", prevEl: "#videoSwiperPrev" },
          on: { slideChange: updateActiveVideoTitle }
        });

        window.otherSwiper = new Swiper("#otherFeaturesSwiper", {
          effect: "fade",
          fadeEffect: { crossFade: true },
          slidesPerView: 1,
          loop: false,
          navigation: { nextEl: "#otherFeaturesNext", prevEl: "#otherFeaturesPrev" },
          on: { slideChange: updateActiveOtherVideoTitle }
        });

        // The slides are rendered statically now via build.js so we just call update once
        setTimeout(() => {
          updateActiveVideoTitle();
          updateActiveOtherVideoTitle();
        }, 100);
      });
    </script>`;
  }
  return match;
});

// Generic text replacements
// Fix mismatches manually before the array loop:
html = html.replace('Everything you need to compete, in one app.', '{{sections.mainFeatures.description}}');
html = html.replace('FightersTech was born from a real problem: important competitive\n            information gets lost in algorithms, schedules, and noise.', '{{sections.faq.description}}');
html = html.replace('<span class="section-label">App Gallery</span>', '<span class="section-label">{{sections.app.label}}</span>'); // First one
html = html.replace('Take a look at the FightersTech interface. Built for speed,\n              designed for competitors. Every screen is optimized for quick\n              access to the features you need most.', '{{sections.app.description}}');
// Wait, Other Features had "App Gallery" as its label!
html = html.replace('<span class="section-label">{{sections.app.label}}</span>\n          <h2 class="section-title" id="titleOtherFeatures">', '<span class="section-label">{{sections.more.label}}</span>\n          <h2 class="section-title" id="titleOtherFeatures">');
// Since the first replace changed it, wait, let's just do it directly.
html = html.replace('Explore additional tools and features that make FightersTech the\n            complete platform for fighting game enthusiasts.', '{{sections.more.description}}');
html = html.replace('Download FightersTech today and become part of the ultimate Fighting\n            Game Community platform.', '{{sections.cta.description}}');
html = html.replace('The ultimate platform for the Fighting Game Community. Train,\n              fight, and compete at your best.', '{{footer.brand.description}}');

const toReplace = [
  ['hero.subtitle', 'id="heroSubtitle">', '</p>'],
  ['hero.badge', 'class="hero-badge">', '</div>'],
  ['hero.scrollText', '<div class="scroll-indicator">\n        <span>', '</span>'],
  ['hero.storeButtons.apple.label', '<span class="store-btn-label">', '</span>'], // Will replace first 2? We have to be careful
  ['hero.storeButtons.google.label', '<span class="store-btn-label">', '</span>', 1],
  ['hero.storeButtons.apple.title', '<span class="store-btn-title">', '</span>'],
  ['hero.storeButtons.google.title', '<span class="store-btn-title">', '</span>', 1],

  ['nav.menuMainFeatures', 'id="menuMainFeatures"\n                >', '</a>'],
  ['nav.menuFaq', 'id="menuFaq"\n                >', '</a>'],
  ['nav.menuApp', 'id="menuApp"\n                >', '</a>'],
  ['nav.menuMore', 'id="menuMore"\n                >', '</a>'],
  ['nav.downloadApp', '<span id="headerDownloadText">', '</span>'],

  ['sections.mainFeatures.label', 'id="featuresLabel">', '</span>'],
  ['sections.mainFeatures.title', 'id="titleMainFeatures">\n            ', '\n          </h2>'],
  ['sections.mainFeatures.description', 'id="featuresDesc">\n            ', '\n          </p>'],

  ['sections.faq.label', 'id="whyLabel">', '</span>'],
  ['sections.faq.title', 'id="titleWhyFightersTech">\n            ', '\n          </h2>'],
  ['sections.faq.description', 'id="whyDesc">\n            ', '\n          </p>'],

  ['sections.app.label', '<span class="section-label">', '</span>', 1], // App Gallery is the second span.section-label
  ['sections.app.title', '<h2 id="titleAppImages">', '</h2>'],
  ['sections.app.description', '<h2 id="titleAppImages">See the <span>Action</span></h2>\n            <p>\n              ', '\n            </p>'],
  ['sections.app.swipeInstruction', '<span id="swipeText">', '</span>'],

  ['sections.more.label', '<span class="section-label">', '</span>', 2], // 3rd
  ['sections.more.title', 'id="titleOtherFeatures">\n            ', '\n          </h2>'],
  ['sections.more.description', '<p class="section-description">\n            ', '\n          </p>'],

  ['sections.cta.title', '<h2>', '</h2>'],
  ['sections.cta.description', '<div class="cta-content fade-in">\n          <h2>{{sections.cta.title}}</h2>\n          <p>\n            ', '\n          </p>'],

  ['footer.brand.description', '<h3>FightersTech</h3>\n            <p>\n              ', '\n            </p>'],
  ['footer.columns.product.title', '<h4>', '</h4>', 0],
  ['footer.columns.legal.title', '<h4>', '</h4>', 1],
  ['footer.columns.contact.title', '<h4>', '</h4>', 2],

  ['footer.columns.product.links.features', '<li><a href="#mainFeaturesSection">', '</a></li>'],
  ['footer.columns.product.links.faq', '<li><a href="#faqSection" id="linkFaq">', '</a></li>'],
  ['footer.columns.product.links.app', '<li><a href="#appSection">', '</a></li>'],

  ['footer.columns.legal.links.legalNotice', '<li><a href="#" id="linkLegal">', '</a></li>'],
  ['footer.columns.legal.links.privacyPolicy', '<li><a href="#" id="linkPrivacy">', '</a></li>'],
  ['footer.columns.legal.links.termsOfService', '<li><a href="#" id="linkTerms">', '</a></li>'],
  ['footer.columns.legal.links.cookiePolicy', '<li><a href="#" id="linkCookies">', '</a></li>'],
  ['footer.columns.legal.links.codeOfConduct', '<li><a href="#" id="linkConduct">', '</a></li>'],

  ['footer.columns.contact.links.contactUs', '<a href="mailto:info@fighterstech.com" id="linkContact"\n                  >', '</a\n                >'],
  ['footer.columns.contact.links.support', '<a\n                  href="https://twitter.com/fighterstech"\n                  target="_blank"\n                  rel="noopener noreferrer"\n                  >', '</a\n                >'],
  
  ['footer.rights', '<span id="footerRights">', '</span>']
];

// Actually, it's easier to just do regex or split/join. I will just use string index.

function replaceOccurrence(str, prefix, suffix, key, index = 0) {
  let parts = str.split(prefix);
  if (parts.length > index + 1) {
    let subParts = parts[index + 1].split(suffix);
    if (subParts.length > 1) {
      subParts[0] = '{{' + key + '}}';
      parts[index + 1] = subParts.join(suffix);
    }
  }
  return parts.join(prefix);
}

for (const args of toReplace) {
  html = replaceOccurrence(html, args[1], args[2], args[0], args[3] || 0);
}

// CTA buttons in footer
html = replaceOccurrence(html, '<span class="store-btn-label">', '</span>', 'hero.storeButtons.apple.label', 2);
html = replaceOccurrence(html, '<span class="store-btn-title">', '</span>', 'hero.storeButtons.apple.title', 2);
html = replaceOccurrence(html, '<span class="store-btn-label">', '</span>', 'hero.storeButtons.google.label', 3);
html = replaceOccurrence(html, '<span class="store-btn-title">', '</span>', 'hero.storeButtons.google.title', 3);

// App Gallery Feature List
let featureListHTML = '<ul class="feature-list">\n';
for (let i = 0; i < 5; i++) {
  featureListHTML += `              <li>{{sections.app.featureList.${i}}}</li>\n`;
}
featureListHTML += '            </ul>';
html = html.replace(/<ul class="feature-list">[\s\S]*?<\/ul>/, featureListHTML);

// Main feature cards
for (let i = 0; i < 4; i++) {
  html = replaceOccurrence(html, `<h3 id="featureCard${i+1}Title">`, '</h3>', `featureCards.${i}.title`);
  html = replaceOccurrence(html, `<p id="featureCard${i+1}Desc">\n              `, '\n            </p>', `featureCards.${i}.description`);
}

// Why cards
for (let i = 0; i < 4; i++) {
  html = replaceOccurrence(html, `<h3 id="whyCard${i+1}Title">`, '</h3>', `faqItems.${i}.title`);
  html = replaceOccurrence(html, `<p id="whyCard${i+1}Desc">\n              `, '\n            </p>', `faqItems.${i}.description`);
}

// Video placeholders
html = html.replace(
  /<div class="swiper-container" id="videoSwiper">[\s\S]*?<div class="swiper-wrapper"><\/div>/,
  `<div class="swiper-container" id="videoSwiper">
            <div class="swiper-wrapper">{{mainVideosHtml}}</div>`
);

html = html.replace(
  /<div class="swiper-container" id="otherFeaturesSwiper">[\s\S]*?<div class="swiper-wrapper"><\/div>/,
  `<div class="swiper-container" id="otherFeaturesSwiper">
            <div class="swiper-wrapper">{{otherVideosHtml}}</div>`
);

fs.writeFileSync(htmlPath, html);
console.log('Done refactoring template.html');
