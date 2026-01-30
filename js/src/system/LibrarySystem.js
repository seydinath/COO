const Livre = require('../models/Livre');
const TransactionEmprunt = require('../models/TransactionEmprunt');
const NotificationService = require('../observers/NotificationService');

/**
 * Singleton - LibrarySystem
 * Système principal de gestion de la bibliothèque
 * Assure qu'une seule instance existe dans toute l'application
 */
class LibrarySystem {
    constructor() {
        if (LibrarySystem.instance) {
            return LibrarySystem.instance;
        }

        this.utilisateurs = new Map();
        this.livres = new Map();
        this.transactions = [];
        this.notificationService = new NotificationService();
        this.compteurTransactions = 0;

        LibrarySystem.instance = this;
    }

    /**
     * Retourne l'instance unique de LibrarySystem
     * @returns {LibrarySystem} L'instance du système de bibliothèque
     */
    static getInstance() {
        if (!LibrarySystem.instance) {
            new LibrarySystem();
        }
        return LibrarySystem.instance;
    }

    // ========== GESTION DES UTILISATEURS ==========

    /**
     * Ajouter un utilisateur
     * @param {Utilisateur} utilisateur - L'utilisateur à ajouter
     */
    addUtilisateur(utilisateur) {
        this.utilisateurs.set(utilisateur.getId(), utilisateur);
        this.notificationService.subscribe(utilisateur);
        console.log(`✓ Utilisateur ajouté: ${utilisateur.getNom()}`);
    }

    /**
     * Obtenir un utilisateur par ID
     * @param {string} id - L'ID de l'utilisateur
     * @returns {Utilisateur} L'utilisateur ou undefined
     */
    getUtilisateur(id) {
        return this.utilisateurs.get(id);
    }

    /**
     * Obtenir tous les utilisateurs
     * @returns {Array} Liste des utilisateurs
     */
    getAllUtilisateurs() {
        return Array.from(this.utilisateurs.values());
    }

    /**
     * Supprimer un utilisateur
     * @param {string} id - L'ID de l'utilisateur
     */
    removeUtilisateur(id) {
        const user = this.utilisateurs.get(id);
        if (user) {
            this.utilisateurs.delete(id);
            this.notificationService.unsubscribe(user);
            console.log(`✓ Utilisateur supprimé: ${user.getNom()}`);
        }
    }

    // ========== GESTION DES LIVRES ==========

    /**
     * Ajouter un livre
     * @param {Livre} livre - Le livre à ajouter
     */
    addLivre(livre) {
        this.livres.set(livre.getIsbn(), livre);
        console.log(`✓ Livre ajouté: ${livre.getTitre()}`);
    }

    /**
     * Obtenir un livre par ISBN
     * @param {string} isbn - L'ISBN du livre
     * @returns {Livre} Le livre ou undefined
     */
    getLivre(isbn) {
        return this.livres.get(isbn);
    }

    /**
     * Obtenir tous les livres
     * @returns {Array} Liste des livres
     */
    getAllLivres() {
        return Array.from(this.livres.values());
    }

    /**
     * Obtenir les livres disponibles
     * @returns {Array} Liste des livres disponibles
     */
    getLivresDisponibles() {
        return this.getAllLivres().filter(livre => livre.isDisponible());
    }

    /**
     * Supprimer un livre
     * @param {string} isbn - L'ISBN du livre
     */
    removeLivre(isbn) {
        const livre = this.livres.get(isbn);
        if (livre) {
            this.livres.delete(isbn);
            console.log(`✓ Livre supprimé: ${livre.getTitre()}`);
        }
    }

    // ========== GESTION DES EMPRUNTS ==========

    /**
     * Emprunter un livre
     * @param {string} idUtilisateur - L'ID de l'utilisateur
     * @param {string} isbnLivre - L'ISBN du livre
     * @returns {boolean} True si l'emprunt a réussi
     */
    emprunterLivre(idUtilisateur, isbnLivre) {
        const utilisateur = this.getUtilisateur(idUtilisateur);
        const livre = this.getLivre(isbnLivre);

        if (!utilisateur) {
            console.log('✗ Erreur: Utilisateur introuvable');
            return false;
        }

        if (!livre) {
            console.log('✗ Erreur: Livre introuvable');
            return false;
        }

        if (!livre.isDisponible()) {
            console.log(`✗ Erreur: Le livre '${livre.getTitre()}' n'est pas disponible`);
            return false;
        }

        if (!utilisateur.peutEmprunter()) {
            console.log(`✗ Erreur: ${utilisateur.getNom()} a atteint sa limite d'emprunts`);
            return false;
        }

        // Créer la transaction
        this.compteurTransactions++;
        const idTransaction = `TRANS-${this.compteurTransactions}`;
        const transaction = new TransactionEmprunt(idTransaction, idUtilisateur, isbnLivre);
        this.transactions.push(transaction);

        // Mettre à jour l'état du livre
        livre.setDisponible(false);
        livre.setEmpruntePar(idUtilisateur);

        // Mettre à jour l'utilisateur
        utilisateur.addLivreEmpruntu(livre.getTitre());

        // Notification
        const message = `${utilisateur.getNom()} a emprunté '${livre.getTitre()}'. Retour prévu le: ${TransactionEmprunt.formatDate(transaction.getDateRetourPrevue())}`;
        this.notificationService.notifyObservers(message);

        console.log(`✓ Emprunt réussi: ${utilisateur.getNom()} a emprunté '${livre.getTitre()}'`);
        return true;
    }

