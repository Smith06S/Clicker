var count = 0;
var perSecond = 0
var countString = document.getElementById("count");

var opt1 = 30;
var opt2 = 80;
var opt3 = 200;
var opt4 = 500;
var opt5 = 1000;
var opt6 = 1500;

var imageCountId = 1;
var life = { "0": 100 };
var countImg = 1;

var kill = 1;

var dict = {
  opt1: 10,
  opt2: 30,
  opt3: 70,
  opt4: 100,
  opt5: 300,
  opt6: 500,
};


var value = {
  opt1: 0.1,
  opt2: 1,
  opt3: 5,
  opt4: 10,
  opt5: 20,
  opt6: 30
};

var killValue = {
  opt1: 1,
  opt2: 1.5,
  opt3: 2,
  opt4: 2.5,
  opt5: 3,
  opt6: 3.5
};

const ufoTypes = [
  { src: 'images/kenney_alien-ufo-pack/shipBlue_manned.png', life: 150 },
  { src: 'images/kenney_alien-ufo-pack/shipGreen_manned.png', life: 100 },
  { src: 'images/kenney_alien-ufo-pack/shipPink_manned.png', life: 250 },
  { src: 'images/kenney_alien-ufo-pack/shipYellow_manned.png', life: 200 }
];

var gameloop = setInterval(() => {
  console.log(count);
  console.log(perSecond);
  if (perSecond > 0) {
    count += perSecond;
  }
  countString.textContent = count;
}, 1000);

var imgAppear = setInterval(() => {
  NewImage();
}, 15000);


function Clicked(event) {
  count += 1;
  countString.textContent = count;

  const clickedElement = event.currentTarget;
  const id = clickedElement.dataset.id;

  life[id].current -= kill;
  updateHealthBar(id);

  if (life[id].current <= 0) {
    clickedElement.style.display = "none";
    const bar = document.getElementById("health-bar-container-" + id);
    if (bar) bar.style.display = "none";

    countImg -= 1;
    delete life[id];

    if (countImg === 0) {
      OverlayContent();
      clearInterval(gameloop);
      clearInterval(imgAppear);
    }
  }
}


function Options(option) {
  var optString = document.getElementById(option);

  var optionValue = window[option];
  if (count > optionValue) {
    count -= optionValue;
    perSecond += value[option];
    window[option] += dict[option];
    optString.textContent = window[option];
    kill += killValue[option];
  }
}


function NewImage() {
  countImg += 1;

  const container = document.createElement('div');
  container.classList.add('image-container');

  const img = document.createElement('img');
  const randomIndex = Math.floor(Math.random() * ufoTypes.length);
  const chosenUfo = ufoTypes[randomIndex];

  img.src = chosenUfo.src;
  img.dataset.id = imageCountId++;
  life[img.dataset.id] = {
    current: chosenUfo.life,
    max: chosenUfo.life
  };

  img.addEventListener('click', Clicked);

  const barContainer = document.createElement('div');
  barContainer.id = "health-bar-container-" + img.dataset.id;
  barContainer.className = "health-bar-container";

  const bar = document.createElement('div');
  bar.id = "health-bar-" + img.dataset.id;
  bar.className = "health-bar";

  barContainer.appendChild(bar);
  container.appendChild(img);
  container.appendChild(barContainer);
  document.body.appendChild(container);

  setTimeout(() => {
    const imgWidth = container.offsetWidth || 100;
    const imgHeight = container.offsetHeight || 100;

    const randomX = Math.random() * (window.innerWidth - imgWidth);
    const randomY = Math.random() * (window.innerHeight - imgHeight);

    container.style.left = `${randomX}px`;
    container.style.top = `${randomY}px`;
  }, 0);

  console.log(`Spawned UFO ${img.dataset.id} with ${chosenUfo.life} HP`);
}


function OverlayContent() {
  const popup = document.getElementById("popup");
  popup.style.display = "flex";
}



function getColor(percent) {
  if (percent >= 50) {
    const p = (percent - 50) / 50;
    const r = Math.round(255 - (179 * p));
    const g = Math.round(235 - (60 * p));
    const b = Math.round(59 + (21 * p));
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    const p = percent / 50;
    const r = Math.round(244 + (11 * (1 - p)));
    const g = Math.round(67 + (168 * p));
    const b = Math.round(54 + (5 * p));
    return `rgb(${r}, ${g}, ${b})`;
  }
}


function updateHealthBar(id) {
  const healthObj = life[id];
  if (!healthObj) return;

  const percent = Math.max(0, (healthObj.current / healthObj.max) * 100);

  const healthBar = document.getElementById("health-bar-" + id);
  if (!healthBar) return;

  healthBar.style.width = percent + "%";
  healthBar.style.backgroundColor = getColor(percent);
}


window.onload = () => {
  NewImage();
};



// Concepte
// tuer les extraterrestres qui reviennent

// fare in modo che non vada dove cè la zona per comprare
//  gun +1, energy +2, power +3, mine +4, grenade +5, canon+6
// fare tutto bello

