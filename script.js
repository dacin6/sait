// ===== THEME TOGGLE =====
const themeBtn = document.getElementById('themeBtn');
const dateNotice = document.getElementById('dateNotice');
const htmlElement = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
  themeBtn.textContent = '☀️';
}

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  themeBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeBtn.style.animation = 'pulse 0.3s ease';
});

let lastLeafTime = 0;

document.addEventListener('mousemove', (event) => {
  const now = Date.now();
  if (now - lastLeafTime > 160) {
    lastLeafTime = now;
    createLeaf(event.clientX, event.clientY);
  }
});

function createLeaf(x, y) {
  const leaf = document.createElement('div');
  leaf.className = 'leaf';
  leaf.style.left = `${x}px`;
  leaf.style.top = `${y}px`;
  leaf.style.animationDuration = `${3 + Math.random() * 2}s`;
  leaf.style.transform = `rotate(${Math.random() * 360}deg)`;
  document.body.appendChild(leaf);
  setTimeout(() => leaf.remove(), 4200);
}

function createFirefly() {
  const container = document.querySelector('.fireflies');
  if (!container) return;
  const firefly = document.createElement('div');
  firefly.className = 'firefly';
  firefly.style.left = `${Math.random() * 100}%`;
  firefly.style.top = `${Math.random() * 100}%`;
  firefly.style.animationDuration = `${4 + Math.random() * 4}s`;
  firefly.style.animationDelay = `${Math.random() * 3}s`;
  firefly.style.width = `${6 + Math.random() * 8}px`;
  firefly.style.height = firefly.style.width;
  container.appendChild(firefly);
  setTimeout(() => firefly.remove(), 9000);
}

setInterval(() => {
  const count = document.querySelectorAll('.firefly').length;
  if (count < 14) createFirefly();
}, 800);

function isDateAllowed(dateString) {
  if (!dateString) return true;
  const date = new Date(dateString);
  const day = date.getDay();
  return day !== 1 && day !== 5;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getNextWeekBounds(fromDate) {
  const date = new Date(fromDate);
  const day = date.getDay();
  const daysUntilNextMonday = ((8 - day) % 7) || 7;
  const nextMonday = new Date(date);
  nextMonday.setDate(date.getDate() + daysUntilNextMonday);
  const nextSunday = new Date(nextMonday);
  nextSunday.setDate(nextMonday.getDate() + 6);
  return { min: nextMonday, max: nextSunday };
}

function getNextAllowedDate(startDate, endDate) {
  const candidate = new Date(startDate);
  while (candidate <= endDate) {
    const iso = formatDate(candidate);
    if (isDateAllowed(iso)) return candidate;
    candidate.setDate(candidate.getDate() + 1);
  }
  return startDate;
}

function showDateWarning(message) {
  if (!dateNotice) return;
  dateNotice.textContent = message;
  dateNotice.classList.remove('hidden');
}

function clearDateWarning() {
  if (!dateNotice) return;
  dateNotice.textContent = '';
  dateNotice.classList.add('hidden');
}

// ===== PARTICLE EFFECT ON CLICK =====
document.addEventListener('click', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  const flowers = ['🌸', '🌼', '🌻', '🌺', '💚'];
  
  for (let i = 0; i < 3; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.fontSize = '20px';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '999';
    particle.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    particle.style.animation = `float 1s ease-out forwards`;
    particle.style.opacity = '0.8';
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / 3;
    const vx = Math.cos(angle) * 100;
    const vy = Math.sin(angle) * 100 - 50;
    
    particle.animate([
      { transform: 'translate(0, 0)', opacity: 1 },
      { transform: `translate(${vx}px, ${vy}px)`, opacity: 0 }
    ], { duration: 1000, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' });
    
    setTimeout(() => particle.remove(), 1000);
  }
});

// ===== PARALLAX EFFECT =====
const wrap = document.querySelector('.wrap');
const flowers = document.querySelector('.flowers');
const infoSection = document.querySelector('.info-section');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  
  if (wrap) wrap.style.transform = `translateY(${scrollY * 0.5}px)`;
  if (flowers) flowers.style.transform = `translateY(${scrollY * 0.3}px)`;
  if (infoSection) infoSection.style.transform = `translateY(${scrollY * 0.6}px)`;
});

// ===== QUIZ FUNCTIONALITY =====
const quizSection = document.getElementById('quizSection');
const quizBtns = document.querySelectorAll('.quiz-btn');
const quizResult = document.getElementById('quizResult');
const customFlowerInput = document.getElementById('customFlower');
const customFlowerBtn = document.getElementById('customFlowerBtn');

quizBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    quizBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    customFlowerInput.value = '';
    
    const flower = btn.dataset.flower;
    const responses = {
      '🌹': 'Троянда - символ любові! Гарний вибір 💕',
      '🌷': 'Тюльпан - грація й витонченість! 💐',
      '🌺': 'Гібіскус - екзотична й восхитивна! 🌴',
      '🌼': 'Ромашка - чистота й простота 💚'
    };
    
    quizResult.textContent = responses[flower];
    quizResult.style.animation = 'fadeInUp 0.4s ease';
    
    // Get invitation date
    const invitationDate = localStorage.getItem('chosenDate') || 'не обрана';
    
    // Log the flower selection with date
    const flowerData = {
      flower: flower + ' ' + Object.values(responses).find(r => r.includes(responses[flower])).match(/[а-яА-Я\s]+/)[0].trim(),
      invitationDate: invitationDate,
      timestamp: new Date().toLocaleString('uk-UA')
    };
    
    let flowerLog = JSON.parse(localStorage.getItem('flowerLog') || '[]');
    flowerLog.push(flowerData);
    localStorage.setItem('flowerLog', JSON.stringify(flowerLog));
    
    localStorage.setItem('favoriteFlower', flower);
  });
});

// Custom flower input
customFlowerBtn.addEventListener('click', () => {
  const customFlower = customFlowerInput.value.trim();
  if (!customFlower) {
    quizResult.textContent = 'Будь ласка, напиши квітку!';
    return;
  }
  
  quizBtns.forEach(b => b.classList.remove('selected'));
  
  const response = `${customFlower} - цікавий вибір! 🌸`;
  quizResult.textContent = response;
  quizResult.style.animation = 'fadeInUp 0.4s ease';
  
  // Get invitation date
  const invitationDate = localStorage.getItem('chosenDate') || 'не обрана';
  
  // Save custom flower with timestamp and invitation date
  const customFlowerData = {
    flower: customFlower,
    invitationDate: invitationDate,
    timestamp: new Date().toLocaleString('uk-UA')
  };
  
  // Get existing log
  let flowerLog = JSON.parse(localStorage.getItem('flowerLog') || '[]');
  flowerLog.push(customFlowerData);
  localStorage.setItem('flowerLog', JSON.stringify(flowerLog));
  
  localStorage.setItem('favoriteFlower', `custom:${customFlower}`);
  customFlowerInput.value = '';
});

// Allow Enter key to submit
customFlowerInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    customFlowerBtn.click();
  }
});

// Load saved flower choice
const savedFlower = localStorage.getItem('favoriteFlower');
if (savedFlower) {
  if (savedFlower.startsWith('custom:')) {
    const customFlower = savedFlower.replace('custom:', '');
    customFlowerInput.value = customFlower;
    customFlowerBtn.click();
    quizSection.classList.remove('hidden');
  } else {
    const savedBtn = document.querySelector(`[data-flower="${savedFlower}"]`);
    if (savedBtn) {
      savedBtn.click();
      quizSection.classList.remove('hidden');
    }
  }
}

// Playful invitation logic
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const dateArea = document.getElementById('dateArea');
const saveDate = document.getElementById('saveDate');
const dateInput = document.getElementById('dateInput');
const result = document.getElementById('result');

let noClickCount = 0;

// Make No button "run away" when mouse approaches
noBtn.addEventListener('mouseenter', () => {
  noClickCount++;
  const distance = 80 + noClickCount * 30;
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  
  noBtn.style.transform = `translate(${x}px, ${y}px) scale(${Math.max(0.7, 1 - noClickCount * 0.1)})`;
  noBtn.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
  
  // Playful scaling effect
  if (noClickCount > 3) {
    noBtn.textContent = Math.random() > 0.5 ? '😅' : '🏃';
  }
});

// Restore button text on mouse leave
noBtn.addEventListener('mouseleave', () => {
  noBtn.innerHTML = '<span>Ні</span>';
});

// If clicked No for real, playful message
noBtn.addEventListener('click', () => {
  noClickCount = 0;
  result.textContent = 'Ой, він втікає... але може все ж передумаєш? 😊';
  result.style.animation = 'pulse 0.4s ease';
});

yesBtn.addEventListener('click', () => {
  // Add celebration effect
  yesBtn.style.animation = 'pulse 0.5s ease 3';
  
  document.getElementById('btns').classList.add('hidden');
  dateArea.classList.remove('hidden');
  dateArea.style.animation = 'fadeInUp 0.6s ease';

  // only next week, excluding Monday and Friday because I am on duty for 24 hours on those days
  const today = new Date();
  const { min, max } = getNextWeekBounds(today);
  dateInput.min = formatDate(min);
  dateInput.max = formatDate(max);
  dateInput.value = formatDate(getNextAllowedDate(min, max));
  clearDateWarning();
  
  // Confetti on yes
  launchLightConfetti();
});

