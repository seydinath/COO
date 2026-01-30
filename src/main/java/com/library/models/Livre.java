package com.library.models;

/**
 * Classe Livre
 * Représente un livre dans la bibliothèque
 */
public class Livre {
    private String isbn;
    private String titre;
    private String auteur;
    private String categorie;
    private boolean disponible;
    private String empruntePar; // ID de l'utilisateur qui a emprunté le livre

    public Livre(String isbn, String titre, String auteur, String categorie) {
        this.isbn = isbn;
        this.titre = titre;
        this.auteur = auteur;
        this.categorie = categorie;
        this.disponible = true;
        this.empruntePar = null;
    }

    public String getIsbn() {
        return isbn;
    }

    public String getTitre() {
        return titre;
    }

    public String getAuteur() {
        return auteur;
    }

    public String getCategorie() {
        return categorie;
    }

    public boolean isDisponible() {
        return disponible;
    }

    public void setDisponible(boolean disponible) {
        this.disponible = disponible;
    }

    public String getEmpruntePar() {
        return empruntePar;
    }

    public void setEmpruntePar(String userId) {
        this.empruntePar = userId;
    }

    public void liberer() {
        this.disponible = true;
        this.empruntePar = null;
    }

    @Override
    public String toString() {
        return "Livre{" +
                "isbn='" + isbn + '\'' +
                ", titre='" + titre + '\'' +
                ", auteur='" + auteur + '\'' +
                ", categorie='" + categorie + '\'' +
                ", disponible=" + disponible +
                (empruntePar != null ? ", empruntePar='" + empruntePar + '\'' : "") +
                '}';
    }
}
