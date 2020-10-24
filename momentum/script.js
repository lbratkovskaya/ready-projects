// DOM Elements
const dateTag = document.querySelector('.date'),
  time = document.querySelector('.time'),
  greeting = document.querySelector('.greeting'),
  name = document.querySelector('.name'),
  focus = document.querySelector('.focus'),
  cityTag = document.querySelector('.city'),
  weatherIcon = document.querySelector('.weather-icon'),
  weatherTemp = document.querySelector('.weather-temperature'),
  weatherState = document.querySelector('.weather-state'),
  blockquote = document.querySelector('blockquote'),
  figcaption = document.querySelector('figcaption'),
  nextImgBtn = document.querySelector('.next-image'),
  nextQuoteBtn = document.querySelector('.next-quote'),
  overlay = document.querySelector('.overlay');

// Options And Constants
let readyToSwitch = true;
let ingIndex = new Date().getHours() + 1;
const dayPeriodsCount = 4;
const apiKey = '2bd82ee7444fb5848885689e5988a2ca';

const imageNamesArray = (() => {
  let result = [];
  for (i = 0; i < dayPeriodsCount; i++) {
    let arr = [];
    while (arr.length < 24 / dayPeriodsCount) {
      let ind = Math.floor(Math.random() * 20) + 1;
      if (!arr.includes(ind)) {
        arr.push(ind);
      }
    }
    result = [...result, ...arr];
  }

  return result;
})();

// Show Time
function showTime() {
  let today = new Date(),
    day = today.getDay(),
    date = today.getDate(),
    month = today.getMonth(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();

  formatAndFillDate(month, date, day);

  // Output Time
  time.innerHTML = `<span>${addZero(hour)}</span><span>:</span><span>${addZero(min)}</span><span>:</span><span>${addZero(sec)}</span>`;

  if (min < 1 && readyToSwitch) {
    readyToSwitch = false;
    switchBackgroundImage(hour);
  } else if (!readyToSwitch) {
    readyToSwitch = true;
  }

  setTimeout(showTime, 1000);
}

// Add Zeros
function formatAndFillDate(month, date, day) {
  let monthName = '',
    dayName = '';
  switch (month) {
    case 0:
      monthName = 'january';
      break;
    case 1:
      monthName = 'february';
      break;
    case 2:
      monthName = 'march';
      break;
    case 3:
      monthName = 'april';
      break;
    case 4:
      monthName = 'may';
      break;
    case 5:
      monthName = 'june';
      break;
    case 6:
      monthName = 'july';
      break;
    case 7:
      monthName = 'august';
      break;
    case 8:
      monthName = 'september';
      break;
    case 9:
      monthName = 'october';
      break;
    case 10:
      monthName = 'november';
      break;
    case 11:
      monthName = 'december';
      break;
  }

  switch (day) {
    case 0:
      dayName = 'sunday';
      break;
    case 1:
      dayName = 'monday';
      break;
    case 2:
      dayName = 'tuesday';
      break;
    case 3:
      dayName = 'wednesday';
      break;
    case 4:
      dayName = 'thursday';
      break;
    case 5:
      dayName = 'friday';
      break;
    case 6:
      dayName = 'saturday';
      break;
  }

  dateTag.innerHTML = `<span>${date} of ${monthName}, </span><span>${dayName}</span>`;
}

// Add Zeros
function addZero(n) {
  return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

// Set Background and Greeting
function setBgGreet() {
  let today = new Date(),
    hour = today.getHours();

  switchBackgroundImage(hour);
}

// Change Background Image
function switchBackgroundImage(hour) {
  let greet = getGreetingByHour(hour);

  let folderName = greet.folderName || greet.greetingStr.toLowerCase();
  let urlString = `assets/images/${folderName}/${addZero(imageNamesArray[hour])}.jpg`;

  greeting.textContent = `Good ${greet.greetingStr}, `;

  const img = document.createElement('img');
  img.src = urlString;
  img.onload = () => {
    document.body.style.backgroundImage = `url(${urlString})`;
  };
}

// Calculate appropriate greeting
function getGreetingByHour(hour) {
  let greetingStr = '',
    folderName = '';

  if (hour < 6) {
    // Night
    greetingStr = 'Night';
    document.body.style.color = 'white';
    overlay.classList.add('dark');
  } else if (hour < 12) {
    // Morning
    greetingStr = 'Morning';
    document.body.style.color = '';
    overlay.classList.remove('dark');
  } else if (hour < 18) {
    // Afternoon
    document.body.style.color = '';
    overlay.classList.remove('dark');
    greetingStr = 'Afternoon';
    folderName = 'day';
  } else {
    // Evening
    document.body.style.color = 'white';
    overlay.classList.add('dark');
    greetingStr = 'Evening';
  }

  return { 'greetingStr': greetingStr, 'folderName': folderName };
}

// Set Quote
function setQuote() {
  const url = `https://quote-garden.herokuapp.com/api/v2/quotes/random`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      blockquote.innerText = data.quote.quoteText;
      figcaption.innerText = data.quote.quoteAuthor;
    });
}

