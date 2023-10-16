import { host } from '../config.js';

document.getElementById("login").addEventListener("submit", function (e) {
  e.preventDefault(); // Empêche le rechargement de la page



  // Récupérer les valeurs des champs
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Valider les champs
  if (!email && !password) {
    document.getElementById("error-message").textContent =
      "Veuillez remplir tous les champs.";
    return; // Arrêtez l'exécution si un champ est vide
  }
  // Valider le password
  if (!password) {
    document.getElementById("error-message").textContent =
      "Veuillez renseigner votre mot de passe.";
    return; // Arrêtez l'exécution si un champ est vide
  }

  // Valider le format de l'email avec une expression régulière simple
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    document.getElementById("error-message").textContent =
      "Format d'email incorrect.";
    return; // Arrêtez l'exécution si le format de l'email est incorrect
  }

  // Si tout est valide, continuez avec la requête fetch
  const loginData = {
    email: email,
    password: password,
  };

  fetch(host + "/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 401) {
        throw new Error("Identifiants incorrects.");
      } else if (response.status === 404) {
        throw new Error("Utilisateur non trouvé.");
      } else {
        throw new Error("Erreur inattendue.");
      }
    })
    .then((data) => {
      // Gérer la réponse réussie ici
      const userId = data.userId;
      const token = data.token;

      // Stocker l'ID de l'utilisateur et le token dans des cookies de session
      document.cookie = `userId=${userId}; path=/`;
      document.cookie = `token=${token}; path=/`;

      // Rediriger vers la page d'accueil
      window.location.href = "index.html";
    })
    .catch((error) => {
      document.getElementById("error-message").textContent = error.message;
    });
});

