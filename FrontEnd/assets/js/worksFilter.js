// Fonction utilitaire pour les requêtes fetch
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`La requête a échoué avec le statut : ${response.status}`);
    }
    return response.json();
  }
  
  // Récupère les travaux depuis l'API
  async function getWorksFromServer() {
    return fetchData("http://localhost:5678/api/works");
  }
  
  // Récupère les catégories depuis l'API
  async function getCategoriesFromServer() {
    return fetchData("http://localhost:5678/api/categories");
  }




/**
 * Fonction pour générer les éléments du DOM pour les travaux en fonction de la catégorie sélectionnée.
 */
async function addWorksToDom() {
  const gallery = document.querySelector(".gallery");
  try {
    let data = await getWorksFromServer();
    data.forEach((work) => {
      // Création des éléments du DOM
      let figure = document.createElement("figure");
      figure.dataset.categoryId = work.categoryId;
      figure.style.display = "block";
      let img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;
      let figcaption = document.createElement("figcaption");
      figcaption.textContent = work.title;
      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de l'affichage des travaux : ",
      error
    );
  }
}

// Affiche tous les travaux au chargement initial
addWorksToDom();

/**
 * Fonction pour supprimer la classe "btn-filter-active" de tous les boutons de filtre.
 */
function removeActiveFilterButtons() {
  const allBtn = document.querySelectorAll(".btn-filter");
  allBtn.forEach((btn) => {
    btn.classList.remove("btn-filter-active");
  });
}

/**
 * Fonction pour configurer les boutons de filtre.
 */
async function setupFilterButtons() {

  const filter = document.getElementById("filter");  
  const categories = await getCategoriesFromServer();// on récupère les categories via l'api pour créer les btn-filter

// Création de l'element button all dans le DOM
  let buttonAll = document.createElement("button");
  buttonAll.id = "allCategories";
  buttonAll.className = "btn-filter btn-filter-active";
  buttonAll.textContent = "Tous";
  filter.appendChild(buttonAll);

  // Écouteur d'événement 
  buttonAll.addEventListener("click", (e) => {
    
    // Sectionne les balises Figure enfant de la div Gallery
    const gallery = document.querySelector(".gallery");
    let works = gallery.querySelectorAll("figure");
    e.preventDefault();

    // On applique un diplay block à toutes les balises 
    works.forEach((work) => {
      work.style.display = "block";
    });
    
    removeActiveFilterButtons();//on retire la classe active des btn filter 
    buttonAll.classList.add("btn-filter-active");//on ajoute la classe active au btn 
  });



// Boucle pour créer tous les boutons de filtre
  categories.forEach(function (category) {
    let button = document.createElement("button");
    button.id = category.id;
    button.textContent = category.name;
    button.className = "btn-filter";

    // ajoute un événement click sur le btn 
    button.addEventListener("click", (e) => {
      const gallery = document.querySelector(".gallery"); // on récupère la div contenant tous les balises
      let works = gallery.querySelectorAll("figure"); // on récupère tous les balises dans le div Gallery
      e.preventDefault();
// boucle compare l id de l'élément cliqué au id des balise figure 
      works.forEach((work) => {
        if (work.dataset.categoryId === button.id) { // si l'id de l'élément cliqué est identique l'id de la balise figure
          work.style.display = "block"; // on affiche la balise
        } else {
          work.style.display = "none";// sinon on n'affiche pas la balise
        }
      });

      removeActiveFilterButtons();// on retire la classe active des btn filter 
      button.classList.add("btn-filter-active");// on ajoute la classe active au btn 
    });

    filter.appendChild(button);
  });
}

setupFilterButtons();
