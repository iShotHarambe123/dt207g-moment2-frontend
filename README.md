# Arbetserfarenheter Frontend - Webbapplikation med Fetch API

En fristående frontend-webbapplikation som konsumerar Arbetserfarenheter API:et (Uppgift 2.1) med hjälp av Fetch API. Byggd med ren HTML, CSS och JavaScript. [Länk](https://dt207g-moment2-frontend.netlify.app/)

## Funktionalitet

- **Visa arbetserfarenheter**: Lista alla sparade arbetserfarenheter
- **Lägg till nya**: Formulär för att skapa nya arbetserfarenheter
- **Ta bort**: Möjlighet att radera arbetserfarenheter
- **Responsiv design**: Fungerar på alla skärmstorlekar
- **Felhantering**: Tydliga felmeddelanden och loading-states

## Teknisk stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **API-kommunikation**: Fetch API
- **Design**: Responsiv CSS med modern layout
- **Utvecklingsmiljö**: Statisk webbserver

## Sidstruktur

### index.html

Startsida som visar alla arbetserfarenheter i en lista. Varje post innehåller:

- Företagsnamn och jobbtitel
- Plats och anställningsperiod
- Beskrivning av arbetet
- Radera-knapp

### add.html

Formulärsida för att lägga till nya arbetserfarenheter med fält för:

- Företagsnamn (obligatoriskt)
- Jobbtitel (obligatoriskt)
- Plats (obligatoriskt)
- Startdatum (obligatoriskt)
- Slutdatum (valfritt)
- Beskrivning (obligatoriskt)

### about.html

Informationssida som beskriver:

- Applikationens syfte och funktionalitet
- Teknisk implementation
- Databas och API-information
- Slutsatser från utvecklingsprocessen

## API-integration

Applikationen använder Fetch API för att kommunicera med backend:

```javascript
// Hämta alla arbetserfarenheter
const response = await fetch("http://localhost:3001/api/workexperience");
const data = await response.json();

// Skapa ny arbetserfarenhet
const response = await fetch("http://localhost:3001/api/workexperience", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(workExperience),
});

// Ta bort arbetserfarenhet
const response = await fetch(`http://localhost:3001/api/workexperience/${id}`, {
  method: "DELETE",
});
```

## Felhantering

Applikationen hanterar olika typer av fel:

- **Nätverksfel**: När API:et inte är tillgängligt
- **Valideringsfel**: När formulärdata är felaktig
- **Serverfel**: När API:et returnerar fel
- **Loading states**: Visar laddningsindikatorer under API-anrop

## Projektstruktur

```
Uppgift2.2/
├── index.html              # Startsida - visa arbetserfarenheter
├── add.html                # Formulär för att lägga till
├── about.html              # Om-sida med information
├── css/
│   └── style.css          # Responsiv CSS-styling
├── js/
│   ├── main.js            # JavaScript för startsidan
│   └── add.js             # JavaScript för formuläret
└── package.json           # NPM-konfiguration för dev-server
```

## Cross-Origin Requests

Applikationen är konfigurerad för att fungera med CORS-aktiverat API och kan köras från olika domäner än API:et.
