import {
  setLocationObj,
  getHomeLocation,
  getCoordsFromApi,
  cleanText,
} from './dataFunctions.js';

import {
  setPlaceholderText,
  addSpinner,
  displayError,
  displayApiError,
  updateSRConfirmation,
} from './domFunctions.js';

import CurrentLocation from './CurrentLocation.js';

const currentLoc = new CurrentLocation();

const initApp = () => {
  // Event Listeners
  const locationEntry = document.getElementById('searchBar__form');
  locationEntry.addEventListener('submit', submitNewLocation);

  const homeButton = document.getElementById('home');
  homeButton.addEventListener('click', loadWeather);

  const geoButton = document.getElementById('getLocation');
  geoButton.addEventListener('click', getGeoWeather);

  const refreshButton = document.getElementById('refresh');
  refreshButton.addEventListener('click', refreshWeather);

  const unitButton = document.getElementById('unit');
  unitButton.addEventListener('click', setUnitPref);

  const saveButton = document.getElementById('saveLocation');
  saveButton.addEventListener('click', saveLocation);

  // Set up
  setPlaceholderText();

  // Load weather
  loadWeather();
};

document.addEventListener('DOMContentLoaded', initApp);

// Get weather from location
const getGeoWeather = event => {
  if (event) {
    if (event.type === 'click') {
      // Loading animation
      const mapIcon = document.querySelector('.fa-map-marker-alt');
      addSpinner(mapIcon);
    }
  }
  // Location success / error
  if (!navigator.geolocation) return geoError();
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

// Location error
const geoError = errObj => {
  const errMsg = errObj ? errObj.message : 'Location not supported';
  displayError(errMsg, errMsg);
};

// Location success
const geoSuccess = position => {
  const coordsObj = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`,
  };
  // Location object
  setLocationObj(currentLoc, coordsObj);
  console.log(currentLoc);
  // Update data and display
  updateDataDisplay(currentLoc);
};

// Load weather
const loadWeather = event => {
  const savedLocation = getHomeLocation();
  if (!savedLocation && !event) return getGeoWeather();
  // Errors
  if (!savedLocation && event.type === 'click') {
    displayError(
      'No saved home location',
      'Please save your home location first.'
    );
    // Load saved location without click
  } else if (savedLocation && !event) {
    displayHomeLocationWeather(savedLocation);
    // Load saved location with click
  } else {
    const homeIcon = document.querySelector('.fa-home');
    addSpinner(homeIcon);
    displayHomeLocationWeather(savedLocation);
  }
};

// Display home weather
const displayHomeLocationWeather = home => {
  if (typeof home === 'string') {
    const locationJson = JSON.parse(home);
    const coordsObj = {
      lat: locationJson.lat,
      lon: locationJson.lon,
      name: locationJson.name,
      unit: locationJson.unit,
    };
    setLocationObj(currentLoc, coordsObj);
    updateDataDisplay(currentLoc);
  }
};

// Save location
const saveLocation = () => {
  if (currentLoc.getLat() && currentLoc.getLon()) {
    const saveIcon = document.querySelector('.fa-download');
    addSpinner(saveIcon);
    const location = {
      lat: currentLoc.getLat(),
      lon: currentLoc.getLon(),
      name: currentLoc.getName(),
      unit: currentLoc.getUnit(),
    };
    localStorage.setItem('defaultWeatherLocation', JSON.stringify(location));
    updateSRConfirmation(`Saved ${currentLoc.getName()} as home location.`);
  }
};

// Toggle temperature units
const setUnitPref = () => {
  const unitIcon = document.querySelector('.fa-square-poll-vertical');
  addSpinner(unitIcon);
  currentLoc.toggleUnit();
  updateDataDisplay(currentLoc);
};

// Refresh weather
const refreshWeather = () => {
  const refreshIcon = document.querySelector('.fa-sync-alt');
  addSpinner(refreshIcon);
  updateDataDisplay(currentLoc);
};

// Enter location from search bar
const submitNewLocation = async event => {
  event.preventDefault();
  const text = document.getElementById('searchBar__text').value;
  const entryText = cleanText(text);
  // Return if no text
  if (!entryText.length) return;
  const locationIcon = document.querySelector('.fa-magnifying-glass');
  addSpinner(locationIcon);
  // Retrieve API data
  const coordsData = await getCoordsFromApi(entryText, currentLoc.getUnit());
  // Success
  if (coordsData) {
    if (coordsData.cod === 200) {
      // API data
      const coordsObj = {};
      setLocationObj(currentLoc, coordsObj);
      updateDataDisplay(currentLoc);
      // Error
    } else {
      displayApiError(coordsData);
    }
  } else {
    displayError('Connection Error', 'Connection Error');
  }
};

// Update data and display
const updateDataDisplay = async locationObj => {
  // const weatherJson = await getWeatherFromCoords(locationObj);
  // if (weatherJson) updateDisplay(weatherJson, locationObj);
};
