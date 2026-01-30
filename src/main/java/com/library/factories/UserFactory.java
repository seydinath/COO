package com.library.factories;

import com.library.users.Utilisateur;
import com.library.users.Etudiant;
import com.library.users.Enseignant;

/**
 * Factory Pattern - UserFactory
 * Crée les instances d'utilisateurs en fonction du type
 */
public class UserFactory {

    public enum UserType {
        ETUDIANT,
        ENSEIGNANT
    }

    /**
     * Crée un utilisateur du type spécifié
     * @param type Le type d'utilisateur à créer
     * @param id L'identifiant de l'utilisateur
     * @param nom Le nom de l'utilisateur
     * @param email L'email de l'utilisateur
     * @param additionalInfo Information supplémentaire (numéro étudiant ou département)
     * @return L'utilisateur créé
     */
    public static Utilisateur createUser(UserType type, String id, String nom, 
                                         String email, String additionalInfo) {
        switch (type) {
            case ETUDIANT:
                return new Etudiant(id, nom, email, additionalInfo);
            case ENSEIGNANT:
                return new Enseignant(id, nom, email, additionalInfo);
            default:
                throw new IllegalArgumentException("Type d'utilisateur inconnu: " + type);
        }
    }
}
