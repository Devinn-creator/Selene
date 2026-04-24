from pathlib import Path

base = Path("/mnt/data/selene_timer_app")
base.mkdir(exist_ok=True)

html = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Selene | Timer & Planning</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div id="app" class="app">
    <div class="shade"></div>

    <header class="topbar">
      <div class="goal-box">
        <label for="goalInput">Timer Goal</label>
        <input id="goalInput" type="text" placeholder="What are you working on?" maxlength="80" />
      </div>

      <button id="calendarToggle" class="glass-btn">Calendar</button>
    </header>

    <aside class="background-switcher">
      <button id="prevBg" aria-label="Previous background">‹</button>
      <span id="bgName">Aurora Lake</span>
      <button id="nextBg" aria-label="Next background">›</button>
    </aside>

    <main class="timer-screen">
      <p id="activeGoal" class="active-goal"></p>

      <section class="timer-card">
        <div id="countdown" class="countdown">00:25:00</div>

        <div class="time-controls">
          <button id="minusFive">−5</button>
          <input id="manualMinutes" type="number" min="1" max="600" value="25" />
          <button id="plusFive">+5</button>
          <span>minutes</span>
        </div>

        <div class="timer-actions">
          <button id="startPauseBtn" class="primary">Start</button>
          <button id="resetBtn">Reset</button>
          <button id="saveSessionBtn">Save Session</button>
        </div>
      </section>
    </main>

    <section class="quote-card">
      <p id="dailyQuote">“The impediment to action advances action.”</p>
      <span id="quoteAuthor">Marcus Aurelius</span>
    </section>

    <section class="spotify-bar">
      <div>
        <strong>Lofi Beats</strong>
        <p>Embedded Spotify player</p>
      </div>
      <iframe
        title="Spotify lofi beats"
        src="https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator"
        width="100%"
        height="80"
        frameborder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy">
      </iframe>
    </section>

    <section id="calendarPanel" class="calendar-panel hidden">
      <div class="calendar-header">
        <div>
          <h2>Planning Calendar</h2>
          <p id="monthLabel"></p>
        </div>
        <button id="closeCalendar" class="glass-btn">Close</button>
      </div>

      <div class="planner-inputs">
        <textarea id="lifeSchedule" placeholder="Describe your daily schedule. Example: school 8-3, gym 5-6, dinner 7..."></textarea>
        <textarea id="goalPlan" placeholder="Describe your goal. Example: learn JavaScript in 8 weeks..."></textarea>
        <input id="importantDate" type="date" />
        <input id="importantDateText" type="text" placeholder="Important date note" />
        <button id="generatePlan" class="primary">Generate Healthy Plan</button>
        <button id="addImportantDate">Add Date</button>
      </div>

      <div class="view-tabs">
        <button id="dotsViewBtn" class="active">Dot Month View</button>
        <button id="weekViewBtn">Weekly View</button>
      </div>

      <div class="today-summary">
        <div>
          <h3>Today’s Summary</h3>
          <p id="todaySummaryText">No plan yet. Add a goal or save a timer session.</p>
        </div>
        <div>
          <h3>Daily Affirmation</h3>
          <input id="affirmationInput" type="text" placeholder="I am consistent and focused." />
          <p id="affirmationDisplay"></p>
        </div>
        <div class="wisdom-box">
          <h3>Daily Wisdom</h3>
          <p id="wisdomText"></p>
        </div>
      </div>

      <div id="dotsView" class="calendar-dots"></div>

      <div id="coverFlow" class="cover-flow">
        <button id="prevDay">‹</button>
        <div id="dayCard" class="day-card"></div>
        <button id="nextDay">›</button>
      </div>

      <div id="weekView" class="week-view hidden"></div>
    </section>
  </div>

  <script src="script.js"></script>
</body>
</html>
'''

css = r'''* {
  box-sizing: border-box;
}

:root {
  --glass: rgba(255, 255, 255, 0.13);
  --glass-strong: rgba(255, 255, 255, 0.22);
  --white: #ffffff;
  --muted: rgba(255, 255, 255, 0.72);
  --blue: #58a6ff;
  --shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--white);
  background: #05070d;
  overflow-x: hidden;
}

.app {
  min-height: 100vh;
  position: relative;
  background-size: cover;
  background-position: center;
  transition: background-image 0.7s ease;
}

