import {initModal} from './modal/modal_galerie-photo.js';
import { Modal } from "./modal/class-modal.js";
/**
 * insère les éléments du "edit_mode"
 */
export function editMode() {
  /**
   * Création du slidebar EditMode
   */
  const headerElement = document.querySelector("header"); // Récupérez le <header> existant

  // Créez un élément div avec la classe "edit_mode"
  const editModeDiv = document.createElement("div");
  editModeDiv.classList.add("edit_mode");

  // Créez un élément i avec la classe fa-regular fa-pen-to-square""
  const penToSquare = document.createElement("i");
  penToSquare.classList.add("fa-regular", "fa-pen-to-square");

  editModeDiv.appendChild(penToSquare); // Insérez la balise i  dans la div "edit_mode"
  headerElement.parentNode.insertBefore(editModeDiv, headerElement); // Insérez la div "edit_mode" avant le <header>

  /**
   * Création du Bouton Modifié
   */
  const projet = document.getElementById("portfolio");
  // Trouvez le premier élément <h2> dans la section #portfolio
const h2Element = projet.querySelector("h2");



  const modifyProjet = document.createElement("a");
  modifyProjet.classList.add('portfolio_btn-editmode')
  
// Créez un élément i avec les classes CSS "fa-regular" et "fa-pen-to-square"
const baliseI = document.createElement("i");
baliseI.classList.add("fa", "fa-regular", "fa-pen-to-square");

// Créez un élément de texte pour le texte "modifier"
const textNode = document.createTextNode(" Modifier");

// Ajoutez l'élément <i> et le texte au conteneur "modifyProjet"
modifyProjet.appendChild(baliseI);
modifyProjet.appendChild(textNode);

// Ajoutez un gestionnaire d'événements au clic sur "modifyProjet"
modifyProjet.addEventListener("click", (event) => {
  event.preventDefault();
  initModal();
});


  //projet.appendChild(modifyProjet); 
  
  // Insérez la div "filter" après le <h2>
if (h2Element) {
    h2Element.appendChild(modifyProjet);}// Ins
}
