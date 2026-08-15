// ============================================================
// CONFIGURATION — c'est la seule chose à modifier pour brancher
// votre propre Google Sheet publié en CSV (voir README.md).
// ============================================================
const CONFIG = {
  SHEET_CSV_URL: '' // ex: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSrMYhk1z8dvjZe6Ulzz687IIvaWpONQVNWQcp4JMujVOoOAWeigZuaUnKcpsswgcs2w2eFTT6WpKSk/pub?gid=0&single=true&output=csv'
};

const CATEGORIES = [
  {label:'Résistances', color:'var(--red)'},
  {label:'Sociétés & pouvoirs', color:'var(--blue)'},
  {label:'Sciences & savoirs', color:'var(--teal)'},
  {label:'Explorations & échanges', color:'var(--gold)'},
  {label:'Luttes sociales', color:'var(--rust)'},
  {label:'Figures oubliées', color:'var(--grey)'},
];
const DEFAULT_COLOR = 'var(--text-dim)';

const ERAS = [
  {id:'antiquite', label:'Antiquité', min:-3000, max:500},
  {id:'moyen-age', label:'Moyen Âge', min:500, max:1500},
  {id:'moderne', label:'Époque moderne', min:1500, max:1800},
  {id:'xixe', label:'XIXe siècle', min:1800, max:1900},
  {id:'xxe', label:'XXe–XXIe siècle', min:1900, max:2100},
];

const REGION_BOUNDS = {
  'Afrique': [[-35,-20],[38,52]],
  'Asie': [[-10,40],[55,150]],
  'Europe': [[35,-10],[70,40]],
  'Amériques': [[-55,-170],[75,-30]],
  'Moyen-Orient': [[12,25],[42,63]],
  'Océanie': [[-50,110],[0,180]],
};

function catColor(theme){
  const c = CATEGORIES.find(c=>c.label.toLowerCase() === String(theme||'').trim().toLowerCase());
  return c ? c.color : DEFAULT_COLOR;
}
function eraOf(year){
  return ERAS.find(e=>year>=e.min && year<e.max) || ERAS[ERAS.length-1];
}
function centuryOf(year){
  return year>=0 ? Math.floor(year/100)*100 : Math.ceil(year/100)*100;
}
function centuryLabel(bucket){
  if(bucket>=0){ const n = bucket/100 + 1; return (n===1?'1er':n+'e') + ' siècle'; }
  const n = Math.abs(bucket)/100 + 1; return (n===1?'1er':n+'e') + ' siècle av. J.-C.';
}
function decadeOf(year){ return Math.floor(year/10)*10; }
function decadeLabel(bucket){
  return bucket>=0 ? 'Années ' + bucket : Math.abs(bucket) + 's av. J.-C.';
}

// ---------- CSV parsing (gère guillemets, virgules et retours à la ligne dans les cellules) ----------
function parseCSV(text){
  const rows = []; let row = []; let field = ''; let inQuotes = false;
  for(let i=0; i<text.length; i++){
    const c = text[i];
    if(inQuotes){
      if(c === '"'){ if(text[i+1] === '"'){ field += '"'; i++; } else { inQuotes = false; } }
      else field += c;
    } else {
      if(c === '"') inQuotes = true;
      else if(c === ',') { row.push(field); field=''; }
      else if(c === '\n' || c === '\r'){
        if(c === '\r' && text[i+1] === '\n') i++;
        row.push(field); field=''; rows.push(row); row=[];
      } else field += c;
    }
  }
  if(field.length || row.length){ row.push(field); rows.push(row); }
  return rows.filter(r => r.some(f => f.trim() !== ''));
}

function rowsToEvents(rows){
  if(rows.length < 2) return [];
  const headers = rows[0].map(h=>h.trim());
  const idx = name => headers.indexOf(name);
  return rows.slice(1).map((r, i)=>{
    const get = name => { const j = idx(name); return j>=0 ? (r[j]||'').trim() : ''; };
    const videos = [];
    for(const n of [1,2]){
      const lien = get('video'+n+'_lien');
      if(lien) videos.push({plateforme:get('video'+n+'_plateforme')||'Vidéo', label:get('video'+n+'_label')||'Voir la vidéo', url:lien});
    }
    const annee = parseFloat(get('annee'));
    return {
      id: get('id') || ('evt-'+i),
      annee: isNaN(annee) ? 0 : annee,
      date_affichee: get('date_affichee') || get('annee'),
      lieu: get('lieu'),
      lat: parseFloat(get('latitude')),
      lng: parseFloat(get('longitude')),
      theme: get('theme'),
      zone_geo: get('zone_geo'),
      personnages: get('personnages').split(';').map(s=>s.trim()).filter(Boolean),
      resume: get('resume').split('||').map(s=>s.trim()).filter(Boolean),
      videos,
      auteur: get('auteur'),
      sources: get('sources'),
    };
  }).filter(e => !isNaN(e.annee));
}

