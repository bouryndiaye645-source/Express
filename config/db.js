const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        
  password: 'root',        
  database: 'projet_examen'  
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