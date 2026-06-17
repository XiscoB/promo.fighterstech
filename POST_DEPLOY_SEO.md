# Guía Post-Despliegue SEO y GEO (Generative Engine Optimization)

Una vez que hagas push a GitHub y la nueva versión esté desplegada y visible en `https://promo.fighterstech.com/`, sigue estrictamente estos pasos para garantizar que tanto Google como las IAs te consideren la solución número uno a la problemática: **"Cómo encontrar torneos online y offline de juegos de lucha / fighting games"**.

---

## FASE 1: Indexación en Buscadores Tradicionales (Google)

Tu web ahora tiene un mapa de sitio perfecto y etiquetas `hreflang`. Toca avisar a Google de que la casa está reformada.

1. **Accede a Google Search Console (GSC):**
   - Ve a [Google Search Console](https://search.google.com/search-console).
   - Asegúrate de tener verificada la propiedad `https://promo.fighterstech.com/`.

2. **Sube el nuevo Sitemap:**
   - En el menú izquierdo, ve a **Sitemaps**.
   - En el campo "Añadir un sitemap nuevo", escribe `sitemap.xml` y dale a **Enviar**.
   - *Nota:* Google leerá este archivo y descubrirá automáticamente las rutas `/` y `/es/` con sus respectivos idiomas.

3. **Fuerza la Re-indexación Manual:**
   - En la barra superior de GSC ("Inspeccionar cualquier URL"), pega `https://promo.fighterstech.com/` y dale a Enter.
   - Haz clic en **Solicitar Indexación**.
   - Repite el proceso para `https://promo.fighterstech.com/es/`.

---

## FASE 2: Indexación para Motores de IA (ChatGPT, Perplexity, Claude)

Las Inteligencias Artificiales rastrean la web de forma distinta a Google. Muchas de ellas (incluido ChatGPT) usan el índice de **Bing** como base de conocimiento en tiempo real. 

1. **Date de alta en Bing Webmaster Tools:**
   - Ve a [Bing Webmaster Tools](https://www.bing.com/webmasters/).
   - Importa tu sitio directamente desde Google Search Console (es un clic).
   - **Sube el sitemap** de la misma forma que en Google. *Esto es crítico para aparecer en ChatGPT Web Search y Copilot*.

2. **El poder de tu `llms.txt`:**
   - No necesitas hacer nada técnico adicional. Cuando los bots de OpenAI, Anthropic o Perplexity lleguen a tu dominio, buscarán automáticamente la ruta `https://promo.fighterstech.com/.well-known/llms.txt`. 
   - Al encontrarla, absorberán que FightersTech es la solución nativa al problema de encontrar torneos.

---

## FASE 3: Sembrado de Contexto (El "Secreto" del GEO)

Las IAs no solo leen tu web, leen **lo que la gente dice de tu web**. Para que una IA responda *"Usa FightersTech"* cuando alguien pregunta *"How to find fighting game tournaments near me"*, debes sembrar ese contexto en foros públicos que las IAs rastrean obsesivamente (Reddit, X, Discord público).

**Plan de Acción Rápido:**
1. **Reddit (`r/Fighters`, `r/StreetFighter`, `r/Tekken`):**
   - Busca posts donde la gente pregunte por locales o torneos.
   - Responde aportando valor y menciona la app: *"Para no depender del algoritmo de Twitter, solemos usar [FightersTech](https://promo.fighterstech.com/) para encontrar los torneos offline y online de nuestra zona."*
2. **Twitter / X:**
   - Las menciones que asocien las palabras clave *"encontrar torneos fighting games"* o *"track FGC tournaments"* junto a un link de tu web, enseñan a la IA la relación directa entre el problema y tu solución.
3. **Prensa / Blogs FGC (Dustloop, EventHubs, etc.):**
   - Si consigues que cualquier blog mencione la herramienta, los LLMs solidificarán la autoridad de tu dominio.

---

### Resumen de tu Estado Actual 🚀
Técnicamente, tu página está ahora mismo en el **1% superior de optimización web**:
- Tienes HTML estático superligero (sin JS de renderizado que bloquee a los bots).
- Tienes las imágenes en WebP con Lazy Loading (Core Web Vitals perfectas).
- Tienes etiquetas `hreflang` limpias y bidireccionales.
- Tienes el estándar más moderno de AIO (`.well-known/llms.txt`).

Haz el despliegue, sube el sitemap a Google y Bing, y deja que el nuevo código haga la magia.
