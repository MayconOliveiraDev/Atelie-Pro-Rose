(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");
  const productCards = document.querySelectorAll(".product-card");
  const leadForm = document.querySelector("#lead-form");
  const currentYear = document.querySelector("#current-year");

  /* === HEADER / SCROLL === */
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* === MOBILE MENU === */
  const closeMenu = () => {
    if (!menuToggle || !navigation) return;

    menuToggle.classList.remove("is-open");
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  };

  const openMenu = () => {
    if (!menuToggle || !navigation) return;

    menuToggle.classList.add("is-open");
    navigation.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Fechar menu");
  };

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        navigation.classList.contains("is-open") &&
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  /* === PRODUCT FILTER === */


  /* === LEAD FORM === */

  /* === LEAD FORM - WHATSAPP === */

  /* === LEAD FORM - WHATSAPP === */
  if (leadForm) {
    const message = leadForm.querySelector(".form-message");

    leadForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!leadForm.checkValidity()) {
        leadForm.reportValidity();
        return;
      }

      const name = leadForm.elements.nome.value.trim();
      const details = leadForm.elements.mensagem.value.trim();

      const whatsappNumber = "5514997090334";

      let whatsappMessage =
        "Olá! Vim pela landing page do Ateliê Pro Rose e gostaria de informações. 💗\n\n" +
        `Meu nome é ${name}.`;

      if (details) {
        whatsappMessage += `\n\nGostaria de saber mais sobre:\n${details}`;
      } else {
        whatsappMessage +=
          "\n\nGostaria de conhecer os produtos e as opções disponíveis.";
      }

      const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

      if (message) {
        message.textContent =
          "Abrindo o WhatsApp para você continuar o atendimento!";
      }

      window.open(whatsappURL, "_blank", "noopener,noreferrer");
    });
  }

  
  /* === PRODUCT DETAILS MODAL === */

  const productModal = document.querySelector("#product-modal");
  const modalProductImage = document.querySelector("#modal-product-image");
  const modalProductTitle = document.querySelector("#modal-product-title");
  const productZoom = document.querySelector("#product-zoom");
  const productModalCloseButtons = document.querySelectorAll("[data-close-modal]");

  let lastFocusedProductButton = null;

  const openProductModal = (button) => {
    if (!productModal || !modalProductImage || !modalProductTitle) return;

    const productCard = button.closest(".product-card");

    if (!productCard) return;

    const productImage = productCard.querySelector(".product-image img");
    const productTitle = productCard.querySelector(".product-info h3");

    if (!productImage || !productTitle) return;

    lastFocusedProductButton = button;

    modalProductImage.src = productImage.src;
    modalProductImage.alt = productImage.alt || productTitle.textContent.trim();
    modalProductTitle.textContent = productTitle.textContent.trim();

    modalProductImage.classList.remove("is-zoomed");
    productZoom.innerHTML = "<span>+</span>";
    productZoom.setAttribute("aria-label", "Ampliar imagem");

    productModal.classList.add("is-open");
    productModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    productModal.querySelector(".product-modal-close").focus();
  };

  const closeProductModal = () => {
    if (!productModal) return;

    productModal.classList.remove("is-open");
    productModal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    modalProductImage.classList.remove("is-zoomed");
    productZoom.innerHTML = "<span>+</span>";
    productZoom.setAttribute("aria-label", "Ampliar imagem");

    if (lastFocusedProductButton) {
      lastFocusedProductButton.focus();
    }
  };

  /* ABRIR MODAL */

  document.querySelectorAll("[data-product-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      openProductModal(button);
    });
  });

  /* FECHAR MODAL */

  productModalCloseButtons.forEach((button) => {
    button.addEventListener("click", closeProductModal);
  });

  /* AMPLIAR IMAGEM */

  const toggleProductZoom = () => {
    if (!modalProductImage) return;

    const isZoomed = modalProductImage.classList.toggle("is-zoomed");

    productZoom.innerHTML = isZoomed ? "<span>−</span>" : "<span>+</span>";

    productZoom.setAttribute(
      "aria-label",
      isZoomed ? "Reduzir imagem" : "Ampliar imagem"
    );

    
    /* MOVIMENTAR A ÁREA AMPLIADA */

    const modalImageContainer = document.querySelector(".product-modal-image");

    if (modalImageContainer && modalProductImage) {
      modalImageContainer.addEventListener("pointermove", (event) => {
        if (!modalProductImage.classList.contains("is-zoomed")) return;

        const containerRect = modalImageContainer.getBoundingClientRect();

        // Dimensões originais da imagem, sem considerar a ampliação.
        const imageWidth = modalProductImage.offsetWidth;
        const imageHeight = modalProductImage.offsetHeight;

        // Calcula a posição original da imagem dentro do contêiner.
        const imageLeft = (containerRect.width - imageWidth) / 2;
        const imageTop = (containerRect.height - imageHeight) / 2;

        // Identifica onde o cursor ou o dedo está sobre a imagem.
        const x = (event.clientX - containerRect.left - imageLeft) / imageWidth;
        const y = (event.clientY - containerRect.top - imageTop) / imageHeight;

        // Limita o movimento aos limites da imagem.
        const positionX = Math.max(0, Math.min(100, x * 100));
        const positionY = Math.max(0, Math.min(100, y * 100));

        modalProductImage.style.transformOrigin =
          `${positionX}% ${positionY}%`;
      });
    }

  };

  if (productZoom) {
    productZoom.addEventListener("click", toggleProductZoom);
  }

  /* FECHAR COM ESC */

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      productModal &&
      productModal.classList.contains("is-open")
    ) {
      closeProductModal();
    }
  });




  
  
  /* === PRODUCT CATALOG MODAL === */

  const catalogModal = document.querySelector("#catalog-modal");
  const catalogGrid = document.querySelector("#catalog-product-grid");
  const openCatalogButton = document.querySelector("#open-product-catalog");
  const catalogCloseButtons = document.querySelectorAll("[data-close-catalog]");

  const catalogProducts = Array.from({ length: 22 }, (_, index) => {
    const number = index + 1;

    return {
      name: `Produto ${number}`,
      image: `imagens/catalogo/Produto-${number}.jpg`
    };
  });

  // Gera os produtos automaticamente
  if (catalogGrid) {
    catalogProducts.forEach((product, index) => {
      const card = document.createElement("article");
      card.className = "catalog-product-card";

      const image = document.createElement("img");
      image.src = product.image;
      image.alt = product.name;
      image.loading = "lazy";
      image.decoding = "async";
      image.dataset.catalogIndex = index;

      const title = document.createElement("h3");
      title.textContent = product.name;

      card.appendChild(image);
      card.appendChild(title);

      catalogGrid.appendChild(card);
    });
  }

  // Abre o catálogo
  const openCatalog = () => {
    if (!catalogModal) return;

    catalogModal.classList.add("is-open");
    catalogModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    catalogModal.querySelector(".catalog-modal-close")?.focus();
  };

  // Fecha o catálogo
  const closeCatalog = () => {
    if (!catalogModal) return;

    catalogModal.classList.remove("is-open");
    catalogModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (openCatalogButton) openCatalogButton.focus();
  };

  if (openCatalogButton) {
    openCatalogButton.addEventListener("click", openCatalog);
  }

  catalogCloseButtons.forEach((button) => {
    button.addEventListener("click", closeCatalog);
  });


  /* === CATALOG IMAGE VIEWER === */

  const catalogViewer = document.querySelector("#catalog-viewer");
  const viewerImage = document.querySelector("#catalog-viewer-image");
  const viewerCounter = document.querySelector("#viewer-counter");
  const viewerPrev = document.querySelector("#viewer-prev");
  const viewerNext = document.querySelector("#viewer-next");
  const viewerCloseButtons = document.querySelectorAll("[data-close-viewer]");

  let currentViewerIndex = 0;

  // Atualiza a imagem ampliada
  const updateViewerImage = () => {
    if (!viewerImage || !viewerCounter) return;

    const product = catalogProducts[currentViewerIndex];

    viewerImage.src = product.image;
    viewerImage.alt = product.name;

    viewerCounter.textContent =
      `${currentViewerIndex + 1} / ${catalogProducts.length}`;
  };

  // Abre o visualizador
  const openViewer = (index) => {
    if (!catalogViewer) return;

    currentViewerIndex = index;

    updateViewerImage();

    catalogViewer.classList.add("is-open");
    catalogViewer.setAttribute("aria-hidden", "false");

    catalogViewer.querySelector(".catalog-viewer-close")?.focus();
  };

  // Fecha o visualizador
  const closeViewer = () => {
    if (!catalogViewer) return;

    catalogViewer.classList.remove("is-open");
    catalogViewer.setAttribute("aria-hidden", "true");

    viewerImage.src = "";

    if (catalogModal?.classList.contains("is-open")) {
      catalogModal.querySelector(".catalog-modal-close")?.focus();
    }
  };

  // Navega para a próxima imagem
  const nextViewerImage = () => {
    currentViewerIndex =
      (currentViewerIndex + 1) % catalogProducts.length;

    updateViewerImage();
  };

  // Navega para a imagem anterior
  const previousViewerImage = () => {
    currentViewerIndex =
      (currentViewerIndex - 1 + catalogProducts.length) %
      catalogProducts.length;

    updateViewerImage();
  };

  // Clique nas imagens do catálogo
  if (catalogGrid) {
    catalogGrid.addEventListener("click", (event) => {
      const image = event.target.closest("img[data-catalog-index]");

      if (!image) return;

      openViewer(Number(image.dataset.catalogIndex));
    });
  }

  // Controles de navegação
  if (viewerNext) {
    viewerNext.addEventListener("click", nextViewerImage);
  }

  if (viewerPrev) {
    viewerPrev.addEventListener("click", previousViewerImage);
  }

  // Fechar pelo botão ou pelo fundo escuro
  viewerCloseButtons.forEach((button) => {
    button.addEventListener("click", closeViewer);
  });

  // Teclado: ESC e setas
  document.addEventListener("keydown", (event) => {
    if (catalogViewer?.classList.contains("is-open")) {
      if (event.key === "Escape") {
        closeViewer();
      }

      if (event.key === "ArrowRight") {
        nextViewerImage();
      }

      if (event.key === "ArrowLeft") {
        previousViewerImage();
      }
    }
  });

  // Fechar catálogo com ESC
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      catalogModal?.classList.contains("is-open") &&
      !catalogViewer?.classList.contains("is-open")
    ) {
      closeCatalog();
    }
  });


  /* === CURRENT YEAR === */
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* ===
     IMAGE ERROR FALLBACK
     Quando começarmos a inserir as imagens reais,
     este tratamento evita espaços quebrados.
  === */
  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-error");
    });
  });
})();
