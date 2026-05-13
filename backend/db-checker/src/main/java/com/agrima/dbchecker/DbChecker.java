package com.agrima.dbchecker;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class DbChecker {

    public static class DbInfo {
        String id;
        String url;
        String user;
        String pass;

        DbInfo(String id, String url, String user, String pass) {
            this.id = id;
            this.url = url;
            this.user = user;
            this.pass = pass;
        }
    }

    public static void main(String[] args) {
        List<DbInfo> dbs = new ArrayList<>();

        // Load default properties from classpath resource if present
        Properties props = new Properties();
        try (InputStream in = DbChecker.class.getClassLoader().getResourceAsStream("dbs.properties")) {
            if (in != null) {
                props.load(in);
                for (String name : props.stringPropertyNames()) {
                    if (name.endsWith(".url")) {
                        String id = name.substring(0, name.length() - 4);
                        String url = props.getProperty(id + ".url");
                        String user = props.getProperty(id + ".user", "");
                        String pass = props.getProperty(id + ".pass", "");
                        dbs.add(new DbInfo(id, url, user, pass));
                    }
                }
            }
        } catch (IOException e) {
            System.err.println("Impossible de lire dbs.properties: " + e.getMessage());
        }

        // Also accept arguments: each arg = id,url,user,pass
        for (String a : args) {
            String[] parts = a.split(",");
            if (parts.length >= 3) {
                String id = parts[0];
                String url = parts[1];
                String user = parts[2];
                String pass = parts.length >= 4 ? parts[3] : "";
                dbs.add(new DbInfo(id, url, user, pass));
            }
        }

        if (dbs.isEmpty()) {
            System.out.println("Aucune configuration de base de données trouvée. Ajoutez un fichier dbs.properties ou passez des arguments.");
            System.exit(2);
        }

        int failures = 0;
        for (DbInfo db : dbs) {
            System.out.printf("Vérification %s -> %s ... ", db.id, db.url);
            try (Connection c = DriverManager.getConnection(db.url, db.user, db.pass)) {
                if (c != null && !c.isClosed()) {
                    System.out.println("OK");
                } else {
                    System.out.println("ECHEC (connexion nulle)");
                    failures++;
                }
            } catch (SQLException e) {
                System.out.println("ECHEC: " + e.getMessage());
                failures++;
            }
        }

        if (failures > 0) {
            System.exit(1);
        } else {
            System.exit(0);
        }
    }
}
