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
