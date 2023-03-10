import {
  setLocationObj,
  getHomeLocation,
  getWeatherFromCoords,
  getCoordsFromApi,
  cleanText,
} from './dataFunctions.js';

import {
  setPlaceholderText,
  addSpinner,
  displayError,
  displayApiError,
  updateSRConfirmation,
  updateDisplay,
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

// Update data and display
export const updateDataDisplay = async locationObj => {
  const weatherJson = await getWeatherFromCoords(locationObj);
  if (weatherJson) updateDisplay(weatherJson, locationObj);
};

document.addEventListener('DOMContentLoaded', initApp);

// Get weather from location
const getGeoWeather = event => {
  if (event && event.type === 'click') {
    const mapIcon = document.querySelector('.fa-map-marker-alt');
    // Loading animation
    addSpinner(mapIcon);
  }

  // Get location
  if (!navigator.geolocation) return geoError();
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

// Error: Unable to get location
const geoError = errObj => {
  const errMsg = errObj ? errObj.message : 'Location not supported';
  displayError(errMsg, errMsg);
};

// Get location success
const geoSuccess = position => {
  const coordsObj = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`,
  };
  // Location object
  setLocationObj(currentLoc, coordsObj);

  // Update location data and display
  updateDataDisplay(currentLoc);
};

// Load weather
const loadWeather = event => {
  const savedLocation = getHomeLocation();
  if (!savedLocation && !event) return getGeoWeather();

  // Error: No saved home location
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

// Display home location weather
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

// Save new home location
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

// Toggle temperature units (°F | °C)
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

// Enter new location from search bar
const submitNewLocation = async event => {
  event.preventDefault();
  const text = document.getElementById('searchBar__text').value;
  const entryText = cleanText(text);

  // Error: No text entry
  if (!entryText.length) return;
  const locationIcon = document.querySelector('.fa-magnifying-glass');
  addSpinner(locationIcon);

  // Retrieve data from API
  const coordsData = await getCoordsFromApi(entryText, currentLoc.getUnit());

  // Success -> Update location
  if (coordsData) {
    if (coordsData.cod === 200) {
      const coordsObj = {
        lat: coordsData.coord.lat,
        lon: coordsData.coord.lon,
        name: coordsData.sys.country
          ? `${coordsData.name}, ${coordsData.sys.country}`
          : coordsData.name,
      };
      setLocationObj(currentLoc, coordsObj);
      updateDataDisplay(currentLoc);

      // Error: Unable to get specific location info
    } else {
      displayApiError(coordsData);
    }
    // Error: Data connection
  } else {
    displayError('Connection Error', 'Connection Error');
  }
};

// // Update data and display
// const updateDataDisplay = async locationObj => {
//   const weatherJson = await getWeatherFromCoords(locationObj);
//   if (weatherJson) updateDisplay(weatherJson, locationObj);
// };
