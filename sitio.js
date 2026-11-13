/* Dulce Antojo — funciones compartidas por todas las páginas */
(function () {
    // 1. Productos agotados: basta con agregar la clase "agotado" a la tarjeta
    //    <div class="producto-card agotado"> y esto hace el resto.
    document.querySelectorAll('.producto-card.agotado').forEach(function (card) {
        var h3 = card.querySelector('h3');
        var nombre = h3 ? h3.textContent.trim() : 'este producto';
        if (!card.querySelector('.insignia-agotado')) {
            var tag = document.createElement('span');
            tag.className = 'insignia-agotado';
            tag.textContent = 'Agotado';
            card.appendChild(tag);
        }
        var btn = card.querySelector('.btn-pedido');
        if (btn) {
            btn.textContent = 'Preguntar si vuelve';
            btn.href = 'https://wa.me/573147767322?text=' +
                encodeURIComponent('Hola! ¿Vuelven a tener ' + nombre + '?');
        }
    });

    // 2. Videos: solo se reproducen cuando están en pantalla (ahorra datos)
    var videos = document.querySelectorAll('video[data-autoplay]');
    if ('IntersectionObserver' in window && videos.length) {
        var obs = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (e) {
                var v = e.target;
                if (e.isIntersecting) {
                    if (v.preload === 'none') { v.preload = 'auto'; v.load(); }
                    var p = v.play(); if (p && p.catch) p.catch(function () {});
                } else {
                    v.pause();
                }
            });
        }, { rootMargin: '200px' });
        videos.forEach(function (v) {
            obs.observe(v);
        });
    } else {
        videos.forEach(function (v) { v.preload = 'auto'; v.autoplay = true; v.load(); });
    }

    // 3. Analytics: registrar cada toque en un botón de WhatsApp, con el producto
    document.addEventListener('click', function (ev) {
        var a = ev.target.closest && ev.target.closest('a[href*="wa.me"]');
        if (!a || typeof gtag !== 'function') return;
        var card = a.closest('.producto-card');
        var h3 = card && card.querySelector('h3');
        var producto = h3 ? h3.textContent.trim()
            : a.closest('.promo-grados, .aviso-promo, .barra-promo') ? 'Desayuno de grados'
            : a.classList.contains('whatsapp-float') ? 'Botón flotante' : 'Otro botón';
        var seccion = (card && card.classList.contains('producto-inmediato'))
            ? 'Entrega inmediata' : document.title.split('|')[0].trim();
        gtag('event', 'clic_whatsapp', {
            producto: producto,
            seccion: seccion,
            transport_type: 'beacon'
        });
    });

    // 4. Aviso de la promoción: aparece una vez por visita, a los 4 segundos
    var aviso = document.getElementById('avisoPromo');
    if (aviso) {
        var visto = false;
        try { visto = sessionStorage.getItem('avisoGrados') === '1'; } catch (e) {}
        var cerrar = function () {
            aviso.hidden = true;
            try { sessionStorage.setItem('avisoGrados', '1'); } catch (e) {}
        };
        if (!visto) setTimeout(function () { aviso.hidden = false; }, 4000);
        aviso.addEventListener('click', function (e) {
            if (e.target === aviso || e.target.closest('.aviso-cerrar') || e.target.closest('.aviso-ver') || e.target.closest('.btn-pedido')) cerrar();
        });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });
    }
})();
