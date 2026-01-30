package com.library.models;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * Classe TransactionEmprunt
 * Enregistre une transaction d'emprunt avec ses dates et statut
 */
public class TransactionEmprunt {
    private String idTransaction;
    private String idUtilisateur;
    private String isbnLivre;
    private LocalDate dateEmprunt;
    private LocalDate dateRetourPrevue;
    private LocalDate dateRetourEffective;
    private static final long DUREE_EMPRUNT_JOURS = 14;

    public TransactionEmprunt(String idTransaction, String idUtilisateur, String isbnLivre) {
        this.idTransaction = idTransaction;
        this.idUtilisateur = idUtilisateur;
        this.isbnLivre = isbnLivre;
        this.dateEmprunt = LocalDate.now();
        this.dateRetourPrevue = dateEmprunt.plus(DUREE_EMPRUNT_JOURS, ChronoUnit.DAYS);
        this.dateRetourEffective = null;
    }

    public String getIdTransaction() {
        return idTransaction;
    }

    public String getIdUtilisateur() {
        return idUtilisateur;
    }

    public String getIsbnLivre() {
        return isbnLivre;
    }

    public LocalDate getDateEmprunt() {
        return dateEmprunt;
    }

    public LocalDate getDateRetourPrevue() {
        return dateRetourPrevue;
    }

    public LocalDate getDateRetourEffective() {
        return dateRetourEffective;
    }

    public void setDateRetourEffective(LocalDate date) {
        this.dateRetourEffective = date;
    }

    public boolean isEnRetard() {
        if (dateRetourEffective != null) {
            return dateRetourEffective.isAfter(dateRetourPrevue);
        }
        return LocalDate.now().isAfter(dateRetourPrevue);
    }

    public long getJoursRestants() {
        return ChronoUnit.DAYS.between(LocalDate.now(), dateRetourPrevue);
    }

    public long getJoursDeRetard() {
        if (isEnRetard()) {
            LocalDate dateComparaison = dateRetourEffective != null ? 
                    dateRetourEffective : LocalDate.now();
            return ChronoUnit.DAYS.between(dateRetourPrevue, dateComparaison);
        }
        return 0;
    }

    public boolean isRetourne() {
        return dateRetourEffective != null;
    }

    @Override
    public String toString() {
        return "TransactionEmprunt{" +
                "idTransaction='" + idTransaction + '\'' +
                ", idUtilisateur='" + idUtilisateur + '\'' +
                ", isbnLivre='" + isbnLivre + '\'' +
                ", dateEmprunt=" + dateEmprunt +
                ", dateRetourPrevue=" + dateRetourPrevue +
                (dateRetourEffective != null ? ", dateRetourEffective=" + dateRetourEffective : "") +
                ", enRetard=" + (isEnRetard() ? "OUI" : "NON") +
                '}';
    }
}
