// ===== TELEGRAM CONFIGURATION =====
// Заміни ці значення на свої:
const TELEGRAM_BOT_TOKEN = '8634492138:AAEbRyjIs_Vr-7iRI_8VyJRapJ6e6DzyltA';
const TELEGRAM_CHAT_ID = '892441584';

async function sendToTelegram(date) {
  if (TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' || TELEGRAM_CHAT_ID === 'YOUR_CHAT_ID_HERE') {
    console.warn('Telegram не налаштовано. Додай BOT_TOKEN і CHAT_ID в script.js');
    return;
  }

  const message = `🌸 Нова дата запрошення!\n\n📅 Дата: ${date}\n⏰ Час: ${new Date().toLocaleString('uk-UA')}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    const data = await response.json();
    if (data.ok) {
      console.log('✅ Повідомлення відправлено в Telegram');
    } else {
      console.error('❌ Помилка Telegram:', data.description);
    }
  } catch (error) {
    console.error('❌ Помилка відправки:', error);
  }
}

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
  // Calculate days until next Monday (always at least 1 day)
  const daysUntilNextMonday = (day === 0) ? 1 : (8 - day);
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
  const flowers = ['🌸', '🌼', '🌻', '🌺', '💚', '💖', '✨', '🦋'];
  
  for (let i = 0; i < 5; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.fontSize = (18 + Math.random() * 12) + 'px';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '999';
    particle.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    particle.style.animation = `float 1.2s ease-out forwards`;
    particle.style.opacity = '0.9';
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / 5;
    const vx = Math.cos(angle) * (80 + Math.random() * 60);
    const vy = Math.sin(angle) * (80 + Math.random() * 60) - 40;
    
    particle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${vx}px, ${vy}px) scale(0.5)`, opacity: 0 }
    ], { duration: 1200, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' });
    
    setTimeout(() => particle.remove(), 1200);
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

function moveNoButton() {
  noClickCount++;
  const distance = 80 + noClickCount * 30;
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  
  noBtn.style.transform = `translate(${x}px, ${y}px) scale(${Math.max(0.7, 1 - noClickCount * 0.1)})`;
  noBtn.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
  
  if (noClickCount > 3) {
    noBtn.textContent = Math.random() > 0.5 ? '😅' : '🏃';
  }
}

// Make No button "run away" when mouse or touch approaches
noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('pointerenter', moveNoButton);
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveNoButton();
}, { passive: false });

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

  // Send to Telegram
  sendToTelegram(d);

  // Log the date selection
  const dateLog = {
    date: d,
    timestamp: new Date().toLocaleString('uk-UA')
  };
  localStorage.setItem('dateLog', JSON.stringify(dateLog));

  dateArea.classList.add('hidden');
  result.innerHTML = `<strong>Дані зафіксовано! ✅</strong><br>Будь готова близько 19:00 �`;
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
  
  const emojis = ['🌸', '🌼', '🌻', '🌺', '💚', '✨', '🎉', '💫', '💖', '🦋', '⭐', '🌟'];
  
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    el.className = 'piece';
    el.style.left = Math.random() * 100 + '%';
    el.style.top = '-10%';
    el.style.fontSize = (12 + Math.random() * 24) + 'px';
    el.style.lineHeight = '1';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.animation = `fall ${2.5 + Math.random() * 2.5}s linear forwards`;
    container.appendChild(el);
  }
  
  setTimeout(() => container.remove(), 6000);
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
  
  // Add floating hearts
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('div');
    heart.style.position = 'absolute';
    heart.style.fontSize = (12 + Math.random() * 20) + 'px';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.top = Math.random() * 100 + '%';
    heart.style.opacity = 0.1 + Math.random() * 0.2;
    heart.style.animation = `floatHeart ${4 + Math.random() * 4}s ease-in-out infinite`;
    heart.style.animationDelay = (Math.random() * 3) + 's';
    heart.textContent = ['💖', '💕', '💗', '❤️'][Math.floor(Math.random() * 4)];
    starsContainer.appendChild(heart);
  }
  
  // Add stars
  for (let i = 0; i < 20; i++) {
    const star = document.createElement('div');
    star.style.position = 'absolute';
    star.style.width = (2 + Math.random() * 4) + 'px';
    star.style.height = star.style.width;
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.background = `rgba(255, 255, 255, ${0.2 + Math.random() * 0.4})`;
    star.style.borderRadius = '50%';
    star.style.animation = `twinkle ${2 + Math.random() * 3}s infinite`;
    star.style.animationDelay = (Math.random() * 2) + 's';
    starsContainer.appendChild(star);
  }
  
  // Add sparkles
  for (let i = 0; i < 10; i++) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'absolute';
    sparkle.style.fontSize = (8 + Math.random() * 12) + 'px';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.opacity = 0.15 + Math.random() * 0.25;
    sparkle.style.animation = `twinkle ${1.5 + Math.random() * 2}s infinite`;
    sparkle.style.animationDelay = (Math.random() * 2) + 's';
    sparkle.textContent = ['✨', '⭐', '🌟'][Math.floor(Math.random() * 3)];
    starsContainer.appendChild(sparkle);
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
