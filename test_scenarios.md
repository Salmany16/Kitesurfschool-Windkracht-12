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

## 3. Eigenaar Content Beheer (CRUD)

### Happy Path (Succesvol)
* **Wat gebeurt er:** De eigenaar (administrator) beheert op dynamische wijze pakketten, locaties en foto's via het beheerdersdashboard.
* **Handmatig testen (Pakketten):**
  1. Log in als eigenaar (`owner@windkracht12.nl` met het ingestelde wachtwoord).
  2. Ga naar het dashboard en klik op de knop **"⚙️ Beheer Content"**.
  3. Onder het tabblad **Pakketten**, klik op **"Nieuw Pakket Toevoegen"**.
  4. Vul geldige waarden in (bijv. Naam: `Gevorderde Wave Rider 5 lessen`, Duur: `10`, Prijs: `450`, Max personen: `1`, Aantal lessen: `5`) en klik op **Opslaan**.
  5. Het pakket is direct zichtbaar in de tabel en op de openbare pakketten-pagina `/packages`.
* **Handmatig testen (Locaties):**
  1. Klik in "Beheer Content" op het tabblad **Locaties**.
  2. Klik op **"Nieuwe Locatie Toevoegen"**.
  3. Vul een unieke spot in (bijv. Naam: `Scheveningen`, Difficulty: `expert`, Windrichtingen: `ZW, W, NW`, Icoon: `🌊`) en klik op **Opslaan**.
  4. De spot verschijnt per direct op de openbare pagina `/locations` en is selecteerbaar bij het boeken van een les.
* **Handmatig testen (Foto Galerij):**
  1. Klik in "Beheer Content" op het tabblad **Foto Galerij**.
  2. Klik op **"Nieuwe Foto Toevoegen"**.
  3. Vul een titel in (bijv. `Sunset Session`) en geef ofwel een afbeeldings-URL óf selecteer een gradient-placeholder met een emoji (bijv. `🏄‍♂️`). Klik op **Opslaan**.
  4. De foto is direct te bewonderen op `/gallery`.

### Unhappy Path (Foutafhandeling)
* **Wat gebeurt er:** De applicatie vangt ongeldige invoer, dubbele unieke records of ontbrekende velden op en toont duidelijke foutmeldingen.
* **Handmatig testen (Pakketten):**
  1. Probeer een pakket op te slaan met een negatieve prijs (bijv. `-50`) of met minder dan 1 les.
  2. De frontend-velden valideren dit direct met `min="0"` en `min="1"`. De backend weigert de opslag en retourneert een duidelijke foutmelding (bijv. *"The price must be at least 0."*).
* **Handmatig testen (Locaties):**
  1. Probeer een locatie toe te voegen met een naam die al bestaat (bijv. `Brouwersdam`).
  2. Omdat de locatienaam uniek moet zijn, blokkeert de backend de poging en toont de frontend een rode foutbanner: *"De locatienaam bestaat al of is ongeldig."*
* **Handmatig testen (Foto Galerij):**
  1. Probeer een foto op te slaan zonder zowel een afbeeldings-URL als een gradient-placeholder/icoon in te vullen.
  2. De frontend blokkeert dit direct en toont de waarschuwing: *"Vul alstublieft een geldige afbeelding-URL in of selecteer een gradient-placeholder met icoon."*
* **Geautomatiseerde test:** `AdminContentTest::test_package_crud_happy_path`, `AdminContentTest::test_create_package_unhappy_path_validation_fails`, `AdminContentTest::test_location_crud_happy_path`, `AdminContentTest::test_location_unhappy_path_duplicate_name`, `AdminContentTest::test_photo_crud_happy_path` & `AdminContentTest::test_photo_unhappy_path_missing_visualization_source`.

---

## Hoe draai je de automatische tests?
Open een terminal in de `backend`-map en voer het volgende commando uit:
```bash
php artisan test
```
*(Of gebruik je Wamp64 PHP pad: `C:\wamp64\bin\php\php8.3.28\php.exe artisan test`)*

