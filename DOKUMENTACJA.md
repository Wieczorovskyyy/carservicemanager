# Car Service Manager - dokumentacja projektu

## 1. Opis projektu

Car Service Manager to aplikacja WWW do obsługi zgłoszeń serwisowych samochodów. System pozwala klientom zakładać konto, logować się, dodawać zgłoszenia naprawy lub przeglądu pojazdu oraz śledzić status wizyty. Pracownicy serwisu mogą zarządzać zgłoszeniami, nadawać im terminy, zmieniać statusy i usuwać wpisy. Administrator ma dodatkowo dostęp do zarządzania użytkownikami oraz rolami.

Projekt spełnia wymagania aplikacji bazodanowej z REST API i frontendem SPA:

- baza danych MySQL,
- REST API w Node.js i Express,
- frontend w Vue 3 z Single-File Components,
- obsługa operacji CRUD,
- kontrola dostępu przez JWT,
- testy podstawowych wymagań projektu.

## 2. Technologie

### Backend

- Node.js
- Express
- MySQL
- mysql2
- JSON Web Token
- bcrypt
- dotenv
- node:test

### Frontend

- Vue 3
- Vite
- Vue Router
- Axios
- Bootstrap 5
- lucide-vue-next
- Single-File Components `.vue`

## 3. Struktura projektu

```text
CarServiceManager/
  backend/
    config/
      db.js
    controllers/
      appointmentController.js
      authController.js
    middleware/
      auth.js
    routes/
      appointments.js
      auth.js
    sql/
      init.sql
      add_mileage_to_appointments.sql
      require_user_phone.sql
    test/
      routes.test.js
    index.js
    package.json
  frontend/
    src/
      components/
      constants/
      router/
      services/
      views/
      App.vue
      main.js
    package.json
```

## 4. Model bazy danych

Baza danych nazywa się `car_service_manager`. Skrypt tworzący bazę znajduje się w pliku `backend/sql/init.sql`.

### Tabela `users`

Tabela przechowuje konta użytkowników systemu.

| Pole | Typ | Opis |
| --- | --- | --- |
| `id` | `INT AUTO_INCREMENT PRIMARY KEY` | Identyfikator użytkownika |
| `first_name` | `VARCHAR(80) NOT NULL` | Imię |
| `last_name` | `VARCHAR(80) NOT NULL` | Nazwisko |
| `email` | `VARCHAR(120) NOT NULL UNIQUE` | Adres e-mail używany do logowania |
| `phone` | `VARCHAR(30) NOT NULL` | Numer telefonu |
| `password` | `VARCHAR(255) NOT NULL` | Hasło zahashowane przez bcrypt |
| `role` | `ENUM('user', 'admin', 'mechanic')` | Rola użytkownika |
| `created_at` | `TIMESTAMP` | Data utworzenia konta |

### Tabela `appointments`

Tabela przechowuje zgłoszenia serwisowe pojazdów.

| Pole | Typ | Opis |
| --- | --- | --- |
| `id` | `INT AUTO_INCREMENT PRIMARY KEY` | Identyfikator zgłoszenia |
| `user_id` | `INT NOT NULL` | Właściciel zgłoszenia |
| `car_model` | `VARCHAR(120) NOT NULL` | Model samochodu |
| `mileage` | `INT UNSIGNED NULL` | Przebieg pojazdu |
| `service_type` | `VARCHAR(120) NOT NULL` | Typ usługi |
| `description` | `TEXT NULL` | Opis problemu |
| `appointment_date` | `DATETIME NULL` | Termin wizyty |
| `status` | `ENUM(...)` | Status zgłoszenia |
| `notes` | `TEXT NULL` | Notatki serwisu |
| `created_at` | `TIMESTAMP` | Data utworzenia |
| `updated_at` | `TIMESTAMP` | Data ostatniej aktualizacji |

Relacja:

- `appointments.user_id` jest kluczem obcym do `users.id`,
- usunięcie użytkownika usuwa jego zgłoszenia dzięki `ON DELETE CASCADE`.

Statusy zgłoszeń:

- `new` - nowe zgłoszenie,
- `accepted` - przyjęte,
- `in_progress` - w trakcie realizacji,
- `done` - zakończone,
- `error` - problem z realizacją,
- `rejected` - odrzucone,
- `cancelled` - anulowane,
- `change_requested` - klient poprosił o zmianę.

## 5. REST API

Adres bazowy API:

```text
http://localhost:3000/api
```

Większość endpointów wymaga nagłówka:

```text
Authorization: Bearer <token>
```

### Autoryzacja i użytkownicy