.shade {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 40%),
    linear-gradient(135deg, rgba(2, 5, 15, 0.58), rgba(0, 0, 0, 0.78));
  pointer-events: none;
}

.topbar,
.timer-screen,
.quote-card,
.spotify-bar,
.background-switcher,
.calendar-panel {
  position: relative;
  z-index: 2;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 24px;
}

.goal-box {
  display: grid;
  gap: 8px;
  width: min(360px, 55vw);
}

.goal-box label {
  color: var(--muted);
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

input,
textarea,
button {
  font: inherit;
}

.goal-box input,
.planner-inputs input,
.planner-inputs textarea,
.affirmationInput,
#affirmationInput {
  color: white;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(0,0,0,0.28);
  backdrop-filter: blur(18px);
  border-radius: 18px;
  outline: none;
  padding: 14px 16px;
}

.goal-box input::placeholder,
textarea::placeholder,
input::placeholder {
  color: rgba(255,255,255,0.52);
}

.glass-btn,
.timer-actions button,
.time-controls button,
.background-switcher button,
.view-tabs button,
.planner-inputs button,
.cover-flow button {
  color: white;
  border: 1px solid rgba(255,255,255,0.18);
  background: var(--glass);
  backdrop-filter: blur(18px);
  border-radius: 999px;
  padding: 12px 18px;
  cursor: pointer;
  transition: 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
  background: var(--glass-strong);
}

.primary {
  background: rgba(88, 166, 255, 0.92) !important;
  border-color: rgba(88, 166, 255, 0.4) !important;
}

.background-switcher {
  position: fixed;
  left: 20px;
  top: 46%;
  transform: translateY(-50%);
  display: grid;
  grid-template-columns: 44px 110px 44px;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 999px;
  background: rgba(0,0,0,0.22);
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow);
}

.background-switcher button {
  width: 44px;
  height: 44px;
  padding: 0;
  font-size: 1.8rem;
}

.background-switcher span {
  font-size: 0.8rem;
  text-align: center;
  color: var(--muted);
}

.timer-screen {
  min-height: 58vh;
  display: grid;
  place-items: center;
  padding: 40px 20px 130px;
}

.active-goal {
  position: absolute;
  top: 7%;
  font-size: clamp(1.2rem, 3vw, 2.2rem);
  font-weight: 700;
  text-align: center;
  text-shadow: 0 8px 24px rgba(0,0,0,0.7);
}

.timer-card {
  display: grid;
  gap: 28px;
  justify-items: center;
}

.countdown {
  font-size: clamp(4rem, 13vw, 11rem);
  font-weight: 800;
  letter-spacing: -0.08em;
  line-height: 0.9;
  text-shadow: 0 20px 60px rgba(0,0,0,0.7);
}

.time-controls,
.timer-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.time-controls input {
  width: 92px;
  text-align: center;
  color: white;
  border: none;
  border-radius: 999px;
  background: rgba(255,255,255,0.16);
  padding: 12px;
  outline: none;
}

.quote-card {
  position: fixed;
  left: 24px;
  bottom: 126px;
  max-width: 360px;
  padding: 18px;
  border-radius: 24px;
  background: rgba(0,0,0,0.25);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.14);
}

.quote-card p {
  margin: 0 0 8px;
  font-size: 0.95rem;
}

.quote-card span {
  color: var(--muted);
  font-size: 0.82rem;
}

.spotify-bar {
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  width: min(760px, calc(100vw - 32px));
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 12px;
  align-items: center;
  padding: 14px;
  border-radius: 28px;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.14);
  box-shadow: var(--shadow);
}

.spotify-bar p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 0.8rem;
}

.spotify-bar iframe {
  border-radius: 18px;
}

.calendar-panel {
  position: fixed;
  inset: 20px;
  overflow-y: auto;
  padding: 22px;
  border-radius: 34px;
  background: rgba(5, 7, 14, 0.9);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255,255,255,0.16);
  box-shadow: var(--shadow);
}

.hidden {
  display: none !important;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 16px;
}

.calendar-header h2 {
  margin: 0;
  font-size: 2rem;
}

.calendar-header p {
  margin: 6px 0 0;
  color: var(--muted);
}

.planner-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 20px 0;
}

.planner-inputs textarea {
  min-height: 88px;
  resize: vertical;
}

