/**
 * Fichier de démonstration
 * Montre comment utiliser le système de gestion de bibliothèque
 */

const LibrarySystem = require('./src/system/LibrarySystem');
const UserFactory = require('./src/factories/UserFactory');
const Livre = require('./src/models/Livre');

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║        SYSTÈME DE GESTION DE BIBLIOTHÈQUE - DÉMONSTRATION      ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Obtenir l'instance singleton du système
const library = LibrarySystem.getInstance();

// ========== ÉTAPE 1: CRÉATION DES UTILISATEURS ==========
console.log('▶ ÉTAPE 1: Création des utilisateurs\n');

// Utiliser la Factory pour créer des utilisateurs
const etudiant1 = UserFactory.createUser(
    UserFactory.UserType.ETUDIANT,
    'E001',
    'Alice Dupont',
    'alice@university.edu',
    'E20230001'
);

const etudiant2 = UserFactory.createUser(
    UserFactory.UserType.ETUDIANT,
    'E002',
    'Bob Martin',
    'bob@university.edu',
    'E20230002'
);

const enseignant1 = UserFactory.createUser(
    UserFactory.UserType.ENSEIGNANT,
    'P001',
    'Dr. Pierre Lefevre',
    'pierre@university.edu',
    'Informatique'
);

const enseignant2 = UserFactory.createUser(
    UserFactory.UserType.ENSEIGNANT,
    'P002',
    'Dr. Sophie Bernard',
    'sophie@university.edu',
    'Littérature'
);

// Ajouter les utilisateurs au système
library.addUtilisateur(etudiant1);
library.addUtilisateur(etudiant2);
library.addUtilisateur(enseignant1);
library.addUtilisateur(enseignant2);

console.log('\nUtilisateurs créés:');
console.log(etudiant1.toString());
console.log(etudiant2.toString());
console.log(enseignant1.toString());
console.log(enseignant2.toString());

// ========== ÉTAPE 2: AJOUT DES LIVRES ==========
console.log('\n\n▶ ÉTAPE 2: Ajout des livres à la bibliothèque\n');

const livre1 = new Livre('ISBN-001', 'Les Misérables', 'Victor Hugo', 'Littérature classique');
const livre2 = new Livre('ISBN-002', 'Le Seigneur des Anneaux', 'J.R.R. Tolkien', 'Fantasy');
const livre3 = new Livre('ISBN-003', 'Algorithmes en Python', 'Gilles Schaeffer', 'Informatique');
const livre4 = new Livre('ISBN-004', '1984', 'George Orwell', 'Littérature classique');
const livre5 = new Livre('ISBN-005', 'La Structure et l\'Interprétation', 'Abelson & Sussman', 'Informatique');

library.addLivre(livre1);
library.addLivre(livre2);
library.addLivre(livre3);
library.addLivre(livre4);
library.addLivre(livre5);

console.log('\nLivres ajoutés:');
library.getAllLivres().forEach(livre => {
    console.log(`  - ${livre.getTitre()} par ${livre.getAuteur()}`);
});

// ========== ÉTAPE 3: EMPRUNTS DE LIVRES ==========
console.log('\n\n▶ ÉTAPE 3: Emprunts de livres\n');

// Alice emprunte des livres
library.emprunterLivre('E001', 'ISBN-001');
library.emprunterLivre('E001', 'ISBN-003');
library.emprunterLivre('E001', 'ISBN-004');

// Bob emprunte un livre
library.emprunterLivre('E002', 'ISBN-002');

// Dr. Lefevre emprunte des livres
library.emprunterLivre('P001', 'ISBN-003');
library.emprunterLivre('P001', 'ISBN-005');

// Tentative d'emprunt au-delà de la limite (Alice a déjà 3 livres)
console.log('\nTentative d\'emprunt au-delà de la limite:');
library.emprunterLivre('E001', 'ISBN-005');

// ========== ÉTAPE 4: AFFICHAGE DES LIVRES EMPRUNTÉS ==========
console.log('\n\n▶ ÉTAPE 4: Livres empruntés par utilisateur\n');

library.afficherLivresEmpruntés('E001');
library.afficherLivresEmpruntés('E002');
library.afficherLivresEmpruntés('P001');
library.afficherLivresEmpruntés('P002');

// ========== ÉTAPE 5: STATISTIQUES ==========
console.log('\n▶ ÉTAPE 5: Statistiques de la bibliothèque');
library.afficherStatistiques();

// ========== ÉTAPE 6: RETOUR DE LIVRES ==========
console.log('\n\n▶ ÉTAPE 6: Retour de livres\n');

library.retournerLivre('E001', 'ISBN-001');
library.retournerLivre('E001', 'ISBN-003');

// ========== ÉTAPE 7: VÉRIFICATION APRÈS RETOUR ==========
console.log('\n▶ ÉTAPE 7: Vérification après retour\n');

library.afficherLivresEmpruntés('E001');
library.afficherStatistiques();

// ========== ÉTAPE 8: SIMULATION DE RETARD ==========
console.log('\n\n▶ ÉTAPE 8: Simulation d\'un retard\n');

// Simpler un retard en changeant manuellement la date
const transactions = library.getTransactionsUtilisateur('E001');
if (transactions.length > 0) {
    const transaction = transactions[transactions.length - 1];
    console.log(`Transaction actuelle: ${transaction.toString()}`);
    
    // Simuler un retard en définissant une date de retour passée
    const dateRetardee = new Date();
    dateRetardee.setDate(dateRetardee.getDate() + 20); // 20 jours après l'emprunt
    transaction.setDateRetourEffective(dateRetardee);
    
    console.log(`\nAprès simulation de retard:`);
    console.log(`Jours de retard: ${transaction.getJoursDeRetard()} jours`);
}

// ========== ÉTAPE 9: NOTIFICATIONS DE RETARD ==========
console.log('\n\n▶ ÉTAPE 9: Notification des retards\n');
library.notifierRetards();

// ========== ÉTAPE 10: AFFICHAGE FINAL ==========
console.log('\n▶ ÉTAPE 10: État final du système\n');

console.log('Tous les utilisateurs:');
library.getAllUtilisateurs().forEach(user => {
    console.log(`  ${user.toString()}`);
});

console.log('\nTous les livres:');
library.getAllLivres().forEach(livre => {
    const status = livre.isDisponible() ? '✓ Disponible' : '✗ Emprunté';
    console.log(`  ${status}: ${livre.getTitre()}`);
});

library.afficherStatistiques();

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                    FIN DE LA DÉMONSTRATION                      ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');
