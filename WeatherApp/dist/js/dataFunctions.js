// Set location
export const setLocationObj = (locationObj, coordsObj) => {
  const { lat, lon, name, unit } = coordsObj;
  locationObj.setLat(lat);
  locationObj.setLon(lon);
  locationObj.setName(name);
  if (unit) {
    locationObj.setUnit(unit);
  }
};

// Get home location
export const getHomeLocation = () => {
  return localStorage.getItem('defaultWeatherLocation');
};

// Get weather from location
export const getWeatherFromCoords = async locationObj => {
  const lat = locationObj.getLat();
  const lon = locationObj.getLon();
  const units = locationObj.getUnit();
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`;
  try {
    const weatherStream = await fetch(url);
    const weatherJson = await weatherStream.json();
    return weatherJson;
  } catch (err) {
    console.error(err);
  }
};

// Get coordinates
export const getCoordsFromApi = async (entryText, units) => {
  const regex = /^\d+$/g;
  const flag = regex.test(entryText) ? 'zip' : 'q';
  const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${units}&appid=${WEATHER_API_KEY}`;
  const encodedUrl = encodeURI(url);
  try {
    const dataStream = await fetch(encodedUrl);
    const jsonData = await dataStream.json();
    return jsonData;
  } catch (err) {
    console.error(err.stack);
  }
};

// Trim text whitespace
export const cleanText = text => {
  const trimRegex = / {2,}/g;
  let entryText = text.replaceAll(trimRegex, ' ').trim();

  // TODO: Fix this, it's broken as hell

  // const words = entryText.split(' ');
  // if (words.length <= 3) {
  //   entryText = words.join(', ');
  // } else {
  //   for (let i = 0; i < words.length; i++) {
  //     if (words[i].length === 2 && !words.includes(`${words[i]},`)) {
  //       words[i] = `, ${words[i]}`;
  //     }
  //   }
  //   entryText = words.join(' ');
  // } 
  return entryText;
};

const WEATHER_API_KEY = '6d44e9655bca8a80b809620772ae342d';
