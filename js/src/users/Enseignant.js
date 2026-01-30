const Utilisateur = require('./Utilisateur');

/**
 * Classe Enseignant
 * Représente un enseignant qui peut emprunter jusqu'à 5 livres
 */
class Enseignant extends Utilisateur {
    constructor(id, nom, email, departement) {
        super(id, nom, email);
        this.departement = departement;
    }

    static MAX_EMPRUNTS = 5;

    getMaxEmprunt() {
        return Enseignant.MAX_EMPRUNTS;
    }

    getDepartement() {
        return this.departement;
    }

    toString() {
        return `Enseignant{
            id: '${this.id}',
            nom: '${this.nom}',
            email: '${this.email}',
            departement: '${this.departement}',
            livresEmpruntés: ${this.getNombreLivresEmpruntés()}/${Enseignant.MAX_EMPRUNTS}
        }`;
    }
}

module.exports = Enseignant;
