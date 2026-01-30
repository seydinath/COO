package com.library.system;

import com.library.models.Livre;
import com.library.models.TransactionEmprunt;
import com.library.users.Utilisateur;
import com.library.observers.NotificationService;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Singleton - LibrarySystem
 * Système principal de gestion de la bibliothèque
 * Assure qu'une seule instance existe dans toute l'application
 */
public class LibrarySystem {
    private static LibrarySystem instance;
    
    private Map<String, Utilisateur> utilisateurs;
    private Map<String, Livre> livres;
    private List<TransactionEmprunt> transactions;
    private NotificationService notificationService;
    private int compteurTransactions;

    /**
     * Constructeur privé pour empêcher l'instanciation directe
     */
    private LibrarySystem() {
        this.utilisateurs = new HashMap<>();
        this.livres = new HashMap<>();
        this.transactions = new ArrayList<>();
        this.notificationService = new NotificationService();
        this.compteurTransactions = 0;
    }

    /**
     * Retourne l'instance unique de LibrarySystem
     * @return L'instance du système de bibliothèque
     */
    public static synchronized LibrarySystem getInstance() {
        if (instance == null) {
            instance = new LibrarySystem();
        }
        return instance;
    }

    // ========== GESTION DES UTILISATEURS ==========

    public void addUtilisateur(Utilisateur utilisateur) {
        utilisateurs.put(utilisateur.getId(), utilisateur);
        notificationService.subscribe(utilisateur);
        System.out.println("✓ Utilisateur ajouté: " + utilisateur.getNom());
    }

    public Utilisateur getUtilisateur(String id) {
        return utilisateurs.get(id);
    }

    public List<Utilisateur> getAllUtilisateurs() {
        return new ArrayList<>(utilisateurs.values());
    }

    public void removeUtilisateur(String id) {
        Utilisateur user = utilisateurs.remove(id);
        if (user != null) {
            notificationService.unsubscribe(user);
            System.out.println("✓ Utilisateur supprimé: " + user.getNom());
        }
    }

    // ========== GESTION DES LIVRES ==========

    public void addLivre(Livre livre) {
        livres.put(livre.getIsbn(), livre);
        System.out.println("✓ Livre ajouté: " + livre.getTitre());
    }

    public Livre getLivre(String isbn) {
        return livres.get(isbn);
    }

    public List<Livre> getAllLivres() {
        return new ArrayList<>(livres.values());
    }

    public List<Livre> getLivresDisponibles() {
        return livres.values().stream()
                .filter(Livre::isDisponible)
                .collect(Collectors.toList());
    }

    public void removeLivre(String isbn) {
        Livre livre = livres.remove(isbn);
        if (livre != null) {
            System.out.println("✓ Livre supprimé: " + livre.getTitre());
        }
    }

    // ========== GESTION DES EMPRUNTS ==========

    public boolean emprunterLivre(String idUtilisateur, String isbnLivre) {
        Utilisateur utilisateur = getUtilisateur(idUtilisateur);
        Livre livre = getLivre(isbnLivre);

        if (utilisateur == null) {
            System.out.println("✗ Erreur: Utilisateur introuvable");
            return false;
        }

        if (livre == null) {
            System.out.println("✗ Erreur: Livre introuvable");
            return false;
        }

        if (!livre.isDisponible()) {
            System.out.println("✗ Erreur: Le livre '" + livre.getTitre() + "' n'est pas disponible");
            return false;
        }

        if (!utilisateur.peutEmprunter()) {
            System.out.println("✗ Erreur: " + utilisateur.getNom() + " a atteint sa limite d'emprunts");
            return false;
        }

        // Créer la transaction
        compteurTransactions++;
        String idTransaction = "TRANS-" + compteurTransactions;
        TransactionEmprunt transaction = new TransactionEmprunt(idTransaction, idUtilisateur, isbnLivre);
        transactions.add(transaction);

        // Mettre à jour l'état du livre
        livre.setDisponible(false);
        livre.setEmpruntePar(idUtilisateur);

        // Mettre à jour l'utilisateur
        utilisateur.addLivreEmpruntu(livre.getTitre());

        // Notification
        String message = utilisateur.getNom() + " a emprunté '" + livre.getTitre() + 
                        "'. Retour prévu le: " + transaction.getDateRetourPrevue();
        notificationService.notifyObservers(message);

        System.out.println("✓ Emprunt réussi: " + utilisateur.getNom() + " a emprunté '" + livre.getTitre() + "'");
        return true;
    }

