# Kleiderspenden-Registrierung – Fallstudie (IPWA01-01, Aufgabe 3)

Dieses Projekt ist die Umsetzung der Webanwendungsoberfläche zur **Registrierung von Kleiderspenden** im Rahmen der Fallstudie **IPWA01-01 – Programmierung von Webanwendungsoberflächen** (Aufgabe 3: Kleiderspenden-Registrierung).

Spendende können:
- eine **Krisenregion** auswählen,
- zwischen **Übergabe an der Geschäftsstelle** und **Abholung durch ein Sammelfahrzeug** wählen,
- und erhalten nach dem Absenden eine **Bestätigungsansicht** mit allen eingegebenen Daten.

## Repository
> (Hier kannst du den Link zu deinem GitHub-Repository eintragen)
- Code-Repository: https://github.com/<dein-user>/<dein-repo>

## Technologien
- **HTML** (Struktur)
- **Tailwind CSS (CDN)** (Layout/Design/Responsivität)
- **Vanilla JavaScript** (Interaktion, Validierung, Bestätigung)

## Funktionen / Anforderungen (Kurzüberblick)
- Seitenstruktur mit **Header**, **Content-Bereich** und **Footer** (rechtliche Hinweise)
- **Responsives Layout** für Smartphone, Tablet und Desktop
- Formular zur Registrierung (Kleidungsart, Krisenregion, Prozessart, Termin/Ort)
- Zwei Prozesse:
  - **Übergabe an der Geschäftsstelle**
  - **Abholung** (mit Adressdaten + Termin)
- Dynamische Formularlogik: relevante Felder werden je nach Prozess **ein-/ausgeblendet**
- Validierung:
  - Pflichtfelderprüfung
  - PLZ-Format (5 Ziffern)
  - **PLZ-Näheprüfung** für Abholung: erste zwei Ziffern müssen mit der Geschäftsstelle übereinstimmen
- Bestätigungsansicht auf derselben Seite (Variante B)
- Sichere Ausgabe von Benutzereingaben über `textContent` (kein `innerHTML`)

## Geschäftsstelle (Konfiguration)
- **Adresse:** Patzetz 8, 39240 Sachsendorf  
- **PLZ-Nahbereich:** 39xxx (Abholung nur bei PLZ mit Prefix **39**)

Diese Werte werden in `app.js` im Objekt `OFFICE` gepflegt.

## Projektstruktur
```txt
.
├── index.html
├── app.js
└── README.md