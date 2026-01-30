const Etudiant = require('../users/Etudiant');
const Enseignant = require('../users/Enseignant');

/**
 * Factory Pattern - UserFactory
 * Crée les instances d'utilisateurs en fonction du type
 */
class UserFactory {
    static UserType = {
        ETUDIANT: 'ETUDIANT',
        ENSEIGNANT: 'ENSEIGNANT'
    };

    /**
     * Crée un utilisateur du type spécifié
     * @param {string} type - Le type d'utilisateur (ETUDIANT ou ENSEIGNANT)
     * @param {string} id - L'identifiant de l'utilisateur
     * @param {string} nom - Le nom de l'utilisateur
     * @param {string} email - L'email de l'utilisateur
     * @param {string} additionalInfo - Information supplémentaire (numéro étudiant ou département)
     * @returns {Utilisateur} L'utilisateur créé
     */
    static createUser(type, id, nom, email, additionalInfo) {
        switch (type) {
            case UserFactory.UserType.ETUDIANT:
                return new Etudiant(id, nom, email, additionalInfo);
            case UserFactory.UserType.ENSEIGNANT:
                return new Enseignant(id, nom, email, additionalInfo);
            default:
                throw new Error(`Type d'utilisateur inconnu: ${type}`);
        }
    }
}

module.exports = UserFactory;
