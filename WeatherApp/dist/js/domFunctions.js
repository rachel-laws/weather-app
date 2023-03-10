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

const updateWeatherLocationHeader = msg => {
  const h1 = document.getElementById('currentForecast__location');
  h1.textContent = msg;
};

export const updateSRConfirmation = msg => {
  document.getElementById('confirmation').textContent = msg;
};
