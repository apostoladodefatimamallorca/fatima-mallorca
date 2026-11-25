/* ================================================================
   web.js — Apostolado Mundial de Fátima · Delegación de Mallorca
   1) Muestra la reflexión actual (datos en reflexion-actual.js)
   2) Mide en Google Analytics lo que importa:
      reflexion_leida · clic_reflexion · compartir_whatsapp ·
      clic_youtube · unirse_whatsapp
   No hace falta tocar este archivo al publicar una reflexión.
   ================================================================ */
(function () {
  'use strict';

  var R = window.REFLEXION_ACTUAL || null;
  var pagina = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  function ev(nombre, datos) {
    try { if (typeof window.gtag === 'function') window.gtag('event', nombre, datos || {}); } catch (e) {}
  }
  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function esNueva() {
    if (!R || !R.publicada) return false;
    var p = new Date(R.publicada + 'T00:00:00');
    var dias = (Date.now() - p.getTime()) / 864e5;
    return dias >= 0 && dias < 15;
  }

  /* ---------- estilos (una sola vez) ---------- */
  var css = '' +
    '.ra-barra{display:block;text-decoration:none;background:linear-gradient(90deg,#4a0a1a,#6b1a2a,#4a0a1a);border-bottom:2px solid #c9a84c;padding:11px 16px;text-align:center;font-family:"Cormorant Garamond",serif;font-size:1.08rem;line-height:1.35;color:#f5f0e8}' +
    '.ra-barra b{font-family:"Playfair Display",serif;font-weight:700;color:#f0d78c}' +
    '.ra-barra .ra-flecha{font-family:"Cinzel",serif;font-size:.72rem;letter-spacing:.12em;color:#c9a84c;white-space:nowrap;margin-left:6px}' +
    '.ra-nueva{display:inline-block;background:#c9a84c;color:#3a0812;font-family:"Cinzel",serif;font-weight:700;font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;padding:3px 9px;border-radius:2px;margin-right:8px;vertical-align:2px}' +
    '#reflexion-destacada{background:linear-gradient(180deg,#faf6ee 0%,#f3ead8 100%);padding:60px 20px;border-top:3px solid #c9a84c}' +
    '.ra-cab{text-align:center;margin-bottom:26px}' +
    '.ra-cab span{font-family:"Cinzel",serif;font-size:.7rem;letter-spacing:.28em;color:#9a7a2c;text-transform:uppercase}' +
    '.ra-cab h2{font-family:"Playfair Display",serif;font-size:clamp(1.8rem,5vw,2.5rem);color:#4a0a1a;margin:10px 0 0;line-height:1.15}' +
    '.ra-card{display:flex;flex-wrap:wrap;max-width:960px;margin:0 auto;text-decoration:none;background:linear-gradient(135deg,#1a0508,#4a0a1a);border:2px solid #c9a84c;box-shadow:0 10px 36px rgba(74,10,26,.28);overflow:hidden;transition:transform .2s,box-shadow .2s}' +
    '.ra-card:hover{transform:translateY(-3px);box-shadow:0 14px 40px rgba(74,10,26,.36)}' +
    '.ra-card .ra-img{flex:1 1 380px;min-height:240px;background:#1a0508}' +
    '.ra-card .ra-img img{width:100%;height:100%;min-height:240px;object-fit:cover;display:block}' +
    '.ra-card .ra-txt{flex:1 1 380px;padding:30px 30px 32px;display:flex;flex-direction:column;justify-content:center}' +
    '.ra-meta{font-family:"Cinzel",serif;font-size:.62rem;letter-spacing:.16em;color:#c9a84c;text-transform:uppercase;margin-bottom:12px;line-height:1.7}' +
    '.ra-card h3{font-family:"Playfair Display",serif;font-size:clamp(1.45rem,4vw,2rem);font-weight:700;color:#f5f0e8;line-height:1.22;margin:0 0 10px}' +
    '.ra-sub{font-family:"Cormorant Garamond",serif;font-size:1.15rem;font-style:italic;color:#f0d78c;line-height:1.45;margin:0 0 14px}' +
    '.ra-ext{font-family:"Cormorant Garamond",serif;font-size:1.15rem;color:rgba(245,240,232,.95);line-height:1.65;margin:0 0 22px}' +
    '.ra-boton{align-self:flex-start;display:inline-block;background:linear-gradient(135deg,#c9a84c,#e0bf63);color:#3a0812;padding:14px 30px;border-radius:50px;font-family:"Cinzel",serif;font-weight:700;font-size:.85rem;letter-spacing:.08em}' +
    '.ra-mas{text-align:center;margin-top:22px;font-family:"Cormorant Garamond",serif;font-size:1.1rem;font-style:italic;color:#5c3d2e}' +
    '.ra-mas a{color:#6b1a2a;font-weight:700}' +
    '.ra-aviso-wrap{max-width:860px;margin:40px auto;padding:0 12px}' +
    '.ra-aviso{display:flex;align-items:center;gap:16px;text-decoration:none;background:linear-gradient(135deg,#4a0a1a,#6b1a2a);border:2px solid #c9a84c;padding:14px 18px;box-shadow:0 6px 24px rgba(74,10,26,.25);transition:transform .2s}' +
    '.ra-aviso:hover{transform:translateY(-3px)}' +
    '.ra-aviso img{width:92px;height:92px;object-fit:cover;flex:none;border:1px solid rgba(201,168,76,.6)}' +
    '.ra-aviso .ra-a-txt{flex:1;min-width:0}' +
    '.ra-aviso .ra-a-eti{font-family:"Cinzel",serif;font-size:.58rem;letter-spacing:.2em;color:#c9a84c;text-transform:uppercase;margin-bottom:4px}' +
    '.ra-aviso .ra-a-tit{font-family:"Playfair Display",serif;font-size:1.15rem;font-weight:700;color:#f5f0e8;line-height:1.25}' +
    '.ra-aviso .ra-a-ir{font-family:"Cinzel",serif;font-size:.68rem;letter-spacing:.12em;color:#f0d78c;margin-top:6px}' +
    '@media(max-width:768px){' +
      '#reflexion-destacada{padding:44px 14px}' +
      '.ra-card .ra-img,.ra-card .ra-img img{min-height:200px}' +
      '.ra-card .ra-txt{padding:24px 20px 26px;text-align:left}' +
      '.ra-boton{align-self:stretch;text-align:center}' +
      '.ra-barra{font-size:1rem;padding:10px 12px}' +
      '.ra-aviso{gap:12px;padding:12px}' +
      '.ra-aviso img{width:72px;height:72px}' +
      '.ra-aviso .ra-a-tit{font-size:1.02rem}' +
    '}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- reflexión actual ---------- */
  function pintar() {
    if (!R || !R.url) return;
    var actual = pagina === R.url.toLowerCase();
    var nueva = esNueva();
    var meta = esc(R.autor) + ' · ' + esc(R.fecha) + (R.minutos ? ' · ' + esc(R.minutos) + ' min de lectura' : '');

    // Barra fina bajo la cabecera (portada)
    var barra = document.getElementById('ra-barra');
    if (barra) {
      barra.outerHTML =
        '<a id="ra-barra" class="ra-barra" href="' + esc(R.url) + '" data-origen="portada-barra">' +
        (nueva ? '<span class="ra-nueva">Nueva</span>' : '') +
        'Reflexión del mes: <b>' + esc(R.titulo) + '</b><span class="ra-flecha">LEER →</span></a>';
    }

    // Tarjeta grande (portada)
    var dest = document.getElementById('reflexion-destacada');
    if (dest) {
      dest.innerHTML =
        '<div class="ra-cab"><span>' + (nueva ? 'Recién publicada' : 'Espiritualidad y actualidad') + '</span>' +
        '<h2>La reflexión del mes</h2>' +
        '<div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-top:12px;"><div style="width:60px;height:1px;background:#c9a84c;"></div><div style="width:6px;height:6px;background:#c9a84c;transform:rotate(45deg);"></div><div style="width:60px;height:1px;background:#c9a84c;"></div></div></div>' +
        '<a class="ra-card" href="' + esc(R.url) + '" data-origen="portada-tarjeta">' +
          '<div class="ra-img"><img src="' + esc(R.imagen) + '" alt="' + esc(R.alt || R.titulo) + '" loading="lazy" decoding="async"></div>' +
          '<div class="ra-txt">' +
            '<div class="ra-meta">' + (nueva ? '<span class="ra-nueva">Nueva</span>' : '') + meta + '</div>' +
            '<h3>' + esc(R.titulo) + '</h3>' +
            (R.subtitulo ? '<p class="ra-sub">' + esc(R.subtitulo) + '</p>' : '') +
            (R.extracto ? '<p class="ra-ext">' + esc(R.extracto) + '</p>' : '') +
            '<span class="ra-boton">LEER LA REFLEXIÓN →</span>' +
          '</div>' +
        '</a>' +
        '<p class="ra-mas">¿Buscas un artículo anterior? Están todos en la <a href="hemeroteca.html" data-origen="portada-hemeroteca">Hemeroteca</a>.</p>';
    }

    // Avisos compactos (resto de páginas y final de artículos antiguos)
    var avisos = document.querySelectorAll('.ra-aviso-hueco');
    for (var i = 0; i < avisos.length; i++) {
      var h = avisos[i];
      if (actual) { h.parentNode.removeChild(h); continue; }
      var etiqueta = h.getAttribute('data-etiqueta') || 'La reflexión del mes';
      h.outerHTML =
        '<div class="ra-aviso-wrap"><a class="ra-aviso" href="' + esc(R.url) + '" data-origen="' + esc(h.getAttribute('data-origen') || pagina) + '">' +
          '<img src="' + esc(R.imagen) + '" alt="" loading="lazy" decoding="async">' +
          '<div class="ra-a-txt">' +
            '<div class="ra-a-eti">' + (nueva ? '<span class="ra-nueva">Nueva</span>' : '') + esc(etiqueta) + '</div>' +
            '<div class="ra-a-tit">' + esc(R.titulo) + '</div>' +
            '<div class="ra-a-ir">' + (R.minutos ? esc(R.minutos) + ' MIN DE LECTURA · ' : '') + 'LEER AHORA →</div>' +
          '</div></a></div>';
    }
  }

  /* ---------- medición: clics ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var origen = a.getAttribute('data-origen');
    if (origen) {
      ev('clic_reflexion', { origen: origen, destino: href });
    } else if (/^(https?:\/\/(www\.)?fatima-mallorca\.es\/)?\/?reflexion(es)?[-.][^\/]*$/i.test(href.split('#')[0]) && pagina !== href.toLowerCase()) {
      ev('clic_reflexion', { origen: pagina, destino: href });
    }
    if (/wa\.me\/|api\.whatsapp\.com\/send/i.test(href)) ev('compartir_whatsapp', { pagina: pagina });
    else if (/chat\.whatsapp\.com/i.test(href)) ev('unirse_whatsapp', { pagina: pagina });
    if (/youtube\.com|youtu\.be/i.test(href)) ev('clic_youtube', { pagina: pagina });
  }, true);

  /* ---------- medición: reflexión leída hasta el final ---------- */
  function medirLectura() {
    var cont = document.getElementById('reflexiones-posts');
    var art = cont ? cont.querySelector('article') : null;
    if (!art || !('IntersectionObserver' in window)) return;
    var marca = document.createElement('div');
    marca.style.cssText = 'height:1px;width:100%;';
    art.appendChild(marca);
    var inicio = Date.now(), hecho = false, MIN = 20000;  // al menos 20 s en la página
    var titulo = (document.title || '').split(' — ')[0];
    function enviar() {
      if (hecho) return; hecho = true;
      ev('reflexion_leida', { articulo: titulo, pagina: pagina, segundos: Math.round((Date.now() - inicio) / 1000) });
    }
    var io = new IntersectionObserver(function (ents) {
      for (var i = 0; i < ents.length; i++) {
        if (ents[i].isIntersecting) {
          io.disconnect();
          var falta = MIN - (Date.now() - inicio);
          if (falta > 0) setTimeout(enviar, falta); else enviar();
        }
      }
    });
    io.observe(marca);
  }

  function arrancar() { pintar(); medirLectura(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