| Metoda | Endpoint | Dostęp | Opis |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Publiczny | Rejestracja klienta |
| `POST` | `/auth/login` | Publiczny | Logowanie i pobranie tokenu JWT |
| `GET` | `/auth/me` | Zalogowany | Dane aktualnego użytkownika |
| `PUT` | `/auth/me` | Zalogowany | Edycja własnego profilu |
| `PUT` | `/auth/change-password` | Zalogowany | Zmiana hasła |
| `GET` | `/auth/users` | Admin lub mechanik | Lista użytkowników |
| `GET` | `/auth/users/:id` | Admin lub mechanik | Szczegóły użytkownika |
| `PUT` | `/auth/users/:id` | Admin lub mechanik | Edycja użytkownika |
| `PATCH` | `/auth/users/:id/role` | Admin lub mechanik | Zmiana roli użytkownika |
| `DELETE` | `/auth/users/:id` | Admin lub mechanik | Usunięcie użytkownika |

Przykład rejestracji:

```json
{
  "first_name": "Jan",
  "last_name": "Kowalski",
  "email": "jan@example.com",
  "phone": "+48 500 100 300",
  "password": "tajnehaslo"
}
```

Przykład logowania:

```json
{
  "email": "jan@example.com",
  "password": "tajnehaslo"
}
```

Odpowiedź logowania:

```json
{
  "token": "JWT_TOKEN"
}
```

### Zgłoszenia serwisowe

| Metoda | Endpoint | Dostęp | Opis |
| --- | --- | --- | --- |
| `GET` | `/appointments/my` | Zalogowany | Lista własnych zgłoszeń klienta |
| `POST` | `/appointments` | Zalogowany | Dodanie nowego zgłoszenia |
| `PATCH` | `/appointments/:id/action` | Właściciel zgłoszenia | Anulowanie zgłoszenia lub prośba o zmianę |
| `GET` | `/appointments` | Admin lub mechanik | Lista wszystkich zgłoszeń |
| `GET` | `/appointments/stats` | Admin lub mechanik | Statystyki zgłoszeń |
| `GET` | `/appointments/calendar` | Admin lub mechanik | Zgłoszenia z terminami do kalendarza |
| `GET` | `/appointments/:id` | Właściciel, admin lub mechanik | Szczegóły zgłoszenia |
| `PUT` | `/appointments/:id` | Admin lub mechanik | Aktualizacja statusu, terminu i notatek |
| `DELETE` | `/appointments/:id` | Właściciel, admin lub mechanik | Usunięcie zgłoszenia |

Przykład dodania zgłoszenia:

```json
{
  "car_model": "Toyota Yaris",
  "mileage": 92000,
  "service_type": "Przegląd okresowy",
  "description": "Kontrola auta przed dłuższą trasą",
  "appointment_date": null
}
```

Przykład aktualizacji zgłoszenia przez pracownika:

```json
{
  "status": "accepted",
  "appointment_date": "2026-05-10T09:30",
  "notes": "Termin potwierdzony z klientem."
}
```

Przykład akcji klienta:

```json
{
  "action": "cancel"
}
```

Dostępne akcje klienta:

- `cancel` - anuluje zgłoszenie,
- `request_change` - oznacza prośbę o zmianę terminu lub zakresu usługi.

## 6. Kontrola dostępu

System korzysta z tokenów JWT.

1. Użytkownik loguje się przez `/api/auth/login`.
2. Backend sprawdza e-mail i hasło.
3. Jeśli dane są poprawne, backend zwraca token JWT.
4. Frontend zapisuje token w `localStorage`.
5. Axios automatycznie dodaje token do nagłówka `Authorization`.
6. Middleware `verifyToken` sprawdza token po stronie backendu.

Role w systemie:

| Rola | Uprawnienia |
| --- | --- |
| `user` | Dodawanie zgłoszeń, przegląd własnych zgłoszeń, anulowanie własnych zgłoszeń, edycja profilu |
| `mechanic` | Podgląd zgłoszeń, zarządzanie statusem i terminami, podgląd użytkowników |
| `admin` | Pełne zarządzanie zgłoszeniami, użytkownikami i rolami |

Frontend dodatkowo chroni trasy przez `vue-router`:

- `/dashboard`, `/vehicle/new`, `/settings` - wymagają zalogowania,
- `/requests`, `/calendar` - wymagają roli `admin` albo `mechanic`,
- `/clients` - wymaga roli `admin`.

## 7. Frontend i widoki aplikacji

Aplikacja frontendowa jest zbudowana jako SPA w Vue 3. Widoki są tworzone jako Single-File Components.

Główne widoki:

