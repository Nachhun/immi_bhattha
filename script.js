/**
 * Kristian & Hatha Wedding Invitation - Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initAccordions();
  initRsvpForm();
  initCalendarEvent();
  initAudioPlayer();
  initNavigation();
});

/* --------------------------------------------------------------------------
   1. COUNTDOWN TIMER
   -------------------------------------------------------------------------- */
function initCountdown() {
  // Wedding Date: 22 November 2026 at 10:30 AM (NZDT, UTC+13)
  const targetDate = new Date('2026-11-22T10:30:00+13:00').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-mins');
  const secondsEl = document.getElementById('cd-secs');

  if (!daysEl) return;

  function update() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   2. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initAccordions() {
  const headers = document.querySelectorAll('.faq-header');

  headers.forEach((header) => {
    header.addEventListener('click', () => {
      const parentItem = header.parentElement;
      const isActive = parentItem.classList.contains('active');

      // Close all other accordions
      document.querySelectorAll('.faq-item').forEach((item) => {
        item.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        parentItem.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. CALENDAR INTEGRATION (.ICS & GOOGLE CALENDAR)
   -------------------------------------------------------------------------- */
function initCalendarEvent() {
  const addToCalBtn = document.getElementById('btn-add-calendar');
  if (!addToCalBtn) return;

  addToCalBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const title = encodeURIComponent('Kristian & Hatha Wedding Celebration');
    const details = encodeURIComponent(
      'Wedding celebration of Kristian Joshua Emnas & Pich Hatha Van.\n\n' +
      'Ceremony: 11:00 AM (Please arrive by 10:30 AM)\n' +
      'Reception: 5:30 PM at Jolly Seafood Restaurant, Christchurch, New Zealand.\n' +
      'Dress code: Formal / Semi-Formal (Burgundy theme, avoid white/ivory).'
    );
    const location = encodeURIComponent('Jolly Seafood Restaurant, Christchurch, New Zealand');
    // Start: 2026-11-22 10:30 NZDT -> UTC 2026-11-21 21:30
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261121T213000Z/20261122T103000Z&details=${details}&location=${location}`;

    // Also download .ics file
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Kristian and Hatha Wedding//EN',
      'BEGIN:VEVENT',
      'UID:' + Date.now() + '@kristianandhatha.wedding',
      'DTSTAMP:20260915T000000Z',
      'DTSTART:20261121T213000Z',
      'DTEND:20261122T103000Z',
      'SUMMARY:Kristian & Hatha Wedding Celebration',
      'DESCRIPTION:Wedding of Kristian Joshua Emnas & Pich Hatha Van. Arrival 10:30 AM, Reception 5:30 PM.',
      'LOCATION:Jolly Seafood Restaurant, Christchurch, New Zealand',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Kristian_and_Hatha_Wedding.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Open Google Calendar in new tab as convenience
    setTimeout(() => {
      window.open(gcalUrl, '_blank');
    }, 400);
  });
}

/* --------------------------------------------------------------------------
   4. INTERACTIVE RSVP
   -------------------------------------------------------------------------- */
function initRsvpForm() {
  const form = document.getElementById('rsvp-form');
  const successBox = document.getElementById('rsvp-success');
  const guestDisplay = document.getElementById('success-guest-name');

  if (!form || !successBox) return;

  // Check saved state
  const savedData = localStorage.getItem('kh_wedding_rsvp');
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      guestDisplay.textContent = parsed.name || 'Honored Guest';
      form.style.display = 'none';
      successBox.classList.add('show');
    } catch (e) {}
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('guest-name').value.trim();
    const attendance = document.querySelector('input[name="attending"]:checked')?.value || 'yes';
    const guestCount = document.getElementById('guest-count').value;
    const dietary = document.getElementById('guest-dietary').value.trim();
    const wishes = document.getElementById('guest-wishes').value.trim();

    if (!name) {
      alert('Please enter your name.');
      return;
    }

    const submission = {
      name,
      attendance,
      guestCount,
      dietary,
      wishes,
      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem('kh_wedding_rsvp', JSON.stringify(submission));

    guestDisplay.textContent = name;
    form.style.display = 'none';
    successBox.classList.add('show');

    // Confetti effect
    triggerConfetti();
  });
}

function triggerConfetti() {
  const colors = ['#cba243', '#e8cc7c', '#720f23', '#8e1830', '#ffffff'];
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.zIndex = '9999';
    confetti.style.width = Math.random() * 8 + 6 + 'px';
    confetti.style.height = Math.random() * 8 + 6 + 'px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-20px';
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.opacity = '0.9';
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.transition = `transform ${Math.random() * 3 + 2.5}s ease-out, top ${Math.random() * 3 + 2.5}s ease-out, opacity 1s ease`;

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.style.top = '105vh';
      confetti.style.transform = `rotate(${Math.random() * 720}deg) translateX(${Math.random() * 100 - 50}px)`;
    }, 20);

    setTimeout(() => {
      confetti.style.opacity = '0';
      setTimeout(() => confetti.remove(), 1000);
    }, 3200);
  }
}

/* --------------------------------------------------------------------------
   5. ROMANTIC AMBIENT AUDIO PLAYER (Web Audio API Harp & Piano Chords)
   -------------------------------------------------------------------------- */
function initAudioPlayer() {
  const toggleBtn = document.getElementById('music-toggle');
  if (!toggleBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let intervalId = null;

  // Romantic chord progression in D major:
  // D -> A/C# -> Bm -> F#m -> G -> D/F# -> Em -> A7
  const progression = [
    [146.83, 220.00, 293.66, 369.99, 440.00], // D major (D3, A3, D4, F#4, A4)
    [138.59, 220.00, 277.18, 329.63, 440.00], // A/C#
    [123.47, 185.00, 246.94, 293.66, 369.99], // Bm
    [92.50, 146.83, 185.00, 220.00, 293.66],  // F#m
    [98.00, 146.83, 196.00, 246.94, 293.66],  // G major
    [92.50, 146.83, 220.00, 293.66, 369.99],  // D/F#
    [82.41, 123.47, 164.81, 196.00, 246.94],  // Em
    [110.00, 164.81, 220.00, 277.18, 329.63]  // A7
  ];

  let chordIndex = 0;

  function playArpeggiatedChord(chordNotes) {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    chordNotes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Soft warm acoustic timbre
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.28);

      // Lowpass filter for warm music-box / harp feel
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now + i * 0.28);

      gain.gain.setValueAtTime(0.001, now + i * 0.28);
      gain.gain.exponentialRampToValueAtTime(0.08, now + i * 0.28 + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.28 + 2.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + i * 0.28);
      osc.stop(now + i * 0.28 + 2.9);
    });
  }

  function startMusic() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = true;
    toggleBtn.classList.add('playing');
    toggleBtn.setAttribute('title', 'Pause Romantic Music');

    playArpeggiatedChord(progression[chordIndex]);
    chordIndex = (chordIndex + 1) % progression.length;

    intervalId = setInterval(() => {
      playArpeggiatedChord(progression[chordIndex]);
      chordIndex = (chordIndex + 1) % progression.length;
    }, 2400);
  }

  function stopMusic() {
    isPlaying = false;
    toggleBtn.classList.remove('playing');
    toggleBtn.setAttribute('title', 'Play Romantic Music');
    if (intervalId) clearInterval(intervalId);
    if (audioCtx && audioCtx.state === 'running') {
      audioCtx.suspend();
    }
  }

  toggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });
}

/* --------------------------------------------------------------------------
   6. NAVIGATION & MENU
   -------------------------------------------------------------------------- */
function initNavigation() {
  const menuBtn = document.getElementById('menu-btn');
  const overlay = document.getElementById('mobile-nav');
  const closeBtn = document.getElementById('close-menu');
  const menuLinks = document.querySelectorAll('.mobile-nav-links a');
  const bottomNavItems = document.querySelectorAll('.bottom-nav-item');

  if (menuBtn && overlay) {
    menuBtn.addEventListener('click', () => overlay.classList.add('active'));
  }

  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  }

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (overlay) overlay.classList.remove('active');
    });
  });

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    bottomNavItems.forEach((btn) => {
      btn.classList.remove('active');
      if (btn.getAttribute('href') === `#${current}`) {
        btn.classList.add('active');
      }
    });
  });
}
