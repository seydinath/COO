const NotificationObserver = require('../observers/NotificationObserver');

/**
 * Classe abstraite Utilisateur
 * Définit le comportement partagé pour tous les types d'utilisateurs
 */
class Utilisateur extends NotificationObserver {
    constructor(id, nom, email) {
        super();
        this.id = id;
        this.nom = nom;
        this.email = email;
        this.livresEmpruntés = [];
    }

    /**
     * Méthode abstraite - doit être implémentée par les sous-classes
     * @returns {number} Limite d'emprunts
     */
    getMaxEmprunt() {
        throw new Error('getMaxEmprunt() doit être implémenté');
    }

    getId() {
        return this.id;
    }

    getNom() {
        return this.nom;
    }

    getEmail() {
        return this.email;
    }

    getLivresEmpruntés() {
        return this.livresEmpruntés;
    }

    /**
     * Ajouter un livre emprunté
     * @param {string} livreTitre - Le titre du livre
     */
    addLivreEmpruntu(livreTitre) {
        if (this.livresEmpruntés.length < this.getMaxEmprunt()) {
            this.livresEmpruntés.push(livreTitre);
        }
    }

    /**
     * Retirer un livre emprunté
     * @param {string} livreTitre - Le titre du livre
     */
    removeLivreEmpruntu(livreTitre) {
        const index = this.livresEmpruntés.indexOf(livreTitre);
        if (index > -1) {
            this.livresEmpruntés.splice(index, 1);
        }
    }

    getNombreLivresEmpruntés() {
        return this.livresEmpruntés.length;
    }

    /**
     * Vérifier si l'utilisateur peut emprunter
     * @returns {boolean} True si limite non atteinte
     */
    peutEmprunter() {
        return this.livresEmpruntés.length < this.getMaxEmprunt();
    }

    /**
     * Implémenter l'interface NotificationObserver
     * @param {string} message - Le message de notification
     */
    update(message) {
        console.log(`[Notification pour ${this.nom}] ${message}`);
    }

    toString() {
        return `${this.constructor.name}{
            id: '${this.id}',
            nom: '${this.nom}',
            email: '${this.email}',
            livresEmpruntés: ${this.livresEmpruntés.length}
        }`;
    }
}

module.exports = Utilisateur;
