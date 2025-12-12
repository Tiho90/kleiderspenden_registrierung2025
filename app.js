"use strict";

/**
 * KONFIGURATION – Geschäftsstelle
 */
const OFFICE = {
  address: "Musterstraße 1 , 99084 Erfurt",
  zip: "99084",
};

const CRISIS_REGIONS = [
  "Ukraine",
  "Syrien",
  "Gaza/Palästina",
  "Sudan",
  "Afghanistan",
  "Jemen",
  "Somalia",
  "DR Kongo",
];

// Helpers
function $(id) {
  return document.getElementById(id);
}

function getSelectedProcess() {
  const checked = document.querySelector('input[name="processType"]:checked');
  return checked ? checked.value : "";
}

function onlyDigits(str) {
  return (str || "").replace(/\D/g, "");
}

function zipPrefix(zip) {
  const d = onlyDigits(zip);
  return d.length >= 2 ? d.slice(0, 2) : "";
}

function setText(id, value) {
  // Schutz vor HTML-Injection: textContent statt innerHTML
  $(id).textContent = value ?? "";
}

function showErrors(errors) {
  const box = $("errorBox");
  const list = $("errorList");

  list.innerHTML = "";
  errors.forEach((msg) => {
    const li = document.createElement("li");
    li.textContent = msg;
    list.appendChild(li);
  });

  box.classList.remove("hidden");
  box.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearErrors() {
  $("errorBox").classList.add("hidden");
  $("errorList").innerHTML = "";
}

function toggleSections() {
  const process = getSelectedProcess();
  const handover = $("handoverSection");
  const pickup = $("pickupSection");

  if (process === "pickup") {
    pickup.classList.remove("hidden");
    handover.classList.add("hidden");
  } else {
    handover.classList.remove("hidden");
    pickup.classList.add("hidden");
  }
}

function fillCrisisRegions() {
  const select = $("crisisRegion");
  select.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Bitte auswählen…";
  select.appendChild(placeholder);

  CRISIS_REGIONS.forEach((r) => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    select.appendChild(opt);
  });
}

function setFooterYear() {
  $("year").textContent = String(new Date().getFullYear());
}

function setOfficeZipPrefixBadge() {
  const prefix = zipPrefix(OFFICE.zip);
  $("officeZipPrefix").textContent = prefix || "--";
}

function validateForm(data) {
  const errors = [];

  // Common required fields
  if (!data.clothingType) errors.push("Bitte wählen Sie eine Kleidungsart aus.");
  if (!data.crisisRegion) errors.push("Bitte wählen Sie eine Krisenregion aus.");

  if (!data.processType) {
    errors.push("Bitte wählen Sie aus, ob Übergabe oder Abholung gewünscht ist.");
    return errors;
  }

  if (data.processType === "handover") {
    if (!data.handoverDate) errors.push("Bitte wählen Sie ein Datum für die Übergabe.");
    if (!data.handoverTime) errors.push("Bitte wählen Sie eine Uhrzeit für die Übergabe.");
  }

  if (data.processType === "pickup") {
    if (!data.fullName) errors.push("Bitte geben Sie Ihren Namen an (Abholung).");
    if (!data.contact) errors.push("Bitte geben Sie eine Kontaktmöglichkeit an (E-Mail oder Telefon).");
    if (!data.street) errors.push("Bitte geben Sie Straße und Hausnummer an (Abholung).");
    if (!data.zip) errors.push("Bitte geben Sie eine Postleitzahl an (Abholung).");
    if (!data.city) errors.push("Bitte geben Sie den Ort an (Abholung).");
    if (!data.pickupDate) errors.push("Bitte wählen Sie ein Datum für die Abholung.");
    if (!data.pickupTime) errors.push("Bitte wählen Sie eine Uhrzeit für die Abholung.");

    // ZIP format
    const digits = onlyDigits(data.zip);
    if (data.zip && digits.length !== 5) {
      errors.push("Die Postleitzahl muss aus genau 5 Ziffern bestehen.");
    }

    // PLZ-Näheprüfung (erste zwei Ziffern)
    const userPrefix = zipPrefix(data.zip);
    const officePrefix = zipPrefix(OFFICE.zip);

    if (digits.length === 5 && userPrefix && officePrefix && userPrefix !== officePrefix) {
      errors.push(
        `Abholung nicht möglich: PLZ-Nahbereich stimmt nicht überein (erwartet ${officePrefix}xxx). Bitte wählen Sie Übergabe an der Geschäftsstelle.`
      );
    }
  }

  return errors;
}

