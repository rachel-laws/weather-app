const WEATHER_API_KEY = 'b4dfd45039a6a4b4d2149e5c4f99934e';

export const setLocationObj = (locationObj, coordsObj) => {
  const { lat, lon, name, unit } = coordsObj;
  locationObj.setLat(lat);
  locationObj.setLon(lon);
  locationObj.setName(name);
  if (unit) {
    locationObj.setUnit(unit);
  }
};

export const getHomeLocation = () => {
  return localStorage.getItem('defaultWeatherLocation');
};

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

export const cleanText = text => {
  const regex = / {2,}/g;
  const entryText = text.replaceAll(regex, ' ').trim();
  return entryText;
};
