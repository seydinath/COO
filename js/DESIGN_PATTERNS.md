# Patrons de Conception - Explications Détaillées

## 📚 Vue d'ensemble

Ce projet implémente trois patrons de conception majeurs selon les principes de la Conception Orientée Objet (POO).

---

## 1️⃣ SINGLETON PATTERN - LibrarySystem

### 🎯 Objectif
Assurer qu'une **seule instance** de la classe `LibrarySystem` existe dans toute l'application.

### 🔧 Implémentation

```javascript
class LibrarySystem {
    constructor() {
        // Vérifier s'il existe déjà une instance
        if (LibrarySystem.instance) {
            return LibrarySystem.instance;
        }

        // Initialisation première fois
        this.utilisateurs = new Map();
        this.livres = new Map();
        this.transactions = [];
        this.notificationService = new NotificationService();

        // Stocker l'instance unique
        LibrarySystem.instance = this;
    }

    static getInstance() {
        if (!LibrarySystem.instance) {
            new LibrarySystem();
        }
        return LibrarySystem.instance;
    }
}
```

### ✅ Avantages

| Avantage | Description |
|----------|------------|
| **Unicité** | Garantit une seule instance du système |
| **Accès global** | `LibrarySystem.getInstance()` partout dans l'app |
| **Contrôle centralisé** | Gère tous les utilisateurs, livres et transactions |
| **Économie mémoire** | Une seule instance en mémoire |

### 📝 Utilisation

```javascript
// Obtenir l'instance depuis n'importe où
const library1 = LibrarySystem.getInstance();
const library2 = LibrarySystem.getInstance();

// library1 et library2 pointent sur la MÊME instance
console.log(library1 === library2); // true
```

---

## 2️⃣ FACTORY PATTERN - UserFactory

### 🎯 Objectif
Encapsuler la **création d'objets** utilisateurs sans exposer la logique complexe.

### 🔧 Implémentation

```javascript
class UserFactory {
    static UserType = {
        ETUDIANT: 'ETUDIANT',
        ENSEIGNANT: 'ENSEIGNANT'
    };

    static createUser(type, id, nom, email, additionalInfo) {
        switch (type) {
            case UserFactory.UserType.ETUDIANT:
                return new Etudiant(id, nom, email, additionalInfo);
            case UserFactory.UserType.ENSEIGNANT:
                return new Enseignant(id, nom, email, additionalInfo);
            default:
                throw new Error(`Type inconnu: ${type}`);
        }
    }
}
```

### ✅ Avantages

| Avantage | Description |
|----------|------------|
| **Encapsulation** | Masque la complexité de création |
| **Extensibilité** | Ajouter nouveau type sans changer le client |
| **Maintenabilité** | Un seul point de modification |
| **Flexibilité** | Créer n'importe quel type d'utilisateur |

### 📝 Utilisation

```javascript
// Avant (sans Factory) - Couplage fort
const etudiant = new Etudiant('E001', 'Alice', 'alice@mail.com', 'E2023');

// Après (avec Factory) - Couplage faible
const etudiant = UserFactory.createUser(
    UserFactory.UserType.ETUDIANT,
    'E001',
    'Alice',
    'alice@mail.com',
    'E2023'
);

// Si on veut ajouter un nouveau type de professeur...
// On modifie juste la Factory!
```

### 🔄 Hiérarchie d'héritage

```
      Utilisateur (abstraite)
      /            \
   Étudiant    Enseignant
   (3 max)     (5 max)
      \            /
       UserFactory
```

---

## 3️⃣ OBSERVER PATTERN - NotificationService

### 🎯 Objectif
Permettre à des objets (`Utilisateur`) de **s'abonner** aux changements d'état et être **notifiés automatiquement**.

### 🔧 Implémentation

```javascript
// Interface Observer
class NotificationObserver {
    update(message) {
        throw new Error('update() doit être implémenté');
    }
}

// Service Observable
class NotificationService {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }

    notifyObservers(message) {
        this.observers.forEach(observer => {
            observer.update(message);
        });
    }
}

// Observer concret
class Utilisateur extends NotificationObserver {
    update(message) {
        console.log(`[Notification pour ${this.nom}] ${message}`);
    }
}
```

### ✅ Avantages

| Avantage | Description |
|----------|------------|
| **Couplage faible** | Subject et Observer indépendants |
| **Notifications auto** | Tous les observateurs informés |
| **Dynamique** | Ajout/suppression d'observateurs à runtime |
| **Maintenabilité** | Facile d'ajouter de nouveaux observateurs |

### 📝 Utilisation et flux

