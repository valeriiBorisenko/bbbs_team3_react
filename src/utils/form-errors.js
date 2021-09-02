const getServerErrors = (serverErrorObj) => {
  if (!serverErrorObj) {
    throw Error('Invalid input');
  }

  return Object.values(serverErrorObj)
    .map((err) => err)
    .join(' ')
    .trim();
};

export default getServerErrors;
