package com.library.users;

import com.library.observers.NotificationObserver;
import java.util.ArrayList;
import java.util.List;

/**
 * Classe abstraite Utilisateur
 * Définit le comportement partagé pour tous les types d'utilisateurs
 */
public abstract class Utilisateur implements NotificationObserver {
    private String id;
    private String nom;
    private String email;
    private List<String> livresEmpruntés;
    
    // Limite d'emprunts par type d'utilisateur
    protected abstract int getMaxEmprunt();

    public Utilisateur(String id, String nom, String email) {
        this.id = id;
        this.nom = nom;
        this.email = email;
        this.livresEmpruntés = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getEmail() {
        return email;
    }

    public List<String> getLivresEmpruntés() {
        return livresEmpruntés;
    }

    public void addLivreEmpruntu(String livreTitre) {
        if (livresEmpruntés.size() < getMaxEmprunt()) {
            livresEmpruntés.add(livreTitre);
        }
    }

    public void removeLivreEmpruntu(String livreTitre) {
        livresEmpruntés.remove(livreTitre);
    }

    public int getNombreLivresEmpruntés() {
        return livresEmpruntés.size();
    }

    public boolean peutEmprunter() {
        return livresEmpruntés.size() < getMaxEmprunt();
    }

    @Override
    public void update(String message) {
        System.out.println("[Notification pour " + nom + "] " + message);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "{" +
                "id='" + id + '\'' +
                ", nom='" + nom + '\'' +
                ", email='" + email + '\'' +
                ", livresEmpruntés=" + livresEmpruntés.size() +
                '}';
    }
}
