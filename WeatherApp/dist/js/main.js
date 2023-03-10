import { setLocationObj, getHomeLocation } from './dataFunctions.js';
import { addSpinner, displayError } from './domFunctions.js';
import CurrentLocation from './CurrentLocation.js';

const currentLoc = new CurrentLocation();

const initApp = () => {
  // Event Listeners
  const geoButton = document.getElementById('getLocation');
  geoButton.addEventListener('click', getGeoWeather);
  const homeButton = document.getElementById('home');
  homeButton.addEventListener('click', loadWeather);
  const saveButton = document.getElementById('saveLocation')
  // Set up
  // Load weather
  loadWeather();
};

document.addEventListener('DOMContentLoaded', initApp);

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
      'Please save your home location first'
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

const updateDataDisplay = async locationObj => {
  // const weatherJson = await getWeatherFromCoords(locationObj);
  // if (weatherJson) updateDisplay(weatherJson, locationObj);
};
