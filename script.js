/* ============================================================
   Rancho El Paredón — comportamiento del sitio
   Secciones: menú, animaciones, galería, calendario, formulario.
   No necesita servidor: todo corre en el navegador del visitante.
   ============================================================ */
(function () {
  'use strict';

  var WA = 'https://wa.me/527971218676?text=';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- aparición de secciones al bajar ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
    document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- barra superior y barra móvil ---------- */
  var bar = document.getElementById('bar');
  var nav = document.getElementById('nav');
  var hero = document.querySelector('.hero');
  if ('IntersectionObserver' in window && hero) {
    new IntersectionObserver(function (es) {
      var fuera = !es[0].isIntersecting;
      bar.classList.toggle('up', fuera);
      nav.classList.toggle('down', fuera);
    }, { threshold: 0.12 }).observe(hero);
  } else {
    bar.classList.add('up'); nav.classList.add('down');
  }

  /* ---------- menú de celular ---------- */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  function cerrarMenu() {
    drawer.classList.remove('open');
    burger.classList.remove('x');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', function () {
    var abierto = drawer.classList.toggle('open');
    burger.classList.toggle('x', abierto);
    burger.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    document.body.style.overflow = abierto ? 'hidden' : '';
  });
  drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', cerrarMenu); });

  /* ---------- galería en grande ---------- */
  var lb = document.getElementById('lb');
  var lbi = document.getElementById('lbi');
  function cerrarFoto() {
    lb.classList.remove('show');
    setTimeout(function () { lb.classList.remove('on'); }, 250);
  }
  document.querySelectorAll('.grid figure').forEach(function (f) {
    f.addEventListener('click', function () {
      var img = f.querySelector('img');
      lbi.src = img.src; lbi.alt = img.alt;
      lb.classList.add('on');
      requestAnimationFrame(function () { lb.classList.add('show'); });
    });
  });
  lb.addEventListener('click', cerrarFoto);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { cerrarFoto(); cerrarMenu(); }
  });

  /* ============================================================
     CALENDARIO
     ============================================================ */
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
               'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var MAX_NOCHES = 30;   // arriba de esto mandamos a cotizar estancia larga
  var MAX_MESES = 18;    // hasta dónde se puede navegar hacia adelante

  /* ------------------------------------------------------------
     FECHAS NO DISPONIBLES
     Cada renglón es un periodo cerrado: ['AAAA-MM-DD', 'AAAA-MM-DD'].
     Las dos fechas quedan incluidas. Para un solo día, repite la fecha.
     Agrega o borra renglones según se vayan ocupando las cabañas.
     Ejemplos:
       ['2027-01-01', '2027-01-06'],   // vacaciones de enero
       ['2027-02-14', '2027-02-14'],   // un solo día
     ------------------------------------------------------------ */
  var NO_DISPONIBLES = [
    ['2026-12-01', '2026-12-31']    // diciembre 2026 completo
  ];

  // Convierte los renglones de arriba a fechas reales, una sola vez
  var ocupadas = NO_DISPONIBLES.map(function (r) {
    function aFecha(s) {
      var p = s.split('-');
      return new Date(+p[0], +p[1] - 1, +p[2]);
    }
    return { ini: aFecha(r[0]), fin: aFecha(r[1]) };
  });

  function ocupada(d) {
    for (var i = 0; i < ocupadas.length; i++) {
      if (d >= ocupadas[i].ini && d <= ocupadas[i].fin) return true;
    }
    return false;
  }

  // ¿Hay algún día ocupado entre la llegada y la salida?
  function chocaConOcupadas(desde, hasta) {
    var d = new Date(desde.getTime());
    while (d < hasta) {
      if (ocupada(d)) return true;
      d.setDate(d.getDate() + 1);
    }
    return false;
  }

  var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  var limite = new Date(hoy.getFullYear(), hoy.getMonth() + MAX_MESES, 1);
  var vista = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  var llegada = null, salida = null;

  var cabana = 'dos', precio = 500, minH = 1, maxH = 2, huespedes = 2;

  var daysEl = document.getElementById('days');
  var mlabel = document.getElementById('mlabel');
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  var gv = document.getElementById('gv');
  var gm = document.getElementById('gm');
  var gp = document.getElementById('gp');
  var ghint = document.getElementById('ghint');
  var sum = document.getElementById('sum');
  var vacio = document.getElementById('empty');
  var l1 = document.getElementById('l1');
  var v1 = document.getElementById('v1');
  var vt = document.getElementById('vt');

  function clave(d) { return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(); }
  function igual(a, b) { return a && b && clave(a) === clave(b); }
  function fecha(d) { return d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear(); }
  function pesos(n) { return '$' + n.toLocaleString('es-MX'); }
  function noches() {
    if (!llegada || !salida) return 0;
    return Math.round((salida - llegada) / 86400000);
  }

  function pintarCalendario(animar) {
    if (animar && !reduce) daysEl.classList.add('swap');
    setTimeout(function () {
      var y = vista.getFullYear(), m = vista.getMonth();
      mlabel.textContent = MESES[m] + ' ' + y;
      var primero = new Date(y, m, 1);
      var hueco = (primero.getDay() + 6) % 7;        // la semana empieza en lunes
      var total = new Date(y, m + 1, 0).getDate();
      var html = '';
      for (var i = 0; i < hueco; i++) html += '<span class="day off"></span>';
      for (var d = 1; d <= total; d++) {
        var dt = new Date(y, m, d);
        var pasado = dt < hoy;
        var tomada = !pasado && ocupada(dt);
        var cls = 'day';
        var extra = '';
        if (pasado) {
          cls += ' off';
        } else if (tomada) {
          cls += ' taken';
          extra = ' title="No disponible" aria-label="' + d + ', no disponible"';
        } else {
          if (llegada && salida && dt > llegada && dt < salida) cls += ' mid';
          if (igual(dt, llegada)) cls += ' edge ' + (salida ? 's1' : 'solo');
          if (igual(dt, salida)) cls += ' edge s2';
        }
        html += '<button type="button" class="' + cls + '"' + extra + ' ' +
                (pasado || tomada ? 'disabled' : 'data-d="' + d + '"') + '>' + d + '</button>';
      }
      daysEl.innerHTML = html;
      prev.disabled = (y === hoy.getFullYear() && m === hoy.getMonth());
      next.disabled = (vista >= limite);
      daysEl.classList.remove('swap');
    }, animar && !reduce ? 200 : 0);
  }

  daysEl.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-d]');
    if (!b) return;
    var dt = new Date(vista.getFullYear(), vista.getMonth(), +b.dataset.d);
    // Primer toque, o reinicio si ya había rango, o si tocan antes de la llegada
    if (!llegada || (llegada && salida) || dt <= llegada) {
      llegada = dt; salida = null;
      formmsg.textContent = '';
      formmsg.className = 'formmsg';
    } else if (chocaConOcupadas(llegada, dt)) {
      // La estancia pasaría por días que ya están apartados
      formmsg.textContent = 'Entre esas fechas hay días que ya están apartados. Elige otro periodo.';
      formmsg.className = 'formmsg bad';
      llegada = dt; salida = null;
    } else {
      salida = dt;
      formmsg.textContent = '';
      formmsg.className = 'formmsg';
    }
    pintarCalendario(false);
    actualizar();
  });

  prev.addEventListener('click', function () {
    if (prev.disabled) return;
    vista.setMonth(vista.getMonth() - 1); pintarCalendario(true);
  });
  next.addEventListener('click', function () {
    if (next.disabled) return;
    vista.setMonth(vista.getMonth() + 1); pintarCalendario(true);
  });

  /* ---------- selección de cabaña ---------- */
  function elegirCabana(b) {
    document.querySelectorAll('#seg button').forEach(function (x) { x.classList.remove('on'); });
    b.classList.add('on');
    cabana = b.dataset.cabin;
    precio = +b.dataset.price;
    minH = +b.dataset.min;
    maxH = +b.dataset.max;
    if (huespedes > maxH) huespedes = maxH;
    if (huespedes < minH) huespedes = minH;
    actualizar();
  }
  document.getElementById('seg').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-cabin]');
    if (b) elegirCabana(b);
  });
  // Los botones "Elegir fechas" de cada cabaña preseleccionan la correcta
  document.querySelectorAll('[data-pick]').forEach(function (a) {
    a.addEventListener('click', function () {
      var b = document.querySelector('#seg button[data-cabin="' + a.dataset.pick + '"]');
      if (b) elegirCabana(b);
    });
  });

  /* ---------- huéspedes ---------- */
  gm.addEventListener('click', function () { if (huespedes > minH) { huespedes--; actualizar(); } });
  gp.addEventListener('click', function () { if (huespedes < maxH) { huespedes++; actualizar(); } });

  /* ---------- resumen ---------- */
  function actualizar() {
    gv.textContent = huespedes;
    gm.disabled = huespedes <= minH;
    gp.disabled = huespedes >= maxH;
    ghint.textContent = cabana === 'familiar'
      ? 'La cabaña familiar recibe de 4 a 8 personas.'
      : 'La cabaña para dos recibe máximo 2 personas.';

    var n = noches();
    if (n > 0) {
      var subtotal = n * precio;
      l1.textContent = pesos(precio) + ' × ' + n + (n === 1 ? ' noche' : ' noches');
      v1.textContent = pesos(subtotal);
      vt.textContent = pesos(subtotal);
      sum.hidden = false; vacio.hidden = true;
    } else {
      sum.hidden = true; vacio.hidden = false;
      vacio.textContent = llegada
        ? 'Ahora toca tu día de salida.'
        : 'Toca tu día de llegada y luego el de salida.';
    }
  }

  /* ============================================================
     FORMULARIO Y VALIDACIONES
     ============================================================ */
  var form = document.getElementById('form');
  var nombre = document.getElementById('nombre');
  var tel = document.getElementById('tel');
  var correo = document.getElementById('correo');
  var notas = document.getElementById('notas');
  var acepta = document.getElementById('acepta');
  var formmsg = document.getElementById('formmsg');

  function marcarError(campo, idError, texto) {
    document.getElementById(idError).textContent = texto;
    if (campo) campo.setAttribute('aria-invalid', 'true');
  }
  function limpiarError(idError, campo) {
    var el = document.getElementById('e-' + idError);
    if (el) el.textContent = '';
    if (campo) campo.removeAttribute('aria-invalid');
  }

  // El teléfono solo acepta dígitos mientras se escribe
  tel.addEventListener('input', function () {
    tel.value = tel.value.replace(/\D/g, '').slice(0, 10);
    limpiarError('tel', tel);
  });
  nombre.addEventListener('input', function () { limpiarError('nombre', nombre); });
  correo.addEventListener('input', function () { limpiarError('correo', correo); });
  acepta.addEventListener('change', function () { limpiarError('acepta'); });

  function validar() {
    var fallas = [];
    ['nombre', 'tel', 'correo', 'acepta'].forEach(function (k) { limpiarError(k); });
    [nombre, tel, correo].forEach(function (c) { c.removeAttribute('aria-invalid'); });
    formmsg.textContent = ''; formmsg.className = 'formmsg';

    // Nombre: al menos 2 caracteres y que no sean solo números
    var nom = nombre.value.trim();
    if (nom.length < 2) {
      marcarError(nombre, 'e-nombre', 'Escribe tu nombre.');
      fallas.push(nombre);
    } else if (!/[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(nom)) {
      marcarError(nombre, 'e-nombre', 'El nombre debe llevar letras.');
      fallas.push(nombre);
    }

    // Teléfono: exactamente 10 dígitos
    var t = tel.value.replace(/\D/g, '');
    if (t.length === 0) {
      marcarError(tel, 'e-tel', 'Necesitamos un teléfono para contestarte.');
      fallas.push(tel);
    } else if (t.length !== 10) {
      marcarError(tel, 'e-tel', 'Deben ser 10 dígitos. Llevas ' + t.length + '.');
      fallas.push(tel);
    }

    // Correo: opcional, pero si lo llenan tiene que servir
    var c = correo.value.trim();
    if (c && !/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(c)) {
      marcarError(correo, 'e-correo', 'Ese correo no se ve completo.');
      fallas.push(correo);
    }

    // Fechas
    var n = noches();
    if (!llegada || !salida) {
      formmsg.textContent = 'Elige tu día de llegada y tu día de salida en el calendario.';
      formmsg.className = 'formmsg bad';
      if (!fallas.length) fallas.push(daysEl);
    } else if (chocaConOcupadas(llegada, salida)) {
      formmsg.textContent = 'Entre esas fechas hay días que ya están apartados. Elige otro periodo.';
      formmsg.className = 'formmsg bad';
      if (!fallas.length) fallas.push(daysEl);
    } else if (n > MAX_NOCHES) {
      formmsg.textContent = 'Son más de ' + MAX_NOCHES + ' noches. Para estancias así manejamos precio cerrado: escríbenos directo y te cotizamos.';
      formmsg.className = 'formmsg bad';
      if (!fallas.length) fallas.push(daysEl);
    }

    // Huéspedes dentro del rango de la cabaña
    if (huespedes < minH || huespedes > maxH) {
      formmsg.textContent = 'El número de huéspedes no cabe en esa cabaña.';
      formmsg.className = 'formmsg bad';
      if (!fallas.length) fallas.push(gp);
    }

    // Condiciones
    if (!acepta.checked) {
      document.getElementById('e-acepta').textContent = 'Marca que aceptas las condiciones.';
      fallas.push(acepta);
    }

    return fallas;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fallas = validar();

    if (fallas.length) {
      if (!formmsg.textContent) {
        formmsg.textContent = 'Revisa los datos marcados en rojo.';
        formmsg.className = 'formmsg bad';
      }
      fallas[0].focus({ preventScroll: false });
      return;
    }

    var n = noches();
    var nom = cabana === 'familiar' ? 'la cabaña familiar' : 'la cabaña para dos';
    var texto =
      'Hola, quiero reservar ' + nom + '.\n\n' +
      'Nombre: ' + nombre.value.trim() + '\n' +
      'Teléfono: ' + tel.value + '\n' +
      (correo.value.trim() ? 'Correo: ' + correo.value.trim() + '\n' : '') +
      'Llegada: ' + fecha(llegada) + '\n' +
      'Salida: ' + fecha(salida) + '\n' +
      'Noches: ' + n + '\n' +
      'Huéspedes: ' + huespedes + '\n' +
      'Total estimado: ' + pesos(n * precio) + ' (sin limpieza)\n' +
      (notas.value.trim() ? '\nNotas: ' + notas.value.trim() + '\n' : '') +
      '\n¿Están libres esas fechas?';

    formmsg.textContent = 'Abriendo WhatsApp con tu solicitud...';
    formmsg.className = 'formmsg good';
    window.open(WA + encodeURIComponent(texto), '_blank', 'noopener');
  });

  /* ---------- arranque ---------- */
  pintarCalendario(false);
  actualizar();
})();
