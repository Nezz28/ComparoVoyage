const logBox = document.querySelector('.log_box');
if (logBox) {
  logBox.addEventListener('submit', function(e) {
    const email = document.getElementById('email').value;

  // Vérifie la présence de "@" et "."

  if (!email.includes('@') || !email.includes('.')) {

    e.preventDefault(); // Empêche l'envoi du formulaire
    
    alert("L'adresse email doit contenir un '@' et un '.' !");

  }
});
}



const cardPanier = document.querySelectorAll('.cart-card');
for (let i = 0; i < cardPanier.length; i++) {
  cardPanier[i].addEventListener('click', function() {
    cardPanier[i].remove();
  });
}

const resultCards = document.querySelectorAll('.result-card');
const cartContainer = document.querySelector('.cart-container'); // Assurez-vous que ce conteneur existe dans votre HTML

// Utilise le localStorage pour stocker les cartes sélectionnées
resultCards.forEach(card => {
  if (!card) return; // Vérifie que la carte existe
  const addToCartBtn = card.querySelector('.details-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      // Récupère les données nécessaires pour le panier (par exemple, un id ou le HTML)
      const cardId = card.getAttribute('data-id') || card.id || null;
      if (!cardId || !card.outerHTML) {
        alert("Erreur : impossible d'ajouter cette carte au panier.");
        return;
      }
      const cardData = {
        id: cardId,
        html: card.outerHTML
      };
      let panier = JSON.parse(localStorage.getItem('panier')) || [];
      // Évite les doublons si besoin
      if (!panier.some(item => item.id === cardData.id)) {
        panier.push(cardData);
        localStorage.setItem('panier', JSON.stringify(panier));
        alert('Ajouté au panier !');
      } else {
        alert('Cet élément est déjà dans le panier.');
      }
    });
  }
});
