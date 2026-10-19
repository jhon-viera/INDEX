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
})();
