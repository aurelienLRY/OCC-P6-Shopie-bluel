import { getWorksFromServer } from "../worksFilter.js";
import { Modal } from "./class-modal.js";
import { getUserDataFromCookies } from "../auth/auth.js";
import { host } from "../config.js";
import { modalAddWork, dragAndDrop, checkInputs } from "./modal-addWork2.js";

/**
 * Supprime le travail selon l'id
 * @param {int} id du travail à supprimer
 */
async function deletework(id) {
  const userToken = getUserDataFromCookies().token; // on récupère le token de l'utilisateur dans les cookies
  const deleteWork = document.querySelector(`[data-work-id="${id}"]`);
  if (userToken) {
    await fetch(`${host}/api/works/${id}`, {
      // on sélection la balise du travail à supprimer
      method: "DELETE",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${userToken}`,
      },
    }).then((response) => {
      if (response.status === 401) {
        // Gérer le cas d'une réponse non autorisée (Unauthorized)
        console.error("Erreur : Non autorisé (Unauthorized)");
        return null;
      }
      if (!response.ok) {
        // Gérer d'autres erreurs de requête ici
        console.error(`Erreur : ${response.status} - ${response.statusText}`);
        return null;
      }
      if (response.status === 200) {
        deleteWork.remove(); // on supprime la balise du DOM
      }
    });
  } else {
    console.error("Vous n'avez pas les autorisations")
  }
}

/**
 * Création de la modal
 */
export async function modalGalleryPhoto() {
  const modal = new Modal("modal-galeriePhoto"); // génère une modal a partir de la class modal""
  modal.headerTitle.textContent = "Galerie photo"; // ajoute le titre
  modal.body.classList.add("gallery");
  let works = await getWorksFromServer();

  // génère l'affichage des images
  works.forEach((work) => {
    const div = document.createElement("div"); // création d'une div'
    div.dataset.workId = work.id; // ajoute l'id du projet
    div.classList.add("gallery_figure");
    const img = document.createElement("img"); // création d'une image
    img.src = work.imageUrl; // ajoute l'url de l'image
    img.alt = work.title; // ajoute l'alt de l'image

    const deleteImg = document.createElement("i"); // création d'une image de suppression'
    deleteImg.classList.add("img-delete", "fa-solid", "fa-trash"); // ajoute la classe img-delete à l'image'
    deleteImg.dataset.idWork = work.id; // ajoute l'id de l'images

    deleteImg.addEventListener("click", (e) => {
      const idWork = e.target.dataset.idWork;
      if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
        deletework(idWork);
      }
    });

    div.appendChild(img);
    div.appendChild(deleteImg);

    modal.body.appendChild(div);
  });

  modal.btn.textContent = "Ajouter une image";
  modal.btn.addEventListener("click", async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const modalAddWorks = await modalAddWork();// Génère le modal suivant 
    modal.closeModal();// ferme le modal actuel 
    document.body.appendChild(modalAddWorks.modal); // Ajoute le modal suivant au corps (body) du document
    dragAndDrop();
    checkInputs();
  });
  // Ajoutez "modal" au corps (body) du document
  document.body.appendChild(modal.modal);
}
