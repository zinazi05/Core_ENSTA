import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// CONFIGURATION DE VOTRE BASE DE DONNÉES SQL
// ==========================================
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',               
  password: 'Dba@Student#2025', 
  database: 'school_db'       
};

// Route de diagnostic
app.get('/api/status', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    await connection.ping();
    res.json({ status: 'connected', message: 'SQL Connecté avec succès.' });
  } catch (error) {
    console.error("Erreur de connexion SQL :", error.message);
    res.status(500).json({ status: 'error', message: "Vérifiez vos identifiants SQL dans server.js" });
  } finally {
    if (connection) await connection.end();
  }
});

// Récupérer les données avec logique relationnelle
app.get('/api/students', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [students] = await connection.execute('SELECT * FROM students');
    
    let internships = [];
    try {
        const [rows] = await connection.execute('SELECT * FROM internships');
        internships = rows;
    } catch (e) {
        // Table vide ou inexistante (cas d'installation fraîche)
    }
    
    const formattedStudents = students.map(s => ({
      ...s,
      internships: internships.filter(i => i.student_id === s.id)
    }));
    res.json(formattedStudents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// Insertion Étudiant
app.post('/api/students', async (req, res) => {
    const { id, dept_id, specialty_id, first_name, last_name, year_of_study } = req.body;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO students (id, dept_id, specialty_id, first_name, last_name, year_of_study) VALUES (?, ?, ?, ?, ?, ?)',
            [id, dept_id, specialty_id || null, first_name, last_name, year_of_study]
        );
        res.status(201).json({ message: 'Succès SQL' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

// Insertion Stage
app.post('/api/internships', async (req, res) => {
    const { id, student_id, company_name, internship_type, duration_weeks, year } = req.body;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO internships (id, student_id, company_name, internship_type, duration_weeks, year) VALUES (?, ?, ?, ?, ?, ?)',
            [id, student_id, company_name, internship_type, duration_weeks, year]
        );
        res.status(201).json({ message: 'Succès SQL' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

const SERVER_PORT = process.env.PORT || 3005;
app.listen(SERVER_PORT, '0.0.0.0', () => {
  console.log(`
  ==============================================
  🏫 API BACKEND CORE-ENSTA EN LIGNE
  🔗 URL : http://localhost:${SERVER_PORT}
  📡 Status : Prêt pour les requêtes SQL
  ==============================================
  `);
});