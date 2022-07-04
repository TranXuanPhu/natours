const mongoose = require('mongoose');

async function connect() {
  try {
    let dbName = 'mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME;
    await mongoose.connect(dbName);
    console.log('connect DB successfully ......');
  } catch (error) {
    console.error('connect DB error : ', error);
  }
}

module.exports = { connect };
