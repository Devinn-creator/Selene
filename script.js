console.log("JS LOADED");

const bgList = [
"https://images.unsplash.com/photo-1506744038136-46273834b3fb",
"https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
"https://images.unsplash.com/photo-1470770841072-f978cf4d019e"
];

let bgIndex = 0;
const bg = document.getElementById("bg");

function setBg() {
  bg.style.backgroundImage = `url(${bgList[bgIndex]})`;
}
setBg();

/* BACKGROUND BUTTONS */
document.getElementById("next").onclick = () => {
  bgIndex = (bgIndex+1)%bgList.length;
  setBg();
};

document.getElementById("prev").onclick = () => {
  bgIndex = (bgIndex-1+bgList.length)%bgList.length;
  setBg();
};

/* TIMER */
let time = 1500;
let interval;

const display = document.getElementById("time");

function update() {
  let m = Math.floor(time/60);
  let s = time%60;
  display.innerText =
    `00:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}
update();

document.getElementById("start").onclick = () => {
  if(interval) return;
  interval = setInterval(()=>{
    time--;
    update();
  },1000);
};

document.getElementById("pause").onclick = () => {
  clearInterval(interval);
  interval=null;
};

document.getElementById("reset").onclick = () => {
  clearInterval(interval);
  interval=null;
  time = document.getElementById("minutes").value * 60;
  update();
};

document.getElementById("plus").onclick = () => {
  let m = document.getElementById("minutes");
  m.value = Number(m.value)+5;
};

document.getElementById("minus").onclick = () => {
  let m = document.getElementById("minutes");
  m.value = Math.max(1,Number(m.value)-5);
};

/* GOAL */
document.getElementById("setGoal").onclick = () => {
  document.getElementById("goalDisplay").innerText =
    document.getElementById("goalInput").value;
};

/* CALENDAR */
const grid = document.getElementById("grid");
const today = new Date().getDate();

for(let i=1;i<=30;i++){
  let d = document.createElement("div");
  d.className="day";
  if(i===today) d.classList.add("today");
  d.innerText=i;
  grid.appendChild(d);
}
