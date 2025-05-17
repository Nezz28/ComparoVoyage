
  // Burger menu toggle
  const burger = document.getElementById('burger-menu');
  const nav = document.querySelector('.header-button');

  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
    burger.classList.toggle('active');
  });

  // Ferme le menu quand on clique ailleurs
  document.addEventListener('click', function(e) {
    if (!burger.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
      burger.classList.remove('active');
    }
  });
