var count = 0;
var perSecond = 0
var countString = document.getElementById("count");

var opt1 = 30;
var opt2 = 80;
var opt3 = 200;
var opt4 = 500;

var imageCountId = 1;
var life = { "0": 10 };
var countImg = 1;

var dict = {
  opt1: 10,
  opt2: 30,
  opt3: 70,
  opt4: 100
};


var value = {
  opt1: 0.1,
  opt2: 1,
  opt3: 5,
  opt4: 20
}


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

  life[id] -= 1;

  if (life[id] <= 0) {
    clickedElement.style.display = "none";
    countImg -= 1;
    delete life[id];

    if (countImg === 0){
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
  }
}

function NewImage() {
  countImg += 1;
  const img = document.createElement('img');
  img.src = 'images/kenney_alien-ufo-pack/shipBlue_manned.png';
  img.dataset.id = imageCountId++;
  life[img.dataset.id] = 100;

  img.addEventListener('click', Clicked);

  img.style.position = 'absolute';
  img.style.width = '100px';
  img.style.height = 'auto';
  img.style.zIndex = '10';

  img.onload = () => {
    const imgWidth = img.offsetWidth || 100;
    const imgHeight = img.offsetHeight || 100;

    const randomX = Math.random() * (window.innerWidth - imgWidth);
    const randomY = Math.random() * (window.innerHeight - imgHeight);

    img.style.left = `${randomX}px`;
    img.style.top = `${randomY}px`;
  };

  document.body.appendChild(img);
  console.log(JSON.stringify(life, null, 2));

}


function OverlayContent() {
  const popup = document.getElementById("popup");
  popup.style.display = "flex";
}



// Concepte
// tuer les extraterrestres qui reviennent


// life for each ufo diversa per ciascuno (sono 4)  // 100, 125, 150, 175
// sbarra per la vita degli alieni

//  gun +1, enery +2, power +3, mine +4, grenade +5, canon+6

