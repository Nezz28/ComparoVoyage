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
