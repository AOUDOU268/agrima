package com.agrima.user.model;

import jakarta.persistence.*;

@Entity
@Table(name = "addresses")
public class Adresse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String ligne1;
    private String ligne2;
    private String ville;
    private String codePostal;
    private String pays;
    private boolean parDefaut;

    public Adresse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLigne1() {
        return ligne1;
    }

    public void setLigne1(String ligne1) {
        this.ligne1 = ligne1;
    }

    public String getLigne2() {
        return ligne2;
    }

    public void setLigne2(String ligne2) {
        this.ligne2 = ligne2;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public String getCodePostal() {
        return codePostal;
    }

    public void setCodePostal(String codePostal) {
        this.codePostal = codePostal;
    }

    public String getPays() {
        return pays;
    }

    public void setPays(String pays) {
        this.pays = pays;
    }

    public boolean isParDefaut() {
        return parDefaut;
    }

    public void setParDefaut(boolean parDefaut) {
        this.parDefaut = parDefaut;
    }
}
