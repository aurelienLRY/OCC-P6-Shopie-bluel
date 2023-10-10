// Récupérez l'URL actuelle
var currentURL = new URL(window.location.href);

// Récupérez tous les liens de navigation
var navLinks = document.querySelectorAll('.nav_link');

// Parcourez chaque lien et comparez son attribut href à l'URL actuelle
for (var i = 0; i < navLinks.length; i++) {
  var linkURL = new URL(navLinks[i].getAttribute('href'), window.location.origin + '/FrontEnd/');
  if (currentURL.href === linkURL.href) {
    // Ajoutez la classe "active" au lien correspondant à la page actuelle
    navLinks[i].classList.add('nav_link--active');
  }
}