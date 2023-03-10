import { setLocationObj } from './dataFunctions';

export const setPlaceholderText = () => {
  const input = document.getElementById('searchBar__text');
  window.innerWidth < 400
    ? (input.placeholder = 'City, State, Country')
    : (input.placeholder = 'City, State, Country or Zip Code');
};

export const addSpinner = icon => {
  animateButton(icon);
  setTimeout(animateButton, 1250, icon);
};

const animateButton = icon => {
  icon.classList.toggle('none');
  icon.nextElementSibling.classList.toggle('block');
  icon.nextElementSibling.classList.toggle('none');
};

export const displayError = (headerMsg, srMsg) => {
  updateWeatherLocationHeader(headerMsg);
  updateSRConfirmation(srMsg);
};

export const displayApiError = statusCode => {
  const properMsg = toProperCase(statusCode.msg);
  updateWeatherLocationHeader(properMsg);
  updateSRConfirmation(`${properMsg}. Please try again.`);
};

const toProperCase = text => {
  const words = text.split(' ');
  const properWords = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return properWords.join(' ');
};

const updateWeatherLocationHeader = msg => {
  const h1 = document.getElementById('currentForecast__location');
  h1.textContent = msg;
};

export const updateSRConfirmation = msg => {
  document.getElementById('confirmation').textContent = msg;
};

export const updateDisplay = (weatherJson, locationObj) => {
  fadeDisplay();
  clearDisplay();
  fadeDisplay();
};

const fadeDisplay = () => {
  const currentForecast = document.getElementById('currentForecast');
  currentForecast.classList.toggle('zero-vis');
  currentForecast.classList.toggle('fade-in');

  const dailyForecast = document.getElementById('dailyForecast');
  dailyForecast.classList.toggle('zero-vis');
  dailyForecast.classList.toggle('fade-in');
};

const clearDisplay = () => {
  const currentConditions = document.getElementById(
    'currentForecast__conditions'
  );
  deleteContents(currentConditions);

  const dailyConditions = document.getElementById('dailyForecast__conditions');
  deleteContents(dailyConditions);
};

const deleteContents = parentElement => {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};
