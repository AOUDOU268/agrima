package com.agrima.user.model;

import jakarta.persistence.*;

@Embeddable
public class PreferencesUtilisateur {
    private boolean newsletter;
    private String langue;
    private boolean notificationsProduit;

    public PreferencesUtilisateur() {
        this.newsletter = false;
        this.langue = "fr";
        this.notificationsProduit = true;
    }

    public boolean isNewsletter() {
        return newsletter;
    }

    public void setNewsletter(boolean newsletter) {
        this.newsletter = newsletter;
    }

    public String getLangue() {
        return langue;
    }

    public void setLangue(String langue) {
        this.langue = langue;
    }

    public boolean isNotificationsProduit() {
        return notificationsProduit;
    }

    public void setNotificationsProduit(boolean notificationsProduit) {
        this.notificationsProduit = notificationsProduit;
    }
}
