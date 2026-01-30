package com.library.observers;

/**
 * Interface Observer pour le système de notifications
 * Permet aux utilisateurs de recevoir des notifications sur les changements d'état
 */
public interface NotificationObserver {
    void update(String message);
}
