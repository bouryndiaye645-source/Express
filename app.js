const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './page');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const tacheRoute = require('./route/tache_route');
app.use('/', tacheRoute);

app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});