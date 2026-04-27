const SUPABASE_URL = "https://kjlvwptfpyeknffciuyd.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbHZ3cHRmcHlla25mZmNpdXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNTE1NTQsImV4cCI6MjA5MjYyNzU1NH0.IkTStAFr90vOTiqaDzokyW22QuNY0hgmtwOTf_KBv_U";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

let currentUser = null;

const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");
const signOutBtn = document.getElementById("sign-out-btn");
const authMessage = document.getElementById("auth-message");

function showMessage(message) {
  authMessage.textContent = message;
}

function showApp() {
  authSection.classList.add("hidden");
  appSection.classList.remove("hidden");
  signOutBtn.classList.remove("hidden");
}

function showAuth() {
  authSection.classList.remove("hidden");
  appSection.classList.add("hidden");
  signOutBtn.classList.add("hidden");
}

async function signUp() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showMessage("Enter an email and password.");
    return;
  }

  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
  });

  if (error) {
    showMessage(error.message);
    return;
  }

  showMessage("Account created. Check your email to confirm it.");
}

async function signIn() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showMessage("Enter your email and password.");
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    showMessage(error.message);
    return;
  }

  currentUser = data.user;
  showApp();
  loadGoals();
  loadEvents();
}

async function signOut() {
  await supabaseClient.auth.signOut();
  currentUser = null;
  showAuth();
}

async function checkSession() {
  const { data } = await supabaseClient.auth.getSession();

  if (data.session) {
    currentUser = data.session.user;
    showApp();
    loadGoals();
    loadEvents();
  } else {
    showAuth();
  }
}

async function addGoal() {
  const input = document.getElementById("goal-input");
  const text = input.value.trim();

  if (!text) return;

  const { error } = await supabaseClient.from("goals").insert([
    {
      text,
      user_id: currentUser.id,
    },
  ]);

  if (error) {
    alert(error.message);
    return;
  }

  input.value = "";
  loadGoals();
}

async function loadGoals() {
  const { data, error } = await supabaseClient
    .from("goals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    alert(error.message);
    return;
  }

  const list = document.getElementById("goals-list");
  list.innerHTML = "";

  data.forEach((goal) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div>${goal.text}</div>
      <button class="delete-btn" onclick="deleteGoal('${goal.id}')">
        Delete
      </button>
    `;

    list.appendChild(li);
  });
}

async function deleteGoal(id) {
  const { error } = await supabaseClient
    .from("goals")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  loadGoals();
}

async function addEvent() {
  const title = document.getElementById("event-title").value.trim();
  const date = document.getElementById("event-date").value;
  const description = document.getElementById("event-description").value.trim();

  if (!title || !date) {
    alert("Add an event title and date.");
    return;
  }

  const { error } = await supabaseClient.from("events").insert([
    {
      title,
      event_date: date,
      description,
      user_id: currentUser.id,
    },
  ]);

  if (error) {
    alert(error.message);
    return;
  }

  document.getElementById("event-title").value = "";
  document.getElementById("event-date").value = "";
  document.getElementById("event-description").value = "";

  loadEvents();
}

async function loadEvents() {
  const { data, error } = await supabaseClient
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) {
    alert(error.message);
    return;
  }

  const list = document.getElementById("events-list");
  list.innerHTML = "";

  data.forEach((event) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="event-date">${event.event_date}</div>
      <strong>${event.title}</strong>
      <p>${event.description || ""}</p>
      <button class="delete-btn" onclick="deleteEvent('${event.id}')">
        Delete
      </button>
    `;

    list.appendChild(li);
  });
}

async function deleteEvent(id) {
  const { error } = await supabaseClient
    .from("events")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  loadEvents();
}

let timerSeconds = 25 * 60;
let timerInterval = null;

const timerDisplay = document.getElementById("timerDisplay");
const timerMinutes = document.getElementById("timerMinutes");

function updateTimerDisplay() {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;

  timerDisplay.textContent =
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0");
}

function setTimerFromInput() {
  const minutes = Number(timerMinutes.value);

  if (minutes < 1) {
    timerMinutes.value = 1;
    timerSeconds = 60;
  } else {
    timerSeconds = minutes * 60;
  }

  updateTimerDisplay();
}

function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      alert("Timer complete.");
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

document.getElementById("sign-up-btn").addEventListener("click", signUp);
document.getElementById("sign-in-btn").addEventListener("click", signIn);
document.getElementById("sign-out-btn").addEventListener("click", signOut);

document.getElementById("add-goal-btn").addEventListener("click", addGoal);
document.getElementById("add-event-btn").addEventListener("click", addEvent);

document.getElementById("startTimer").addEventListener("click", startTimer);
document.getElementById("pauseTimer").addEventListener("click", pauseTimer);
document.getElementById("resetTimer").addEventListener("click", resetTimer);

document.getElementById("plusFive").addEventListener("click", () => {
  timerMinutes.value = Number(timerMinutes.value) + 5;
  setTimerFromInput();
});

document.getElementById("minusFive").addEventListener("click", () => {
  timerMinutes.value = Math.max(1, Number(timerMinutes.value) - 5);
  setTimerFromInput();
});

timerMinutes.addEventListener("change", setTimerFromInput);

checkSession();