// ============================================================
// ÉTAT
// ============================================================
const state = {
  all: [], search:'', activeThemes:new Set(), activeZones:new Set(),
  zoomLevel:'siecle', focusRange:null
};
let map, markersLayer;

// ============================================================
// CHARGEMENT DES DONNÉES
// ============================================================
async function loadEvents(){
  if(!CONFIG.SHEET_CSV_URL){
    document.getElementById('demoBadge').hidden = false;
    return window.SAMPLE_EVENTS.slice();
  }
  try{
    const res = await fetch(CONFIG.SHEET_CSV_URL);
    if(!res.ok) throw new Error('HTTP '+res.status);
    const text = await res.text();
    const events = rowsToEvents(parseCSV(text));
    if(!events.length) throw new Error('Feuille vide ou colonnes incorrectes');
    return events;
  } catch(err){
    console.error('Impossible de charger le Google Sheet, retour aux données de démonstration :', err);
    document.getElementById('demoBadge').hidden = false;
    return window.SAMPLE_EVENTS.slice();
  }
}

// ============================================================
// FILTRES
// ============================================================
function matchesSearch(ev, q){
  if(!q) return true;
  const hay = [ev.date_affichee, ev.lieu, ev.theme, ev.zone_geo, ...(ev.personnages||[])].join(' ').toLowerCase();
  return hay.includes(q.toLowerCase());
}
function filteredEvents(){
  return state.all.filter(ev=>{
    const themeOk = state.activeThemes.size===0 || state.activeThemes.has(ev.theme);
    const zoneOk = state.activeZones.size===0 || state.activeZones.has(ev.zone_geo);
    const rangeOk = !state.focusRange || (ev.annee>=state.focusRange.min && ev.annee<state.focusRange.max);
    return themeOk && zoneOk && rangeOk && matchesSearch(ev, state.search);
  }).sort((a,b)=>a.annee-b.annee);
}

// ============================================================
// RENDU — FILTRES (thème / zone) — construits une fois les données chargées
// ============================================================
function renderEras(){
  const row = document.getElementById('eraRow');
  ERAS.forEach(era=>{
    const btn = document.createElement('button');
    btn.className = 'pill';
    btn.textContent = era.label;
    btn.addEventListener('click', ()=>{
      state.focusRange = {min:era.min, max:era.max};
      state.zoomLevel = 'decennie';
      state.search = '';
      document.getElementById('search').value = '';
      syncZoomButtons();
      renderAll();
    });
    row.appendChild(btn);
  });
}

function renderThemeChips(){
  const row = document.getElementById('themeRow');
  const present = [...new Set(state.all.map(e=>e.theme).filter(Boolean))];
  present.forEach(theme=>{
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.style.setProperty('--chip-color', catColor(theme));
    chip.innerHTML = '<span class="dot"></span>' + theme;
    chip.addEventListener('click', ()=>{
      if(state.activeThemes.has(theme)){ state.activeThemes.delete(theme); chip.classList.remove('active'); }
      else { state.activeThemes.add(theme); chip.classList.add('active'); }
      renderAll();
    });
    row.appendChild(chip);
  });
}

function renderZoneChips(){
  const row = document.getElementById('zoneRow');
  const present = [...new Set(state.all.map(e=>e.zone_geo).filter(Boolean))];
  present.forEach(zone=>{
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.style.setProperty('--chip-color', 'var(--teal)');
    chip.innerHTML = '<span class="dot"></span>' + zone;
    chip.addEventListener('click', ()=>{
      if(state.activeZones.has(zone)){ state.activeZones.delete(zone); chip.classList.remove('active'); }
      else { state.activeZones.add(zone); chip.classList.add('active'); }
      renderAll();
    });
    row.appendChild(chip);
  });
}

function syncZoomButtons(){
  document.querySelectorAll('.zoom-btn').forEach(b=>b.classList.toggle('active', b.dataset.zoom===state.zoomLevel));
  document.getElementById('resetZoom').hidden = !state.focusRange && state.zoomLevel==='siecle';
}