| Widok | Ścieżka | Opis |
| --- | --- | --- |
| `Home.vue` | `/` | Strona startowa |
| `Login.vue` | `/login` | Logowanie |
| `Register.vue` | `/register` | Rejestracja |
| `Dashboard.vue` | `/dashboard` | Panel klienta z własnymi zgłoszeniami |
| `VehicleNew.vue` | `/vehicle/new` | Formularz dodania zgłoszenia |
| `Requests.vue` | `/requests` | Panel zarządzania zgłoszeniami dla personelu |
| `Calendar.vue` | `/calendar` | Kalendarz wizyt |
| `Clients.vue` | `/clients` | Zarządzanie użytkownikami |
| `Settings.vue` | `/settings` | Ustawienia konta |

Szata graficzna korzysta z Bootstrap 5, własnych stylów CSS oraz ikon `lucide-vue-next`.

## 8. Przypadki użycia

### UC1: Rejestracja klienta

1. Użytkownik wchodzi na stronę rejestracji.
2. Wpisuje imię, nazwisko, e-mail, telefon i hasło.
3. System zapisuje konto w bazie danych.
4. Konto otrzymuje rolę `user`.

### UC2: Logowanie

1. Użytkownik wpisuje e-mail i hasło.
2. Backend weryfikuje dane.
3. System zwraca token JWT.
4. Frontend przekierowuje użytkownika do panelu.

### UC3: Dodanie zgłoszenia serwisowego

1. Klient otwiera formularz zgłoszenia.
2. Wpisuje model auta, przebieg, typ usługi i opis.
3. System zapisuje zgłoszenie ze statusem `new`.
4. Klient widzi zgłoszenie w panelu.

### UC4: Zarządzanie zgłoszeniem przez pracownika

1. Mechanik lub administrator otwiera listę zgłoszeń.
2. Wybiera zgłoszenie.
3. Ustawia status, termin i notatkę.
4. System zapisuje zmiany w bazie danych.

### UC5: Anulowanie zgłoszenia przez klienta

1. Klient otwiera listę swoich zgłoszeń.
2. Wybiera akcję anulowania.
3. System zmienia status zgłoszenia na `cancelled`.

### UC6: Zarządzanie użytkownikami

1. Administrator otwiera widok klientów.
2. Wyszukuje użytkownika.
3. Może zmienić rolę użytkownika lub usunąć konto.
4. Zmiany są zapisywane przez API.

## 9. Uruchomienie projektu lokalnie

### Wymagania

- Node.js zgodny z wymaganiami frontendu: `^20.19.0` lub `>=22.12.0`
- MySQL
- npm

### Baza danych

1. Uruchomić MySQL.
2. Wykonać skrypt:

```sql
SOURCE backend/sql/init.sql;
```

Skrypt tworzy bazę, tabele oraz przykładowych użytkowników i zgłoszenia.

### Konfiguracja backendu

W katalogu `backend` należy przygotować plik `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=twoje_haslo
DB_NAME=car_service_manager
JWT_SECRET=sekretny_klucz
```

Instalacja i start backendu:

```bash
cd backend
npm install
npm start
```

API będzie dostępne pod adresem:

```text
http://localhost:3000/api
```

### Uruchomienie frontendu

```bash
cd frontend
npm install
npm run dev
```

Frontend domyślnie korzysta z API:

```text
http://localhost:3000/api
```

## 10. Testy

Backend posiada testy w pliku `backend/test/routes.test.js`. Testy sprawdzają między innymi:

- obecność endpointów CRUD dla zgłoszeń,
- obecność endpointów zarządzania użytkownikami,
- zgodność schematu bazy danych z wymaganiami projektu.

Uruchomienie testów:

```bash
cd backend
npm test
```

## 11. Spełnienie wymagań projektu

| Wymaganie | Realizacja |
| --- | --- |
| Baza danych | MySQL, baza `car_service_manager` |
| Minimum jedna tabela | Są dwie tabele: `users`, `appointments` |
| Minimum 4 pola w tabeli | Obie tabele mają więcej niż 4 pola |
| Pole `id` autoinkrementowane | `id INT AUTO_INCREMENT PRIMARY KEY` |
| API REST | Express w katalogu `backend` |
| Endpointy POST/PUT/GET/DELETE | Dostępne dla zgłoszeń i użytkowników |
| Frontend | Vue 3 + Vite |
| Dodawanie, edycja, usuwanie danych | Obsługiwane przez frontend i API |
| Szata graficzna | Bootstrap 5, własny CSS, ikony |
| Single-File Components | Widoki i komponenty `.vue` |
| Dokumentacja | Ten plik |
| Kontrola dostępu | JWT, role `user`, `mechanic`, `admin` |
| Testy | `backend/test/routes.test.js` |

## 12. Możliwe dalsze rozszerzenia

- publikacja aplikacji online,
- rozbudowa testów integracyjnych API,
- resetowanie hasła przez e-mail,
- powiadomienia mailowe o zmianie terminu,
- historia zmian statusu zgłoszenia,
- panel raportów dla administratora.
