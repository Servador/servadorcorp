// ========================
// Mobile Navigation
// ========================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger?.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    // allow buttons with data-action
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ========================
// WhatsApp shortcuts
// ========================
const WA_NUMBER = '6282129837460';
function openWA(text) {
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

document.querySelectorAll('[data-action="wa"]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    openWA('Halo ServadorCorp! 👋 Saya ingin konsultasi pembuatan website.');
  });
});

// ========================
// Contact form -> WhatsApp
// ========================
const contactForm = document.querySelector('.contact-form form');
contactForm?.addEventListener('submit', function (e) {
  e.preventDefault();

  const fd = new FormData(this);
  const name = fd.get('name') || '';
  const email = fd.get('email') || '';
  const phone = fd.get('phone') || '';
  const service = fd.get('service') || '';
  const message = fd.get('message') || '';

  const whatsappMessage = `Halo ServadorCorp! 👋
Saya tertarik dengan layanan website Anda.

*Detail Informasi:*
📝 Nama: ${name}
📧 Email: ${email}
📱 WhatsApp: ${phone}
🎯 Layanan: ${service}

*Pesan:*
${message}

Mohon informasi lebih lanjut. Terima kasih! 🙏`;

  openWA(whatsappMessage);
  this.reset();
  alert('Terima kasih! Anda akan diarahkan ke WhatsApp untuk melanjutkan konsultasi.');
});

// ========================
// Buttons behavior
// ========================
document.querySelectorAll('.btn-outline').forEach(btn => {
  if (btn.textContent.includes('Portofolio')) {
    btn.addEventListener('click', function(e){
      e.preventDefault();
      document.querySelector('#portofolio')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
});

// ========================
// Intersection Observer for reveal
// ========================
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.about-card, .service-card, .portfolio-item, .contact-form, .testi-card, .faq-item')
  .forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

// ========================
// Navbar dynamic background
// ========================
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 100) {
    navbar.style.background = 'rgba(30, 41, 59, 0.95)';
  } else {
    navbar.style.background = 'rgba(30, 41, 59, 0.8)';
  }
});

// ========================
// Page loading fade-in
// ========================
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
  document.body.style.transition = 'opacity 0.5s ease';
});
document.body.style.opacity = '0';

