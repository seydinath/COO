/**
 * Interface NotificationObserver
 * Définit le contrat pour les observateurs
 */
class NotificationObserver {
    /**
     * Méthode appelée quand une notification est envoyée
     * @param {string} message - Le message de notification
     */
    update(message) {
        throw new Error('update() doit être implémenté');
    }
}

module.exports = NotificationObserver;
