package com.library.observers;

import java.util.ArrayList;
import java.util.List;

/**
 * Service de notification qui implémente le pattern Observable
 * Gère les abonnés et diffuse les notifications
 */
public class NotificationService {
    private List<NotificationObserver> observers = new ArrayList<>();

    public void subscribe(NotificationObserver observer) {
        if (!observers.contains(observer)) {
            observers.add(observer);
        }
    }

    public void unsubscribe(NotificationObserver observer) {
        observers.remove(observer);
    }

    public void notifyObservers(String message) {
        for (NotificationObserver observer : observers) {
            observer.update(message);
        }
    }
}
