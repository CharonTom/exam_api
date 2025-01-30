# Examen API

Une API développée par Tom Charon avec **NestJS** et **TypeORM**

## Installation et Configuration

Suivez ces étapes pour installer et configurer le projet.

### Cloner le repo ou télécharger le via le zip

### Faites "npm install" à la racine du projet pour installer les dépendances

### Faites un fichier .env à la racine du projet sous cette forme :

- JWT_SECRET='monsuperstrongpassword'
- ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC="56s"
- DB_HOST="localhost"
- DB_PORT="3306"
- DB_NAME="exam_api"
- DB_USERNAME="exemple"
- DB_PASSWORD="exemple"

### Configurer et migrer la base de données

Assurez-vous que votre serveur de base de données (MySQL) est en cours d'exécution.
Puis exécutez la migration avec :

- npm run migration:run
- npm run migration:generate

### Lancer l'application

npm run start:dev

### Technologies utilisées

NestJS (Framework Node.js en ts)
TypeORM (ORM pour la base de données)
MySQL
JWT (Authentification avec passport)

Auteur : Tom Charon
