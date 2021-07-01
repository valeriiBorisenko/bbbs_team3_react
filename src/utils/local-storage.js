export const setlocalStorageData = (key, value) => {
  const event = new Event('changeLocalStorage');
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(event);
};

export const getlocalStorageData = (key) =>
  JSON.parse(localStorage.getItem(key));
