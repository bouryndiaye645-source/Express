const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // change si besoin
  password: 'root',        // ton mot de passe MySQL
  database: 'projet_examen'  // le nom de ta base
});
// gestion de la connection a la base de donne

db.connect((err) => {
  if (err) {
    console.log('Erreur de connexion à MySQL :', err);
  } else {
    console.log('Connecté à MySQL');
  }
});

module.exports = db;