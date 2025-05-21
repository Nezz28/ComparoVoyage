const logBox = document.querySelector('.log_box');
if (logBox) {
  logBox.addEventListener('submit', function(e) {
    const email = document.getElementById('email').value;

  // Vérifie la présence de "@" et "."
  if (!email.includes('@') || !email.includes('.')) {
    e.preventDefault(); // Empêche l'envoi du formulaire
    alert("L'adresse email doit contenir un '@' et un '.' !");
    // Optionnel : mettre en rouge le champ
    document.getElementById('email').style.borderColor = 'red';
    return false;
    document.getElementById('email').style.borderColor = '#FFAF00';
  }
});
}


const searchBtn = document.getElementById('search-btn');
if (searchBtn) {
    searchBtn.addEventListener('click', function () {
        const depart = document.getElementById('depart').value;
        const destination = document.getElementById('destination').value;
        const date = document.getElementById('date').value;
        const hour = document.querySelector('select[name="hour"]').value;
        const minute = document.querySelector('select[name="minute"]').value;
        const heure = hour + ':' + minute;
        // Construction de l’URL avec les paramètres de recherche
        const url = `search_result.html?depart=${encodeURIComponent(depart)}&destination=${encodeURIComponent(destination)}&date=${date}&heure=${heure}`;
        window.location.href = url;
    });
}

// Fonction pour lire les paramètres de l’URL
function getQueryParams() {
    const params = {};
    window.location.search.substring(1).split("&").forEach(function(part) {
        const item = part.split("=");
        params[decodeURIComponent(item[0])] = decodeURIComponent(item[1]);
    });
    return params;
}

async function fetchSNCFResults(params) {
    // Adapter ici les filtres en fonction de l’API SNCF utilisée
    let apiUrl = `https://data.sncf.com/api/explore/v2.1/catalog/datasets/horaires-des-train-voyages-tgvinouiouigo/records?limit=40`;
    if (params.depart) {
        apiUrl += `&where=origine_nom='${params.depart}'`;
    }
    if (params.destination) {
        apiUrl += ` AND destination_nom='${params.destination}'`;
    }
    if (params.date) {
        apiUrl += ` AND date='${params.date}'`;
    }
    // L’API peut nécessiter d’autres champs, vérifier la documentation SNCF

    // Appel API
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.results || data.records || [];
}

function createResultCard(result) {
    // Adapter selon la structure de l’objet retourné par l’API SNCF
    return `
    <div class="result-card">
        <div class="result-left">
            <img src="assets/img/sncf.png" alt="SNCF Logo" class="company-logo">
            <p>${result.origine_nom || "?"}<br><small>Départ: ${result.depart || "?"}</small></p>
        </div>
        <div class="result-center">
            <p><small>Temps trajet: ${result.duree || "?"}</small></p>
            <div class="line"></div>
        </div>
        <div class="result-right">
            <p>${result.destination_nom || "?"}<br><strong>Arrivée: ${result.arrivee || "?"}</strong></p>
            <img src="assets/img/ouigo.png" alt="Ouigo" class="company-logo">
        </div>
        <div class="result-price">
            <p>Prix:</p>
            <strong>${result.prix ? result.prix + "€" : "?"}</strong>
            <button class="details-btn">Détails</button>
        </div>
    </div>
    `;
}

window.addEventListener('DOMContentLoaded', async () => {
    const params = getQueryParams();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "<p>Chargement des résultats...</p>";

    try {
        const results = await fetchSNCFResults(params);
        if (results.length === 0) {
            resultsDiv.innerHTML = "<p>Aucun résultat trouvé.</p>";
        } else {
            resultsDiv.innerHTML = results.map(createResultCard).join("");
        }
    } catch (error) {
        resultsDiv.innerHTML = "<p>Erreur lors de la récupération des données.</p>";
    }
});