    /**
     * Retourner un livre
     * @param {string} idUtilisateur - L'ID de l'utilisateur
     * @param {string} isbnLivre - L'ISBN du livre
     * @returns {boolean} True si le retour a réussi
     */
    retournerLivre(idUtilisateur, isbnLivre) {
        const utilisateur = this.getUtilisateur(idUtilisateur);
        const livre = this.getLivre(isbnLivre);

        if (!utilisateur || !livre) {
            console.log('✗ Erreur: Utilisateur ou livre introuvable');
            return false;
        }

        // Trouver la transaction active
        const transaction = this.transactions.find(t =>
            t.getIdUtilisateur() === idUtilisateur &&
            t.getIsbnLivre() === isbnLivre &&
            !t.isRetourne()
        );

        if (!transaction) {
            console.log('✗ Erreur: Aucun emprunt actif trouvé pour ce livre');
            return false;
        }

        // Mettre à jour la transaction
        transaction.setDateRetourEffective(new Date());

        // Mettre à jour le livre
        livre.liberer();

        // Mettre à jour l'utilisateur
        utilisateur.removeLivreEmpruntu(livre.getTitre());

        // Notification
        let message;
        if (transaction.isEnRetard()) {
            const joursRetard = transaction.getJoursDeRetard();
            message = `${utilisateur.getNom()} a retourné '${livre.getTitre()}' avec ${joursRetard} jours de retard!`;
        } else {
            message = `${utilisateur.getNom()} a retourné '${livre.getTitre()}' à temps.`;
        }
        this.notificationService.notifyObservers(message);

        console.log(`✓ Retour effectué: ${message}`);
        return true;
    }

    /**
     * Obtenir les transactions d'un utilisateur
     * @param {string} idUtilisateur - L'ID de l'utilisateur
     * @returns {Array} Liste des transactions
     */
    getTransactionsUtilisateur(idUtilisateur) {
        return this.transactions.filter(t => t.getIdUtilisateur() === idUtilisateur);
    }

    /**
     * Obtenir les transactions en retard
     * @returns {Array} Liste des transactions en retard
     */
    getTransactionsEnRetard() {
        return this.transactions.filter(t => t.isEnRetard() && !t.isRetourne());
    }

    // ========== NOTIFICATIONS ==========

    /**
     * Notifier les utilisateurs en retard
     */
    notifierRetards() {
        const retards = this.getTransactionsEnRetard();
        retards.forEach(transaction => {
            const utilisateur = this.getUtilisateur(transaction.getIdUtilisateur());
            const livre = this.getLivre(transaction.getIsbnLivre());
            if (utilisateur && livre) {
                const message = `⚠️ ALERTE RETARD: Vous devez retourner '${livre.getTitre()}' depuis ${transaction.getJoursDeRetard()} jours!`;
                this.notificationService.notifyObservers(message);
            }
        });
    }

    // ========== AFFICHAGE ET RAPPORTS ==========

    /**
     * Afficher les statistiques de la bibliothèque
     */
    afficherStatistiques() {
        console.log('\n========== STATISTIQUES DE LA BIBLIOTHÈQUE ==========');
        console.log(`Utilisateurs: ${this.utilisateurs.size}`);
        console.log(`Livres: ${this.livres.size}`);
        console.log(`Livres disponibles: ${this.getLivresDisponibles().length}`);
        console.log(`Transactions totales: ${this.transactions.length}`);
        console.log(`Emprunts en retard: ${this.getTransactionsEnRetard().length}`);
    }

    /**
     * Afficher les livres empruntés par un utilisateur
     * @param {string} idUtilisateur - L'ID de l'utilisateur
     */
    afficherLivresEmpruntés(idUtilisateur) {
        const utilisateur = this.getUtilisateur(idUtilisateur);
        if (utilisateur) {
            console.log(`\nLivres empruntés par ${utilisateur.getNom()}:`);
            const livres = utilisateur.getLivresEmpruntés();
            if (livres.length === 0) {
                console.log('  Aucun livre emprunté');
            } else {
                livres.forEach(livre => console.log(`  - ${livre}`));
            }
        }
    }
}

module.exports = LibrarySystem;
