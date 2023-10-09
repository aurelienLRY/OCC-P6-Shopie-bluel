/**
 * Récupère les travaux  via l'api
 * @returns data  
 *  "id": int,
    "title": "string ",
    "imageUrl": "URL",
    "categoryId": int,
    "userId": int,
    "category": {
      "id": int,
      "name": "Objets"
 */
      async function getWorksFromServer() {
        try {
          // Effectuer une requête GET en utilisant la méthode fetch
          const response = await fetch("http://localhost:5678/api/works");
          
          // Vérifier si la réponse est OK (statut 200)
          if (!response.ok) {
            throw new Error("La requête a échoué avec le statut : " + response.status);
          }
          
          // Transformer la réponse en JSON
          const data = await response.json();
          return data;
        } catch (error) {
          // Gérer les erreurs
          console.error("Une erreur s'est produite : ", error);
        }
      }

/**
 * Génère les éléments du Dom pour les travaux
 */
async function addWorksToDom() {
    const gallery = document.querySelector(".gallery");
    try {
      let data = await getWorksFromServer();
      console.log('Les works sont  : ' + JSON.stringify(data)); // Utilisation de JSON.stringify pour afficher correctement l'objet
      data.forEach(function (work) {
        //création des éléments du DOM
        let figure = document.createElement("figure");
        let img = document.createElement("img");
  
        img.src = work.imageUrl;
        img.alt = work.title;      
        let figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        console.log('boucle création de figure :' + figure);
        gallery.appendChild(figure);
      });
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'affichage des travaux : ", error);
    }
  }


addWorksToDom()