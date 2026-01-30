# Système de Gestion de Bibliothèque - JavaScript

Un système complet de gestion de bibliothèque implémenté en JavaScript utilisant les principes de la Conception Orientée Objet (POO) et plusieurs patrons de conception.

## 📋 Caractéristiques principales

### Patrons de conception utilisés:

1. **Singleton Pattern** - LibrarySystem
   - Assure qu'une seule instance du système existe
   - Gère centralement tous les utilisateurs, livres et transactions

2. **Factory Pattern** - UserFactory
   - Crée des instances d'utilisateurs (Étudiant ou Enseignant)
   - Encapsule la logique de création d'objets

3. **Observer Pattern** - NotificationService
   - Permet aux utilisateurs de recevoir des notifications
   - Notifie les utilisateurs des changements (emprunts, retours, retards)

### Concepts POO implémentés:

- **Héritage**: Les classes `Étudiant` et `Enseignant` héritent de `Utilisateur`
- **Abstraction**: Classe abstraite `Utilisateur` avec méthode abstraite `getMaxEmprunt()`
- **Encapsulation**: Champs privés et getter/setter
- **Polymorphisme**: Implémentation de l'interface `NotificationObserver`

## 📁 Structure du projet

```
js/
├── src/
│   ├── models/
│   │   ├── Livre.js                 # Classe Livre
│   │   └── TransactionEmprunt.js    # Classe Transaction d'emprunt
│   ├── users/
│   │   ├── Utilisateur.js           # Classe abstraite Utilisateur
│   │   ├── Etudiant.js              # Classe Étudiant (limite: 3 emprunts)
│   │   └── Enseignant.js            # Classe Enseignant (limite: 5 emprunts)
│   ├── factories/
│   │   └── UserFactory.js           # Factory pour créer les utilisateurs
│   ├── observers/
│   │   ├── NotificationObserver.js  # Interface Observer
│   │   └── NotificationService.js   # Service de notification
│   └── system/
│       └── LibrarySystem.js         # Singleton - Cœur du système
├── demo.js                           # Fichier de démonstration
├── package.json                      # Configuration npm
└── README.md                         # Cette documentation
```

## 🚀 Installation et exécution

### Prérequis
- Node.js installé sur votre système

### Exécuter la démonstration

```bash
cd js
npm install
npm start
```

Ou directement:
```bash
node demo.js
```

## 🎯 Fonctionnalités

### Gestion des utilisateurs
- Créer des utilisateurs (Étudiants et Enseignants)
- Consulter la liste des utilisateurs
- Supprimer des utilisateurs

### Gestion des livres
- Ajouter des livres à la bibliothèque
- Consulter la liste des livres
- Vérifier la disponibilité des livres
- Supprimer des livres

### Gestion des emprunts
- **Emprunter un livre**: Avec vérification de disponibilité et limite d'emprunt
- **Retourner un livre**: Avec suivi des retards
- **Consulter les livres empruntés**: Par utilisateur
- **Vérifier les retards**: Liste des emprunts en retard

### Limitations d'emprunt
- **Étudiants**: Maximum 3 livres simultanément
- **Enseignants**: Maximum 5 livres simultanément
- Durée d'emprunt: 14 jours

### Notifications
- Notifications lors des emprunts et retours
- Alertes de retard pour les utilisateurs
- Système observable pour les changements d'état

## 💡 Exemple d'utilisation

```javascript
const LibrarySystem = require('./src/system/LibrarySystem');
const UserFactory = require('./src/factories/UserFactory');
const Livre = require('./src/models/Livre');

// Obtenir l'instance singleton
const library = LibrarySystem.getInstance();

// Créer un utilisateur avec la Factory
const etudiant = UserFactory.createUser(
    UserFactory.UserType.ETUDIANT,
    'E001',
    'Alice Dupont',
    'alice@university.edu',
    'E20230001'
);

// Ajouter au système
library.addUtilisateur(etudiant);

// Ajouter un livre
const livre = new Livre(
    'ISBN-001',
    'Les Misérables',
    'Victor Hugo',
    'Littérature classique'
);
library.addLivre(livre);

// Emprunter un livre
library.emprunterLivre('E001', 'ISBN-001');

// Afficher les livres empruntés
library.afficherLivresEmpruntés('E001');

// Retourner un livre
library.retournerLivre('E001', 'ISBN-001');
```

## 📊 Classes principales

### Utilisateur (abstraite)
- Classe de base pour tous les utilisateurs
- Implémente l'interface `NotificationObserver`
- Méthode abstraite: `getMaxEmprunt()`

### Étudiant et Enseignant
- Héritent de `Utilisateur`
- Limites d'emprunt différentes
- Propriétés spécifiques (numéro étudiant, département)

### Livre
- Représente un livre avec ISBN, titre, auteur, catégorie
- Gère l'état de disponibilité

### TransactionEmprunt
- Enregistre les données d'emprunt
- Suivi des dates et des retards
- Calcul des jours restants et de retard

### LibrarySystem (Singleton)
- Gère tous les utilisateurs
- Gère tous les livres
- Gère les transactions d'emprunt
- Coordonne les notifications

## 🔐 Principes appliqués

1. **DRY (Don't Repeat Yourself)**
   - Code réutilisable et bien organisé
   - Héritage pour éviter les répétitions

2. **SOLID**
   - Single Responsibility: Chaque classe a une responsabilité unique
   - Open/Closed: Extensible via héritage et interfaces
   - Liskov: Les classes dérivées peuvent remplacer la classe de base
   - Interface Segregation: Interfaces spécifiques
   - Dependency Inversion: Utilisation d'abstractions

3. **Design Patterns**
   - Factory pour la création d'objets
   - Singleton pour l'unicité du système
   - Observer pour les notifications

## 📝 Améliorations possibles

- Ajouter une persistance de données (base de données ou fichiers)
- Implémentation d'une interface utilisateur web
- Système de réservation de livres
- Système de notation/avis sur les livres
- Gestion des amendes pour retards
- Exportation de rapports (PDF, CSV)


