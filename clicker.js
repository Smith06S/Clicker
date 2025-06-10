/*** Game Variables ***/

var count = 0; // total player points
var perSecond = 0; // // points added automatically every second
var countString = document.getElementById("count");

var imageCountId = 1; // used to give a unique id for each ufo image created
var life = { "0": 100 }; // store the HP of each active ufo with it's id
var countImg = 0; // count the number of ufos left on the page

var kill = 1; // damage per click

// options for upgrades the player can buy 
var options = {
  opt1: { cost: 30, increment: 10, value: 0.1, killValue: 1, name: "Gun" },
  opt2: { cost: 80, increment: 40, value: 1, killValue: 1.5, name: "Energy" },
  opt3: { cost: 200, increment: 90, value: 2, killValue: 2, name: "Power" },
  opt4: { cost: 500, increment: 120, value: 4, killValue: 2.5, name: "Mine" },
  opt5: { cost: 1000, increment: 500, value: 6, killValue: 3, name: "Grenade" },
  opt6: { cost: 1500, increment: 1000, value: 8, killValue: 3.5, name: "Canon" }
};

// different types of ufos that can appear in the game
const ufoTypes = [
  { src: 'images/shipBlue_manned.png', life: 1500 },
  { src: 'images/shipGreen_manned.png', life: 1000 },
  { src: 'images/shipPink_manned.png', life: 2000 },
  { src: 'images/shipBeige_manned.png', life: 3000 },
  { src: 'images/shipYellow_manned.png', life: 2500 }
];

/*** Game update ***/

// updates the player's count and "per second" display every second
var gamecount = setInterval(() => {
  if (perSecond > 0) {
    count += perSecond;
  }
  countString.textContent = Math.floor(count); // round down the count to an integer
  document.getElementById("perSecond").textContent = Math.round(perSecond * 100) / 100 + "/s"; // rounds the "per second" display to two decimal and adds "/s"
}, 1000);

// creates a new ufo on the screen every 10 seconds
var imgAppear = setInterval(() => {
  NewImage();
}, 10000);

/*** Functions ***/

// called when the player clicks on a ufo
function Clicked(event) {
  hitElement(); // show hit animation
  count += 1;
  countString.textContent = Math.floor(count); //update the count on the page

  // get the id of the element clicked
  const clickedElement = event.currentTarget;
  const id = clickedElement.dataset.id;

  // reduce the ufo life with the player's damage 
  life[id].current -= kill;
  updateHealthBar(id);

  // if the ufo dies:
  if (life[id].current <= 0) {
    clickedElement.style.display = "none"; // hide ufo
    const bar = document.getElementById("health-bar-container-" + id);
    if (bar) bar.style.display = "none"; // hide health bar

    countImg -= 1;
    delete life[id];  // remove from life object

    // If no ufos remain
    if (countImg === 0) {
      OverlayContent(); // show the victory overlay
      clearInterval(gamecount); // stop the gamecount loop
      clearInterval(imgAppear); // stop the imgAppear loop
    }
  }
}

// called when the player buys an upgrade
function Options(option) {
  var optString = document.getElementById(option);
  var optData = options[option];

  // buy only if player has enough points
  if (count > optData.cost) {
    count -= optData.cost; // pay the cost from the count
    perSecond += optData.value; // increase the income per second
    optData.cost += optData.increment; // make the next purchase more expensive
    kill += optData.killValue; // increase player click damage

    // update the option button
    optString.textContent = '';
    var numberNode = document.createTextNode(optData.cost + ' ');
    var span = document.createElement('span');
    span.textContent = optData.name;
    optString.appendChild(numberNode);
    optString.appendChild(span);
  }
}

// creates a new random ufo and places it on the window
function NewImage() {
  countImg += 1;

  // create container div with the class
  const container = document.createElement('div');
  container.classList.add('image-container', 'alien-ufo');

  // choose random ufo from ufoTypes
  const img = document.createElement('img');
  const randomIndex = Math.floor(Math.random() * ufoTypes.length);
  const chosenUfo = ufoTypes[randomIndex];
  img.src = chosenUfo.src;
  img.alt = "alien";
  img.dataset.id = imageCountId++;
  // store this UFO's life in the "life" object
  life[img.dataset.id] = { current: chosenUfo.life, max: chosenUfo.life };
  // add click listener for attacking the UFO
  img.addEventListener('click', Clicked);

    // create health bar
  const barContainer = document.createElement('div');
  barContainer.id = "health-bar-container-" + img.dataset.id;
  barContainer.className = "health-bar-container";
  const bar = document.createElement('div');
  bar.id = "health-bar-" + img.dataset.id;
  bar.className = "health-bar";

  // append the bar and img to the container
  barContainer.appendChild(bar);
  container.appendChild(img);
  container.appendChild(barContainer);

  // place ufo on screen randomly avoiding the option zone
  setTimeout(() => {
    const imgWidth = container.offsetWidth || 100;
    const imgHeight = container.offsetHeight || 100;

    let randomX = Math.random() * (window.innerWidth - imgWidth);
    let randomY = Math.random() * (window.innerHeight - imgHeight);

    // prevent overlapping with bottom-right corner reserved for options
    if ((randomX > window.innerWidth - 500) && (randomY > window.innerHeight - 600)) {
      if (Math.random() < 0.5) {
        randomX = Math.random() * (window.innerWidth - 500 - imgWidth);
      } else {
        randomY = Math.random() * (window.innerHeight - 900 - imgHeight);
      }
    }

    // set position
    container.style.left = `${randomX}px`;
    container.style.top = `${randomY}px`;

    // add to screen
    document.body.appendChild(container);
  }, 0);
}

// shows the victory overlay when all ufos are defeated
function OverlayContent() {
  document.getElementById("popup").classList.add("active");
}

// returns a color for the health bar based on remaining HP %
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

// updates the width and color of a UFO's health bar
function updateHealthBar(id) {
  const healthObj = life[id]; // retrieve the health object for the specific ufo id
  if (!healthObj) return;

  // calculate the health percentage
  const percent = Math.max(0, (healthObj.current / healthObj.max) * 100);

  // gets the element corresponding to the ufo's health bar
  const healthBar = document.getElementById("health-bar-" + id);
  if (!healthBar) return;

  // set the width of the health bar calling getColor()
  healthBar.style.width = percent + "%";
  healthBar.style.backgroundColor = getColor(percent);
}

// creates a "hit" image where the player clicked
function hitElement() {
  // creates a img element with the hit image
  const img = document.createElement('img');
  img.src = 'images/hit.png';
  img.className = 'hit-image';

  // place the hit image at mouse position
  img.style.left = `${event.pageX - 25}px`;
  img.style.top = `${event.pageY - 25}px`;

  document.body.appendChild(img);

  // fade out and remove after short delay
  setTimeout(() => {
    img.style.opacity = '0';
    setTimeout(() => {
      img.remove();
    }, 500);
  }, 100);
}

// creates the first ufo at the start of the game
window.onload = () => {
  NewImage();
};


