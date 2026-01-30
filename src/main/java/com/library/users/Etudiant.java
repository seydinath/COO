package com.library.users;

/**
 * Classe Étudiant
 * Représente un étudiant qui peut emprunter jusqu'à 3 livres
 */
public class Etudiant extends Utilisateur {
    private String numeroEtudiant;
    private static final int MAX_EMPRUNTS = 3;

    public Etudiant(String id, String nom, String email, String numeroEtudiant) {
        super(id, nom, email);
        this.numeroEtudiant = numeroEtudiant;
    }

    public String getNumeroEtudiant() {
        return numeroEtudiant;
    }

    @Override
    protected int getMaxEmprunt() {
        return MAX_EMPRUNTS;
    }

    @Override
    public String toString() {
        return "Étudiant{" +
                "id='" + getId() + '\'' +
                ", nom='" + getNom() + '\'' +
                ", email='" + getEmail() + '\'' +
                ", numeroEtudiant='" + numeroEtudiant + '\'' +
                ", livresEmpruntés=" + getNombreLivresEmpruntés() + "/" + MAX_EMPRUNTS +
                '}';
    }
}
