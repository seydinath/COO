/**
 * Classe TransactionEmprunt
 * Enregistre une transaction d'emprunt avec ses dates et statut
 */
class TransactionEmprunt {
    constructor(idTransaction, idUtilisateur, isbnLivre) {
        this.idTransaction = idTransaction;
        this.idUtilisateur = idUtilisateur;
        this.isbnLivre = isbnLivre;
        this.dateEmprunt = new Date();
        
        // Date de retour prévue: 14 jours après l'emprunt
        this.dateRetourPrevue = new Date();
        this.dateRetourPrevue.setDate(this.dateRetourPrevue.getDate() + 14);
        
        this.dateRetourEffective = null;
    }

    static DUREE_EMPRUNT_JOURS = 14;

    getIdTransaction() {
        return this.idTransaction;
    }

    getIdUtilisateur() {
        return this.idUtilisateur;
    }

    getIsbnLivre() {
        return this.isbnLivre;
    }

    getDateEmprunt() {
        return this.dateEmprunt;
    }

    getDateRetourPrevue() {
        return this.dateRetourPrevue;
    }

    getDateRetourEffective() {
        return this.dateRetourEffective;
    }

    setDateRetourEffective(date) {
        this.dateRetourEffective = date;
    }

    /**
     * Vérifier si le livre est en retard
     * @returns {boolean} True si en retard
     */
    isEnRetard() {
        const dateComparaison = this.dateRetourEffective || new Date();
        return dateComparaison > this.dateRetourPrevue;
    }

    /**
     * Obtenir le nombre de jours restants
     * @returns {number} Jours restants (peut être négatif si en retard)
     */
    getJoursRestants() {
        const aujourd = new Date();
        const diffTime = this.dateRetourPrevue - aujourd;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Obtenir le nombre de jours de retard
     * @returns {number} Jours de retard (0 si pas de retard)
     */
    getJoursDeRetard() {
        if (this.isEnRetard()) {
            const dateComparaison = this.dateRetourEffective || new Date();
            const diffTime = dateComparaison - this.dateRetourPrevue;
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
        return 0;
    }

    /**
     * Vérifier si le livre a été retourné
     * @returns {boolean} True si retourné
     */
    isRetourne() {
        return this.dateRetourEffective !== null;
    }

    /**
     * Formater une date
     * @param {Date} date - La date à formater
     * @returns {string} Date formatée (YYYY-MM-DD)
     */
    static formatDate(date) {
        if (!date) return null;
        return date.toISOString().split('T')[0];
    }

    toString() {
        let str = `TransactionEmprunt{
            idTransaction: '${this.idTransaction}',
            idUtilisateur: '${this.idUtilisateur}',
            isbnLivre: '${this.isbnLivre}',
            dateEmprunt: ${TransactionEmprunt.formatDate(this.dateEmprunt)},
            dateRetourPrevue: ${TransactionEmprunt.formatDate(this.dateRetourPrevue)}`;
        
        if (this.dateRetourEffective) {
            str += `,\n            dateRetourEffective: ${TransactionEmprunt.formatDate(this.dateRetourEffective)}`;
        }
        
        str += `,\n            enRetard: ${this.isEnRetard() ? 'OUI' : 'NON'}`;
        str += '\n        }';
        
        return str;
    }
}

module.exports = TransactionEmprunt;
