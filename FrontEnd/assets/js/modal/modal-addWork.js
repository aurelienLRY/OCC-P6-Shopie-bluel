import { getCategoriesFromServer } from "../worksFilter.js";
import { modalGalleryPhoto } from "./modal-galeriePhoto.js";
import { getUserDataFromCookies } from "../auth/auth.js";
import { Modal } from "./class-modal.js";
import { host } from "../config.js";

/**
 * Génére le modal à partir de la classe Modal
 * @return modal add Work
 */
export async function modalAddWork() {
  const modal = new Modal("modal-addwork"); // généré le modal à partir de la classe modal
  const categories = await getCategoriesFromServer(); // on récupère les categories via l'api pour l'input select

  modal.headerTitle.textContent = "Ajout photo"; //Titre du modal

  modal.previousIcon.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    modal.closeModal(); //ferme le modal actuel
    await modalGalleryPhoto(); // Génère le modal précèdent
  });

  // élément du body
  modal.body.classList.add("addWork_body");
  modal.divErreur;

  // Crée un élément div avec la classe "dragandDrop" et l'attribut "draggable"
  const dragAndDrop = document.createElement("div");
  dragAndDrop.id = "dragandDrop";
  dragAndDrop.className = "dragandDrop";
  dragAndDrop.setAttribute("draggable", "true");
  dragAndDrop.id = "dragandDrop";

  // Crée un élément i avec les classes "fa-regular" et "fa-image"
  const icon = document.createElement("i");
  icon.className = "fa-regular fa-image";

  // Crée un élément label avec la classe "btn_fileType"
  const label = document.createElement("label");
  label.setAttribute("for", "fileInput");
  label.className = "btn_fileType";
  label.textContent = "+ Ajouter photo";

  // Crée un élément input de type "file" avec l'ID "fileInput" et l'attribut "accept"
  const inputFile = document.createElement("input");
  inputFile.type = "file";
  inputFile.id = "fileInput";
  inputFile.accept = "image/jpeg, image/png";
  inputFile.size = 4194304;
  inputFile.style.display = "none";
  const divErr = document.createElement("div");
  divErr.id = "divErr";

  // Crée un élément span
  const span = document.createElement("span");
  span.textContent = "jpg, png : 4mo max";

  // Ajoute les éléments créés à l'élément "dragAndDrop"
  dragAndDrop.appendChild(icon);
  dragAndDrop.appendChild(label);
  dragAndDrop.appendChild(inputFile);
  dragAndDrop.appendChild(divErr);
  dragAndDrop.appendChild(span);

  // Crée l'élément "addWork_title" avec le champ "Titre"
  const addWorkTitle = document.createElement("div");
  addWorkTitle.className = "addWork_title form-group";
  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", "workTitle");
  titleLabel.textContent = "Titre";
  const titleInput = document.createElement("input");
  titleInput.id = "workTitle";
  titleInput.type = "text";
  titleInput.required = true;

  // Ajoute les éléments "Titre" à "addWork_title"
  addWorkTitle.appendChild(titleLabel);
  addWorkTitle.appendChild(titleInput);

  // Crée l'élément "addWork_category" avec le champ "Catégorie"
  const addWorkCategory = document.createElement("div");
  addWorkCategory.className = "addWork_category form-group";
  const categoryLabel = document.createElement("label");
  categoryLabel.setAttribute("for", "workCategory");
  categoryLabel.textContent = "Catégorie";
  const categorySelect = document.createElement("select");
  categorySelect.id = "workCategory";

  const firstOptionElement = document.createElement("option");
  firstOptionElement.value = "firstOption";
  categorySelect.appendChild(firstOptionElement);
  // Parcourir le tableau categories pour créer des options
  categories.forEach((category) => {
    const optionElement = document.createElement("option");
    optionElement.value = category.id; // Définir la valeur de l'option sur l'ID de la catégorie
    optionElement.textContent = category.name; // Définir le texte de l'option sur le nom de la catégorie
    categorySelect.appendChild(optionElement); // Ajouter l'option à l'élément select
  });

  addWorkCategory.appendChild(categoryLabel);
  addWorkCategory.appendChild(categorySelect);

  modal.body.appendChild(dragAndDrop);
  modal.body.appendChild(addWorkTitle);
  modal.body.appendChild(addWorkCategory);

  //élément du footer
  modal.btn.textContent = "Valider";
  modal.btn.disabled = true;
  modal.btn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await createWork(modal);
  });

  return modal;
}

/**
 *  Envoi les données à l'api
 */
