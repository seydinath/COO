package com.library.users;

/**
 * Classe Enseignant
 * Représente un enseignant qui peut emprunter jusqu'à 5 livres
 */
public class Enseignant extends Utilisateur {
    private String departement;
    private static final int MAX_EMPRUNTS = 5;

    public Enseignant(String id, String nom, String email, String departement) {
        super(id, nom, email);
        this.departement = departement;
    }

    public String getDepartement() {
        return departement;
    }

    @Override
    protected int getMaxEmprunt() {
        return MAX_EMPRUNTS;
    }

    @Override
    public String toString() {
        return "Enseignant{" +
                "id='" + getId() + '\'' +
                ", nom='" + getNom() + '\'' +
                ", email='" + getEmail() + '\'' +
                ", departement='" + departement + '\'' +
                ", livresEmpruntés=" + getNombreLivresEmpruntés() + "/" + MAX_EMPRUNTS +
                '}';
    }
}