```javascript
// 1. Les utilisateurs s'abonnent au service
notificationService.subscribe(etudiant);
notificationService.subscribe(enseignant);

// 2. Quand quelque chose change...
notificationService.notifyObservers("Alice a emprunté 'Les Misérables'");

// 3. Tous les abonnés reçoivent la notification
// [Notification pour Étudiant] Alice a emprunté 'Les Misérables'
// [Notification pour Enseignant] Alice a emprunté 'Les Misérables'
```

### 🔄 Diagramme du flux

```
┌─────────────────┐
│ LibrarySystem   │
│   (Subject)     │
└────────┬────────┘
         │ notifyObservers()
         │
    ┌────┴────┬─────────┐
    ▼         ▼         ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Alice   │ │  Bob    │ │ Pierre  │
│(Observer)│ │(Observer)│ │(Observer)│
└─────────┘ └─────────┘ └─────────┘
   update()   update()    update()
```

---

## 🏗️ Architecture globale

### Diagramme des interactions

```
┌──────────────────────────────────────────────────────────┐
│                   LibrarySystem (Singleton)              │
│  - Gère les utilisateurs                                 │
│  - Gère les livres                                       │
│  - Gère les transactions                                 │
│  - Coordonne les notifications                           │
└──────────────────────────────────────────────────────────┘
           │                    │                   │
           ▼                    ▼                   ▼
   ┌─────────────────┐  ┌──────────────┐  ┌──────────────────┐
   │  UserFactory    │  │   Livres     │  │ Notifications    │
   │  (Factory)      │  │              │  │ (Observer)       │
   └─────────────────┘  └──────────────┘  └──────────────────┘
           │
      ┌────┴─────┐
      ▼          ▼
   Étudiant   Enseignant
   (3 max)    (5 max)
```

---

## 📊 Principes SOLID appliqués

### S - Single Responsibility
- **Utilisateur**: Gère les données utilisateur
- **Livre**: Gère les données de livre
- **TransactionEmprunt**: Gère les données d'emprunt
- **LibrarySystem**: Orchestre le système
- **UserFactory**: Crée les utilisateurs
- **NotificationService**: Envoie les notifications

### O - Open/Closed
- ✅ Extensible via héritage (ajouter Administrateur?)
- ✅ Extensible via Factory (ajouter nouveau type d'utilisateur)
- ✅ Extensible via Observer (ajouter nouveaux observateurs)

### L - Liskov Substitution
- Les sous-classes (Étudiant, Enseignant) peuvent remplacer Utilisateur
- Les implémentations de NotificationObserver sont interchangeables

### I - Interface Segregation
- **NotificationObserver**: Interface simple et focalisée
- Pas d'interface "grosse" avec trop de méthodes

### D - Dependency Inversion
- LibrarySystem dépend d'abstractions (Utilisateur, NotificationObserver)
- Pas de dépendances directes sur les implémentations concrètes

---

## 🔄 Cycle de vie des objets

### 1. Création d'un utilisateur

```javascript
// La Factory crée l'utilisateur
const etudiant = UserFactory.createUser(
    UserFactory.UserType.ETUDIANT,
    'E001',
    'Alice',
    'alice@mail.com',
    'E20230001'
);

// L'utilisateur s'abonne au système
library.addUtilisateur(etudiant);
// => notificationService.subscribe(etudiant)
```

### 2. Emprunt d'un livre

```javascript
library.emprunterLivre('E001', 'ISBN-001');

// Notifications envoyées
notificationService.notifyObservers(
    "Alice a emprunté 'Les Misérables'. Retour prévu..."
);
// => Chaque utilisateur abonné reçoit la notification
```

### 3. Retour d'un livre

```javascript
library.retournerLivre('E001', 'ISBN-001');

// Notifications de retour envoyées
notificationService.notifyObservers(
    "Alice a retourné 'Les Misérables' à temps."
);
```

---

## 🎓 Points clés à retenir

| Patron | Rôle | Bénéfice |
|--------|------|----------|
| **Singleton** | Une seule instance du système | Contrôle centralisé |
| **Factory** | Crée les objets utilisateurs | Encapsulation, flexibilité |
| **Observer** | Notifie les changements d'état | Couplage faible, maintenabilité |

---

## 💡 Améliorations futures possibles

1. **Strategy Pattern**: Différentes stratégies de calcul d'amendes
2. **Decorator Pattern**: Ajouter des fonctionnalités aux livres
3. **Command Pattern**: Historique des opérations
4. **Template Method**: Processus d'emprunt standardisé
5. **State Pattern**: Gestion des états d'un livre

---

*Développé en suivant les meilleures pratiques de la POO et de l'architecture logicielle.*
