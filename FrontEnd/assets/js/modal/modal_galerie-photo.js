import { getWorksFromServer } from "../worksFilter.js";
import { Modal } from "./class-modal.js";
import { getUserDataFromCookies } from "../auth/auth.js";
import { host } from '../config.js';

/**
 *
 * @param {*} id de l'image à supprimer
 */
async function deletework(id) {
  const userToken = getUserDataFromCookies().token;
  const deleteWork = document.querySelector(`[data-work-id="${id}"]`);
  console.log(userToken);
  await fetch(`${host}/api/works/${id}`, {
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
      deleteWork.remove();
    }
  });
}

/**
 * Création de la modal
 */
export async function initModal() {
  const modal = new Modal("galerie-photo"); // génère une modal a partir de la class modal""
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

    deleteImg.addEventListener("click", async (e) =>
     await deletework(e.target.dataset.idWork)
    ); 

    div.appendChild(img);
    div.appendChild(deleteImg);

    modal.body.appendChild(div);
  });

  modal.btn.textContent = "Ajouter une image";
  modal.btn.addEventListener("click", (e) => {
    e.preventDefault;
    modal.closeModal();
    // ici mettre le prochain modal avec index ?
  });
  // Ajoutez "modal" au corps (body) du document
  document.body.appendChild(modal.modal);
}
