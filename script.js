/* ===== ALISCKETCH · script.js ===== */
document.addEventListener('DOMContentLoaded', () => {

  // Año del footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // --- Menú móvil ---
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  // --- Imágenes faltantes: muestra un rosa suave en vez del icono roto ---
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => { img.style.visibility = 'hidden'; });
  });

  // --- Lightbox de la galería ---
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  const lbCap = lb.querySelector('figcaption');
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ''; };

  document.querySelectorAll('.work').forEach(work => {
    work.addEventListener('click', () => {
      const img = work.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = `${work.dataset.title} — ${work.dataset.cat}`;
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lb-close').focus();
    });
  });
  lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.lb-close')) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  // --- Tarjetas de comisión preseleccionan el servicio en el formulario ---
  document.querySelectorAll('.tag[data-service]').forEach(tag => {
    tag.addEventListener('click', () => {
      document.getElementById('servicio').value = tag.dataset.service;
    });
  });

  // --- Formulario: valida y abre tu correo con el mensaje listo ---
  const EMAIL = 'alisketch@gmail.com'; // ⚠ Cambia por tu correo real
  const form = document.getElementById('contact-form');
  const status = form.querySelector('.form-status');

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach(f => {
      const valid = f.type === 'email' ? /^\S+@\S+\.\S+$/.test(f.value) : f.value.trim() !== '';
      f.classList.toggle('invalid', !valid);
      if (!valid) ok = false;
    });
    if (!ok) { status.textContent = 'Revisa los campos marcados en rojo.'; return; }

    const d = Object.fromEntries(new FormData(form));
    const subject = encodeURIComponent(`Comisión: ${d.servicio} — ${d.nombre}`);
    const body = encodeURIComponent(`Nombre: ${d.nombre}\nCorreo: ${d.correo}\nTipo: ${d.servicio}\n\n${d.mensaje}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    status.textContent = '¡Gracias! Se abrió tu correo para enviar la idea ♡';
    form.reset();
  });
});
