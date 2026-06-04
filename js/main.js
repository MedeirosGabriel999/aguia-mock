// ========== NAVBAR SCROLL ==========
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ========== HAMBURGER MENU ==========
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

// ========== SCROLL ANIMATIONS ==========
function setupAnimations() {
  const elements = document.querySelectorAll('.service-card, .diff-card, .review-card, .timeline-item, .about-grid, .form-card, .stat');
  elements.forEach(el => el.classList.add('fade-up'));
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  
  elements.forEach(el => observer.observe(el));
}

// ========== COUNTER ANIMATION ==========
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();
        
        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(c => observer.observe(c));
}

// ========== PHONE MASK ==========
document.querySelectorAll('input[type="tel"]').forEach(input => {
  input.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    e.target.value = v;
  });
});

// ========== FILE UPLOAD ==========
const fileInput = document.getElementById('trab-cv');
const fileName = document.getElementById('fileName');
if (fileInput) {
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      fileName.textContent = '📎 ' + fileInput.files[0].name;
      fileName.style.display = 'block';
    }
  });
}

// ========== FORMS ==========
// Substitua as URLs abaixo pelas URLs de Teste/Produção do seu n8n Webhook
const WEBHOOK_URL_ORCAMENTO = "https://n8n.infinitydev.tech/webhook/orcamento";
const WEBHOOK_URL_CURRICULO = "https://n8n.infinitydev.tech/webhook/curriculo";

function closeModal() {
  document.getElementById('modalSucesso').classList.remove('active');
}

document.getElementById('formOrcamento').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  btn.disabled = true;

  const payload = {
    nome: document.getElementById('orc-nome').value,
    email: document.getElementById('orc-email').value,
    telefone: document.getElementById('orc-tel').value,
    empresa: document.getElementById('orc-empresa').value,
    servico: document.getElementById('orc-servico').value,
    cidade: document.getElementById('orc-cidade').value,
    mensagem: document.getElementById('orc-msg').value
  };

  try {
    const response = await fetch(WEBHOOK_URL_ORCAMENTO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      document.getElementById('modalSucesso').classList.add('active');
      e.target.reset();
    } else {
      alert("Houve um erro ao enviar sua solicitação. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro no envio:", error);
    alert("Erro de conexão ao enviar o formulário.");
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
});

// Função auxiliar para converter arquivo em Base64
const fileToBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

document.getElementById('formTrabalhe').addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  btn.disabled = true;

  const fileInput = document.getElementById('trab-cv');
  let fileBase64 = null;
  let fileNameStr = "";
  let fileMime = "";

  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    fileNameStr = file.name;
    fileMime = file.type;
    fileBase64 = await fileToBase64(file);
  }

  const payload = {
    nome: document.getElementById('trab-nome').value,
    email: document.getElementById('trab-email').value,
    telefone: document.getElementById('trab-tel').value,
    cargo: document.getElementById('trab-cargo').value,
    mensagem: document.getElementById('trab-msg').value,
    curriculo: {
      nome_arquivo: fileNameStr,
      mime_type: fileMime,
      base64: fileBase64
    }
  };

  try {
    const response = await fetch(WEBHOOK_URL_CURRICULO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      document.getElementById('modalSucesso').classList.add('active');
      e.target.reset();
      if (fileName) { fileName.style.display = 'none'; fileName.textContent = ''; }
    } else {
      alert("Houve um erro ao enviar sua candidatura. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro no envio:", error);
    alert("Erro de conexão ao enviar o formulário.");
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
});

// ========== ACTIVE NAV LINK ==========
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
});

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  setupAnimations();
  animateCounters();
});