export async function createWork(modal) {
  const userData = getUserDataFromCookies(); // récupère les données de l'utilisateur dans les cookies
  const title = document.getElementById("workTitle").value; // récupère le titre du projet via l'input
  const workCategory = document.getElementById("workCategory").value; // récupère la catégorie du projet via l'input
  const fileInput = document.getElementById("fileInput"); // récupère l'image du projet via l'input '
  const divErr = document.getElementById("messErr"); // sélectionne l'élément "divErr"'
  const formData = new FormData(); // création d'un objet FormData'

   // Vérification des données 
  if (workCategory === "firstOption") {
    divErr.textContent = "Veuillez sélectionner une catégorie.";
    return;
  } else if (title === "") {
    divErr.textContent = "Veuillez renseigner un titre.";
    return;
  } else {
    formData.append("category", workCategory);
    formData.append("title", title);
    formData.append("image", fileInput.files[0]);
  }
 // vérification de l'intégration des données à l'objet formData
  if (
    formData.has("image") &&
    formData.has("title") &&
    formData.has("category")
  ) {
    try {
      const response = await fetch(`${host}/api/works`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${userData.token}`,
        },
        body: formData,
      });

      if (response.status === 201) {
        // La création a réussi
        const data = await response.json();
        addWorkToDom(data);
        modal.closeModal();
      } else if (response.status === 401) {
        divErr.textContent = "Vous ne disposez pas des droits nécessaires.";
        console.error("Erreur d'autorisation :", response.status);
        return;
      } else {
        divErr.textContent = "Erreur inattendue";
        console.error("Erreur inattendue :", response.status);
        return;
      }
    } catch (error) {
      console.error("Erreur de réseau :", error);
    }
  } else {
    divErr.textContent = "Veuillez renseigner tous les champs.";
    return;
  }
}

/**
 * vérifie fileName est une image :  jpg ou png
 * @param {*} fileName
 * @returns true or false
 */
function isImageFile(file) {
  const fileName = file.name;
  const fileExtension = fileName.split(".").pop().toLowerCase();
  const validExtensions = ["jpg", "jpeg", "png"]; // Extensions d'image acceptées

  if (validExtensions.includes(fileExtension)) {
    return true;
  } else {
    return false;
  }
}

/**
 *  Vérifie si les inputs sont renseignés & active le btn valide
 */
export async function checkInputs() {
  // Sélection des éléments du DOM
  const title = document.getElementById("workTitle");
  const dragandDrop = document.getElementById("dragandDrop");
  const workCategory = document.getElementById("workCategory");
  const footerBtn = document.querySelector(".modal-wrapper_footer button");
  const divErr = document.getElementById("messErr");

  // Initialisation de la variable "drag" pour le drag-and-drop
  let drag = false;

  // Création d'un tableau avec les éléments à vérifier
  const check = [title, workCategory];

  // Fonction pour vérifier les champs et activer/désactiver le bouton
  function checkFields() {
    if (title.value && workCategory.value && drag) {
      divErr.textContent = ""; // Effacez les messages d'erreur s'il y en avait
      footerBtn.disabled = false;
    }
  }

  // Fonction pour vérifier le champ "dragandDrop"
  function checkDragAndDrop() {
    if (dragandDrop.querySelector("img") !== null) {
      drag = true;
    } else {
      drag = false;
    }
    checkFields();
  }

  // Ajout des écouteurs d'événements "change" pour les champs
  for (const checkInput of check) {
    checkInput.addEventListener("change", () => {
      checkDragAndDrop();
    });
  }

  // Vérification initiale
  checkDragAndDrop();
}

/**
 * @return true si l'image est prise ne compte
 */
export function dragAndDrop() {
  const dragAndDrop = document.getElementById("dragandDrop");
  const fileInput = document.getElementById("fileInput");
  const mesErr = document.getElementById("divErr");

  function handleFile(file) {
    if (isImageFile(file) && file.size <= 4194304) {
      const reader = new FileReader();
      reader.onload = function () {
        const image = new Image();
        image.src = reader.result;
        // Masquez tous les enfants de dragAndDrop
        for (const child of dragAndDrop.children) {
          child.style.display = "none";
        }
        dragAndDrop.appendChild(image);
      };
      checkInputs();
      reader.readAsDataURL(file);
      mesErr.textContent = ""; // Effacez les messages d'erreur s'il y en avait
    } else {
      if (file.size >= 4194304) {
        mesErr.textContent = "La taille de l'image ne doit pas dépasser 4 Mo.";
        return;
      } else {
        // Affichez un message d'erreur dans la div "mesErr"
        mesErr.textContent = "Le format de l'image doit être jpg ou png.";
        return;
      }
    }
  }

  dragAndDrop.addEventListener("dragover", (e) => {
    e.preventDefault();
    mesErr.innerHTML = "";
    dragAndDrop.classList.add("dragover");
  });

  dragAndDrop.addEventListener("dragleave", () => {
    dragAndDrop.classList.remove("dragover");
    mesErr.innerHTML = "";
  });

  dragAndDrop.addEventListener("drop", (e) => {
    e.preventDefault();
    mesErr.innerHTML = "";
    dragAndDrop.classList.remove("dragover");
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files;
      handleFile(files[0]);
    }
  });

  fileInput.addEventListener("change", () => {
    mesErr.innerHTML = "";
    const file = fileInput.files[0];
    if (file) {
      handleFile(file);
    }
  });
}
/**
 * Insère dans le dom le projet avec la réponse de l'api
 * @param {object} work
 */
function addWorkToDom(work) {
  const gallery = document.querySelector(".gallery");
  let figure = document.createElement("figure");
  figure.id = `figure-${work.id}`;
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
}
