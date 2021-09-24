const getServerErrors = (serverErrorObj) => {
  if (
    !(
      typeof serverErrorObj === 'object' &&
      !Array.isArray(serverErrorObj) &&
      serverErrorObj !== null
    )
  ) {
    throw Error('Invalid input');
  }

  return Object.values(serverErrorObj)
    .map((err) => err)
    .join(' ')
    .trim();
};

export default getServerErrors;
