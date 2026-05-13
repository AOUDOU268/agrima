DB Checker
==========

Utilitaire simple pour tester les connexions JDBC vers les bases PostgreSQL utilisées par les services.

Usage:

- Lancer via Maven (exécute la classe principale):

```bash
mvn -q exec:java -Dexec.mainClass="com.agrima.dbchecker.DbChecker"
```

- Vous pouvez aussi passer des arguments: chaque argument a la forme `id,url,user,pass`.

Exemple:

```bash
mvn -q exec:java -Dexec.mainClass="com.agrima.dbchecker.DbChecker" -Dexec.args="user_db,jdbc:postgresql://localhost:5432/user_db,postgres,postgres"
```

Le fichier `src/main/resources/dbs.properties` contient par défaut les connexions détectées dans le projet. Modifiez-le si nécessaire.

PowerShell note:

If you run the command from Windows PowerShell, PowerShell may parse `-D` properties incorrectly. Use `--%` to stop PowerShell parsing, for example (run this from the `backend/db-checker` directory):

```powershell
mvn -q --% -Dexec.mainClass=com.agrima.dbchecker.DbChecker exec:java
```
