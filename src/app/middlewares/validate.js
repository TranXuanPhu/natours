exports.errorMessageValidate = (schema) => {
  const errorValidate = schema.validateSync();
  if (!errorValidate) return;
  const arrayMessage = [];
  const lengthError = Object.keys(errorValidate.errors).length;
  for (let index = 0; index < lengthError; index++) {
    const errorObject = Object.values(errorValidate.errors)[index];
    arrayMessage.push({ [errorObject.path]: errorObject.message });
  }
  return arrayMessage;
};
