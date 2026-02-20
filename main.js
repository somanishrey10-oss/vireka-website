// ===== INTERACTIVE TECH BACKGROUND =====
(function() {
  const canvas = document.getElementById('techCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h;
  let mouseX = -1000, mouseY = -1000;
  let particles = [];
  const PARTICLE_COUNT = 80;
  const CONNECTION_DIST = 150;
  const MOUSE_RADIUS = 200;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.documentElement.scrollHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Scroll offset for mouse position
    const scrollY = window.scrollY;
    const mx = mouseX;
    const my = mouseY + scrollY;

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles and mouse interactions
    for (const p of particles) {
      // Mouse attraction
      const dx = mx - p.x;
      const dy = my - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.02;
        p.vx += dx / dist * force;
        p.vy += dy / dist * force;

        // Draw line to cursor
        const alpha = (1 - dist / MOUSE_RADIUS) * 0.3;
        ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mx, my);
        ctx.stroke();
      }

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Dampen
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Wrap
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      // Draw particle
      const glow = dist < MOUSE_RADIUS ? (1 - dist / MOUSE_RADIUS) * 0.5 + 0.3 : 0.3;
      ctx.fillStyle = `rgba(0, 212, 255, ${glow})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mouse glow gradient
    if (mx > 0 && my > 0) {
      const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, MOUSE_RADIUS);
      gradient.addColorStop(0, 'rgba(0, 212, 255, 0.06)');
      gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(mx - MOUSE_RADIUS, my - MOUSE_RADIUS, MOUSE_RADIUS * 2, MOUSE_RADIUS * 2);
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
  window.addEventListener('scroll', () => {
    // Resize canvas if page height changed
    const newH = document.documentElement.scrollHeight;
    if (Math.abs(h - newH) > 100) {
      h = canvas.height = newH;
    }
  });

  resize();
  createParticles();
  draw();
})();

// ===== HERO DENSE PARTICLE CANVAS =====
(function() {
  const heroCanvas = document.getElementById('heroCanvas');
  if (!heroCanvas) return;

  const ctx = heroCanvas.getContext('2d');
  let w, h;
  let mouseX = -1000, mouseY = -1000;
  let particles = [];
  const COUNT = 160;
  const CONNECT = 120;
  const MOUSE_R = 250;

  function resize() {
    const hero = heroCanvas.parentElement;
    w = heroCanvas.width = hero.offsetWidth;
    h = heroCanvas.height = hero.offsetHeight;
  }

  function init() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2.5 + 0.5,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Get mouse position relative to hero
    const heroRect = heroCanvas.parentElement.getBoundingClientRect();
    const mx = mouseX - heroRect.left;
    const my = mouseY - heroRect.top;

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT) {
          const alpha = (1 - dist / CONNECT) * 0.2;
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      const dx = mx - p.x;
      const dy = my - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_R && dist > 0) {
        const force = (MOUSE_R - dist) / MOUSE_R * 0.03;
        p.vx += dx / dist * force;
        p.vy += dy / dist * force;

        // Line to cursor
        const alpha = (1 - dist / MOUSE_R) * 0.4;
        ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mx, my);
        ctx.stroke();
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.vy *= 0.99;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const glow = dist < MOUSE_R ? (1 - dist / MOUSE_R) * 0.6 + 0.4 : 0.35;
      ctx.fillStyle = `rgba(0, 212, 255, ${glow})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mouse glow
    if (mx > 0 && mx < w && my > 0 && my < h) {
      const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, MOUSE_R);
      gradient.addColorStop(0, 'rgba(0, 212, 255, 0.08)');
      gradient.addColorStop(0.5, 'rgba(0, 212, 255, 0.03)');
      gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

  resize();
  init();
  draw();
})();

