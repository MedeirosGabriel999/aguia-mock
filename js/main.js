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

// ========== MODAL ALVARÁ PF ==========
// Ordem de tentativa: PDF, JPG, PNG. Coloque o arquivo em assets/docs/
const ALVARA_CANDIDATOS = [
  { src: 'assets/docs/alvara-pf.pdf', tipo: 'pdf' },
  { src: 'assets/docs/alvara-pf.jpg', tipo: 'img' },
  { src: 'assets/docs/alvara-pf.png', tipo: 'img' }
];

async function detectarAlvara() {
  for (const candidato of ALVARA_CANDIDATOS) {
    try {
      const res = await fetch(candidato.src, { method: 'HEAD' });
      if (res.ok) return candidato;
    } catch (_) { /* ignora */ }
  }
  return null;
}

function renderAlvaraPlaceholder() {
  return `
    <div class="alvara-placeholder">
      <div class="icon-wrap"><i class="fas fa-file-shield"></i></div>
      <h4>Documento em digitalização</h4>
      <p>Nosso alvará de funcionamento autorizado pela Polícia Federal será disponibilizado aqui em breve. Caso precise consultá-lo agora, entre em contato direto pelo WhatsApp.</p>
      <div class="alvara-actions">
        <a href="https://wa.me/5537991479482?text=Ol%C3%A1!%20Gostaria%20de%20consultar%20o%20alvar%C3%A1%20da%20VAZ%20Vigil%C3%A2ncia." target="_blank"><i class="fab fa-whatsapp"></i> Solicitar Alvará</a>
      </div>
    </div>`;
}

function renderAlvaraDoc(candidato) {
  if (candidato.tipo === 'pdf') {
    return `
      <embed src="${candidato.src}#toolbar=1&navpanes=0" type="application/pdf" />
      <div class="alvara-actions">
        <a href="${candidato.src}" target="_blank"><i class="fas fa-download"></i> Baixar PDF</a>
      </div>`;
  }
  return `
    <img src="${candidato.src}" alt="Alvará de Funcionamento – Polícia Federal" />
    <div class="alvara-actions">
      <a href="${candidato.src}" target="_blank" download><i class="fas fa-download"></i> Baixar Documento</a>
    </div>`;
}

async function openAlvara() {
  const modal = document.getElementById('modalAlvara');
  const body = document.getElementById('alvaraBody');
  if (!modal || !body) return;
  body.innerHTML = '<div class="proc-loading" style="padding:40px"><i class="fas fa-spinner fa-spin"></i> Carregando documento...</div>';
  modal.classList.add('active');
  const doc = await detectarAlvara();
  body.innerHTML = doc ? renderAlvaraDoc(doc) : renderAlvaraPlaceholder();
}

function closeAlvara() {
  document.getElementById('modalAlvara')?.classList.remove('active');
}

document.getElementById('btnVerAlvara')?.addEventListener('click', openAlvara);
document.getElementById('modalAlvara')?.addEventListener('click', (e) => {
  if (e.target.id === 'modalAlvara') closeAlvara();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAlvara();
});

// ========== PROCESSOS SELETIVOS ==========
const fmtDate = (iso) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

function renderVaga(v) {
  const reqs = (v.requisitos || []).map(r => `<li>${r}</li>`).join('');
  const regime = (v.regime || []).map(r => `<li>${r}</li>`).join('');
  const benefs = (v.beneficios || []).map(b => `<li>${b}</li>`).join('');
  
  let contatoHtml = '';
  if (v.contato) {
    if (v.whatsapp) {
      const waLink = `https://wa.me/${v.whatsapp}?text=Ol%C3%A1!%20Gostaria%20de%20enviar%20meu%20curr%C3%ADculo%20para%20a%20vaga%20de%20${encodeURIComponent(v.cargo)}.`;
      contatoHtml = `
        <div class="proc-contato" style="font-size: 0.85rem; margin-top: 4px; color: var(--gold); font-weight: 600; display: flex; align-items: center; gap: 8px;">
          <i class="fab fa-whatsapp" style="font-size: 1.1rem;"></i>
          <a href="${waLink}" target="_blank" style="text-decoration: underline; color: var(--gold-light);">${v.contato}</a>
        </div>`;
    } else {
      contatoHtml = `
        <div class="proc-contato" style="font-size: 0.85rem; margin-top: 4px; color: var(--gray-400); display: flex; align-items: center; gap: 8px;">
          <i class="fas fa-info-circle"></i>
          <span>${v.contato}</span>
        </div>`;
    }
  }

  const ctaButton = `<button class="proc-cta" data-interesse="${v.cargo}"><i class="fas fa-paper-plane"></i> Tenho Interesse</button>`;

  return `
    <div class="proc-card">
      <div class="proc-card-header">
        <h3 class="proc-card-title">${v.cargo}</h3>
        <span class="proc-status">${v.status || 'Aberta'}</span>
      </div>
      <div class="proc-info">
        ${v.local ? `<span class="proc-chip"><i class="fas fa-location-dot"></i> ${v.local}</span>` : ''}
        ${v.tipo ? `<span class="proc-chip"><i class="fas fa-file-contract"></i> ${v.tipo}</span>` : ''}
        ${v.turno ? `<span class="proc-chip"><i class="fas fa-clock"></i> ${v.turno}</span>` : ''}
      </div>
      ${reqs ? `<div class="proc-reqs"><strong>Requisitos</strong><ul>${reqs}</ul></div>` : ''}
      ${regime ? `<div class="proc-reqs" style="border-left-color: var(--navy-light);"><strong>Regime</strong><ul>${regime}</ul></div>` : ''}
      ${benefs ? `<div class="proc-reqs" style="border-left-color: #16A34A;"><strong>Benefícios</strong><ul>${benefs}</ul></div>` : ''}
      ${ctaButton}
    </div>`;
}

