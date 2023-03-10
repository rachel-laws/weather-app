export const addSpinner = icon => {
  animateButton(icon);
  setTimeout(animateButton, 1000, icon);
};

const animateButton = icon => {
  icon.classList.toggle('none');
  icon.nextElementSibling.classList.toggle('block');
  icon.nextElementSibling.classList.toggle('none');
};
