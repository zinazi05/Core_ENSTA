
#  Projet Core-ENSTA : Gestion des Stages

Ce projet est une plateforme de suivi académique développée pour l'ENSTA. Elle permet d'organiser la hiérarchie scolaire et de recommander des lieux de stages basés sur l'historique des étudiants.

##  Structure SQL (MySQL)

### 1. Création de la Structure
Exécutez ce script dans votre outil SQL (MySQL Workbench) :

```sql
CREATE DATABASE IF NOT EXISTS school_db;
USE school_db;

-- Table des départements
CREATE TABLE departments (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(20),
  name VARCHAR(255)
);

-- Table des spécialités (Hiérarchie : 1 Dept -> N Spécialités)
CREATE TABLE specialties (
  id VARCHAR(50) PRIMARY KEY,
  dept_id VARCHAR(50),
  name VARCHAR(255),
  field VARCHAR(100),
  FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Table des étudiants (Hiérarchie : 1 Spécialité -> N Étudiants)
CREATE TABLE students (
  id VARCHAR(50) PRIMARY KEY,
  dept_id VARCHAR(50),
  specialty_id VARCHAR(50) NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  year_of_study INT,
  FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE,
  FOREIGN KEY (specialty_id) REFERENCES specialties(id) ON DELETE SET NULL
);

-- Table des stages (Hiérarchie : 1 Étudiant -> N Stages)
CREATE TABLE internships (
  id VARCHAR(50) PRIMARY KEY,
  student_id VARCHAR(50),
  company_name VARCHAR(255),
  internship_type VARCHAR(100),
  duration_weeks INT,
  year INT,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
```

### 2. Justification Technique 
*   **Modélisation Relationnelle** : Utilisation d'une structure en "Flocon" pour respecter la hiérarchie demandée.
*   **Contraintes d'Intégrité** : Mise en place de clés étrangères pour garantir qu'on ne peut pas avoir un étudiant sans département.
*   **Flexibilité** : Le champ `specialty_id` est nullable pour gérer les départements de base (DFI/DFST) qui n'ont pas encore de spécialités.
*   **Performance** : Séparation des stages dans une table dédiée pour permettre un historique illimité par étudiant.

##  Lancement du Projet
1.  **Base de données** : Lancez MySQL et créez les tables avec le script ci-dessus.
2.  **Backend** : Dans le dossier du projet, lancez `node server.js`.
3.  **Frontend** : Lancez `npm run dev`.

##  Configuration
Si votre mot de passe MySQL est différent de celui par défaut, modifiez la variable `dbConfig` au début du fichier `server.js`.

*Développé pour ZIANE ZINEB - 2025.*