function renderCurso(c) {
  return `
    <div class="proc-card">
      <div class="proc-card-header">
        <h3 class="proc-card-title">${c.titulo}</h3>
        <span class="proc-status">${c.status || 'Inscrições abertas'}</span>
      </div>
      ${c.descricao ? `<p class="proc-desc">${c.descricao}</p>` : ''}
      <div class="proc-info">
        ${c.carga_horaria ? `<span class="proc-chip"><i class="fas fa-clock"></i> ${c.carga_horaria}</span>` : ''}
        ${c.modalidade ? `<span class="proc-chip"><i class="fas fa-chalkboard-user"></i> ${c.modalidade}</span>` : ''}
        ${c.local ? `<span class="proc-chip"><i class="fas fa-location-dot"></i> ${c.local}</span>` : ''}
        ${c.inicio ? `<span class="proc-chip"><i class="fas fa-calendar-day"></i> Início ${fmtDate(c.inicio)}</span>` : ''}
        ${c.vagas ? `<span class="proc-chip"><i class="fas fa-users"></i> ${c.vagas} vagas</span>` : ''}
      </div>
      <button class="proc-cta" data-interesse="${c.titulo}"><i class="fas fa-paper-plane"></i> Tenho Interesse</button>
    </div>`;
}

const emptyState = (label, genero = 'f') => `
  <div class="proc-empty">
    <i class="fas fa-clipboard-list"></i>
    <p>${genero === 'f' ? 'Nenhuma' : 'Nenhum'} ${label} disponível no momento.</p>
    <p style="font-size:.85rem;margin-top:8px">Acompanhe nosso Instagram <a href="https://instagram.com/vazvigilanciapatrimonial" target="_blank" style="color:var(--gold);font-weight:600">@vazvigilanciapatrimonial</a></p>
  </div>`;

async function loadProcessos() {
  const gridVagas = document.getElementById('grid-vagas');
  const gridCursos = document.getElementById('grid-cursos');
  const countVagas = document.getElementById('count-vagas');
  const countCursos = document.getElementById('count-cursos');
  if (!gridVagas) return;

  try {
    const res = await fetch('data/processos.json?v=' + Date.now());
    if (!res.ok) throw new Error('Falha ao carregar');
    const data = await res.json();

    const vagas = data.vagas || [];
    const cursos = data.cursos || [];

    countVagas.textContent = vagas.length;
    countCursos.textContent = cursos.length;

    gridVagas.innerHTML = vagas.length ? vagas.map(renderVaga).join('') : emptyState('vaga', 'f');
    gridCursos.innerHTML = cursos.length ? cursos.map(renderCurso).join('') : emptyState('curso', 'm');

    // Botões "Tenho Interesse" levam ao formulário Trabalhe Conosco
    document.querySelectorAll('.proc-cta').forEach(btn => {
      btn.addEventListener('click', () => {
        const interesse = btn.dataset.interesse || '';
        const trab = document.getElementById('trabalhe');
        const msg = document.getElementById('trab-msg');
        if (msg && interesse) msg.value = `Olá! Tenho interesse em: ${interesse}.\n\n`;
        if (trab) trab.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => document.getElementById('trab-nome')?.focus(), 700);
      });
    });
  } catch (err) {
    console.error('Erro processos seletivos:', err);
    gridVagas.innerHTML = emptyState('vaga', 'f');
    gridCursos.innerHTML = emptyState('curso', 'm');
  }
}

// Alternância de abas
document.querySelectorAll('.proc-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.proc-tab').forEach(t => t.classList.toggle('active', t === tab));
    document.querySelectorAll('.proc-panel').forEach(p => {
      p.classList.toggle('active', p.id === `panel-${target}`);
    });
  });
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
  loadProcessos();
});