    public boolean retournerLivre(String idUtilisateur, String isbnLivre) {
        Utilisateur utilisateur = getUtilisateur(idUtilisateur);
        Livre livre = getLivre(isbnLivre);

        if (utilisateur == null || livre == null) {
            System.out.println("✗ Erreur: Utilisateur ou livre introuvable");
            return false;
        }

        // Trouver la transaction active
        TransactionEmprunt transaction = transactions.stream()
                .filter(t -> t.getIdUtilisateur().equals(idUtilisateur) &&
                        t.getIsbnLivre().equals(isbnLivre) &&
                        !t.isRetourne())
                .findFirst()
                .orElse(null);

        if (transaction == null) {
            System.out.println("✗ Erreur: Aucun emprunt actif trouvé pour ce livre");
            return false;
        }

        // Mettre à jour la transaction
        transaction.setDateRetourEffective(LocalDate.now());

        // Mettre à jour le livre
        livre.liberer();

        // Mettre à jour l'utilisateur
        utilisateur.removeLivreEmpruntu(livre.getTitre());

        // Notification
        String message;
        if (transaction.isEnRetard()) {
            long joursRetard = transaction.getJoursDeRetard();
            message = utilisateur.getNom() + " a retourné '" + livre.getTitre() + 
                    "' avec " + joursRetard + " jours de retard!";
        } else {
            message = utilisateur.getNom() + " a retourné '" + livre.getTitre() + "' à temps.";
        }
        notificationService.notifyObservers(message);

        System.out.println("✓ Retour effectué: " + message);
        return true;
    }

    public List<TransactionEmprunt> getTransactionsUtilisateur(String idUtilisateur) {
        return transactions.stream()
                .filter(t -> t.getIdUtilisateur().equals(idUtilisateur))
                .collect(Collectors.toList());
    }

    public List<TransactionEmprunt> getTransactionsEnRetard() {
        return transactions.stream()
                .filter(t -> t.isEnRetard() && !t.isRetourne())
                .collect(Collectors.toList());
    }

    // ========== NOTIFICATIONS ==========

    public void notifierRetards() {
        List<TransactionEmprunt> retards = getTransactionsEnRetard();
        for (TransactionEmprunt transaction : retards) {
            Utilisateur utilisateur = getUtilisateur(transaction.getIdUtilisateur());
            Livre livre = getLivre(transaction.getIsbnLivre());
            if (utilisateur != null && livre != null) {
                String message = "⚠️ ALERTE RETARD: Vous devez retourner '" + livre.getTitre() + 
                                "' depuis " + transaction.getJoursDeRetard() + " jours!";
                notificationService.notifyObservers(message);
            }
        }
    }

    // ========== AFFICHAGE ET RAPPORTS ==========

    public void afficherStatistiques() {
        System.out.println("\n========== STATISTIQUES DE LA BIBLIOTHÈQUE ==========");
        System.out.println("Utilisateurs: " + utilisateurs.size());
        System.out.println("Livres: " + livres.size());
        System.out.println("Livres disponibles: " + getLivresDisponibles().size());
        System.out.println("Transactions totales: " + transactions.size());
        System.out.println("Emprunts en retard: " + getTransactionsEnRetard().size());
    }

    public void afficherLivresEmpruntés(String idUtilisateur) {
        Utilisateur utilisateur = getUtilisateur(idUtilisateur);
        if (utilisateur != null) {
            System.out.println("\nLivres empruntés par " + utilisateur.getNom() + ":");
            if (utilisateur.getLivresEmpruntés().isEmpty()) {
                System.out.println("  Aucun livre emprunté");
            } else {
                utilisateur.getLivresEmpruntés().forEach(livre -> System.out.println("  - " + livre));
            }
        }
    }
}