function collectFormData() {
  const processType = getSelectedProcess();

  return {
    clothingType: $("clothingType").value.trim(),
    crisisRegion: $("crisisRegion").value.trim(),
    quantity: $("quantity").value.trim(),
    processType,

    // handover
    handoverDate: $("handoverDate").value,
    handoverTime: $("handoverTime").value,

    // pickup
    fullName: $("fullName").value.trim(),
    contact: $("contact").value.trim(),
    street: $("street").value.trim(),
    zip: $("zip").value.trim(),
    city: $("city").value.trim(),
    pickupDate: $("pickupDate").value,
    pickupTime: $("pickupTime").value,
  };
}

function formatDate(yyyy_mm_dd) {
  if (!yyyy_mm_dd) return "";
  const [y, m, d] = yyyy_mm_dd.split("-");
  if (!y || !m || !d) return yyyy_mm_dd;
  return `${d}.${m}.${y}`;
}

function renderConfirmation(data) {
  setText("c_clothing", data.clothingType);
  setText("c_region", data.crisisRegion);
  setText("c_quantity", data.quantity ? data.quantity : "—");

  const processLabel =
    data.processType === "pickup"
      ? "Abholung durch Sammelfahrzeug"
      : "Übergabe an der Geschäftsstelle";
  setText("c_process", processLabel);

  if (data.processType === "handover") {
    setText("c_date", formatDate(data.handoverDate));
    setText("c_time", data.handoverTime);
    setText("c_location", OFFICE.address);

    $("pickupExtra").classList.add("hidden");
    setText("c_contact", "");
  } else {
    setText("c_date", formatDate(data.pickupDate));
    setText("c_time", data.pickupTime);

    const address = `${data.street}, ${onlyDigits(data.zip)} ${data.city}`.trim();
    setText("c_location", address);

    $("pickupExtra").classList.remove("hidden");
    setText("c_contact", data.contact);
  }
}

function showConfirmation() {
  $("formCard").classList.add("hidden");
  $("confirmCard").classList.remove("hidden");
  $("confirmCard").scrollIntoView({ behavior: "smooth", block: "start" });
}

function showFormAgain() {
  $("confirmCard").classList.add("hidden");
  $("formCard").classList.remove("hidden");
  $("donationForm").reset();

  // default: handover
  document.querySelector('input[name="processType"][value="handover"]').checked = true;
  toggleSections();

  clearErrors();
  $("formCard").scrollIntoView({ behavior: "smooth", block: "start" });
}

function wireEvents() {
  document.querySelectorAll('input[name="processType"]').forEach((el) => {
    el.addEventListener("change", () => {
      clearErrors();
      toggleSections();
    });
  });

  $("donationForm").addEventListener("reset", () => {
    setTimeout(() => {
      clearErrors();
      document.querySelector('input[name="processType"][value="handover"]').checked = true;
      toggleSections();
    }, 0);
  });

  $("donationForm").addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const data = collectFormData();
    const errors = validateForm(data);

    if (errors.length > 0) {
      showErrors(errors);
      return;
    }

    renderConfirmation(data);
    showConfirmation();
  });

  $("newDonationBtn").addEventListener("click", () => {
    showFormAgain();
  });
}

function init() {
  fillCrisisRegions();
  setFooterYear();
  setOfficeZipPrefixBadge();
  toggleSections();
  wireEvents();
}

document.addEventListener("DOMContentLoaded", init);