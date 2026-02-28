const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Page principale - liste des tâches
router.get('/', (req, res) => {
  const search = req.query.search || '';
  const statut = req.query.statut || '';
  const priorite = req.query.priorite || '';

  let query = 'SELECT * FROM tache WHERE 1=1';
  let params = [];

  if (search) {
    query += ' AND (titre LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (statut) {
    query += ' AND statut = ?';
    params.push(statut);
  }
  if (priorite) {
    query += ' AND priorite = ?';
    params.push(priorite);
  }

  query += ' ORDER BY date_creation DESC';

  db.query(query, params, (err, taches) => {
    if (err) throw err;
    res.render('index', { taches, search, statut, priorite });
  });
});

// Page ajout
router.get('/ajout', (req, res) => {
  res.render('ajout');
});

// Enregistrer une tâche
router.post('/ajout', (req, res) => {
  const { titre, description, priorite, date_limite, responsable } = req.body;
  const date_creation = new Date();

  db.query(
    'INSERT INTO tache (titre, description, priorite, statut, date_creation, date_limite, responsable) VALUES (?, ?, ?, "a faire", ?, ?, ?)',
    [titre, description, priorite, date_creation, date_limite, responsable],
    (err) => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});

// Changer le statut
router.get('/statut/:id', (req, res) => {
  const id = req.params.id;

  db.query('SELECT statut FROM tache WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    let nouveauStatut;
    const actuel = result[0].statut;

    if (actuel === 'a faire') nouveauStatut = 'en cours';
    else if (actuel === 'en cours') nouveauStatut = 'termine';
    else nouveauStatut = 'termine';

    db.query('UPDATE tache SET statut = ? WHERE id = ?', [nouveauStatut, id], (err) => {
      if (err) throw err;
      res.redirect('/');
    });
  });
});

// Supprimer une tâche
router.get('/supprimer/:id', (req, res) => {
  db.query('DELETE FROM tache WHERE id = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Page modifier
router.get('/modifier/:id', (req, res) => {
  db.query('SELECT * FROM tache WHERE id = ?', [req.params.id], (err, result) => {
    if (err) throw err;
    res.render('ajout', { tache: result[0] });
  });
});

// Enregistrer modification
router.post('/modifier/:id', (req, res) => {
  const { titre, description, priorite, date_limite, responsable } = req.body;

  db.query(
    'UPDATE tache SET titre=?, description=?, priorite=?, date_limite=?, responsable=? WHERE id=?',
    [titre, description, priorite, date_limite, responsable, req.params.id],
    (err) => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});

// Dashboard
router.get('/dashboard', (req, res) => {
  db.query('SELECT * FROM tache', (err, taches) => {
    if (err) throw err;

    const total = taches.length;
    const terminees = taches.filter(t => t.statut === 'termine').length;
    const pourcentage = total > 0 ? Math.round((terminees / total) * 100) : 0;
    const aujourd_hui = new Date();
    const enRetard = taches.filter(t =>
      t.statut !== 'termine' && new Date(t.date_limite) < aujourd_hui
    ).length;

    res.render('dashbord', { total, terminees, pourcentage, enRetard });
  });
});

module.exports = router;