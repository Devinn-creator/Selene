document.addEventListener("DOMContentLoaded", () => {
  console.log("FocusFlow app loaded");

  const modes = document.querySelectorAll(".mode");
  const timerDisplay = document.getElementById("timerDisplay");
  const minutesInput = document.getElementById("minutesInput");
  const goalInput = document.getElementById("goalInput");
  const goalDisplay = document.getElementById("goalDisplay");
  const calendarBtn = document.getElementById("calendarBtn");
  const calendarPanel = document.getElementById("calendarPanel");
  const closeCalendar = document.getElementById("closeCalendar");
  const calendarGrid = document.getElementById("calendarGrid");
  const monthTitle = document.getElementById("monthTitle");
  const sessionCount = document.getElementById("sessionCount");
  const totalMinutes = document.getElementById("totalMinutes");
  const streakCount = document.getElementById("streakCount");
  const quoteText = document.getElementById("quoteText");

  let activeMinutes = 25;
  let secondsLeft = activeMinutes * 60;
  let timer = null;
  let running = false;

  const quotes = [
    "Marcus Aurelius: You have power over your mind — not outside events.",
    "Seneca: It is not that we have a short time, but that we waste much of it.",
    "Aristotle: We are what we repeatedly do. Excellence is a habit.",
    "Socrates: The secret of change is to focus your energy on building the new.",
    "Epictetus: First say what you would be; then do what you have to do.",
    "Plato: The beginning is the most important part of the work.",
    "Lao Tzu: The journey of a thousand miles begins with one step.",
    "Confucius: It does not matter how slowly you go as long as you do not stop."
  ];

  function getSessions() {
    return JSON.parse(localStorage.getItem("focusFlowSessions")) || {};
  }

  function saveSessions(sessions) {
    localStorage.setItem("focusFlowSessions", JSON.stringify(sessions));
  }

  function todayKey() {
    return new Date().toISOString().split("T")[0];
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function updateDisplay() {
    timerDisplay.textContent = formatTime(secondsLeft);
  }

  function setTimer(minutes) {
    clearInterval(timer);
    timer = null;
    running = false;

    activeMinutes = Math.max(1, Number(minutes));
    secondsLeft = activeMinutes * 60;
    minutesInput.value = activeMinutes;

    document.getElementById("startBtn").textContent = "start";
    updateDisplay();
  }

  function saveSession() {
    const sessions = getSessions();
    const key = todayKey();

    if (!sessions[key]) sessions[key] = [];

    sessions[key].push({
      goal: goalInput.value.trim() || "Focus session",
      minutes: activeMinutes,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    });

    saveSessions(sessions);
    buildCalendar();
    updateStats();
  }

  function startTimer() {
    if (running) return;

    running = true;
    document.getElementById("startBtn").textContent = "running";

    timer = setInterval(() => {
      if (secondsLeft > 0) {
        secondsLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        timer = null;
        running = false;
        document.getElementById("startBtn").textContent = "start";
        saveSession();
        alert("Session complete. Saved to calendar.");
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timer);
    timer = null;
    running = false;
    document.getElementById("startBtn").textContent = "start";
  }

  function resetTimer() {
    setTimer(activeMinutes);
  }

  function updateStats() {
    const sessions = getSessions();
    let count = 0;
    let minutes = 0;

    Object.values(sessions).forEach(day => {
      day.forEach(session => {
        count++;
        minutes += Number(session.minutes);
      });
    });

    sessionCount.textContent = count;
    totalMinutes.textContent = minutes;

    let streak = 0;
    const date = new Date();

    while (true) {
      const key = date.toISOString().split("T")[0];
      if (sessions[key] && sessions[key].length > 0) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }

    streakCount.textContent = streak;
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
    const sessions = getSessions();

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

      if (day === today) div.classList.add("today");
      if (daySessions.length > 0) div.classList.add("has-session");

      const info = daySessions.length
        ? daySessions.map(s => `${s.minutes}m ${s.goal}`).join(" • ")
        : "No sessions";

      div.innerHTML = `
        <span class="num">${day}</span>
        <span class="info">${info}</span>
      `;

      calendarGrid.appendChild(div);
    }
  }

  function setQuote() {
    const start = new Date(new Date().getFullYear(), 0, 0);
    const day = Math.floor((new Date() - start) / 86400000);
    quoteText.textContent = quotes[day % quotes.length];
  }

  modes.forEach(mode => {
    mode.addEventListener("click", () => {
      modes.forEach(btn => btn.classList.remove("active"));
      mode.classList.add("active");
      setTimer(Number(mode.dataset.minutes));
    });
  });

  document.getElementById("plusFive").addEventListener("click", () => {
    setTimer(Number(minutesInput.value) + 5);
  });

  document.getElementById("minusFive").addEventListener("click", () => {
    setTimer(Math.max(1, Number(minutesInput.value) - 5));
  });

  minutesInput.addEventListener("change", () => {
    setTimer(Number(minutesInput.value));
  });

  goalInput.addEventListener("input", () => {
    const text = goalInput.value.trim();
    goalDisplay.textContent = text || "Ready to focus?";
  });

  document.getElementById("startBtn").addEventListener("click", startTimer);
  document.getElementById("pauseBtn").addEventListener("click", pauseTimer);
  document.getElementById("resetBtn").addEventListener("click", resetTimer);

  calendarBtn.addEventListener("click", () => {
    calendarPanel.classList.toggle("hidden");
    buildCalendar();
  });

  closeCalendar.addEventListener("click", () => {
    calendarPanel.classList.add("hidden");
  });

  updateDisplay();
  buildCalendar();
  updateStats();
  setQuote();
});
