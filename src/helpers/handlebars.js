module.exports = {
  getErrorMessage: (errors, keyName) => {
    // console.log('getErrorMessage: ', errors);
    if (!errors || !Array.isArray(errors)) return '';
    const objError = errors.find((err) => {
      return err[keyName];
    });
    if (!objError) return '';
    const message = Object.values(objError).toString();
    if (message.includes('is required')) return 'Nhập dữ liệu.';

    return message;
  },
};