// ============================================================
// RENDU — FRISE
// ============================================================
function renderTimeline(list){
  const track = document.getElementById('track');
  track.querySelectorAll('.node, .divider').forEach(n=>n.remove());
  document.getElementById('emptyState').hidden = list.length>0;
  if(!list.length) return;

  const effectiveLevel = state.search ? 'detail' : state.zoomLevel;

  if(effectiveLevel === 'detail'){
    let lastEra = null;
    list.forEach((ev, i)=>{
      const era = eraOf(ev.annee);
      if(era.id !== lastEra){
        track.appendChild(makeDivider(era.label));
        lastEra = era.id;
      }
      track.appendChild(makeEventNode(ev, i));
    });
    return;
  }

  const bucketFn = effectiveLevel === 'siecle' ? centuryOf : decadeOf;
  const labelFn = effectiveLevel === 'siecle' ? centuryLabel : decadeLabel;
  const groups = new Map();
  list.forEach(ev=>{
    const b = bucketFn(ev.annee);
    if(!groups.has(b)) groups.set(b, []);
    groups.get(b).push(ev);
  });
  const buckets = [...groups.keys()].sort((a,b)=>a-b);
  buckets.forEach((b, i)=>{
    track.appendChild(makeGroupNode(labelFn(b), groups.get(b), b, effectiveLevel, i));
  });
}

function makeDivider(label){
  const div = document.createElement('div');
  div.className = 'divider';
  div.innerHTML = '<div class="dline"></div><div class="dlabel">'+label+'</div>';
  return div;
}

function makeEventNode(ev, i){
  const color = catColor(ev.theme);
  const node = document.createElement('div');
  node.className = 'node ' + (i % 2 === 0 ? 'above' : 'below');
  node.style.setProperty('--node-color', color);
  const card = document.createElement('button'); card.className = 'card'; card.dataset.id = ev.id;
  const yr = document.createElement('span'); yr.className='yr'; yr.textContent = ev.date_affichee;
  const ti = document.createElement('span'); ti.className='ti'; ti.textContent = ev.lieu || '(sans titre)';
  card.appendChild(yr); card.appendChild(ti);
  const connector = document.createElement('div'); connector.className='connector';
  const dot = document.createElement('button'); dot.className='dot'; dot.dataset.id = ev.id; dot.setAttribute('aria-label','Ouvrir : '+(ev.lieu||ev.date_affichee));
  card.addEventListener('click', ()=>openPanel(ev.id));
  dot.addEventListener('click', ()=>openPanel(ev.id));
  node.appendChild(card); node.appendChild(connector); node.appendChild(dot);
  return node;
}

function makeGroupNode(label, items, bucket, level, i){
  const color = catColor(items[0].theme);
  const node = document.createElement('div');
  node.className = 'node grouped ' + (i % 2 === 0 ? 'above' : 'below');
  node.style.setProperty('--node-color', color);
  const card = document.createElement('button'); card.className='card';
  const bubble = document.createElement('span'); bubble.className='bubble'; bubble.textContent = items.length;
  const ti = document.createElement('span'); ti.className='ti'; ti.textContent = label;
  const ct = document.createElement('span'); ct.className='ct'; ct.textContent = items.length>1 ? items.length+' histoires' : '1 histoire';
  card.appendChild(bubble); card.appendChild(ti); card.appendChild(ct);
  card.addEventListener('click', ()=>{
    const span = level === 'siecle' ? 100 : 10;
    state.focusRange = {min:bucket, max:bucket+span};
    state.zoomLevel = level === 'siecle' ? 'decennie' : 'detail';
    syncZoomButtons();
    renderAll();
  });
  const connector = document.createElement('div'); connector.className='connector';
  node.appendChild(card); node.appendChild(connector);
  return node;
}

// ============================================================
// RENDU — CARTE
// ============================================================
function initMap(){
  map = L.map('map', {scrollWheelZoom:false}).setView([20,10], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 18
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);
}

function renderMap(list){
  markersLayer.clearLayers();
  const withCoords = list.filter(e=>!isNaN(e.lat) && !isNaN(e.lng));
  withCoords.forEach(ev=>{
    const color = catColor(ev.theme).startsWith('var') ? getComputedColor(catColor(ev.theme)) : catColor(ev.theme);
    const marker = L.circleMarker([ev.lat, ev.lng], {
      radius:7, color:'#12141c', weight:2, fillColor:color, fillOpacity:.95
    });
    const popupEl = document.createElement('div');
    popupEl.className = 'map-popup';
    popupEl.innerHTML = '<b>'+escapeHtml(ev.lieu||ev.date_affichee)+'</b><br>'+escapeHtml(ev.date_affichee);
    const openBtn = document.createElement('button');
    openBtn.textContent = "Lire l'article →";
    openBtn.addEventListener('click', ()=>openPanel(ev.id));
    popupEl.appendChild(openBtn);
    marker.bindPopup(popupEl);
    marker.addTo(markersLayer);
  });

  if(state.activeZones.size === 1){
    const zone = [...state.activeZones][0];
    if(REGION_BOUNDS[zone]) { map.fitBounds(REGION_BOUNDS[zone]); return; }
  }
  if(withCoords.length){
    const group = L.featureGroup(withCoords.map(e=>L.marker([e.lat,e.lng])));
    map.fitBounds(group.getBounds().pad(0.35));
  } else {
    map.setView([20,10], 2);
  }
}

