const GESCHAEFTSSTELLE = {
  name: "Geschäftsstelle",
  strasse: "Musterstraße 1",
  plz: "45525",
  ort: "Hattingen"
};

let radioGeschaeftsstelle = document.querySelector("#artGeschaeftsstelle");
let radioAbholung = document.querySelector("#artAbholung");
let adressBereich = document.querySelector("#adressBereich");

radioGeschaeftsstelle.onclick = function () {
  adressBereich.style.display = "none";
};

radioAbholung.onclick = function () {
  adressBereich.style.display = "block";
};

function plzPasst(plz) {
  return plz.substring(0, 2) === GESCHAEFTSSTELLE.plz.substring(0, 2);
}

document.querySelector("#spendeForm").onsubmit = function (event) {
  event.preventDefault(); 

  let istAbholung = radioAbholung.checked;
  let plzFehler = document.querySelector("#plzFehler");

  if (istAbholung) {
    let plz = document.querySelector("#plz").value;
    if (!plzPasst(plz)) {
      plzFehler.style.display = "block";
      return false; 
    }
  }
  plzFehler.style.display = "none";

  let kleiderCheckboxen = document.querySelectorAll('input[name="kleiderart"]');
  let kleiderArten = [];
  for (let i = 0; i < kleiderCheckboxen.length; i++) {
    if (kleiderCheckboxen[i].checked) {
      kleiderArten.push(kleiderCheckboxen[i].value);
    }
  }

  if (kleiderArten.length === 0) {
    alert("Bitte wähle mindestens eine Kleiderart aus.");
    return false;
  }

  let krisengebiet = document.querySelector("#krisengebiet").value;
  if (krisengebiet === "") {
    alert("Bitte wähle ein Krisengebiet aus.");
    return false;
  }

  let ort;
  if (istAbholung) {
    ort = document.querySelector("#strasse").value + ", " +
          document.querySelector("#plz").value + " " +
          document.querySelector("#ort").value;
  } else {
    ort = GESCHAEFTSSTELLE.name + ", " + GESCHAEFTSSTELLE.strasse + ", " +
          GESCHAEFTSSTELLE.plz + " " + GESCHAEFTSSTELLE.ort;
  }

  let jetzt = new Date();

  let bestaetigungListe = document.querySelector("#bestaetigungListe");
  bestaetigungListe.innerHTML = ""; 

  function erstelleListenElement(label, wert) {
      let li = document.createElement("li");
      li.classList.add("list-group-item"); 
      li.innerText = label + ": " + wert; 
      bestaetigungListe.appendChild(li);
  }

  erstelleListenElement("Art der Kleidung", kleiderArten.join(", "));
  erstelleListenElement("Krisengebiet", krisengebiet);
  erstelleListenElement("Datum", jetzt.toLocaleDateString("de-DE"));
  erstelleListenElement("Uhrzeit", jetzt.toLocaleTimeString("de-DE"));
  erstelleListenElement("Ort", ort);

  document.querySelector("#formular").style.display = "none";
  document.querySelector("#bestaetigungBereich").style.display = "block";
  window.scrollTo(0, 0); 
};

document.querySelector("#neueSpendeBtn").onclick = function () {
  document.querySelector("#spendeForm").reset();
  adressBereich.style.display = "none";
  document.querySelector("#formular").style.display = "block";
  document.querySelector("#bestaetigungBereich").style.display = "none";
};