document.addEventListener("DOMContentLoaded", () => {
  console.log("SELENE JS LOADED");

  const timerDisplay = document.getElementById("timerDisplay");
  const minutesInput = document.getElementById("minutesInput");
  const goalInput = document.getElementById("goalInput");
  const goalDisplay = document.getElementById("goalDisplay");
  const calendarPanel = document.getElementById("calendarPanel");
  const calendarGrid = document.getElementById("calendarGrid");
  const monthTitle = document.getElementById("monthTitle");
  const selectedDateTitle = document.getElementById("selectedDateTitle");
  const selectedEvents = document.getElementById("selectedEvents");
  const quoteText = document.getElementById("quoteText");

  let minutes = 25;
  let secondsLeft = minutes * 60;
  let interval = null;

  const quotes = [
    "Marcus Aurelius: You have power over your mind, not outside events.",
    "Seneca: We suffer more often in imagination than in reality.",
    "Aristotle: Excellence is not an act, but a habit.",
    "Plato: The beginning is the most important part of the work.",
    "Epictetus: First say what you would be; then do what you have to do.",
    "Lao Tzu: The journey of a thousand miles begins with one step."
  ];

  function getSessions() {
    return JSON.parse(localStorage.getItem("seleneSessions")) || {};
  }

  function saveSessions(data) {
    localStorage.setItem("seleneSessions", JSON.stringify(data));
  }

  function todayKey() {
    return new Date().toISOString().split("T")[0];
  }

  function formatTime(total) {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function updateDisplay() {
    timerDisplay.textContent = formatTime(secondsLeft);
  }

  function setTimer(newMinutes) {
    clearInterval(interval);
    interval = null;
    minutes = Math.max(1, Number(newMinutes));
    secondsLeft = minutes * 60;
    minutesInput.value = minutes;
    updateDisplay();
  }

  function saveSession() {
    const data = getSessions();
    const key = todayKey();

    if (!data[key]) data[key] = [];

    data[key].push({
      goal: goalInput.value.trim() || "Focus session",
      minutes: minutes
    });

    saveSessions(data);
    buildCalendar();
  }

  function startTimer() {
    if (interval) return;

    interval = setInterval(() => {
      if (secondsLeft > 0) {
        secondsLeft--;
        updateDisplay();
      } else {
        clearInterval(interval);
        interval = null;
        saveSession();
        alert("Session complete. Saved to calendar.");
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(interval);
    interval = null;
  }

  function resetTimer() {
    setTimer(minutesInput.value);
  }

  function showDateInfo(key, label) {
    const data = getSessions();
    const sessions = data[key] || [];

    selectedDateTitle.textContent = label;
    selectedEvents.innerHTML = "";

    if (sessions.length === 0) {
      selectedEvents.innerHTML = "<li>No events</li>";
      return;
    }

    sessions.forEach(session => {
      const li = document.createElement("li");
      li.textContent = `${session.minutes} min — ${session.goal}`;
      selectedEvents.appendChild(li);
    });
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
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data = getSessions();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div");
      calendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dateLabel = `${monthNames[month]} ${day}, ${year}`;

      const div = document.createElement("button");
      div.className = "day";
      div.textContent = day;

      if (day === today) div.classList.add("today");
      if (data[key] && data[key].length) div.classList.add("has-session");

      div.addEventListener("click", () => {
        showDateInfo(key, dateLabel);
      });

      div.addEventListener("mouseenter", () => {
        showDateInfo(key, dateLabel);
      });

      calendarGrid.appendChild(div);
    }

    const todayCalendarKey = todayKey();
    showDateInfo(todayCalendarKey, `${monthNames[month]} ${today}, ${year}`);
  }

  function setQuote() {
    const start = new Date(new Date().getFullYear(), 0, 0);
    const day = Math.floor((new Date() - start) / 86400000);
    quoteText.textContent = quotes[day % quotes.length];
  }

  document.getElementById("startBtn").addEventListener("click", startTimer);
  document.getElementById("pauseBtn").addEventListener("click", pauseTimer);
  document.getElementById("resetBtn").addEventListener("click", resetTimer);

  document.getElementById("plusFive").addEventListener("click", () => {
    setTimer(Number(minutesInput.value) + 5);
  });

  document.getElementById("minusFive").addEventListener("click", () => {
    setTimer(Number(minutesInput.value) - 5);
  });

  minutesInput.addEventListener("change", () => {
    setTimer(minutesInput.value);
  });

  goalInput.addEventListener("input", () => {
    goalDisplay.textContent = goalInput.value.trim() || "Ready to focus?";
  });

  document.getElementById("calendarBtn").addEventListener("click", () => {
    calendarPanel.classList.remove("hidden");
    buildCalendar();
  });

  document.getElementById("closeCalendar").addEventListener("click", () => {
    calendarPanel.classList.add("hidden");
  });

  updateDisplay();
  buildCalendar();
  setQuote();
});
