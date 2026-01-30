/**
 * Service de notification - Pattern Observer
 * Gère les abonnés et diffuse les notifications
 */
class NotificationService {
    constructor() {
        this.observers = [];
    }

    /**
     * S'abonner aux notifications
     * @param {NotificationObserver} observer - L'observateur à ajouter
     */
    subscribe(observer) {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }

    /**
     * Se désabonner aux notifications
     * @param {NotificationObserver} observer - L'observateur à retirer
     */
    unsubscribe(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    /**
     * Notifier tous les observateurs
     * @param {string} message - Le message à envoyer
     */
    notifyObservers(message) {
        this.observers.forEach(observer => {
            observer.update(message);
        });
    }
}

module.exports = NotificationService;
