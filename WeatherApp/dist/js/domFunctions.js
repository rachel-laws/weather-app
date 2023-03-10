// Search bar placeholder text
export const setPlaceholderText = () => {
  const input = document.getElementById('searchBar__text');
  window.innerWidth < 400
    ? (input.placeholder = 'City, State, Country')
    : (input.placeholder = 'City, State, Country or Zip Code');
};

// Animate button
export const addSpinner = icon => {
  animateButton(icon);
  setTimeout(animateButton, 1250, icon);
};

const animateButton = icon => {
  icon.classList.toggle('none');
  icon.nextElementSibling.classList.toggle('block');
  icon.nextElementSibling.classList.toggle('none');
};

// Display Error
export const displayError = (headerMsg, srMsg) => {
  updateWeatherLocationHeader(headerMsg);
  updateSRConfirmation(srMsg);
};

// API Error
export const displayApiError = statusCode => {
  const properMsg = toProperCase(statusCode.msg);
  updateWeatherLocationHeader(properMsg);
  updateSRConfirmation(`${properMsg}. Please try again.`);
};

// Proper Case
const toProperCase = text => {
  const words = text.split(' ');
  const properWords = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return properWords.join(' ');
};

// Location header
const updateWeatherLocationHeader = msg => {
  const h1 = document.getElementById('currentForecast__location');
  h1.textContent = msg;
};

// Screen reader message
export const updateSRConfirmation = msg => {
  document.getElementById('confirmation').textContent = msg;
};

// Update display
export const updateDisplay = (weatherJson, locationObj) => {
  fadeDisplay();
  clearDisplay();

  const weatherClass = getWeatherClass(weatherJson.current.weather[0].icon);
  setBGImage(weatherClass);

  const screenReaderWeather = buildScreenReaderWeather(
    weatherJson,
    locationObj
  );

  updateSRConfirmation(screenReaderWeather);
  updateWeatherLocationHeader(locationObj.getName());

  // Current conditions
  const currentConditionsArray = createCurrentConditionsDivs(
    weatherJson,
    locationObj.getUnit()
  );

  displayCurrentConditions(currentConditionsArray);
  // Daily forecast

  setFocusOnSearch();

  fadeDisplay();
};

// Fade display in and out
const fadeDisplay = () => {
  const currentForecast = document.getElementById('currentForecast');
  currentForecast.classList.toggle('zero-vis');
  currentForecast.classList.toggle('fade-in');

  const dailyForecast = document.getElementById('dailyForecast');
  dailyForecast.classList.toggle('zero-vis');
  dailyForecast.classList.toggle('fade-in');
};

// Clear current and daily forecast display
const clearDisplay = () => {
  const currentConditions = document.getElementById(
    'currentForecast__conditions'
  );
  deleteContents(currentConditions);

  const dailyConditions = document.getElementById('dailyForecast__conditions');
  deleteContents(dailyConditions);
};

// Delete div contents
const deleteContents = parentElement => {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};

// Weather classes
const getWeatherClass = icon => {
  const firstTwoChars = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  const weatherLookup = {
    '09': 'snow',
    10: 'rain',
    11: 'rain',
    13: 'snow',
    50: 'fog',
  };
  let weatherClass;
  if (weatherLookup[firstTwoChars]) {
    weatherClass = weatherLookup[firstTwoChars];
  } else if (lastChar === 'd') {
    weatherClass = 'clouds';
  } else {
    weatherClass = 'night';
  }
  return weatherClass;
};

// Background images
const setBGImage = weatherClass => {
  document.documentElement.classList.add(weatherClass);
  document.documentElement.classList.forEach(img => {
    if (img !== weatherClass) document.documentElement.classList.remove(img);
  });
};

// Screen reader
const buildScreenReaderWeather = (weatherJson, locationObj) => {
  const location = locationObj.getName();
  const unit = locationObj.getUnit();
  const tempUnit = unit === 'imperial' ? 'Fahrenheit' : 'Celcius';
  return `${weatherJson.current.weather[0].description} and ${Math.round(
    Number(weatherJson.current.temp)
  )}°${tempUnit} in ${location}`;
};

