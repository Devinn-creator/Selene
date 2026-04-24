const backgrounds = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80"
];

const quotes = [
  "Socrates: The secret of change is to focus all your energy not on fighting the old, but building the new.",
  "Aristotle: We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  "Marcus Aurelius: You have power over your mind, not outside events.",
  "Seneca: It is not that we have a short time to live, but that we waste much of it.",
  "Epictetus: First say to yourself what you would be; then do what you have to do.",
  "Plato: The beginning is the most important part of the work.",
  "Lao Tzu: The journey of a thousand miles begins with one step.",
  "Confucius: It does not matter how slowly you go as long as you do not stop.",
  "Nietzsche: He who has a why to live can bear almost any how.",
  "Kant: Act as if what you do makes a difference. It does.",
  "Thoreau: Success usually comes to those who are too busy to be looking for it.",
  "Ralph Waldo Emerson: The only person you are destined to become is the person you decide to be."
];

let bgIndex = 0;
let timerSeconds = 25 * 60;
let originalSeconds = timerSeconds;
let timerInterval = null;
let currentGoal = "";

const body = document.body;
const timerDisplay = document.getElementById("timerDisplay");
const customMinutes = document.getElementById("customMinutes");
const goalInput = document.getElementById("goalInput");
const goalDisplay = document.getElementById("goalDisplay");
const calendarPanel = document.getElementById("calendarPanel");
const calendarGrid = document.getElementById("calendarGrid");
const monthTitle = document.getElementById("monthTitle");
const audioPlayer = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");

function setBackground() {
  body.style.backgroundImage = `url('${backgrounds[bgIndex]}')`;
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(timerSeconds);
}

function setTimerFromInput() {
  const minutes = Math.max(1, Number(customMinutes.value));
  timerSeconds = minutes * 60;
  originalSeconds = timerSeconds;
  updateDisplay();
}

function saveTimerSession() {
  const today = new Date().toISOString().split("T")[0];
  const sessions = JSON.parse(localStorage.getItem("timerSessions")) || {};

  if (!sessions[today]) {
    sessions[today] = [];
  }

  sessions[today].push({
    goal: currentGoal || "Focus session",
    duration: Math.round(originalSeconds / 60)
  });

  localStorage.setItem("timerSessions", JSON.stringify(sessions));
  buildCalendar();
}

function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      updateDisplay();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      saveTimerSession();
      alert("Timer complete. Great work.");
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  pauseTimer();
  setTimerFromInput();
}

function buildCalendar() {
  calendarGrid.innerHTML = "";

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayDate = now.getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  monthTitle.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const sessions = JSON.parse(localStorage.getItem("timerSessions")) || {};

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "empty-day";
    calendarGrid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const daySessions = sessions[dateKey] || [];

    const circle = document.createElement("div");
    circle.className = "day-circle";

    if (day === todayDate) {
      circle.classList.add("today");
    }

    const sessionText = daySessions.length
      ? daySessions.map(s => `${s.duration} min: ${s.goal}`).join(" | ")
      : "No timers yet";

    circle.innerHTML = `
      <span class="day-num">${day}</span>
      <span class="day-info">${sessionText}</span>
    `;

    calendarGrid.appendChild(circle);
  }
}

function setDailyQuote() {
  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );

  document.getElementById("dailyQuote").textContent =
    quotes[dayOfYear % quotes.length];
}

document.getElementById("prevBg").addEventListener("click", () => {
  bgIndex = (bgIndex - 1 + backgrounds.length) % backgrounds.length;
  setBackground();
});

document.getElementById("nextBg").addEventListener("click", () => {
  bgIndex = (bgIndex + 1) % backgrounds.length;
  setBackground();
});

document.getElementById("plusFive").addEventListener("click", () => {
  customMinutes.value = Number(customMinutes.value) + 5;
  setTimerFromInput();
});

document.getElementById("minusFive").addEventListener("click", () => {
  customMinutes.value = Math.max(1, Number(customMinutes.value) - 5);
  setTimerFromInput();
});

customMinutes.addEventListener("input", setTimerFromInput);

document.getElementById("saveGoalBtn").addEventListener("click", () => {
  currentGoal = goalInput.value.trim();
  goalDisplay.textContent = currentGoal;
});

document.getElementById("startBtn").addEventListener("click", startTimer);
document.getElementById("pauseBtn").addEventListener("click", pauseTimer);
document.getElementById("resetBtn").addEventListener("click", resetTimer);

document.getElementById("calendarBtn").addEventListener("click", () => {
  calendarPanel.classList.toggle("hidden");
  buildCalendar();
});

document.getElementById("closeCalendar").addEventListener("click", () => {
  calendarPanel.classList.add("hidden");
});

playBtn.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playBtn.textContent = "⏸";
  } else {
    audioPlayer.pause();
    playBtn.textContent = "▶";
  }
});

document.querySelector(".spotify-bar input").addEventListener("input", e => {
  audioPlayer.volume = e.target.value / 100;
});

setBackground();
setTimerFromInput();
buildCalendar();
setDailyQuote();