saveDate.addEventListener('click', () => {
  const d = dateInput.value;
  if (!d) {
    result.textContent = 'Оберіть, будь ласка, дату.';
    dateInput.style.animation = 'pulse 0.3s ease';
    return;
  }

  if (!isDateAllowed(d)) {
    showDateWarning('Вибраний день не підходить. Будь ласка, обери інший день наступного тижня — понеділок та п’ятниця не підходять, бо я в наряд на добу заступаю.');
    dateInput.style.animation = 'pulse 0.3s ease';
    return;
  }

  clearDateWarning();
  localStorage.setItem('chosenDate', d);

  // Log the date selection
  const dateLog = {
    date: d,
    timestamp: new Date().toLocaleString('uk-UA')
  };
  localStorage.setItem('dateLog', JSON.stringify(dateLog));

  dateArea.classList.add('hidden');
  result.innerHTML = `<strong>Дякую! 🎉</strong><br>Зберіг дату: <strong>${d}</strong><br>Чекаю з нетерпінням 💚`;
  result.style.animation = 'fadeInUp 0.6s ease';

  // Show quiz after date is saved
  setTimeout(() => {
    quizSection.classList.remove('hidden');
    quizSection.style.animation = 'fadeInUp 0.6s ease';
    quizSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 500);

  launchConfetti();
});

// If a date is already saved, show it
window.addEventListener('load', () => {
  const saved = localStorage.getItem('chosenDate');
  if (saved) {
    document.getElementById('btns').classList.add('hidden');
    result.innerHTML = `<strong>Вже домовлено на:</strong><br><strong>${saved}</strong> 💚`;
    quizSection.classList.remove('hidden');
  }
  
  // Create star decorations
  createStarBackground();
});

// Enhanced confetti with more variety
function launchConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti';
  document.body.appendChild(container);
  
  const emojis = ['🌸', '🌼', '🌻', '🌺', '💚', '✨', '🎉', '💫'];
  
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'piece';
    el.style.left = Math.random() * 100 + '%';
    el.style.top = '-10%';
    el.style.fontSize = (10 + Math.random() * 20) + 'px';
    el.style.lineHeight = '1';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.animation = `fall ${3 + Math.random() * 2}s linear forwards`;
    container.appendChild(el);
  }
  
  setTimeout(() => container.remove(), 5000);
}

// Light confetti for yes button
function launchLightConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti';
  document.body.appendChild(container);
  
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.className = 'piece';
    el.style.left = Math.random() * 100 + '%';
    el.style.top = '-10%';
    el.style.background = `hsl(${100 + Math.random() * 80}, 80%, 60%)`;
    el.style.animation = `fall ${2 + Math.random() * 1}s linear forwards`;
    container.appendChild(el);
  }
  
  setTimeout(() => container.remove(), 3000);
}

// Create animated star background
function createStarBackground() {
  const starsContainer = document.querySelector('.stars');
  if (!starsContainer) return;
  
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('div');
    star.style.position = 'absolute';
    star.style.width = (1 + Math.random() * 3) + 'px';
    star.style.height = star.style.width;
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.background = `rgba(43, 138, 62, ${0.1 + Math.random() * 0.3})`;
    star.style.borderRadius = '50%';
    star.style.animation = `twinkle ${2 + Math.random() * 2}s infinite`;
    star.style.animationDelay = (Math.random() * 2) + 's';
    starsContainer.appendChild(star);
  }
}

// View flower log in console
window.viewFlowerLog = function() {
  const dateLog = JSON.parse(localStorage.getItem('dateLog') || '{}');
  const flowerLog = JSON.parse(localStorage.getItem('flowerLog') || '[]');
  
  console.log('📋 ===== ЛОГИ ЗАПРОШЕННЯ =====');
  
  if (Object.keys(dateLog).length > 0) {
    console.log('📅 ДАТА ЗАПРОШЕННЯ:');
    console.log(`   Дата: ${dateLog.date}`);
    console.log(`   Записано: ${dateLog.timestamp}`);
  } else {
    console.log('📅 ДАТА: ще не обрана');
  }
  
  console.log('\n🌸 ВИБРАНІ КВІТКИ:');
  if (flowerLog.length === 0) {
    console.log('   Логу нема. Ще ніхто не вводив!');
  } else {
    console.table(flowerLog);
  }
  
  return { date: dateLog, flowers: flowerLog };
};

// Clear all logs
window.clearFlowerLog = function() {
  localStorage.removeItem('flowerLog');
  localStorage.removeItem('dateLog');
  console.log('✅ Всі логи очищено!');
};
