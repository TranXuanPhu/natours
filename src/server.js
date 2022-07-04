// NOTE: config in process.env
const dotenv = require('dotenv');
dotenv.config({ path: './src/config/variables.env' });
const db = require('./config/database/index.js');
const app = require('./app.js');

// NOTE: connect database
db.connect();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
