'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rs = n => 'Rs. ' + Number(n).toLocaleString('en-PK');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const services = [
  { name: 'Periodic Engine Maintenance', price: 15000, time: '3 hours', desc: 'Synthetic oil, oil filter and air filter service.', icon: 'fa-oil-can' },
  { name: 'OBD Computer Tuning', price: 4500, time: '1.5 hours', desc: 'Scanner diagnostics and ECU sensor calibration.', icon: 'fa-gauge-high' },
  { name: 'AC Climate Servicing', price: 6000, time: '2 hours', desc: 'Refrigerant top-up and cooling coil flush.', icon: 'fa-snowflake' },
  { name: 'Mobile Puncture Rescue', price: 800, time: '30 minutes', desc: 'On-site tubeless puncture repair and pressure check.', icon: 'fa-circle-dot' },
  { name: 'Brake Pad Replacement', price: 5500, time: '1 hour', desc: 'Front or rear high-friction brake pad fitting.', icon: 'fa-car-burst' }
];
const products = [
  { id: 1, name: 'Civic & Corolla Headlight Pair', price: 18000, rating: 4.9, image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'Ceramic Quick Detailer Spray', price: 2800, rating: 4.9, image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Sports High-Flow Air Filter', price: 4500, rating: 4.8, image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80' },
  { id: 4, name: 'Digital Portable Tyre Inflator', price: 6500, rating: 4.9, image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80' }
];
const mechanics = [
  { id: 1, name: 'Hyper Garage DHA Hub', location: 'DHA', address: 'Phase 6, Tauheed Commercial', phone: '0321-2345678', rating: 4.9, specialty: 'EFI & engine tuning', img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=700&q=80', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { id: 2, name: 'RedLine Pitstop', location: 'Shahrah-e-Faisal', address: 'Near FTC Building', phone: '0300-9876543', rating: 4.8, specialty: 'Brakes & quick servicing', img: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=700&q=80', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { id: 3, name: 'Bismillah Auto Mechanics', location: 'Gulshan', address: 'Block 4, University Road', phone: '0333-5544332', rating: 4.7, specialty: 'Suspension & steering', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
  { id: 4, name: 'Super Auto Tech', location: 'North Nazimabad', address: 'Block H, Hyderi Market', phone: '0312-1122334', rating: 4.9, specialty: 'Computer scans & wiring', img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=700&q=80', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' }
];
const obdDb = {
  P0300: ['Random engine misfire', 'High risk', 'Random or multiple cylinder misfire. Causes rough idle and poor mileage.', 'Spark plugs, ignition coil test, injector cleaning'],
  P0420: ['Catalytic converter below threshold', 'Medium risk', 'Catalytic converter efficiency is low, or an oxygen sensor is faulty.', 'Converter flush, O2 sensor check'],
  P0171: ['System too lean (Bank 1)', 'Low risk', 'Too much air or too little fuel in the combustion chamber.', 'Clean MAF sensor, inspect vacuum lines']
};
const TITLES = { home: 'Home', services: 'Services', products: 'Parts store', mechanics: 'Karachi garages', chat: 'Mechanic chat', booking: 'Book a service' };
const PETROL = 278.40;

let cart = [];
try { cart = JSON.parse(localStorage.getItem('hg-cart') || '[]'); } catch { cart = []; }
let chatMech = mechanics[0];

function switchTab(id) {
  $$('.view').forEach(v => v.classList.toggle('is-active', v.id === 'tab-' + id));
  $$('.nav-btn').forEach(b => b.classList.toggle('is-active', b.dataset.tab === id));
  $('#page-title').textContent = TITLES[id] || 'Home';
  window.scrollTo({ top: 0 });
}

let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* Services */
function renderServices() {
  $('#services-grid').innerHTML = services.map((s, i) => `
    <div class="svc">
      <span class="svc-ico"><i class="fa-solid ${s.icon}"></i></span>
      <div class="svc-info"><h4>${s.name}</h4><p>${s.desc}</p><span class="svc-meta">${rs(s.price)} · ${s.time}</span></div>
      <button class="btn primary" data-book="${i}">Book</button>
    </div>`).join('');
  $('#book-service').innerHTML = services.map(s => `<option>${s.name}</option>`).join('');
}

/* Products + cart */
function renderProducts() {
  const q = $('#product-search').value.trim().toLowerCase();
  const list = products.filter(p => p.name.toLowerCase().includes(q));
  $('#products-grid').innerHTML = list.length ? list.map(p => `
    <article class="card">
      <div class="card-img"><img loading="lazy" src="${p.image}" alt="${esc(p.name)}"><span class="pill rating"><i class="fa-solid fa-star"></i> ${p.rating}</span></div>
      <div class="card-body"><h4>${p.name}</h4><span class="price">${rs(p.price)}</span>
        <div class="card-actions"><button class="btn ghost" data-add="${p.id}">Add to cart</button></div></div>
    </article>`).join('') : '<p class="empty">No parts match your search.</p>';
}
function saveCart() {
  try { localStorage.setItem('hg-cart', JSON.stringify(cart)); } catch {}
  $('#cart-badge').textContent = cart.reduce((a, i) => a + i.qty, 0);
}
function renderCart() {
  $('#cart-items').innerHTML = cart.length ? cart.map(i => `
    <div class="line"><div><b>${i.name}</b><br><small class="muted">${rs(i.price)} × ${i.qty}</small></div><b class="price">${rs(i.price * i.qty)}</b></div>`).join('')
    : '<p class="empty">Your cart is empty. Add parts from the store.</p>';
  $('#cart-total').textContent = rs(cart.reduce((a, i) => a + i.price * i.qty, 0));
}
function toggleCart(open) {
  const d = $('#cart'); if (open) renderCart();
  d.classList.toggle('is-open', open); d.setAttribute('aria-hidden', String(!open));
}

/* Mechanics */
function renderMechanics() {
  const loc = $('#location-filter').value;
  const list = loc === 'all' ? mechanics : mechanics.filter(m => m.location === loc);
  $('#mechanics-grid').innerHTML = list.map(m => `
    <article class="card">
      <div class="card-img"><img loading="lazy" src="${m.img}" alt="${esc(m.name)}"><span class="pill">${m.location}</span></div>
      <div class="card-body">
        <div class="result-top"><h4>${m.name}</h4><span class="rating"><i class="fa-solid fa-star"></i> ${m.rating}</span></div>
        <p class="svc-meta"><i class="fa-solid fa-wrench"></i> ${m.specialty}</p>
        <p class="muted"><i class="fa-solid fa-location-dot"></i> ${m.address}, Karachi</p>
        <div class="card-actions">
          <a class="btn ghost" href="tel:${m.phone}"><i class="fa-solid fa-phone"></i>${m.phone}</a>
          <button class="btn primary" data-chat="${m.id}"><i class="fa-solid fa-comments"></i>Chat</button>
        </div>
      </div>
    </article>`).join('') || '<p class="empty">No garages listed in this area yet.</p>';
}

/* Chat */
function addMsg(text, who) {
  const el = document.createElement('div');
  el.className = 'msg ' + who; el.textContent = text;
  const log = $('#chat-log'); log.appendChild(el); log.scrollTop = log.scrollHeight;
}
function pickMechanic(id) {
  chatMech = mechanics.find(m => m.id === id) || mechanics[0];
  $('#chat-name').textContent = chatMech.name;
  $('#chat-status').textContent = `${chatMech.specialty} · ${chatMech.location}`;
  $('#chat-img').src = chatMech.avatar;
  $('#chat-log').innerHTML = '';
  addMsg(`Assalam-o-Alaikum! Main ${chatMech.name} se mechanic hoon. Gaadi ke masle ke bare mein puchein, main madad karta hoon.`, 'them');
  $('#chat-picker').innerHTML = mechanics.map(m => `<button data-chat="${m.id}" class="${m.id === chatMech.id ? 'is-active' : ''}">${m.name}</button>`).join('');
}
function botReply(msg) {
  const t = msg.toLowerCase(), has = (...w) => w.some(x => t.includes(x));
  if (has('puncture', 'tyre', 'tire', 'air')) return 'Mobile puncture service available hai. On-site repair ke Rs. 800 hain. Kya vulcanizer aapki location par bhej doon?';
  if (has('oil', 'tuning', 'maintenance', 'service')) return 'Periodic maintenance mein oil change, oil filter, air filter aur 40-point check shamil hai. Charges Rs. 15,000 se start hotay hain.';
  if (has(' ac', 'ac ', 'gas', 'cooling')) return 'AC servicing aur gas refill ke Rs. 6,000 hain. Book tab se slot le sakte hain.';
  if (has('location', 'kahan', 'address', 'where')) return `Humara workshop ${chatMech.address} par hai. Phone: ${chatMech.phone}.`;
  if (has('price', 'cost', 'rate', 'charges')) return 'Tamam packages ki price aur duration Services tab mein maujood hai.';
  return 'Ji, main samajh gaya. Aap garage visit kar sakte hain ya phone par rabta karein.';
}

/* OBD + fuel */
function lookupObd(code) {
  const d = obdDb[code] || [`${code} - Fault code logged`, 'Check needed', 'A sensor fault was logged in the ECU.', 'Visit a workshop for a live OBD scan and reset'];
  $('#obd-title').textContent = `${code} · ${d[0]}`;
  $('#obd-sev').textContent = d[1];
  $('#obd-desc').textContent = d[2];
  $('#obd-fix').textContent = 'Suggested fix: ' + d[3];
  $('#obd-result').hidden = false;
}

/* Events */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-tab],[data-add],[data-chat],[data-book]');
  if (!t) return;
  if (t.matches('a')) e.preventDefault();
  if (t.dataset.add) {
    const p = products.find(x => x.id === +t.dataset.add), it = cart.find(x => x.id === p.id);
    it ? it.qty++ : cart.push({ ...p, qty: 1 }); saveCart(); toast(`${p.name} added to cart`);
  } else if (t.dataset.chat) {
    switchTab('chat'); pickMechanic(+t.dataset.chat);
  } else if (t.dataset.book) {
    switchTab('booking'); $('#book-service').value = services[+t.dataset.book].name;
  } else if (t.dataset.tab) switchTab(t.dataset.tab);
});
$('#cart-open').onclick = () => toggleCart(true);
$('#cart-close').onclick = () => toggleCart(false);
$('#cart').addEventListener('click', e => { if (e.target.id === 'cart') toggleCart(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleCart(false); });
$('#checkout').onclick = () => {
  if (!cart.length) return toast('Add something to your cart first');
  cart = []; saveCart(); toggleCart(false); toast('Order placed. Delivery in Karachi within 24 hours.');
};
$('#product-search').oninput = renderProducts;
$('#location-filter').onchange = renderMechanics;
$('#obd-form').onsubmit = e => {
  e.preventDefault();
  const c = $('#obd-input').value.trim().toUpperCase();
  if (!/^[PBCU][0-9A-F]{4}$/.test(c)) return toast('Enter a valid code, for example P0300');
  lookupObd(c);
};
$('#fuel-liters').oninput = e => { $('#fuel-total').textContent = rs(Math.round((parseFloat(e.target.value) || 0) * PETROL)); };
$('#chat-form').onsubmit = e => {
  e.preventDefault();
  const i = $('#chat-input'), m = i.value.trim(); if (!m) return;
  addMsg(m, 'me'); i.value = '';
  setTimeout(() => addMsg(botReply(m), 'them'), 800);
};
$('#booking-form').onsubmit = e => {
  e.preventDefault(); e.target.reset(); toast('Appointment request saved'); switchTab('home');
};

renderServices(); renderProducts(); renderMechanics(); pickMechanic(1); saveCart();
