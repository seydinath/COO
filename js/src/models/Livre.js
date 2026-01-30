/**
 * Classe Livre
 * Représente un livre dans la bibliothèque
 */
class Livre {
    constructor(isbn, titre, auteur, categorie) {
        this.isbn = isbn;
        this.titre = titre;
        this.auteur = auteur;
        this.categorie = categorie;
        this.disponible = true;
        this.empruntePar = null; // ID de l'utilisateur qui a emprunté le livre
    }

    getIsbn() {
        return this.isbn;
    }

    getTitre() {
        return this.titre;
    }

    getAuteur() {
        return this.auteur;
    }

    getCategorie() {
        return this.categorie;
    }

    isDisponible() {
        return this.disponible;
    }

    setDisponible(disponible) {
        this.disponible = disponible;
    }

    getEmpruntePar() {
        return this.empruntePar;
    }

    setEmpruntePar(userId) {
        this.empruntePar = userId;
    }

    /**
     * Libérer le livre (le rendre disponible)
     */
    liberer() {
        this.disponible = true;
        this.empruntePar = null;
    }

    toString() {
        let str = `Livre{
            isbn: '${this.isbn}',
            titre: '${this.titre}',
            auteur: '${this.auteur}',
            categorie: '${this.categorie}',
            disponible: ${this.disponible}`;
        
        if (this.empruntePar) {
            str += `,\n            empruntePar: '${this.empruntePar}'`;
        }
        
        str += '\n        }';
        return str;
    }
}

module.exports = Livre;
