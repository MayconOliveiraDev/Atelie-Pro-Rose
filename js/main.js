(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");
  const filterButtons = document.querySelectorAll(".filter-btn");
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
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.filter;

      filterButtons.forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });

      productCards.forEach((card) => {
        const category = card.dataset.category;
        const shouldShow = selected === "todos" || category === selected;
        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

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
