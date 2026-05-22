# Test Scenario's - Kitesurfschool Windkracht-12

Om aan te tonen dat de applicatie goed omgaat met invoer en fouten, zijn er zowel **Happy Path** (succesvolle afhandeling) als **Unhappy Path** (foutafhandeling) scenario's uitgewerkt.

---

## 1. Registratie & Activatie (Authenticatie)

### Happy Path (Succesvol)
* **Wat gebeurt er:** Een gebruiker registreert zich met een uniek e-mailadres en activeert zijn account met een sterk wachtwoord.
* **Handmatig testen:**
  1. Ga naar `/register` en vul een nieuw e-mailadres in.
  2. Ga naar `/mailbox` om de activatiemail te openen en klik op de link.
  3. Vul een sterk wachtwoord in (bijv. `Windkracht12!`) en activeer het account.
* **Geautomatiseerde test:** `AuthTest::test_registration_happy_path` & `AuthTest::test_activation_happy_path`.

### Unhappy Path (Foutafhandeling)
* **Wat gebeurt er:** 
  * Registreren met een e-mailadres dat al bestaat.
  * Activeren met een te zwak wachtwoord (minder dan 12 tekens, geen cijfer, geen hoofdletter of geen speciaal teken).
* **Handmatig testen:**
  1. Probeer te registreren met een e-mailadres dat al is geregistreerd. Je krijgt de melding: *“The email has already been taken.”*
  2. Probeer bij activatie een zwak wachtwoord in te vullen (bijv. `123`). Je krijgt een duidelijke foutmelding over de minimale eisen.
* **Geautomatiseerde test:** `AuthTest::test_registration_unhappy_path_duplicate_email` & `AuthTest::test_activation_unhappy_path_weak_password`.

---

## 2. Les Boeken (Bookings)

### Happy Path (Succesvol)
* **Wat gebeurt er:** Een ingelogde klant kiest een lespakket, selecteert de juiste hoeveelheid datums en maakt de boeking aan.
* **Handmatig testen:**
  1. Log in als klant.
  2. Ga naar het dashboard en klik op "Nieuwe Les Boeken".
  3. Kies bijvoorbeeld *Privéles 1 les* en selecteer precies 1 datum.
  4. Klik op boeken. De boeking wordt aangemaakt met de status **Voorlopig**.
* **Geautomatiseerde test:** `BookingTest::test_create_booking_happy_path`.

### Unhappy Path (Foutafhandeling)
* **Wat gebeurt er:** 
  * Te veel of te weinig datums selecteren voor het gekozen pakket.
  * Een Duo-pakket boeken zonder de gegevens van de duo-partner in te vullen.
* **Handmatig testen:**
  1. Kies een pakket van 3 lessen, maar selecteer slechts 1 datum. Je krijgt de melding: *“Voor dit pakket moet je precies 3 lesdatum(s) selecteren.”*
  2. Kies een duo-pakket, maar laat de NAW-gegevens van je partner leeg. Je krijgt de melding: *“Vul alstublieft de NAW-gegevens van de duo-deelnemer in.”*
* **Geautomatiseerde test:** `BookingTest::test_create_booking_unhappy_path_invalid_lessons_count` & `BookingTest::test_create_booking_unhappy_path_duo_missing_details`.

---

## Hoe draai je de automatische tests?
Open een terminal in de `backend`-map en voer het volgende commando uit:
```bash
php artisan test
```
*(Of gebruik je Wamp64 PHP pad: `C:\wamp64\bin\php\php8.3.28\php.exe artisan test`)*
