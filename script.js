<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZenSpace | Time Management</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="bg-overlay"></div>
    
    <header>
        <div class="goal-container">
            <input type="text" id="goalInput" placeholder="Enter your goal...">
            <div id="goalDisplay" class="hidden"></div>
        </div>
        
        <div class="calendar-container">
            <div id="calendar-track">
                </div>
        </div>
    </header>

    <nav class="bg-selector">
        <button id="prevBg" class="arrow">❮</button>
        <button id="nextBg" class="arrow">❯</button>
    </nav>

    <main class="timer-section">
        <h2 id="activeGoal"></h2>
        <div id="timerDisplay">00:00:00</div>
        
        <div class="controls">
            <div class="manual-input">
                <button class="step-btn" onclick="adjustTime(-5)">-5m</button>
                <input type="number" id="manualHours" placeholder="HH" min="0" max="23">
                <input type="number" id="manualMins" placeholder="MM" min="0" max="59">
                <input type="number" id="manualSecs" placeholder="SS" min="0" max="59">
                <button class="step-btn" onclick="adjustTime(5)">+5m</button>
            </div>
            <div class="action-btns">
                <button id="startBtn">Start</button>
                <button id="resetBtn">Reset</button>
            </div>
        </div>
    </main>

    <footer>
        <div class="quote-container">
            <p id="philosophyQuote">"Waste no more time arguing what a good man should be. Be one."</p>
            <span id="philosopher">— Marcus Aurelius</span>
        </div>

        <div class="spotify-bar">
            <iframe id="spotify-player" src="https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExYv" 
                    width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>
