document.addEventListener("DOMContentLoaded", function () {
  console.log("script.js loaded");

  const backgrounds = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=80",
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=80",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=80",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1800&q=80",
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1800&q=80",
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=80",
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1800&q=80"
  ];

  const quotes = [
    "Marcus Aurelius: You have power over your mind — not outside events.",
    "Seneca: It is not that we have a short time, but that we waste much of it.",
    "Aristotle: We are what we repeatedly do. Excellence is a habit.",
    "Socrates: The secret of change is to focus your energy on building the new.",
    "Epictetus: First say to yourself what you would be; then do what you have to do.",
    "Plato: The beginning is the most important part of the work.",
    "Lao Tzu: The journey of a thousand miles begins with one step.",
    "Confucius: It does not matter how slowly you go as long as you do not stop.",
    "Nietzsche: He who has a why can bear almost any how.",
    "Thoreau: Success comes to those who are too busy to look for it.",
    "Emerson: Become the person you decide to be.",
    "Heraclitus: Day by day, what you choose is who you become."
  ];

  let bgIndex = 0;
  let totalSeconds = 25 * 60;
  let startingSeconds = totalSeconds;
  let interval = null;
  let currentGoal = "";

  const bg = document.getElementById("bg");
  const timerDisplay = document.getElementById("timerDisplay");
  const minuteInput = document.getElementById("minuteInput");
  const goalInput = document.getElementById("goalInput");
  const goalDisplay = document.getElementById("goalDisplay");
  const calendarPanel = document.getElementById("calendarPanel");
  const calendarGrid = document.getElementById("calendarGrid");
  const monthTitle = document.getElementById("monthTitle");
  const quoteText = document.getElementById("quoteText");

  function setBackground() {
    bg.style.backgroundImage = `url("${backgrounds[bgIndex]}")`;
  }

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function updateTimer() {
    timerDisplay.textContent = formatTime(totalSeconds);
  }

  function setTimerFromInput() {
    const minutes = Math.max(1, Number(minuteInput.value || 1));
    totalSeconds = minutes * 60;
    startingSeconds = totalSeconds;
    updateTimer();
  }

  function saveSession() {
    const key = new Date().toISOString().split("T")[0];
    const sessions = JSON.parse(localStorage.getItem("flowTimerSessions")) || {};

    if (!sessions[key]) {
      sessions[key] = [];
    }

    sessions[key].push({
      goal: currentGoal || "Focus session",
      minutes: Math.round(startingSeconds / 60)
    });

    localStorage.setItem("flowTimerSessions", JSON.stringify(sessions));
    buildCalendar();
  }

  function startTimer() {
    if (interval) return;

    interval = setInterval(function () {
      if (totalSeconds > 0) {
        totalSeconds--;
        updateTimer();
      } else {
        clearInterval(interval);
        interval = null;
        saveSession();
        alert("Timer complete. Saved to calendar.");
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(interval);
    interval = null;
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
    const today = now.getDate();

    const names = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    monthTitle.textContent = `${names[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const sessions = JSON.parse(localStorage.getItem("flowTimerSessions")) || {};

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div");
      empty.className = "empty";
      calendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const daySessions = sessions[key] || [];

      const div = document.createElement("div");
      div.className = "day";

      if (day === today) {
        div.classList.add("today");
      }

      const info = daySessions.length
        ? daySessions.map(s => `${s.minutes} min — ${s.goal}`).join(" | ")
        : "No timers used";

      div.innerHTML = `
        <span class="num">${day}</span>
        <span class="info">${info}</span>
      `;

      calendarGrid.appendChild(div);
    }
  }

  function setQuote() {
    const start = new Date(new Date().getFullYear(), 0, 0);
    const diff = new Date() - start;
    const day = Math.floor(diff / 86400000);
    quoteText.textContent = quotes[day % quotes.length];
  }

  document.getElementById("prevBg").addEventListener("click", function () {
    bgIndex = (bgIndex - 1 + backgrounds.length) % backgrounds.length;
    setBackground();
  });

  document.getElementById("nextBg").addEventListener("click", function () {
    bgIndex = (bgIndex + 1) % backgrounds.length;
    setBackground();
  });

  document.getElementById("plusFive").addEventListener("click", function () {
    minuteInput.value = Number(minuteInput.value || 0) + 5;
    setTimerFromInput();
  });

  document.getElementById("minusFive").addEventListener("click", function () {
    minuteInput.value = Math.max(1, Number(minuteInput.value || 1) - 5);
    setTimerFromInput();
  });

  minuteInput.addEventListener("input", setTimerFromInput);

  document.getElementById("startBtn").addEventListener("click", startTimer);
  document.getElementById("pauseBtn").addEventListener("click", pauseTimer);
  document.getElementById("resetBtn").addEventListener("click", resetTimer);

  document.getElementById("setGoalBtn").addEventListener("click", function () {
    currentGoal = goalInput.value.trim();
    goalDisplay.textContent = currentGoal || "Ready to focus?";
  });

  document.getElementById("calendarBtn").addEventListener("click", function () {
    calendarPanel.classList.toggle("hidden");
    buildCalendar();
  });

  document.getElementById("closeCalendar").addEventListener("click", function () {
    calendarPanel.classList.add("hidden");
  });

  setBackground();
  setTimerFromInput();
  setQuote();
  buildCalendar();
});
