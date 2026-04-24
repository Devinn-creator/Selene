const backgrounds = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=80"
];

const quotes = [
  "Marcus Aurelius: You have power over your mind — not outside events. Realize this, and you will find strength.",
  "Seneca: It is not that we have a short time to live, but that we waste much of it.",
  "Aristotle: We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  "Socrates: The secret of change is to focus all of your energy not on fighting the old, but building the new.",
  "Epictetus: First say to yourself what you would be; then do what you have to do.",
  "Plato: The beginning is the most important part of the work.",
  "Lao Tzu: The journey of a thousand miles begins with one step.",
  "Confucius: It does not matter how slowly you go as long as you do not stop.",
  "Nietzsche: He who has a why to live can bear almost any how.",
  "Thoreau: Success usually comes to those who are too busy to be looking for it.",
  "Emerson: The only person you are destined to become is the person you decide to be.",
  "Heraclitus: Day by day, what you choose, what you think, and what you do is who you become."
];

let backgroundIndex = 0;
let totalSeconds = 25 * 60;
let startingSeconds = totalSeconds;
let timer = null;
let currentGoal = "";

const backgroundLayer = document.getElementById("backgroundLayer");
const timerDisplay = document.getElementById("timerDisplay");
const minuteInput = document.getElementById("minuteInput");
const goalInput = document.getElementById("goalInput");
const goalDisplay = document.getElementById("goalDisplay");
const calendarPanel = document.getElementById("calendarPanel");
const calendarGrid = document.getElementById("calendarGrid");
const monthTitle = document.getElementById("monthTitle");

function loadBackground() {
  backgroundLayer.style.backgroundImage = `url("${backgrounds[backgroundIndex]}")`;
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(secs).padStart(2, "0")
  );
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(totalSeconds);
}

function setTimerFromInput() {
  const minutes = Math.max(1, Number(minuteInput.value));
  totalSeconds = minutes * 60;
  startingSeconds = totalSeconds;
  updateTimerDisplay();
}

function startTimer() {
  if (timer) return;

  timer = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      updateTimerDisplay();
    } else {
      clearInterval(timer);
      timer = null;
      saveTimerSession();
      alert("Timer finished. Session saved to calendar.");
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  timer = null;
}

function resetTimer() {
  pauseTimer();
  setTimerFromInput();
}

function saveTimerSession() {
  const today = new Date();
  const key = today.toISOString().split("T")[0];

  const sessions = JSON.parse(localStorage.getItem("focusTimerSessions")) || {};

  if (!sessions[key]) {
    sessions[key] = [];
  }

  sessions[key].push({
    goal: currentGoal || "Focus session",
    minutes: Math.round(startingSeconds / 60)
  });

  localStorage.setItem("focusTimerSessions", JSON.stringify(sessions));
  buildCalendar();
}

function buildCalendar() {
  calendarGrid.innerHTML = "";

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  monthTitle.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const sessions = JSON.parse(localStorage.getItem("focusTimerSessions")) || {};

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "empty";
    calendarGrid.appendChild(empty);
  }

  for (let day = 1; day <= totalDays; day++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const daySessions = sessions[key] || [];

    const circle = document.createElement("div");
    circle.className = "dayCircle";

    if (day === today) {
      circle.classList.add("today");
    }

    const info = daySessions.length
      ? daySessions.map(session => `${session.minutes} min — ${session.goal}`).join(" ")
      : "No timers used";

    circle.innerHTML = `
      <span class="num">${day}</span>
      <span class="info">${info}</span>
    `;

    calendarGrid.appendChild(circle);
  }
}

function setDailyQuote() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date() - start;
  const dayNumber = Math.floor(diff / 86400000);

  document.getElementById("dailyQuote").textContent =
    quotes[dayNumber % quotes.length];
}

/* BACKGROUND BUTTONS */
document.getElementById("prevBackground").addEventListener("click", () => {
  backgroundIndex--;

  if (backgroundIndex < 0) {
    backgroundIndex = backgrounds.length - 1;
  }

  loadBackground();
});

document.getElementById("nextBackground").addEventListener("click", () => {
  backgroundIndex++;

  if (backgroundIndex >= backgrounds.length) {
    backgroundIndex = 0;
  }

  loadBackground();
});

/* TIMER INPUT BUTTONS */
document.getElementById("plusFive").addEventListener("click", () => {
  minuteInput.value = Number(minuteInput.value) + 5;
  setTimerFromInput();
});

document.getElementById("minusFive").addEventListener("click", () => {
  minuteInput.value = Math.max(1, Number(minuteInput.value) - 5);
  setTimerFromInput();
});

minuteInput.addEventListener("input", setTimerFromInput);

/* TIMER CONTROL BUTTONS */
document.getElementById("startTimer").addEventListener("click", startTimer);
document.getElementById("pauseTimer").addEventListener("click", pauseTimer);
document.getElementById("resetTimer").addEventListener("click", resetTimer);

/* GOAL */
document.getElementById("setGoalBtn").addEventListener("click", () => {
  currentGoal = goalInput.value.trim();

  if (currentGoal) {
    goalDisplay.textContent = currentGoal;
  } else {
    goalDisplay.textContent = "";
  }
});

/* CALENDAR */
document.getElementById("calendarToggle").addEventListener("click", () => {
  calendarPanel.classList.remove("hidden");
  buildCalendar();
});

document.getElementById("closeCalendar").addEventListener("click", () => {
  calendarPanel.classList.add("hidden");
});

/* INITIAL LOAD */
loadBackground();
setTimerFromInput();
setDailyQuote();
buildCalendar();
