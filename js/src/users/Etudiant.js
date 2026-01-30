const Utilisateur = require('./Utilisateur');

/**
 * Classe Étudiant
 * Représente un étudiant qui peut emprunter jusqu'à 3 livres
 */
class Etudiant extends Utilisateur {
    constructor(id, nom, email, numeroEtudiant) {
        super(id, nom, email);
        this.numeroEtudiant = numeroEtudiant;
    }

    static MAX_EMPRUNTS = 3;

    getMaxEmprunt() {
        return Etudiant.MAX_EMPRUNTS;
    }

    getNumeroEtudiant() {
        return this.numeroEtudiant;
    }

    toString() {
        return `Étudiant{
            id: '${this.id}',
            nom: '${this.nom}',
            email: '${this.email}',
            numeroEtudiant: '${this.numeroEtudiant}',
            livresEmpruntés: ${this.getNombreLivresEmpruntés()}/${Etudiant.MAX_EMPRUNTS}
        }`;
    }
}

module.exports = Etudiant;
