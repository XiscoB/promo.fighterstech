const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 1. Copiar assets estáticos y archivos de configuración a /dist
const staticItems = [
  'assets', 'img', 'lang', 'redkings', '.well-known',
  'robots.txt', 'sitemap.xml', 'favicon.ico', 'CNAME', 'app-ads.txt', '.nojekyll', 'google92ad45d1abd0d250.html'
];

staticItems.forEach(item => {
  const src = path.join(__dirname, item);
  const dest = path.join(distDir, item);
  if (fs.existsSync(src)) {
    // cpSync está disponible en Node >= 16.7
    fs.cpSync(src, dest, { recursive: true }); 
  }
});

// 2. Compilar el HTML
const templatePath = path.join(__dirname, 'template.html');
const template = fs.readFileSync(templatePath, 'utf8');

const enData = JSON.parse(fs.readFileSync(path.join(__dirname, 'lang', 'en.json'), 'utf8'));
const esData = JSON.parse(fs.readFileSync(path.join(__dirname, 'lang', 'es.json'), 'utf8'));

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

function buildHtml(lang, data, outputDir) {
  let html = template;
  const flatData = flattenObject(data);
  
  for (const [key, value] of Object.entries(flatData)) {
    // Solo reemplazamos strings y números, ignoramos arrays (que manejaremos de forma especial si hace falta)
    if (typeof value === 'string' || typeof value === 'number') {
      let finalValue = value;
      // Añadir <span> a la última palabra de los títulos
      if (key.match(/^sections\.(mainFeatures|otherFeatures|whyFightersTech|appGallery)\.title$/)) {
        const parts = value.split(" ");
        if (parts.length > 1) {
          const lastWord = parts.pop();
          finalValue = `${parts.join(" ")} <span>${lastWord}</span>`;
        }
      } else if (key === 'sections.cta.title') {
        const parts = value.split(" ");
        if (parts.length > 3) {
          const lastWords = parts.splice(-3).join(" ");
          finalValue = `${parts.join(" ")} <span>${lastWords}</span>`;
        }
      }
      
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, finalValue);
    }
  }

  // Generar HTML de los Videos (Swiper) para móvil y escritorio
  let mainVideosHtml = '';
  data.videoSwiper.mobileVideos.forEach(v => {
    mainVideosHtml += `<div class="swiper-slide mobile-video-slide" data-title="${v.title}">
      <iframe loading="lazy" class="mobile-video" src="https://www.youtube.com/embed/${v.id}?rel=0" frameborder="0" allowfullscreen></iframe>
    </div>`;
  });
  data.videoSwiper.desktopVideos.forEach(v => {
    mainVideosHtml += `<div class="swiper-slide desktop-video-slide" data-title="${v.title}">
      <iframe loading="lazy" src="https://www.youtube.com/embed/${v.id}?rel=0" frameborder="0" allowfullscreen></iframe>
    </div>`;
  });

  let otherVideosHtml = '';
  data.videoSwiper.mobileOtherVideos.forEach(v => {
    otherVideosHtml += `<div class="swiper-slide mobile-video-slide" data-title="${v.title}">
      <iframe loading="lazy" class="mobile-video" src="https://www.youtube.com/embed/${v.id}?rel=0" frameborder="0" allowfullscreen></iframe>
    </div>`;
  });
  data.videoSwiper.desktopOtherVideos.forEach(v => {
    otherVideosHtml += `<div class="swiper-slide desktop-video-slide" data-title="${v.title}">
      <iframe loading="lazy" src="https://www.youtube.com/embed/${v.id}?rel=0" frameborder="0" allowfullscreen></iframe>
    </div>`;
  });

  html = html.replace('{{mainVideosHtml}}', mainVideosHtml);
  html = html.replace('{{otherVideosHtml}}', otherVideosHtml);

  // Generar HTML de los Testimonios (Swiper)
  let testimonialsHtml = '';
  if (data.sections && data.sections.testimonials && data.sections.testimonials.reviews) {
    data.sections.testimonials.reviews.forEach((review) => {
      const initial = review.name ? review.name.charAt(0).toUpperCase() : 'F';
      testimonialsHtml += `<div class="swiper-slide">
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-author">
                <div class="testimonial-avatar">${initial}</div>
                <div class="testimonial-meta">
                  <span class="testimonial-name">${review.name}</span>
                  <span class="testimonial-handle">${review.handle}</span>
                </div>
              </div>
              <a href="${review.sourceUrl}" target="_blank" rel="noopener noreferrer" class="testimonial-source" aria-label="View Source">
                <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
            <p class="testimonial-text">${review.text}</p>
          </div>
        </div>`;
    });
  }
  html = html.replace('{{testimonialsHtml}}', testimonialsHtml);

  html = html.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`);
  html = html.replaceAll('{{active_en}}', lang === 'en' ? 'active' : '');
  html = html.replaceAll('{{active_es}}', lang === 'es' ? 'active' : '');

  const canonicalPath = lang === 'en' ? '' : 'es/';
  const seoBlock = `
    <link rel="canonical" href="https://promo.fighterstech.com/${canonicalPath}" />
    <link rel="alternate" href="https://promo.fighterstech.com/" hreflang="en" />
    <link rel="alternate" href="https://promo.fighterstech.com/es/" hreflang="es" />
    <link rel="alternate" href="https://promo.fighterstech.com/" hreflang="x-default" />
  `;
  html = html.replace('<!-- SEO_INJECTION -->', seoBlock);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, 'index.html');
  fs.writeFileSync(outputPath, html);
  console.log(`✅ Build completado en: /dist${lang === 'en' ? '' : '/' + lang}/index.html`);
}

// Generar Sitemap XML con hreflang
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://promo.fighterstech.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="es" href="https://promo.fighterstech.com/es/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://promo.fighterstech.com/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://promo.fighterstech.com/" />
  </url>
  <url>
    <loc>https://promo.fighterstech.com/es/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="es" href="https://promo.fighterstech.com/es/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://promo.fighterstech.com/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://promo.fighterstech.com/" />
  </url>
</urlset>`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml);
console.log('✅ Sitemap generado en: /dist/sitemap.xml');

