const dotenv = require('dotenv');
//config in process.env
dotenv.config({ path: './config.env' });

const express = require('express');
const handlebars = require('express-handlebars');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World !');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
