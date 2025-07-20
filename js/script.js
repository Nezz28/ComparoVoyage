

const cardPanier = document.querySelectorAll('.cart-card');
for (let i = 0; i < cardPanier.length; i++) {
  cardPanier[i].addEventListener('click', function() {
    cardPanier[i].remove();
  });
}
const resultCards = document.querySelectorAll('.result-card');
const cartContainer = document.querySelector('.cart-container'); // Assurez-vous que ce conteneur existe dans votre HTML

const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', function() {
    alert("Vous avez payé !");
  });
}

let resultSet = new Set();


// ----- Partie 1 : Sauvegarde depuis le formulaire (index.html) -----
document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const depart = document.getElementById('depart').value;
      const destination = document.getElementById('destination').value;
      const date = document.getElementById('date').value;
      localStorage.setItem('depart', depart);
      localStorage.setItem('destination', destination);
      localStorage.setItem('date', date);
      window.location.href = "search_result.html";
    });
  }

  // ----- Partie 2 : Recherche et affichage des horaires (search_result.html) -----
  const results = document.getElementById('results');
  if (!results) return; // Arrête si on n'est pas sur la page résultats

  const departRecherche = (localStorage.getItem('depart') || '').toLowerCase().trim();
  const destinationRecherche = (localStorage.getItem('destination') || '').toLowerCase().trim();
  const dateRecherche = localStorage.getItem('date'); // format YYYY-MM-DD

  let stopsMap = {};

  // 1. Charger stops.txt pour obtenir les noms de gares
  fetch("gtfs/stops.txt")
    .then(res => res.text())
    .then(text => {
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',');

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const stop = {};
        headers.forEach((key, j) => stop[key] = values[j]);
        if (stop.location_type === '0') {
          stopsMap[stop.stop_id] = stop.stop_name;
        }
      }
      // 2. Charger stop_times.txt
      return fetch("gtfs/stop_times.txt");
    })
    .then(res => res.text())
    .then(text => {
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',');
      const trips = {};

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const stop = {};
        headers.forEach((key, j) => stop[key] = values[j]);
        if (!trips[stop.trip_id]) trips[stop.trip_id] = [];
        trips[stop.trip_id].push(stop);
      }

      let foundResults = [];
      let resultSet = new Set();

      // Récupère l'heure actuelle (si date choisie == aujourd'hui)
      const now = new Date();
      let currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

      Object.values(trips).forEach(stops => {
        stops.sort((a, b) => parseInt(a.stop_sequence) - parseInt(b.stop_sequence));

        const depart = stops.find(stop =>
          stopsMap[stop.stop_id] &&
          stopsMap[stop.stop_id].toLowerCase().includes(departRecherche)
        );
        const arrivee = stops.find(stop =>
          stopsMap[stop.stop_id] &&
          stopsMap[stop.stop_id].toLowerCase().includes(destinationRecherche)
        );

        if (depart && arrivee && parseInt(depart.stop_sequence) < parseInt(arrivee.stop_sequence)) {
          // Filtrage par heure de départ (trajets du jour choisi)
          const depHour = parseInt(depart.departure_time.split(':')[0]);
          const depMin = parseInt(depart.departure_time.split(':')[1]);
          const depMinutes = depHour * 60 + depMin;

          let afficher = true;
          // Si on recherche aujourd'hui : seulement trajets à partir de maintenant
          if (dateRecherche === now.toISOString().slice(0,10)) {
            if (depMinutes < currentTimeMinutes) afficher = false;
          }
          if (!afficher) return;

          // Anti-doublon
          const key = `${depart.stop_id}_${depart.departure_time}_${arrivee.stop_id}_${arrivee.arrival_time}`;
          if (resultSet.has(key)) return;
          resultSet.add(key);

          const nomDepart = stopsMap[depart.stop_id] || depart.stop_id;
          const nomArrivee = stopsMap[arrivee.stop_id] || arrivee.stop_id;

          const arrParts = arrivee.arrival_time.split(":");
          const arrMins = parseInt(arrParts[0]) * 60 + parseInt(arrParts[1]);
          const dureeMin = arrMins - depMinutes;
          const duree = dureeMin > 0 ? `${Math.floor(dureeMin / 60)}h${(dureeMin % 60).toString().padStart(2, "0")}` : "--";

          // On stocke les infos dans le tableau foundResults pour tri ultérieur
          foundResults.push({
            depMinutes,
            html: `
              <div class="result-card">
                <div class="result-left">
                  <img src="assets/img/sncf.png" class="company-logo">
                  <p>${nomDepart}<br><small>Départ: ${depart.departure_time}</small></p>
                </div>
                <div class="result-center">
                  <p><small>Temps trajet: ${duree}</small></p>
                  <div class="line"></div>
                </div>
                <div class="result-right">
                  <p>${nomArrivee}<br><strong>Arrivée: ${arrivee.arrival_time}</strong></p>
                  <img src="assets/img/ouigo.png" class="company-logo">
                </div>
                <div class="result-price">
                  <p>Prix:</p>
                  <strong>-- €</strong>
                  <button class="details-btn">Ajouter au panier</button>
                </div>
              </div>
            `
          });
        }
      });

      // Trie les résultats par heure de départ (du plus tôt au plus tard)
      foundResults.sort((a, b) => a.depMinutes - b.depMinutes);

      if (foundResults.length > 0) {
        foundResults.forEach(result => {
          results.innerHTML += result.html;
        });
      } else {
        results.innerHTML = `<p style="margin:2em 0;">Aucun trajet trouvé pour <strong>${departRecherche}</strong> → <strong>${destinationRecherche}</strong> à la date sélectionnée.</p>`;
      }
    })
    .catch(err => {
      console.error("Erreur lors du chargement des données GTFS :", err);
      results.innerHTML = "<p>Impossible de charger les données horaires.</p>";
    });
});