// ===== MOBILE NAV TOGGLE =====
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('active');
    });

    // Close menu when a link is clicked
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }

  // ===== DONATION PAGE =====
  const donateForm = document.getElementById('donateForm');

  if (donateForm) {
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customInput = document.getElementById('customAmount');
    const freqBtns = document.querySelectorAll('.frequency-btn');
    const impactNote = document.getElementById('impactNote');
    let selectedAmount = 50;

    const impacts = {
      25: 'provides research resources and journal access for one student to begin their project.',
      50: 'covers research mentorship for one student through the entire publishing process.',
      100: 'funds full mentorship and peer-review journal publication fees for one student researcher.',
      250: 'supports a cohort of students through Vireka\'s Research Publishing Program from start to publication.',
      500: 'funds a student\'s full Biotech Innovation Program experience including lab access and patent filing support.',
      1000: 'sponsors an entire research program expansion into a new school district or country.',
    };

    // Amount button selection
    amountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        amountBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedAmount = parseInt(btn.dataset.amount);
        customInput.value = '';
        updateImpact(selectedAmount);
      });
    });

    // Custom amount input
    customInput.addEventListener('input', () => {
      amountBtns.forEach(b => b.classList.remove('selected'));
      const val = parseInt(customInput.value);
      if (val > 0) {
        selectedAmount = val;
        updateImpact(val);
      }
    });

    // Frequency toggle
    freqBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        freqBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });

    function updateImpact(amount) {
      if (!impactNote) return;
      // Find the closest matching tier
      const tiers = Object.keys(impacts).map(Number).sort((a, b) => a - b);
      let tier = tiers[0];
      for (const t of tiers) {
        if (amount >= t) tier = t;
      }
      impactNote.querySelector('p').innerHTML = `<strong>$${amount.toLocaleString()}</strong> &mdash; ${impacts[tier]}`;
    }

    // Form submission
    donateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const alert = document.getElementById('donateAlert');
      alert.style.display = 'block';
      donateForm.reset();
      amountBtns.forEach(b => b.classList.remove('selected'));
      amountBtns[1].classList.add('selected');
      selectedAmount = 50;
      updateImpact(50);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => { alert.style.display = 'none'; }, 5000);
    });
  }

  // ===== CONTACT FORM (EmailJS) =====
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    // Initialize EmailJS — replace YOUR_PUBLIC_KEY with your EmailJS public key
    if (typeof emailjs !== 'undefined') {
      emailjs.init('WEW5-nE0i8W1voS3K');
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const successAlert = document.getElementById('contactAlert');
      const errorAlert = document.getElementById('contactError');
      const originalText = submitBtn.textContent;

      // Hide any previous alerts
      successAlert.style.display = 'none';
      if (errorAlert) errorAlert.style.display = 'none';

      // Show loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.classList.add('btn-sending');

      // Gather form data
      const templateParams = {
        from_name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
        from_email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
      };

      // Send via EmailJS — replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID
      if (typeof emailjs !== 'undefined') {
        emailjs.send('service_ed0f0iu', 'template_9pbdjok', templateParams)
          .then(() => {
            successAlert.style.display = 'block';
            contactForm.reset();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => { successAlert.style.display = 'none'; }, 5000);
          })
          .catch((err) => {
            console.error('EmailJS error:', err);
            if (errorAlert) errorAlert.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => { if (errorAlert) errorAlert.style.display = 'none'; }, 7000);
          })
          .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('btn-sending');
          });
      } else {
        // Fallback if EmailJS not loaded — show success anyway (for local testing)
        successAlert.style.display = 'block';
        contactForm.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('btn-sending');
        setTimeout(() => { successAlert.style.display = 'none'; }, 5000);
      }
    });
  }

  // ===== STAT COUNTER ANIMATION =====
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
  }

  function animateStat(el) {
    const text = el.textContent.trim();
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const numStr = text.replace(/[^0-9.]/g, '');
    const target = parseFloat(numStr);

    if (isNaN(target)) return;

    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      let display = current.toLocaleString();
      if (hasPlus) display += '+';
      if (hasPercent) display += '%';

      el.textContent = display;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }
});
