export class Modal {

  /**
   * 
   * @param {*} id du modal
   * @get wrapperElement() sélectionne l'élément wrapper
   * @get headerTitle() sélectionne le titre
   * @get btn() sélectionne le button
   * @get body() sélectionne le body du modal
   * @function  closeModal() ferme la modal
   */
  constructor(id) {
    this.modal = document.createElement("aside");
    this.modal.id = id;
    this.modal.classList.add("modal");
    this.modal.setAttribute("aria-hidden", "true");
    this.modal.setAttribute("role", "dialog");
    this.modal.setAttribute("aria-labelledby", "titlemodal");

    const modalWrapper = document.createElement("div");
    modalWrapper.classList.add("modal-wrapper");
    modalWrapper.classList.add("js-modal-stop");

    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-wrapper_header");

    const modalNav = document.createElement("div");
    modalNav.classList.add("modal-wrapper_nav");


    const closeIcon = document.createElement("a");
    closeIcon.setAttribute("id", "close");
    closeIcon.classList.add("js-modal-close");
    closeIcon.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    //modalNav.appendChild(previewIcon);
    modalNav.appendChild(closeIcon);

    const titleModal = document.createElement("div");
    titleModal.setAttribute("id", "titlemodal");
    titleModal.classList.add("modal-wrapper_title");
    titleModal.textContent = "headerTitle.textContent";

    modalHeader.appendChild(modalNav);
    modalHeader.appendChild(titleModal);

    const modalBody = document.createElement("div");
    modalBody.classList.add("modal-wrapper_body");

    const modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-wrapper_footer");

    const addButton = document.createElement("button");
    addButton.classList.add('btn-lg')
    addButton.textContent = "object.btn.textContent";

    modalFooter.appendChild(addButton);

    modalWrapper.appendChild(modalHeader);
    modalWrapper.appendChild(modalBody);
    modalWrapper.appendChild(modalFooter);

    this.modal.appendChild(modalWrapper);

    document.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        this.closeModal();
      }
    });
    closeIcon.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.closeModal();
    });
  //FIN DU CONSTRUCTOR
  }

  get wrapperElement() {
    return this.modal.querySelector(".modal-wrapper");
  }

  get headerTitle() {
    return this.modal.querySelector("#titlemodal");
  }

  get btn() {
    return this.modal.querySelector("button");
  }

  get body() {
    return this.modal.querySelector(".modal-wrapper_body")
  }

  get previousIcon() {
    const nav = this.modal.querySelector(".modal-wrapper_nav");
    nav.classList.add('modal-wrapper_nav--space-between');
    const previewIcon = document.createElement("a");
    previewIcon.setAttribute("id", "preview");
    previewIcon.classList.add("js-modal-preview");
    previewIcon.innerHTML = '<i class="fa-solid fa-arrow-left-long"></i>';
    nav.insertBefore(previewIcon , nav.firstChild);
    return this.modal.querySelector(".js-modal-preview");
  }

  get divErreur() {
    const body = this.modal.querySelector(".modal-wrapper_body");
    const divErr = document.createElement("div");
    divErr.id = 'messErr'
    body.appendChild(divErr);
    return this.modal.querySelector("#messErr");
  }

  // Fonction pour fermer la modal
  closeModal() {
    this.modal.remove();
  }
}
