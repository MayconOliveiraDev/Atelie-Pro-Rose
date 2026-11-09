
(() => {
  "use strict";

  /* =========================================
     ELEMENTOS GERAIS
  ========================================= */

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");
  const leadForm = document.querySelector("#lead-form");
  const currentYear = document.querySelector("#current-year");

  const productModal = document.querySelector("#product-modal");
  const modalProductImage = document.querySelector("#modal-product-image");
  const modalProductTitle = document.querySelector("#modal-product-title");
  const productZoom = document.querySelector("#product-zoom");
  const productModalImageContainer = document.querySelector(".product-modal-image");
  const productModalCloseButtons = document.querySelectorAll("[data-close-modal]");

  const catalogModal = document.querySelector("#catalog-modal");
  const catalogGrid = document.querySelector("#catalog-product-grid");
  const openCatalogButton = document.querySelector("#open-product-catalog");
  const catalogCloseButtons = document.querySelectorAll("[data-close-catalog]");

  const catalogViewer = document.querySelector("#catalog-viewer");
  const viewerImage = document.querySelector("#catalog-viewer-image");
  const viewerCounter = document.querySelector("#viewer-counter");
  const viewerPrev = document.querySelector("#viewer-prev");
  const viewerNext = document.querySelector("#viewer-next");
  const viewerCloseButtons = document.querySelectorAll("[data-close-viewer]");

  let lastFocusedProductButton = null;
  let currentViewerIndex = 0;

  /* =========================================
     CONTROLE DO SCROLL DOS MODAIS
  ========================================= */

  const updateBodyScroll = () => {
    const hasOpenModal =
      productModal?.classList.contains("is-open") ||
      catalogModal?.classList.contains("is-open") ||
      catalogViewer?.classList.contains("is-open");

    document.body.style.overflow = hasOpenModal ? "hidden" : "";
  };

  /* =========================================
     HEADER / SCROLL
  ========================================= */

  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  /* =========================================
     MOBILE MENU
  ========================================= */

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

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      const clickedOutside =
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target);

      if (
        navigation.classList.contains("is-open") &&
        clickedOutside
      ) {
        closeMenu();
      }
    });
  }

  /* =========================================
     FORMULÁRIO / WHATSAPP
  ========================================= */

  if (leadForm) {
    const formMessage = leadForm.querySelector(".form-message");
    const whatsappNumber = "5514997090334";

    leadForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!leadForm.checkValidity()) {
        leadForm.reportValidity();
        return;
      }

      const formData = new FormData(leadForm);

      const name = String(formData.get("nome") || "").trim();
      const details = String(formData.get("mensagem") || "").trim();

      let whatsappMessage =
        "Olá! Vim pelo site do Ateliê Pro Rose e gostaria de informações. 💗\n\n" +
        `Meu nome é ${name}.`;

      if (details) {
        whatsappMessage +=
          `\n\nGostaria de saber mais sobre:\n${details}`;
      } else {
        whatsappMessage +=
          "\n\nGostaria de conhecer os produtos e as opções disponíveis.";
      }

      const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

      if (formMessage) {
        formMessage.textContent =
          "Abrindo o WhatsApp para você continuar o atendimento!";
      }

      window.open(whatsappURL, "_blank", "noopener,noreferrer");
    });
  }

  /* =========================================
     PRODUCT DETAILS MODAL
  ========================================= */

  const resetProductZoom = () => {
    if (modalProductImage) {
      modalProductImage.classList.remove("is-zoomed");
      modalProductImage.style.transformOrigin = "center center";
    }

    if (productZoom) {
      productZoom.innerHTML = "<span>+</span>";
      productZoom.setAttribute("aria-label", "Ampliar imagem");
    }
  };

  const openProductModal = (button) => {
    if (
      !productModal ||
      !modalProductImage ||
      !modalProductTitle
    ) {
      return;
    }

    const productCard = button.closest(".product-card");

    if (!productCard) return;

    const productImage = productCard.querySelector(".product-image img");
    const productTitle = productCard.querySelector(".product-info h3");

    if (!productImage || !productTitle) return;

    lastFocusedProductButton = button;

    modalProductImage.src = productImage.src;
    modalProductImage.alt =
      productImage.alt || productTitle.textContent.trim();

    modalProductTitle.textContent =
      productTitle.textContent.trim();

    resetProductZoom();

    productModal.classList.add("is-open");
    productModal.setAttribute("aria-hidden", "false");

    updateBodyScroll();

    productModal.querySelector(".product-modal-close")?.focus();
  };

  const closeProductModal = () => {
    if (!productModal) return;

    productModal.classList.remove("is-open");
    productModal.setAttribute("aria-hidden", "true");

    resetProductZoom();
    updateBodyScroll();

    if (lastFocusedProductButton) {
      lastFocusedProductButton.focus();
      lastFocusedProductButton = null;
    }
  };

  // Abrir detalhes dos produtos
  document.querySelectorAll("[data-product-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      openProductModal(button);
    });
  });

  // Fechar detalhes
  productModalCloseButtons.forEach((button) => {
    button.addEventListener("click", closeProductModal);
  });

  /* =========================================
     PRODUCT IMAGE ZOOM
  ========================================= */

  const toggleProductZoom = () => {
    if (!modalProductImage) return;

    const isZoomed =
      modalProductImage.classList.toggle("is-zoomed");

    if (productZoom) {
      productZoom.innerHTML = isZoomed
        ? "<span>−</span>"
        : "<span>+</span>";

      productZoom.setAttribute(
        "aria-label",
        isZoomed ? "Reduzir imagem" : "Ampliar imagem"
      );
    }

    if (!isZoomed) {
      modalProductImage.style.transformOrigin = "center center";
    }
  };

  if (productZoom) {
    productZoom.addEventListener("click", toggleProductZoom);
  }

  // O evento é registrado uma única vez, fora da função de zoom.
  if (productModalImageContainer && modalProductImage) {
    productModalImageContainer.addEventListener("pointermove", (event) => {
      if (!modalProductImage.classList.contains("is-zoomed")) return;

      const rect = productModalImageContainer.getBoundingClientRect();

      const positionX = Math.max(
        0,
        Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)
      );

      const positionY = Math.max(
        0,
        Math.min(100, ((event.clientY - rect.top) / rect.height) * 100)
      );

      modalProductImage.style.transformOrigin =
        `${positionX}% ${positionY}%`;
    });

    productModalImageContainer.addEventListener("pointerleave", () => {
      if (modalProductImage.classList.contains("is-zoomed")) {
        modalProductImage.style.transformOrigin = "center center";
      }
    });
  }

  /* =========================================
     PRODUCT CATALOG
  ========================================= */

  const catalogProducts = [
    { name: "Kit de Animais em E.V.A.", image: "imagens/catalogo/Produto-1.jpg" },
    { name: "Violão Musical em E.V.A.", image: "imagens/catalogo/Produto-2.jpg" },
    { name: "Porta-Lápis Divertido", image: "imagens/catalogo/Produto-3.jpg" },
    { name: "Bolsinhas de Lembrancinhas", image: "imagens/catalogo/Produto-4.jpg" },
    { name: "Frutinhas Divertidas", image: "imagens/catalogo/Produto-5.jpg" },
    { name: "Boneca Decorativa em E.V.A.", image: "imagens/catalogo/Produto-6.jpg" },
    { name: "Plaquinha Bem-vindos", image: "imagens/catalogo/Produto-7.jpg" },
    { name: "Kit de Recursos com Girafinha", image: "imagens/catalogo/Produto-8.jpg" },
    { name: "Caderninhos Decorados", image: "imagens/catalogo/Produto-9.jpg" },
    { name: "Caderno Corujinha", image: "imagens/catalogo/Produto-10.jpg" },
    { name: "Chaveiro Flor Personalizado", image: "imagens/catalogo/Produto-11.jpg" },
    { name: "Kit Alfabeto em E.V.A.", image: "imagens/catalogo/Produto-12.jpg" },
    { name: "Caixa das Descobertas pelo Tato", image: "imagens/catalogo/Produto-13.jpg" },
    { name: "Kit Dia dos Pais", image: "imagens/catalogo/Produto-14.jpg" },
    { name: "Tabuada em E.V.A.", image: "imagens/catalogo/Produto-15.jpg" },
    { name: "Caneta Decorada", image: "imagens/catalogo/Produto-16.jpg" },
    { name: "Bonequinha em E.V.A.", image: "imagens/catalogo/Produto-17.jpg" },
    { name: "Painel de Parabéns", image: "imagens/catalogo/Produto-18.jpg" },
    { name: "Cadernos Personalizados — A Leoa Lívia", image: "imagens/catalogo/Produto-19.jpg" },
    { name: "Maleta da Leitura", image: "imagens/catalogo/Produto-20.jpg" },
    { name: "Jogo da Melancia — Formação de Palavras", image: "imagens/catalogo/Produto-21.jpg" },
    { name: "Caixa da Calma — Descobrindo Texturas", image: "imagens/catalogo/Produto-22.jpg" }
  ];

  // Gera os cards do catálogo
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

  /* =========================================
     CATALOG IMAGE VIEWER
  ========================================= */

  const updateViewerImage = () => {
    if (!viewerImage || !viewerCounter) return;

    const product = catalogProducts[currentViewerIndex];

    if (!product) return;

    viewerImage.src = product.image;
    viewerImage.alt = product.name;

    viewerCounter.textContent =
      `${currentViewerIndex + 1} / ${catalogProducts.length}`;
  };

  const openViewer = (index) => {
    if (!catalogViewer || !catalogProducts[index]) return;

    currentViewerIndex = index;

    updateViewerImage();

    catalogViewer.classList.add("is-open");
    catalogViewer.setAttribute("aria-hidden", "false");

    updateBodyScroll();

    catalogViewer.querySelector(".catalog-viewer-close")?.focus();
  };

  const closeViewer = () => {
    if (!catalogViewer) return;

    catalogViewer.classList.remove("is-open");
    catalogViewer.setAttribute("aria-hidden", "true");

    if (viewerImage) {
      viewerImage.src = "";
    }

    updateBodyScroll();

    if (catalogModal?.classList.contains("is-open")) {
      catalogModal.querySelector(".catalog-modal-close")?.focus();
    }
  };

  const nextViewerImage = () => {
    if (!catalogProducts.length) return;

    currentViewerIndex =
      (currentViewerIndex + 1) % catalogProducts.length;

    updateViewerImage();
  };

  const previousViewerImage = () => {
    if (!catalogProducts.length) return;

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

  // Navegação do visualizador
  if (viewerNext) {
    viewerNext.addEventListener("click", nextViewerImage);
  }

  if (viewerPrev) {
    viewerPrev.addEventListener("click", previousViewerImage);
  }

  // Fechar visualizador
  viewerCloseButtons.forEach((button) => {
    button.addEventListener("click", closeViewer);
  });

  /* =========================================
     CATALOG MODAL
  ========================================= */

  const openCatalog = () => {
    if (!catalogModal) return;

    catalogModal.classList.add("is-open");
    catalogModal.setAttribute("aria-hidden", "false");

    updateBodyScroll();

    catalogModal.querySelector(".catalog-modal-close")?.focus();
  };

  const closeCatalog = () => {
    if (!catalogModal) return;

    if (catalogViewer?.classList.contains("is-open")) {
      closeViewer();
    }

    catalogModal.classList.remove("is-open");
    catalogModal.setAttribute("aria-hidden", "true");

    updateBodyScroll();

    openCatalogButton?.focus();
  };

  if (openCatalogButton) {
    openCatalogButton.addEventListener("click", openCatalog);
  }

  catalogCloseButtons.forEach((button) => {
    button.addEventListener("click", closeCatalog);
  });

  /* =========================================
     TECLADO / ESC / SETAS
  ========================================= */

  document.addEventListener("keydown", (event) => {
    // O visualizador tem prioridade sobre os outros modais.
    if (catalogViewer?.classList.contains("is-open")) {
      if (event.key === "Escape") {
        closeViewer();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextViewerImage();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousViewerImage();
      }

      return;
    }

    if (
      event.key === "Escape" &&
      catalogModal?.classList.contains("is-open")
    ) {
      closeCatalog();
      return;
    }

    if (
      event.key === "Escape" &&
      productModal?.classList.contains("is-open")
    ) {
      closeProductModal();
      return;
    }

    if (event.key === "Escape") {
      closeMenu();
    }
  });

  /* =========================================
     CURRENT YEAR
  ========================================= */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* =========================================
     IMAGE ERROR FALLBACK
  ========================================= */

  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-error");
    });
  });

})();
