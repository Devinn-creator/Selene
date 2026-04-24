// Configuration
const backgrounds = [
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    'https://images.unsplash.com/photo-1506744038736-83398870ed93',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
    'https://images.unsplash.com/photo-1433086566280-608bd7d53e1e',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
    'https://images.unsplash.com/photo-1426604966149-7a1c002221ba'
];

const quotes = [
    { text: "Very little is needed to make a happy life.", author: "Marcus Aurelius" },
    { text: "He who is brave is free.", author: "Seneca" },
    { text: "The mind is everything. What you think you become.", author: "Buddha" }
];

let currentBgIndex = 0;
let timerInterval;
let totalSeconds = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateBackground();
    generateCalendar();
    rotateQuote();
    
    // Event Listeners
    document.getElementById('nextBg').onclick = () => { currentBgIndex = (currentBgIndex + 1) % 12; updateBackground(); };
    document.getElementById('prevBg').onclick = () => { currentBgIndex = (currentBgIndex - 1 + 12) % 12; updateBackground(); };
    document.getElementById('startBtn').onclick = toggleTimer;
    document.getElementById('resetBtn').onclick = resetTimer;
});

function updateBackground() {
    document.body.style.backgroundImage = `url('${backgrounds[currentBgIndex]}?auto=format&fit=crop&w=1920&q=80')`;
}

function generateCalendar() {
    const track = document.getElementById('calendar-track');
    const today = new Date().getDate();
    for (let i = 1; i <= 7; i++) {
        const circle = document.createElement('div');
        circle.className = `day-circle ${i === today % 7 ? 'current' : ''}`;
        circle.innerText = i;
        track.appendChild(circle);
    }
}

function adjustTime(mins) {
    let m = parseInt(document.getElementById('manualMins').value) || 0;
    document.getElementById('manualMins').value = Math.max(0, m + mins);
}

function toggleTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById('startBtn').innerText = "Start";
    } else {
        const h = parseInt(document.getElementById('manualHours').value) || 0;
        const m = parseInt(document.getElementById('manualMins').value) || 0;
        const s = parseInt(document.getElementById('manualSecs').value) || 0;
        
        if (totalSeconds <= 0) totalSeconds = (h * 3600) + (m * 60) + s;
        
        document.getElementById('activeGoal').innerText = document.getElementById('goalInput').value;
        
        timerInterval = setInterval(() => {
            if (totalSeconds <= 0) {
                clearInterval(timerInterval);
                alert("Time is up!");
                return;
            }
            totalSeconds--;
            updateDisplay();
        }, 1000);
        document.getElementById('startBtn').innerText = "Pause";
    }
}

function updateDisplay() {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    document.getElementById('timerDisplay').innerText = 
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    totalSeconds = 0;
    updateDisplay();
    document.getElementById('startBtn').innerText = "Start";
}

function rotateQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('philosophyQuote').innerText = `"${quote.text}"`;
    document.getElementById('philosopher').innerText = `— ${quote.author}`;
}
