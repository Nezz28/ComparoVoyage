document.querySelector('.log_box').addEventListener('submit', function(e) {
  const email = document.getElementById('email').value;

  // Vérifie la présence de "@" et "."
  if (!email.includes('@') || !email.includes('.')) {
    e.preventDefault(); // Empêche l'envoi du formulaire
    alert("L'adresse email doit contenir un '@' et un '.' !");
    // Optionnel : mettre en rouge le champ
    document.getElementById('email').style.borderColor = 'red';
    return false;
  } else {
    // Optionnel : remet la bordure normale
    document.getElementById('email').style.borderColor = '#FFAF00';
  }
});s