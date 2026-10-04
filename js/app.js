// Zentrale Stammdaten der Geschäftsstelle
const GESCHAEFTSSTELLE = {
  name: "Geschäftsstelle",
  strasse: "Musterstraße 1",
  plz: "45525",
  ort: "Hattingen"
};

// Elemente, die mehrfach gebraucht werden, einmal auswählen 
let radioGeschaeftsstelle = document.querySelector("#artGeschaeftsstelle");
let radioAbholung = document.querySelector("#artAbholung");
let adressBereich = document.querySelector("#adressBereich");

// Adressfelder nur bei Abholung einblenden 
radioGeschaeftsstelle.onclick = function () {
  adressBereich.style.display = "none";
};

radioAbholung.onclick = function () {
  adressBereich.style.display = "block";
};

// Die ersten beiden Ziffern der PLZ müssen mit der PLZ der Geschäftsstelle übereinstimmen
function plzPasst(plz) {
  return plz.substring(0, 2) === GESCHAEFTSSTELLE.plz.substring(0, 2);
}

// Markiert ein Feld als fehlerhaft und zeigt die Meldung direkt darunter an
function setzeFehler(feldId, text) {
  let feld = document.querySelector("#" + feldId);
  feld.classList.add("is-invalid");
  feld.parentElement.querySelector(".invalid-feedback").innerText = text;
}

// Entfernt die rote Markierung und Text bleibt unsichtbar, solange is-invalid fehlt 
function loescheFehler(feldId) {
  document.querySelector("#" + feldId).classList.remove("is-invalid");
}

// Prüft die Abholadresse, gibt true zurück, wenn alles in Ordnung ist
function pruefeAdresse() {
  let gueltig = true;
  let strasse = document.querySelector("#strasse").value.trim();
  let plz = document.querySelector("#plz").value.trim();
  let ort = document.querySelector("#ort").value.trim();

  loescheFehler("strasse");
  loescheFehler("plz");
  loescheFehler("ort");

  if (strasse === "") {
    setzeFehler("strasse", "Bitte gib Straße und Hausnummer an.");
    gueltig = false;
  }

  // Genau fünf Ziffern: ^ = Anfang, [0-9] = Ziffer, {5} = fünfmal, $ = Ende
  if (!/^[0-9]{5}$/.test(plz)) {
    setzeFehler("plz", "Bitte gib eine gültige, fünfstellige Postleitzahl ein.");
    gueltig = false;
  } else if (!plzPasst(plz)) {
    setzeFehler("plz", "Diese Adresse liegt leider außerhalb unseres Abholgebiets.");
    gueltig = false;
  }

  if (ort === "") {
    setzeFehler("ort", "Bitte gib den Ort an.");
    gueltig = false;
  }
  return gueltig;
}

// Logik wird beim Absenden des Formulars ausgeführt
document.querySelector("#spendeForm").onsubmit = function (event) {
  // Verhindert das Neuladen der Seite, sodass die Auswertung im Browser passiert
  event.preventDefault();

  let istAbholung = radioAbholung.checked;
  let formularGueltig = true;

  // Die Adresse wird nur bei Abholung geprüft
  if (istAbholung && !pruefeAdresse()) {
    formularGueltig = false;
  }

  // Ausgewählte Kleiderarten sammeln
  let kleiderCheckboxen = document.querySelectorAll('input[name="kleiderart"]');
  let kleiderArten = [];
  for (let i = 0; i < kleiderCheckboxen.length; i++) {
    if (kleiderCheckboxen[i].checked) {
      kleiderArten.push(kleiderCheckboxen[i].value);
    }
  }
 
  // d-block blendet die Meldung ein, weil Bootstrap sie sonst versteckt (Checkboxen haben kein is-invalid)  
  let kleiderFehler = document.querySelector("#kleiderFehler");
  if (kleiderArten.length === 0) {
    kleiderFehler.classList.add("d-block");
    formularGueltig = false;
  } else {
    kleiderFehler.classList.remove("d-block");
  }

  let krisengebiet = document.querySelector("#krisengebiet").value;
  if (krisengebiet === "") {
    setzeFehler("krisengebiet", "Bitte wähle ein Krisengebiet aus.");
    formularGueltig = false;
  } else {
    loescheFehler("krisengebiet");
  }

  // Alle Fehler werden gleichzeitig angezeigt, erst danach wird abgebrochen
  if (!formularGueltig) {
    return false;
  }

  // Ortsangabe, die bei Abholung die eingegebene Adresse ist und sonst die Geschäftsstelle 
  let ort;
  if (istAbholung) {
    ort = document.querySelector("#strasse").value.trim() + ", " +
          document.querySelector("#plz").value.trim() + " " +
          document.querySelector("#ort").value.trim();
  } else {
    ort = GESCHAEFTSSTELLE.name + ", " + GESCHAEFTSSTELLE.strasse + ", " +
          GESCHAEFTSSTELLE.plz + " " + GESCHAEFTSSTELLE.ort;
  }

  // Zeitpunkt der Registrierung, aus dem Datum und Uhrzeit für die Bestätigung gebildet werden
  let jetzt = new Date();

  // Bestätigungsliste leeren und neu aufbauen (innerHTML nur zum Leeren)
  let bestaetigungListe = document.querySelector("#bestaetigungListe");
  bestaetigungListe.innerHTML = "";

  // innerText statt innerHTML, damit Eingaben nicht als HTML interpretiert werden
  function erstelleListenElement(label, wert) {
    let li = document.createElement("li");
    li.classList.add("list-group-item");
    li.innerText = label + ": " + wert;
    bestaetigungListe.appendChild(li);
  }

  // Gewählte Übergabeart für die Bestätigung
  let uebergabeArt;
  if (istAbholung) {
    uebergabeArt = "Abholung durch das Sammelfahrzeug";
  } else {
    uebergabeArt = "Persönliche Übergabe an der Geschäftsstelle";
  }
  
  erstelleListenElement("Übergabeart", uebergabeArt);
  erstelleListenElement("Art der Kleidung", kleiderArten.join(", "));
  erstelleListenElement("Krisengebiet", krisengebiet);
  erstelleListenElement("Datum", jetzt.toLocaleDateString("de-DE"));
  erstelleListenElement("Uhrzeit", jetzt.toLocaleTimeString("de-DE"));
  erstelleListenElement("Ort", ort);

  // Formular ausblenden, Bestätigung einblenden und nach oben scrollen
  document.querySelector("#formular").style.display = "none";
  document.querySelector("#bestaetigungBereich").style.display = "block";
  window.scrollTo(0, 0);
};

// Zurück zum leeren Formular für eine weitere Spende
document.querySelector("#neueSpendeBtn").onclick = function () {
  document.querySelector("#spendeForm").reset();
  adressBereich.style.display = "none";

  // Alle Fehlermarkierungen zurücksetzen
  loescheFehler("strasse");
  loescheFehler("plz");
  loescheFehler("ort");
  loescheFehler("krisengebiet");

  // Meldung der Kleiderart wieder ausblenden
  document.querySelector("#kleiderFehler").classList.remove("d-block");

  // Formular wieder anzeigen und Bestätigung ausblenden 
  document.querySelector("#formular").style.display = "block";
  document.querySelector("#bestaetigungBereich").style.display = "none";
};