// Set City Value
function setCityAndWeather(ev) {
  if (ev.type === 'keypress') {
    if (ev.which == 13 || ev.keyCode == 13) {
      if (ev.target.innerText) {
        localStorage.setItem('userCity', ev.target.innerText);
        updateWeather(ev.target.innerText);
      } else {
        cityTag.innerText = localStorage.getItem('userCity') || '[Enter City]'
      }

      cityTag.blur();
      ev.preventDefault();
    }
  } else {
    if (ev.target.innerText) {
      localStorage.setItem('userCity', ev.target.innerText);
      updateWeather(ev.target.innerText);
    } else {
      cityTag.innerText = localStorage.getItem('userCity') || '[Enter City]'
    }
  }

}
// Get Weather for Current City
function getCityAndWeather() {
  if (localStorage.getItem('userCity')) {
    cityTag.textContent = localStorage.getItem('userCity');
    updateWeather(localStorage.getItem('userCity'));
  } else {
    cityTag.textContent = '[Enter City]';
  }
}

// Update Weather for Current City
function updateWeather(userCity) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&lang=en&appid=${apiKey}&units=metric`;
  fetch(url)
    .then((res) => {
      if (200 === res.status) {
        return res.json();
      } else {
        weatherTemp.innerHTML = "Sorry, error fetching";
      }

    })
    .then((data) => {
      weatherIcon.classList = `weather-icon owf owf-${data.weather[0].id}`;
      weatherTemp.innerHTML = `${data.main.temp}&#176;C`;
      weatherState.innerHTML = `<span>${data.weather[0].description}, </span><span>wind ${data.wind.speed} m/s, </span><span>hum. ${data.main.humidity}%</span>`;
    });
}


// Get Name
function getName() {
  if (localStorage.getItem('name') === null) {
    name.textContent = '[Enter Name]';
  } else {
    name.textContent = localStorage.getItem('name');
  }
}

// Set Name
function setName(e) {
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      if (e.target.innerText) {
        localStorage.setItem('name', e.target.innerText);
      } else {
        e.target.textContent = localStorage.getItem('name') || '[Enter Name]';
      }
      name.blur();
      e.preventDefault();
    }
  } else {
    if (e.target.innerText) {
      localStorage.setItem('name', e.target.innerText);
    } else {
      e.target.textContent = localStorage.getItem('name') || '[Enter Name]';
    }
  }
}

// Update Background Image By Button Click
function setImage() {
  const index = ingIndex % imageNamesArray.length;
  let greet = getGreetingByHour(index);
  let folderName = greet.folderName || greet.greetingStr.toLowerCase();
  const imageSrc = `assets/images/${folderName}/${addZero(imageNamesArray[index])}.jpg`;

  loadBgImage(imageSrc);
  ingIndex++;
  nextImgBtn.disabled = true;
  setTimeout(function() { nextImgBtn.disabled = false }, 1000);
}

// Load Image From File
function loadBgImage(imgSrc) {
  const src = imgSrc;
  const img = document.createElement('img');
  img.src = src;
  img.onload = () => {
    document.body.style.backgroundImage = `url(${src})`;
  };
}

// Get Focus
function getFocus() {
  if (localStorage.getItem('focus') === null) {
    focus.textContent = '[Enter Focus]';
  } else {
    focus.textContent = localStorage.getItem('focus');
  }
}

// Set Focus
function setFocus(e) {
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      if (e.target.innerText) {
        localStorage.setItem('focus', e.target.innerText);
      } else {
        e.target.textContent = localStorage.getItem('focus') || '[Enter Focus]';
      }
      name.blur();
      e.preventDefault();
    }
  } else {
    if (e.target.innerText) {
      localStorage.setItem('focus', e.target.innerText);
    } else {
      e.target.textContent = localStorage.getItem('focus') || '[Enter Focus]';
    }
  }
}

// Resize Body For Device
function resize() {
  if (document.body.scrollHeight >= window.innerHeight) {
    document.body.style.height = '100%';
  } else {
    document.body.style.height = '';
  }
}

// Add Listeners
name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
name.addEventListener('focus', () => (name.innerText = ''));

focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);
focus.addEventListener('focus', () => (focus.innerText = ''));

cityTag.addEventListener('keypress', setCityAndWeather);
cityTag.addEventListener('blur', setCityAndWeather);
cityTag.addEventListener('focus', () => (cityTag.innerText = ''));

nextImgBtn.addEventListener('click', setImage);
nextQuoteBtn.addEventListener('click', setQuote);

window.addEventListener('resize', resize);

// Run
showTime();
setBgGreet();
getName();
getFocus()
getCityAndWeather();
setQuote();
resize();