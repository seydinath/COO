/**
 * Fichier d'exemples d'utilisation
 * Démontre les différentes façons d'utiliser le système
 */

const {
    LibrarySystem,
    UserFactory,
    Livre,
    TransactionEmprunt
} = require('./index');

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║              EXEMPLES D\'UTILISATION - MINI TUTORIEL             ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// ========== EXEMPLE 1: UTILISATION DU SINGLETON ==========
console.log('📚 EXEMPLE 1: Singleton Pattern\n');

const library1 = LibrarySystem.getInstance();
const library2 = LibrarySystem.getInstance();

console.log('library1 === library2:', library1 === library2);
console.log('✓ Les deux références pointent vers la même instance\n');

// ========== EXEMPLE 2: FACTORY PATTERN ==========
console.log('📚 EXEMPLE 2: Factory Pattern - Création d\'utilisateurs\n');

const alice = UserFactory.createUser(
    UserFactory.UserType.ETUDIANT,
    'E001',
    'Alice',
    'alice@mail.com',
    'E20230001'
);

const professeur = UserFactory.createUser(
    UserFactory.UserType.ENSEIGNANT,
    'P001',
    'Dr. Dupont',
    'dupont@mail.com',
    'Mathématiques'
);

library1.addUtilisateur(alice);
library1.addUtilisateur(professeur);

console.log('\nUtilisateurs créés avec Factory:');
console.log('- Type:', alice.constructor.name);
console.log('- Limite d\'emprunts:', alice.getMaxEmprunt());
console.log('- Type:', professeur.constructor.name);
console.log('- Limite d\'emprunts:', professeur.getMaxEmprunt());

// ========== EXEMPLE 3: OBSERVER PATTERN ==========
console.log('\n\n📚 EXEMPLE 3: Observer Pattern - Notifications\n');

const livre1 = new Livre('ISBN-001', 'JavaScript: The Good Parts', 'Douglas Crockford', 'Programmation');
library1.addLivre(livre1);

console.log('Alice emprunte le livre:');
library1.emprunterLivre('E001', 'ISBN-001');

console.log('\nTous les utilisateurs abonnés ont reçu la notification (Observer Pattern)');

// ========== EXEMPLE 4: GESTION D'EMPRUNTS ==========
console.log('\n\n📚 EXEMPLE 4: Gestion des emprunts et retours\n');

// Ajouter plus de livres
const livre2 = new Livre('ISBN-002', 'Clean Code', 'Robert C. Martin', 'Programmation');
const livre3 = new Livre('ISBN-003', 'Design Patterns', 'Gang of Four', 'Architecture');
library1.addLivre(livre2);
library1.addLivre(livre3);

// Emprunts multiples
console.log('Alice emprunte plusieurs livres:');
library1.emprunterLivre('E001', 'ISBN-002');
library1.emprunterLivre('E001', 'ISBN-003');

library1.afficherLivresEmpruntés('E001');

console.log('\nAffichage des statistiques:');
library1.afficherStatistiques();

console.log('\nAffichage des livres disponibles:');
const livresDisponibles = library1.getLivresDisponibles();
console.log(`Livres disponibles: ${livresDisponibles.length}`);
livresDisponibles.forEach(l => console.log(`  - ${l.getTitre()}`));

// ========== EXEMPLE 5: RETOURS ET SUIVI ==========
console.log('\n\n📚 EXEMPLE 5: Retours de livres et suivi des retards\n');

console.log('Alice retourne un livre:');
library1.retournerLivre('E001', 'ISBN-001');

console.log('\nStatut après retour:');
library1.afficherStatistiques();

// ========== EXEMPLE 6: TRANSACTIONS ==========
console.log('\n\n📚 EXEMPLE 6: Consultation des transactions\n');

const transactions = library1.getTransactionsUtilisateur('E001');
console.log(`Nombre de transactions pour Alice: ${transactions.length}`);
console.log('\nDétails des transactions:');
transactions.forEach((t, index) => {
    console.log(`\nTransaction ${index + 1}:`);
    console.log(`  - ISBN: ${t.getIsbnLivre()}`);
    console.log(`  - Date emprunt: ${TransactionEmprunt.formatDate(t.getDateEmprunt())}`);
    console.log(`  - Date retour prévue: ${TransactionEmprunt.formatDate(t.getDateRetourPrevue())}`);
    console.log(`  - Retourné: ${t.isRetourne() ? 'OUI' : 'NON'}`);
    if (t.isRetourne()) {
        console.log(`  - Date retour effectif: ${TransactionEmprunt.formatDate(t.getDateRetourEffective())}`);
    }
});

// ========== EXEMPLE 7: ERREURS ET VALIDATIONS ==========
console.log('\n\n📚 EXEMPLE 7: Gestion des erreurs et validations\n');

console.log('Tentative d\'emprunt d\'un livre qui n\'existe pas:');
library1.emprunterLivre('E001', 'ISBN-999');

console.log('\nTentative d\'emprunt avec un utilisateur qui n\'existe pas:');
library1.emprunterLivre('E999', 'ISBN-002');

console.log('\nTentative d\'emprunt au-delà de la limite (Alice a 2 livres):');
library1.emprunterLivre('E001', 'ISBN-002'); // 3ème emprunt
library1.emprunterLivre('E001', 'ISBN-003'); // 4ème emprunt (devrait échouer)

console.log('\nTentative de retour d\'un livre déjà retourné:');
library1.retournerLivre('E001', 'ISBN-001'); // Déjà retourné

// ========== EXEMPLE 8: AFFICHAGE FINAL ==========
console.log('\n\n📚 EXEMPLE 8: État final du système\n');

console.log('Tous les utilisateurs:');
library1.getAllUtilisateurs().forEach(u => {
    console.log(`- ${u.getNom()} (${u.constructor.name}): ${u.getNombreLivresEmpruntés()} livres empruntés`);
});

console.log('\nTous les livres:');
library1.getAllLivres().forEach(l => {
    const status = l.isDisponible() ? '✓' : '✗';
    console.log(`${status} ${l.getTitre()} (${l.getAuteur()})`);
});

library1.afficherStatistiques();

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                   FIN DES EXEMPLES                             ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');
