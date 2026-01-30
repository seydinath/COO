/**
 * Fichier de test simple
 * Vérifie que tous les modules chargent correctement
 */

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║                   TESTS DE VALIDATION                          ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

try {
    // Test 1: Charger les modules
    console.log('TEST 1: Vérifier que tous les modules se chargent');
    const modules = require('./index');
    console.log('✓ Tous les modules chargés avec succès\n');

    // Test 2: Vérifier le Singleton
    console.log('TEST 2: Vérifier le pattern Singleton');
    const LibrarySystem = require('./src/system/LibrarySystem');
    const lib1 = LibrarySystem.getInstance();
    const lib2 = LibrarySystem.getInstance();
    if (lib1 === lib2) {
        console.log('✓ Singleton fonctionne: lib1 === lib2\n');
    } else {
        throw new Error('Singleton ne fonctionne pas!');
    }

    // Test 3: Vérifier la Factory
    console.log('TEST 3: Vérifier le pattern Factory');
    const UserFactory = require('./src/factories/UserFactory');
    const etudiant = UserFactory.createUser(
        UserFactory.UserType.ETUDIANT,
        'E001',
        'Test Student',
        'test@mail.com',
        'E20230001'
    );
    const enseignant = UserFactory.createUser(
        UserFactory.UserType.ENSEIGNANT,
        'P001',
        'Test Prof',
        'prof@mail.com',
        'CS'
    );
    
    if (etudiant.getMaxEmprunt() === 3 && enseignant.getMaxEmprunt() === 5) {
        console.log('✓ Factory fonctionne: limites correctes\n');
    } else {
        throw new Error('Factory ne fonctionne pas!');
    }

    // Test 4: Vérifier l'Observer
    console.log('TEST 4: Vérifier le pattern Observer');
    const NotificationService = require('./src/observers/NotificationService');
    const notificationService = new NotificationService();
    notificationService.subscribe(etudiant);
    notificationService.subscribe(enseignant);
    
    console.log('Observer test - Envoi de notification:');
    notificationService.notifyObservers('Test message');
    console.log('✓ Observer fonctionne: notifications envoyées\n');

    // Test 5: Vérifier les modèles
    console.log('TEST 5: Vérifier les modèles (Livre et TransactionEmprunt)');
    const Livre = require('./src/models/Livre');
    const TransactionEmprunt = require('./src/models/TransactionEmprunt');
    
    const livre = new Livre('ISBN-001', 'Test Book', 'Test Author', 'Test');
    const transaction = new TransactionEmprunt('TRANS-1', 'E001', 'ISBN-001');
    
    if (livre.getTitre() === 'Test Book' && transaction.getIdUtilisateur() === 'E001') {
        console.log('✓ Modèles fonctionnent correctement\n');
    } else {
        throw new Error('Modèles ne fonctionnent pas!');
    }

    // Test 6: Vérifier les opérations du système
    console.log('TEST 6: Vérifier les opérations du système');
    const library = LibrarySystem.getInstance();
    
    // Ajouter les utilisateurs
    library.addUtilisateur(etudiant);
    library.addUtilisateur(enseignant);
    
    // Ajouter un livre
    library.addLivre(livre);
    
    // Emprunter
    const success = library.emprunterLivre('E001', 'ISBN-001');
    
    if (success && !livre.isDisponible() && etudiant.getNombreLivresEmpruntés() === 1) {
        console.log('✓ Opérations du système fonctionnent\n');
    } else {
        throw new Error('Opérations du système ne fonctionnent pas!');
    }

    // Test 7: Vérifier les statistiques
    console.log('TEST 7: Vérifier les statistiques');
    const allUsers = library.getAllUtilisateurs();
    const allBooks = library.getAllLivres();
    const availableBooks = library.getLivresDisponibles();
    
    if (allUsers.length > 0 && allBooks.length > 0 && availableBooks.length === 0) {
        console.log(`✓ Statistiques correctes:
  - Utilisateurs: ${allUsers.length}
  - Livres: ${allBooks.length}
  - Livres disponibles: ${availableBooks.length}\n`);
    } else {
        throw new Error('Statistiques incorrectes!');
    }

    // ========== RÉSUMÉ ==========
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                   ✓ TOUS LES TESTS RÉUSSIS                    ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    
    console.log('Le système est opérationnel:');
    console.log('✓ Singleton Pattern implémenté');
    console.log('✓ Factory Pattern implémenté');
    console.log('✓ Observer Pattern implémenté');
    console.log('✓ Modèles de données fonctionnels');
    console.log('✓ Opérations de gestion fonctionnelles');
    console.log('✓ Statistiques et rapports disponibles\n');
    
    console.log('Prochaines étapes:');
    console.log('1. node demo.js     - Voir la démonstration complète');
    console.log('2. node examples.js - Voir les 8 exemples d\'utilisation');
    console.log('3. Consulter README.md et DESIGN_PATTERNS.md\n');

} catch (error) {
    console.error('╔════════════════════════════════════════════════════════════════╗');
    console.error('║                   ✗ ERREUR DE TEST                             ║');
    console.error('╚════════════════════════════════════════════════════════════════╝\n');
    console.error('Erreur:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
}