.view-tabs {
  display: flex;
  gap: 10px;
  margin: 18px 0;
}

.view-tabs .active {
  background: rgba(88,166,255,0.6);
}

.today-summary {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
  margin: 18px 0;
}

.today-summary > div,
.day-card,
.week-day {
  padding: 18px;
  border-radius: 24px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.14);
}

.today-summary h3 {
  margin: 0 0 8px;
}

.today-summary p {
  color: var(--muted);
}

.calendar-dots {
  display: grid;
  grid-template-columns: repeat(7, minmax(52px, 1fr));
  gap: 16px;
  margin: 24px 0;
  place-items: center;
}

.day-dot {
  width: 54px;
  height: 54px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #111827;
  background: white;
  font-weight: 800;
  cursor: pointer;
  position: relative;
  transition: 0.2s ease;
}

.day-dot.today {
  background: var(--blue);
  color: white;
}

.day-dot.has-events::after {
  content: "";
  position: absolute;
  bottom: 6px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #111827;
}

.day-dot:hover {
  width: 132px;
  height: 132px;
  z-index: 3;
  padding: 10px;
  font-size: 0.8rem;
  text-align: center;
  line-height: 1.2;
}

.day-dot:hover span {
  display: none;
}

.day-dot .hover-text {
  display: none;
}

.day-dot:hover .hover-text {
  display: block;
}

.cover-flow {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 18px;
  margin: 20px 0 26px;
}

.cover-flow button {
  font-size: 2rem;
  min-width: 52px;
}

.day-card {
  width: min(540px, 70vw);
  min-height: 160px;
  transform: perspective(900px) rotateY(0deg);
  animation: cardIn 0.25s ease;
}

@keyframes cardIn {
  from { opacity: 0; transform: perspective(900px) rotateY(-10deg) translateY(10px); }
  to { opacity: 1; transform: perspective(900px) rotateY(0deg) translateY(0); }
}

.week-view {
  display: grid;
  grid-template-columns: repeat(7, minmax(140px, 1fr));
  gap: 12px;
}

.week-day h4 {
  margin: 0 0 10px;
}

.week-day ul,
.day-card ul {
  padding-left: 18px;
  color: var(--muted);
}