// ========================
// Mini Cart Logic (existing)
// ========================
(function(){
  const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n);
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const STORAGE_KEY = 'svc_cart_v1';
  const load = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch(e){ return []; }
  };
  const save = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

  let cart = load();

  const fab = $('#cart-fab');
  const drawer = $('#cart-drawer');
  const backdrop = $('#cart-backdrop');
  const closeBtn = $('#cart-close');
  const badge = $('#cart-badge');
  const itemsEl = $('#cart-items');
  const subtotalEl = $('#cart-subtotal');
  const clearBtn = $('#cart-clear');
  const checkoutBtn = $('#cart-checkout');

  function openCart(){ drawer.classList.add('open'); backdrop.classList.add('open'); }
  function closeCart(){ drawer.classList.remove('open'); backdrop.classList.remove('open'); }

  fab?.addEventListener('click', openCart);
  closeBtn?.addEventListener('click', closeCart);
  backdrop?.addEventListener('click', closeCart);

  function render(){
    const count = cart.reduce((a,b)=>a + (b.qty||1), 0);
    badge.textContent = count;
    itemsEl.innerHTML = '';
    if(cart.length === 0){
      itemsEl.innerHTML = '<p class="cart-empty">Keranjang masih kosong.</p>';
    } else {
      cart.forEach((it, idx)=>{
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
          <div>
            <h4>${it.name}</h4>
            <div class="meta">${it.qty} × ${formatIDR(it.price)}</div>
          </div>
          <div class="actions">
            <div class="price">${formatIDR(it.price * it.qty)}</div>
            <button class="remove" data-index="${idx}">Hapus</button>
          </div>
        `;
        itemsEl.appendChild(el);
      });
    }
    const subtotal = cart.reduce((a,b)=>a + b.price*b.qty, 0);
    subtotalEl.textContent = formatIDR(subtotal);

    $$('.remove', itemsEl).forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const idx = +e.currentTarget.getAttribute('data-index');
        cart.splice(idx,1);
        save(cart); render();
      });
    });
  }
  render();

  // hook service cards
  $$('.service-card[data-name][data-price]').forEach(card=>{
    const name = card.getAttribute('data-name');
    const price = +card.getAttribute('data-price');
    const qtyInput = $('.qty-input', card) || { value: 1 };
    const minus = card.querySelector('[data-qty="minus"]');
    const plus = card.querySelector('[data-qty="plus"]');
    const addBtn = $('.btn-add-cart', card);
    const waBtn = $('.btn-whatsapp', card);

    minus?.addEventListener('click', ()=>{
      const v = Math.max(1, parseInt(qtyInput.value||'1') - 1);
      qtyInput.value = v;
    });
    plus?.addEventListener('click', ()=>{
      const v = Math.max(1, parseInt(qtyInput.value||'1') + 1);
      qtyInput.value = v;
    });

    addBtn?.addEventListener('click', ()=>{
      const qty = Math.max(1, parseInt(qtyInput.value||'1'));
      const existing = cart.find(i=>i.name===name && i.price===price);
      if(existing){ existing.qty += qty; } else { cart.push({ name, price, qty }); }
      save(cart); render(); openCart();
    });

    waBtn?.addEventListener('click', ()=>{
      const qty = Math.max(1, parseInt(qtyInput.value||'1'));
      const msg = `Halo ServadorCorp! 👋%0ASaya ingin memesan:%0A- ${name} × ${qty} ( ${formatIDR(price)} / item )%0A%0ATolong infokan langkah selanjutnya.`;
      const link = `https://wa.me/${WA_NUMBER}?text=${msg}`;
      window.open(link, '_blank');
    });
  });

  clearBtn?.addEventListener('click', ()=>{
    cart = []; save(cart); render();
  });

  checkoutBtn?.addEventListener('click', ()=>{
    if(cart.length===0){ openCart(); return; }
    const lines = cart.map(i=>`- ${i.name} × ${i.qty} ( ${i.price} )`).join('%0A');
    const total = cart.reduce((a,b)=>a+b.price*b.qty,0);
    const message = `Halo ServadorCorp! 👋%0ASaya ingin checkout pesanan:%0A${lines}%0A%0ASubtotal: ${total}%0A%0ATolong proses order saya. Terima kasih!`;
    const link = `https://wa.me/${WA_NUMBER}?text=${message}`;
    window.open(link, '_blank');
  });
})();

// ========================
// Testimonials slider (very light)
// ========================
(function(){
  const track = document.querySelector('.testi-track');
  const dots = Array.from(document.querySelectorAll('.testi-dots .dot'));
  if(!track || dots.length === 0) return;
  let idx = 0;
  function go(i){
    idx = (i + dots.length) % dots.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d,j)=> d.classList.toggle('is-active', j===idx));
  }
  dots.forEach((d,i)=> d.addEventListener('click', ()=>go(i)));
  setInterval(()=> go(idx+1), 5000);
  go(0);
})();

// ========================
// Sticky CTA visibility
// ========================
(function(){
  const sticky = document.querySelector('.sticky-cta');
  if(!sticky) return;
  const observer = new IntersectionObserver(([e]) => {
    // hide sticky when hero is fully visible
    sticky.classList.toggle('hide', e.isIntersecting);
  }, { threshold: 0.6 });
  const hero = document.querySelector('#home');
  if(hero) observer.observe(hero);
})();

// Open cart from sticky CTA (mobile)
document.getElementById('sticky-cart-open')?.addEventListener('click', (e)=>{
  e.preventDefault();
  document.getElementById('cart-fab')?.click();
});