// Generar versión Inglés (Raíz de dist)
buildHtml('en', enData, distDir);

// Generar versión Español (Carpeta /dist/es/)
buildHtml('es', esData, path.join(distDir, 'es'));

// Generar llms.txt para AI Bots (Perplexity, ChatGPT, etc)
// Leer el archivo base rico en contexto semántico
let llmsTxtBase = '';
try {
  llmsTxtBase = fs.readFileSync(path.join(__dirname, '.well-known', 'llms.txt'), 'utf8');
} catch (err) {
  try {
    // Fallback por si está en la raíz
    llmsTxtBase = fs.readFileSync(path.join(__dirname, 'llms.txt'), 'utf8');
  } catch (err2) {
    console.warn('⚠️ No se encontró llms.txt base. Se creará uno vacío.');
  }
}

const testimonialsSection = `
# ------------------------------------------------------------
# WHAT THE COMMUNITY IS SAYING (LIVE REVIEWS)
# ------------------------------------------------------------
${enData.sections.testimonials.reviews.map(r => `> "${r.text}"\n> — **${r.name}** (${r.handle})\n> Source: ${r.sourceUrl}`).join('\n\n')}
`;

const llmsTxt = llmsTxtBase + '\n' + testimonialsSection;

const wellKnownDir = path.join(distDir, '.well-known');
if (!fs.existsSync(wellKnownDir)) {
  fs.mkdirSync(wellKnownDir, { recursive: true });
}
fs.writeFileSync(path.join(distDir, 'llms.txt'), llmsTxt);
fs.writeFileSync(path.join(wellKnownDir, 'llms.txt'), llmsTxt);
console.log('✅ llms.txt generado en: /dist/llms.txt y /dist/.well-known/llms.txt');