@media (max-width: 860px) {
  .spotify-bar,
  .today-summary,
  .planner-inputs,
  .week-view {
    grid-template-columns: 1fr;
  }

  .background-switcher {
    position: relative;
    left: auto;
    top: auto;
    transform: none;
    margin: 0 auto;
    width: max-content;
  }

  .quote-card {
    position: relative;
    left: auto;
    bottom: auto;
    margin: 0 16px 120px;
  }

  .calendar-dots {
    grid-template-columns: repeat(4, 1fr);
  }
}
'''

js = r'''const backgrounds = [
  { name: "Aurora Lake", url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80" },
  { name: "Misty Forest", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=80" },
  { name: "Ocean Calm", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80" },
  { name: "Mountain Air", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=80" },
  { name: "Desert Glow", url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80" },
  { name: "Quiet Cabin", url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1800&q=80" },
  { name: "Moon Water", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=80" },
  { name: "Soft Clouds", url: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1800&q=80" },
  { name: "Green Valley", url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1800&q=80" },
  { name: "Night Sky", url: "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=1800&q=80" },
  { name: "Frozen Lake", url: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1800&q=80" },
  { name: "Golden Field", url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80" }
];

const quotes = [
  ["The impediment to action advances action.", "Marcus Aurelius"],
  ["We suffer more often in imagination than in reality.", "Seneca"],
  ["No man ever steps in the same river twice.", "Heraclitus"],
  ["Knowing yourself is the beginning of all wisdom.", "Aristotle"],
  ["The unexamined life is not worth living.", "Socrates"],
  ["First say to yourself what you would be; then do what you have to do.", "Epictetus"],
  ["Well begun is half done.", "Aristotle"],
  ["Luck is what happens when preparation meets opportunity.", "Seneca"],
  ["The soul becomes dyed with the color of its thoughts.", "Marcus Aurelius"],
  ["He who is not a good servant will not be a good master.", "Plato"],
  ["Waste no more time arguing what a good person should be. Be one.", "Marcus Aurelius"],
  ["Difficulties strengthen the mind, as labor does the body.", "Seneca"]
];

const $ = (id) => document.getElementById(id);
const app = $("app");
const countdown = $("countdown");
const manualMinutes = $("manualMinutes");
const goalInput = $("goalInput");
const activeGoal = $("activeGoal");

let bgIndex = Number(localStorage.getItem("bgIndex")) || 0;
let selectedDay = new Date().getDate();
let duration = 25 * 60;
let remaining = duration;
let timerId = null;
let isRunning = false;

const todayKey = () => new Date().toISOString().slice(0, 10);
const pad = (n) => String(n).padStart(2, "0");

function loadEvents() {
  return JSON.parse(localStorage.getItem("seleneEvents") || "{}");
}

function saveEvents(events) {
  localStorage.setItem("seleneEvents", JSON.stringify(events));
}

function dateKey(day = selectedDay) {
  const d = new Date();
  d.setDate(day);
  return d.toISOString().slice(0, 10);
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function renderTimer() {
  countdown.textContent = formatTime(remaining);
}

function setDuration(minutes) {
  const safe = Math.max(1, Math.min(600, Number(minutes) || 25));
  manualMinutes.value = safe;
  duration = safe * 60;
  if (!isRunning) {
    remaining = duration;
    renderTimer();
  }
}

function applyBackground() {
  const bg = backgrounds[bgIndex];
  app.style.backgroundImage = `url('${bg.url}')`;
  $("bgName").textContent = bg.name;
  localStorage.setItem("bgIndex", bgIndex);
}

function dailyQuote() {
  const dayNumber = Math.floor(Date.now() / 86400000);
  const [quote, author] = quotes[dayNumber % quotes.length];
  $("dailyQuote").textContent = `“${quote}”`;
  $("quoteAuthor").textContent = author;
  $("wisdomText").textContent = `“${quote}” — ${author}`;
}

function addEvent(key, text) {
  const events = loadEvents();
  events[key] = events[key] || [];
  events[key].push(text);
  saveEvents(events);
  renderCalendar();
}

function saveSession() {
  const goal = goalInput.value.trim() || "Timer session";
  const minutesUsed = Math.max(1, Math.round((duration - remaining) / 60));
  addEvent(todayKey(), `${goal} — ${minutesUsed} minute session`);
}

function startPause() {
  if (isRunning) {
    clearInterval(timerId);
    isRunning = false;
    $("startPauseBtn").textContent = "Start";
    return;
  }

  isRunning = true;
  $("startPauseBtn").textContent = "Pause";

  timerId = setInterval(() => {
    if (remaining <= 0) {
      clearInterval(timerId);
      isRunning = false;
      $("startPauseBtn").textContent = "Start";
      saveSession();
      alert("Timer complete. Session saved to your calendar.");
      return;
    }
    remaining--;
    renderTimer();
  }, 1000);
}

function renderCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const events = loadEvents();

  $("monthLabel").textContent = now.toLocaleString("default", { month: "long", year: "numeric" });

  const dots = $("dotsView");
  dots.innerHTML = "";

  for (let day = 1; day <= daysInMonth; day++) {
    const key = dateKey(day);
    const dayEvents = events[key] || [];
    const dot = document.createElement("button");
    dot.className = `day-dot ${day === today ? "today" : ""} ${dayEvents.length ? "has-events" : ""}`;
    dot.innerHTML = `<span>${day}</span><div class="hover-text">${dayEvents.length ? dayEvents.slice(0, 2).join("<br>") : "No timers yet"}</div>`;
    dot.onclick = () => {
      selectedDay = day;
      renderDayCard();
    };
    dots.appendChild(dot);
  }

  renderDayCard();
  renderWeekView();
  renderTodaySummary();
}

function renderDayCard() {
  const key = dateKey(selectedDay);
  const events = loadEvents()[key] || [];
  $("dayCard").innerHTML = `
    <h3>${new Date(key + "T12:00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</h3>
    ${events.length ? `<ul>${events.map(e => `<li>${e}</li>`).join("")}</ul>` : "<p>No plan yet. Add a goal, important date, or timer session.</p>"}
  `;
}

function renderWeekView() {
  const week = $("weekView");
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));

  const events = loadEvents();
  week.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const items = events[key] || [];
    const card = document.createElement("div");
    card.className = "week-day";
    card.innerHTML = `
      <h4>${d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}</h4>
      ${items.length ? `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>` : "<p>No events</p>"}
    `;
    week.appendChild(card);
  }
}

function renderTodaySummary() {
  const events = loadEvents()[todayKey()] || [];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.toISOString().slice(0, 10);
  const yEvents = loadEvents()[yKey] || [];

  $("todaySummaryText").textContent = events.length
    ? `Today you have ${events.length} item(s): ${events.join(" | ")}. ${yEvents.length ? "Try to beat yesterday by completing one more focused block." : "Start small and protect your first focused block."}`
    : "No plan yet today. Add one realistic focus block to build momentum.";
}

function generatePlan() {
  const schedule = $("lifeSchedule").value.trim();
  const goal = $("goalPlan").value.trim();

  if (!goal) {
    alert("Add a goal first.");
    return;
  }

  const planIdeas = [
    "Break goal into a 25 minute starter session",
    "Review progress and remove one distraction",
    "Complete one focused work block",
    "Take a recovery break and plan the next step",
    "Do one deeper 45 minute session",
    "Light review and organize next week",
    "Reset day: reflect, stretch, and prepare"
  ];

  const start = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const note = `${goal}: ${planIdeas[i]}${schedule ? " — planned around your schedule" : ""}`;
    addEvent(key, note);
  }
}

$("startPauseBtn").onclick = startPause;
$("resetBtn").onclick = () => {
  clearInterval(timerId);
  isRunning = false;
  $("startPauseBtn").textContent = "Start";
  remaining = duration;
  renderTimer();
};
$("saveSessionBtn").onclick = saveSession;

$("plusFive").onclick = () => setDuration(Number(manualMinutes.value) + 5);
$("minusFive").onclick = () => setDuration(Number(manualMinutes.value) - 5);
manualMinutes.onchange = () => setDuration(manualMinutes.value);

goalInput.oninput = () => {
  activeGoal.textContent = goalInput.value.trim();
};

$("prevBg").onclick = () => {
  bgIndex = (bgIndex - 1 + backgrounds.length) % backgrounds.length;
  applyBackground();
};

$("nextBg").onclick = () => {
  bgIndex = (bgIndex + 1) % backgrounds.length;
  applyBackground();
};

$("calendarToggle").onclick = () => $("calendarPanel").classList.remove("hidden");
$("closeCalendar").onclick = () => $("calendarPanel").classList.add("hidden");

$("dotsViewBtn").onclick = () => {
  $("dotsViewBtn").classList.add("active");
  $("weekViewBtn").classList.remove("active");
  $("dotsView").classList.remove("hidden");
  $("coverFlow").classList.remove("hidden");
  $("weekView").classList.add("hidden");
};

$("weekViewBtn").onclick = () => {
  $("weekViewBtn").classList.add("active");
  $("dotsViewBtn").classList.remove("active");
  $("weekView").classList.remove("hidden");
  $("dotsView").classList.add("hidden");
  $("coverFlow").classList.add("hidden");
};

$("prevDay").onclick = () => {
  selectedDay = Math.max(1, selectedDay - 1);
  renderDayCard();
};

$("nextDay").onclick = () => {
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  selectedDay = Math.min(daysInMonth, selectedDay + 1);
  renderDayCard();
};

$("generatePlan").onclick = generatePlan;

$("addImportantDate").onclick = () => {
  const date = $("importantDate").value;
  const text = $("importantDateText").value.trim();
  if (!date || !text) {
    alert("Choose a date and add a note.");
    return;
  }
  addEvent(date, text);
};

$("affirmationInput").oninput = () => {
  const value = $("affirmationInput").value;
  $("affirmationDisplay").textContent = value;
  localStorage.setItem("affirmation", value);
};

function init() {
  applyBackground();
  dailyQuote();
  setDuration(25);
  renderCalendar();
  const savedAffirmation = localStorage.getItem("affirmation") || "I can make steady progress one focused block at a time.";
  $("affirmationInput").value = savedAffirmation;
  $("affirmationDisplay").textContent = savedAffirmation;
}

init();
'''

(base / "index.html").write_text(html)
(base / "styles.css").write_text(css)
(base / "script.js").write_text(js)

# Also create a zip for easy download
import zipfile
zip_path = Path("/mnt/data/selene_timer_app.zip")
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for file in base.iterdir():
        z.write(file, arcname=file.name)

print(f"Created files in {base}")
print(f"ZIP: {zip_path}")