const setFocusOnSearch = () => {
  document.getElementById('searchBar__text').focus();
};

// Current conditions
const createCurrentConditionsDivs = (weatherObj, unit) => {
  const tempUnit = unit === 'imperial' ? 'F' : 'C';
  const windUnit = unit === 'imperial' ? 'mph' : 'm/s';
  const icon = createMainImgDiv(
    weatherObj.current.weather[0].icon,
    weatherObj.current.weather[0].description
  );

  // Temperature
  const temp = createElement(
    'div',
    'temp',
    `${Math.round(Number(weatherObj.current.temp))}°`
  );

  // Description
  const properDesc = toProperCase(weatherObj.current.weather[0].description);
  const desc = createElement('div', 'desc', properDesc);

  // Feels like
  const feels = createElement(
    'div',
    'feels',
    `Feels Like ${Math.round(Number(weatherObj.current.feels_like))}°`
  );
  // Max temp
  const maxTemp = createElement(
    'div',
    'maxtemp',
    `High ${Math.round(Number(weatherObj.daily[0].temp.max))}°`
  );

  // Max temp
  const minTemp = createElement(
    'div',
    'mintemp',
    `Low ${Math.round(Number(weatherObj.daily[0].temp.min))}°`
  );

  // Humidity
  const humidity = createElement(
    'div',
    'humidity',
    `Humidity ${weatherObj.current.humidity}%`
  );

  // Wind
  const wind = createElement(
    'div',
    'wind',
    `Wind ${Math.round(Number(weatherObj.current.wind_speed))} ${windUnit}`
  );

  return [icon, temp, desc, feels, maxTemp, minTemp, humidity, wind];
};

// Weather icon divs
const createMainImgDiv = (icon, altText) => {
  const iconDiv = createElement('div', 'icon');
  iconDiv.id = 'icon';
  const faIcon = translateIconToFA(icon);
  faIcon.ariaHidden = true;
  faIcon.title = altText;
  iconDiv.appendChild(faIcon);
  return iconDiv;
};

// Create div
const createElement = (elementType, divClassName, divText, unit) => {
  const div = document.createElement(elementType);
  div.className = divClassName;
  if (divText) {
    div.textContent = divText;
  }
  if (divClassName === 'temp') {
    const unitDiv = document.createElement('div');
    unitDiv.classList.add('unit');
    unitDiv.textContent = unit;
    div.appendChild(unitDiv);
  }
  return div;
};

// Set weather icon
const translateIconToFA = icon => {
  const i = document.createElement('i');
  const firstTwoChars = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  switch (firstTwoChars) {
    case '01':
      if (lastChar === 'd') {
        i.classList.add('far', 'fa-sun');
      } else {
        i.classList.add('far', 'fa-moon');
      }
      break;
    case '02':
      if (lastChar === 'd') {
        i.classList.add('fas', 'fa-cloud-sun');
      } else {
        i.classList.add('fas', 'fa-cloud-moon');
      }
      break;
    case '03':
      i.classList.add('fas', 'fa-cloud');
      break;
    case '04':
      i.classList.add('fas', 'fa-cloud-meatball');
      break;
    case '09':
      i.classList.add('fas', 'fa-cloud-rain');
      break;
    case '10':
      if (lastChar === 'd') {
        i.classList.add('fas', 'fa-cloud-sun-rain');
      } else {
        i.classList.add('fas', 'fa-cloud-moon-rain');
      }
      break;
    case '11':
      i.classList.add('fas', 'fa-poo-storm');
      break;
    case '13':
      i.classList.add('fas', 'fa-snowflake');
      break;
    case '50':
      i.classList.add('fas', 'fa-smog');
      break;
    default:
      i.classList.add('far', 'fa-question-circle');
  }
  return i;
};

// Display current conditions
const displayCurrentConditions = currentConditionsArray => {
  const currentConditionsContainer = document.getElementById(
    'currentForecast__conditions'
  );
  currentConditionsArray.forEach(currentConditions => {
    currentConditionsContainer.appendChild(currentConditions);
  });
};
