import { addSpinner, displayError } from './domFunctions.js';
import CurrentLocation from './CurrentLocation.js';

const currentLoc = new CurrentLocation();

const initApp = () => {
  // Event Listeners
  const geoButton = document.getElementById('getLocation');
  geoButton.addEventListener('click', getGeoWeather);
  // Set up
  // Load weather
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
  // Update data and display
};
