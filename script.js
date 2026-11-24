(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = 'https://wa.me/527971218676?text=';

  /* ---- reveal ---- */
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {rootMargin:'0px 0px -10% 0px', threshold:0.06});
    document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.rv').forEach(function(el){ el.classList.add('in'); });
  }

  /* ---- nav + barra móvil ---- */
  var bar=document.getElementById('bar'), nav=document.getElementById('nav'), hero=document.querySelector('.hero');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function(es){
      var out = !es[0].isIntersecting;
      bar.classList.toggle('up', out);
      nav.classList.toggle('down', out);
    }, {threshold:0.12}).observe(hero);
  } else { bar.classList.add('up'); nav.classList.add('down'); }

  /* ---- lightbox ---- */
  var lb=document.getElementById('lb'), lbi=document.getElementById('lbi');
  function closeLb(){ lb.classList.remove('show'); setTimeout(function(){ lb.classList.remove('on'); },250); }
  document.querySelectorAll('.grid figure').forEach(function(f){
    f.addEventListener('click', function(){
      var img=f.querySelector('img');
      lbi.src=img.src; lbi.alt=img.alt;
      lb.classList.add('on'); requestAnimationFrame(function(){ lb.classList.add('show'); });
    });
  });
  lb.addEventListener('click', closeLb);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeLb(); });

  /* ---- calendario ---- */
  var MESES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var today=new Date(); today.setHours(0,0,0,0);
  var view=new Date(today.getFullYear(), today.getMonth(), 1);
  var start=null, end=null;
  var cabin='dos', price=500, maxG=2, guests=2;

  var daysEl=document.getElementById('days'), mlabel=document.getElementById('mlabel');
  var prev=document.getElementById('prev'), next=document.getElementById('next');
  var gv=document.getElementById('gv'), gm=document.getElementById('gm'), gp=document.getElementById('gp');
  var sum=document.getElementById('sum'), empty=document.getElementById('empty');
  var l1=document.getElementById('l1'), v1=document.getElementById('v1'), vt=document.getElementById('vt');
  var send=document.getElementById('send');

  function key(d){ return d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate(); }
  function same(a,b){ return a&&b&&key(a)===key(b); }
  function fmt(d){ return d.getDate()+' de '+MESES[d.getMonth()]+' de '+d.getFullYear(); }
  function money(n){ return '$'+n.toLocaleString('es-MX'); }

  function renderCal(anim){
    if(anim && !reduce){ daysEl.classList.add('swap'); }
    setTimeout(function(){
      var y=view.getFullYear(), m=view.getMonth();
      mlabel.textContent = MESES[m]+' '+y;
      var first=new Date(y,m,1);
      var offset=(first.getDay()+6)%7;           // lunes primero
      var total=new Date(y,m+1,0).getDate();
      var html='';
      for(var i=0;i<offset;i++) html+='<span class="day off"></span>';
      for(var d=1;d<=total;d++){
        var dt=new Date(y,m,d);
        var past = dt < today;
        var cls='day';
        if(past) cls+=' off';
        else {
          if(start&&end&&dt>start&&dt<end) cls+=' mid';
          if(same(dt,start)) cls+=' edge '+(end?'s1':'solo');
          if(same(dt,end)) cls+=' edge s2';
        }
        html+='<button type="button" class="'+cls+'" '+(past?'disabled':'data-d="'+d+'"')+'>'+d+'</button>';
      }
      daysEl.innerHTML=html;
      prev.disabled = (y===today.getFullYear() && m===today.getMonth());
      daysEl.classList.remove('swap');
    }, anim && !reduce ? 200 : 0);
  }

  daysEl.addEventListener('click', function(e){
    var b=e.target.closest('button[data-d]'); if(!b) return;
    var dt=new Date(view.getFullYear(), view.getMonth(), +b.dataset.d);
    if(!start || (start&&end) || dt<=start){ start=dt; end=null; }
    else { end=dt; }
    renderCal(false); update();
  });
  prev.addEventListener('click', function(){ view.setMonth(view.getMonth()-1); renderCal(true); });
  next.addEventListener('click', function(){ view.setMonth(view.getMonth()+1); renderCal(true); });

  /* ---- cabaña ---- */
  document.getElementById('seg').addEventListener('click', function(e){
    var b=e.target.closest('button[data-cabin]'); if(!b) return;
    document.querySelectorAll('#seg button').forEach(function(x){ x.classList.remove('on'); });
    b.classList.add('on');
    cabin=b.dataset.cabin; price=+b.dataset.price; maxG=+b.dataset.max;
    if(guests>maxG) guests=maxG;
    if(cabin==='familiar' && guests<4) guests=4;
    update();
  });

  /* ---- huéspedes ---- */
  function minG(){ return cabin==='familiar' ? 4 : 1; }
  gm.addEventListener('click', function(){ if(guests>minG()){ guests--; update(); } });
  gp.addEventListener('click', function(){ if(guests<maxG){ guests++; update(); } });

  function update(){
    gv.textContent=guests;
    gm.disabled = guests<=minG();
    gp.disabled = guests>=maxG;

    if(start&&end){
      var nights=Math.round((end-start)/86400000);
      var subtotal=nights*price;
      l1.textContent = money(price)+' × '+nights+(nights===1?' noche':' noches');
      v1.textContent = money(subtotal);
      vt.textContent = money(subtotal);
      sum.hidden=false; empty.hidden=true;
      send.setAttribute('aria-disabled','false');
      var nom = cabin==='familiar' ? 'la cabaña familiar' : 'la cabaña para dos';
      var msg = 'Hola, quiero reservar '+nom+'.\n'+
                'Llegada: '+fmt(start)+'\n'+
                'Salida: '+fmt(end)+'\n'+
                'Noches: '+nights+'\n'+
                'Huéspedes: '+guests+'\n'+
                'Total estimado: '+money(subtotal)+' (sin limpieza)\n'+
                '¿Están libres esas fechas?';
      send.href = WA + encodeURIComponent(msg);
    } else {
      sum.hidden=true; empty.hidden=false;
      empty.textContent = start ? 'Ahora toca tu día de salida.' : 'Toca tu día de llegada y luego el de salida.';
      send.setAttribute('aria-disabled','true');
      send.href='#';
    }
  }

  renderCal(false); update();
})();
