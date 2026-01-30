/**
 * Point d'entrée pour les imports
 * Exporte tous les modules principaux du système
 */

// Système
const LibrarySystem = require('./src/system/LibrarySystem');

// Utilisateurs
const Utilisateur = require('./src/users/Utilisateur');
const Etudiant = require('./src/users/Etudiant');
const Enseignant = require('./src/users/Enseignant');

// Modèles
const Livre = require('./src/models/Livre');
const TransactionEmprunt = require('./src/models/TransactionEmprunt');

// Factory
const UserFactory = require('./src/factories/UserFactory');

// Observers
const NotificationObserver = require('./src/observers/NotificationObserver');
const NotificationService = require('./src/observers/NotificationService');

module.exports = {
    // Système
    LibrarySystem,
    
    // Utilisateurs
    Utilisateur,
    Etudiant,
    Enseignant,
    
    // Modèles
    Livre,
    TransactionEmprunt,
    
    // Factory
    UserFactory,
    
    // Observers
    NotificationObserver,
    NotificationService
};
