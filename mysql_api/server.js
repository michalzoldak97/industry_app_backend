const express = require('express');
const app = express();

let routes = require('./routes');

app.use(express.json());
app.use(
    express.urlencoded({
      extended: true
    })
  )
app.use('/', routes);

app.listen(8080, () => {
    console.log('Server listening on port 8080!');
  });