function getComputedColor(cssVar){
  const m = cssVar.match(/var\((--[a-z-]+)\)/);
  if(!m) return '#c9a44c';
  return getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim() || '#c9a44c';
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ============================================================
// PANNEAU D'ARTICLE
// ============================================================
function openPanel(id){
  const ev = state.all.find(e=>e.id===id);
  if(!ev) return;
  const color = catColor(ev.theme);
  const panel = document.getElementById('panel');
  const content = document.getElementById('panelContent');

  const videosHtml = ev.videos && ev.videos.length
    ? '<div class="p-videos"><div class="vh">Vidéos liées</div>' + ev.videos.map(v=>
        '<a class="video-btn" href="'+v.url+'" target="_blank" rel="noopener"><span class="play">▶</span>'+escapeHtml(v.plateforme)+' — '+escapeHtml(v.label)+'</a>'
      ).join('') + '</div>'
    : '<div class="p-videos"><div class="vh">Vidéos liées</div><div class="p-empty-video">Pas encore de vidéo associée à cet article — proposez-en une !</div></div>';

  const authorHtml = ev.auteur
    ? '<div class="p-author">Rédigé par <span class="name">'+escapeHtml(ev.auteur)+'</span></div>'
    : '<div class="p-author unassigned">Cet article n\'a pas encore d\'auteur·ice — lancez-vous !</div>';

  const figuresHtml = ev.personnages && ev.personnages.length
    ? '<div class="p-figures"><b>Figures liées :</b> '+ev.personnages.map(escapeHtml).join(', ')+'</div>'
    : '';

  content.innerHTML =
    '<div class="p-cat"><span class="dot"></span>'+escapeHtml(ev.theme||'Non classé')+'</div>'
    +'<h2>'+escapeHtml(ev.lieu||ev.date_affichee)+'</h2>'
    +'<p class="p-meta">'+escapeHtml(ev.date_affichee)+(ev.lieu?' · '+escapeHtml(ev.lieu):'')+'</p>'
    +'<div class="p-article">'+(ev.resume||[]).map(p=>'<p>'+escapeHtml(p)+'</p>').join('')+'</div>'
    +figuresHtml + videosHtml + authorHtml;

  content.style.setProperty('--p-color', color);
  panel.classList.add('open');
  panel.setAttribute('aria-hidden','false');
  document.getElementById('scrim').classList.add('open');
}
function closePanel(){
  document.getElementById('panel').classList.remove('open');
  document.getElementById('panel').setAttribute('aria-hidden','true');
  document.getElementById('scrim').classList.remove('open');
}

// ============================================================
// ORCHESTRATION
// ============================================================
function renderAll(){
  const list = filteredEvents();
  renderTimeline(list);
  renderMap(list);
  syncZoomButtons();
  document.getElementById('countLabel').textContent =
    list.length + ' histoire' + (list.length>1?'s':'') + ' affichée' + (list.length>1?'s':'') + ' — '
    + state.all.filter(e=>!e.auteur).length + ' en attente d\'auteur·ice sur l\'ensemble du fil.';
}

async function init(){
  document.getElementById('panelClose').addEventListener('click', closePanel);
  document.getElementById('scrim').addEventListener('click', closePanel);
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closePanel(); });
  document.getElementById('search').addEventListener('input', e=>{
    state.search = e.target.value; renderAll();
  });
  document.querySelectorAll('.zoom-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      state.zoomLevel = btn.dataset.zoom;
      if(state.zoomLevel === 'siecle') state.focusRange = null;
      renderAll();
    });
  });
  document.getElementById('resetZoom').addEventListener('click', ()=>{
    state.focusRange = null; state.zoomLevel = 'siecle';
    state.activeZones.clear(); document.querySelectorAll('#zoneRow .chip').forEach(c=>c.classList.remove('active'));
    renderAll();
  });

  initMap();
  state.all = await loadEvents();
  renderEras();
  renderThemeChips();
  renderZoneChips();
  renderAll();
}

init();
