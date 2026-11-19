const TELEGRAM_CONFIG = {
  botToken: "9214085966:AAFkFKgskdCdszS-hpx7G9eubRTljluoh24",
  chatId: "1754933686"
};

const ISSUES_DATA = [
  {
    id: 1,
    slug: "issue-1.html",
    title: "Выпуск №1",
    pagesCount: 24,
    cover: "pages1/01.png",
    pdf: "psalm-150-issue-1.pdf",
    folder: "pages1",
    rubrics: [
      "Открытие номера и слово редакции",
      "Интервью выпуска",
      "Песня / ноты",
      "История / очерк"
    ]
  },
  {
    id: 2,
    slug: "issue-2.html",
    title: "Выпуск №2",
    pagesCount: 20,
    cover: "pages2/01.png",
    pdf: "psalm-150-issue-2.pdf",
    folder: "pages2",
    rubrics: [
      "Слово выпуска",
      "Интервью с музыкантом",
      "Песня / ноты",
      "Разбор и заметки"
    ]
  },
  {
    id: 3,
    slug: "issue-3.html",
    title: "Выпуск №3",
    pagesCount: 34,
    cover: "pages3/01.png",
    pdf: "psalm-150-issue-3.pdf",
    folder: "pages3",
    rubrics: [
      "Главный материал номера",
      "Интервью",
      "Песня / ноты",
      "Истории и свидетельства"
    ]
  }
];

// Каталог материалов для библиотеки и поиска (можно пополнять реальными названиями и авторами)
const LIBRARY_ENTRIES = [
  {
    id: "m1",
    title: "Интервью — Выпуск №1",
    rubric: "Интервью",
    author: "Редакция «Псалом 150»",
    issueTitle: "Выпуск №1",
    issueUrl: "issue-1.html",
    note: "Разговор о музыке, служении и творчестве."
  },
  {
    id: "m2",
    title: "Ноты и текст — Выпуск №1",
    rubric: "Песни и ноты",
    author: "Авторы Выпуска №1",
    issueTitle: "Выпуск №1",
    issueUrl: "issue-1.html",
    note: "Музыкальный материал из первого номера."
  },
  {
    id: "m3",
    title: "История — Выпуск №2",
    rubric: "Истории",
    author: "Авторы Выпуска №2",
    issueTitle: "Выпуск №2",
    issueUrl: "issue-2.html",
    note: "Очерк и живая история из второго выпуска."
  },
  {
    id: "m4",
    title: "Песня / ноты — Выпуск №2",
    rubric: "Песни и ноты",
    author: "Редакция «Псалом 150»",
    issueTitle: "Выпуск №2",
    issueUrl: "issue-2.html",
    note: "Песенный материал второго номера."
  },
  {
    id: "m5",
    title: "Интервью — Выпуск №3",
    rubric: "Интервью",
    author: "Авторы Выпуска №3",
    issueTitle: "Выпуск №3",
    issueUrl: "issue-3.html",
    note: "Беседа из третьего выпуска."
  },
  {
    id: "m6",
    title: "Песня / ноты — Выпуск №3",
    rubric: "Песни и ноты",
    author: "Редакция «Псалом 150»",
    issueTitle: "Выпуск №3",
    issueUrl: "issue-3.html",
    note: "Ноты и материал из третьего выпуска."
  }
];

function getIssuePages(issue) {
  return Array.from({ length: issue.pagesCount }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return `${issue.folder}/${num}.png`;
  });
}

// Right Side Drawer
function initDrawer() {
  const backdrop = document.getElementById("drawerBackdrop");
  const drawer = document.getElementById("sideDrawer");
  const openBtn = document.getElementById("openDrawerBtn");
  const closeBtn = document.getElementById("closeDrawerBtn");

  if (!backdrop || !drawer || !openBtn || !closeBtn) return;

  function openDrawer() {
    drawer.classList.add("open");
    backdrop.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.setAttribute("aria-hidden", "true");
  }

  openBtn.addEventListener("click", openDrawer);
  closeBtn.addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);
  drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeDrawer));
}

// Home page issues + rubrics text list
function initHomeIssues() {
  const grid = document.getElementById("homeIssuesGrid");
  if (!grid) return;

  grid.innerHTML = ISSUES_DATA.map((issue) => `
    <article class="issue-card">
      <a class="cover-link" href="${issue.slug}">
        <img src="${issue.cover}" alt="Обложка ${issue.title}" loading="lazy" />
        <span class="cover-badge">${issue.title}</span>
      </a>
      <div class="issue-body">
        <h3><a href="${issue.slug}" style="text-decoration:none;color:inherit;">${issue.title}</a></h3>
        <div class="issue-meta">${issue.pagesCount} страниц</div>
        <div class="issue-rubrics-title">Рубрики в выпуске</div>
        <ul class="issue-rubrics-list">
          ${issue.rubrics.map((r) => `<li>${r}</li>`).join("")}
        </ul>
        <div class="issue-actions">
          <a class="btn" href="${issue.slug}">Открыть выпуск</a>
          <a class="btn btn-secondary" href="${issue.pdf}" download>PDF</a>
        </div>
      </div>
    </article>
  `).join("");
}

// Issue flipbook page
function initIssuePage(issueId) {
  const issue = ISSUES_DATA.find((item) => item.id === issueId);
  if (!issue) return;

  const pages = getIssuePages(issue);
  let pageIdx = 0;
  let zoomed = false;

  const titleEl = document.getElementById("issuePageTitle");
  const imgEl = document.getElementById("flipbookImg");
  const counterEl = document.getElementById("flipbookCounter");
  const stageEl = document.getElementById("flipbookStage");
  const prevBtn = document.getElementById("flipbookPrev");
  const nextBtn = document.getElementById("flipbookNext");
  const zoomBtn = document.getElementById("flipbookZoom");
  const rubricsListEl = document.getElementById("issuePageRubrics");
  const pdfLinkEl = document.getElementById("issuePagePdf");

  if (titleEl) titleEl.textContent = issue.title;
  if (pdfLinkEl) pdfLinkEl.href = issue.pdf;

  if (rubricsListEl) {
    rubricsListEl.innerHTML = issue.rubrics.map((r) => `<li>${r}</li>`).join("");
  }

  function renderPage() {
    if (!imgEl || !counterEl) return;
    imgEl.src = pages[pageIdx];
    imgEl.alt = `${issue.title}, страница ${pageIdx + 1}`;
    counterEl.textContent = `Страница ${pageIdx + 1} из ${pages.length}`;
    if (prevBtn) prevBtn.disabled = pageIdx === 0;
    if (nextBtn) nextBtn.disabled = pageIdx >= pages.length - 1;
    if (stageEl) {
      stageEl.scrollTop = 0;
      stageEl.scrollLeft = 0;
    }
  }

  if (zoomBtn && stageEl) {
    zoomBtn.addEventListener("click", () => {
      zoomed = !zoomed;
      stageEl.classList.toggle("zoomed", zoomed);
      zoomBtn.textContent = zoomed ? "По ширине" : "Увеличить";
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (pageIdx > 0) {
        pageIdx--;
        renderPage();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (pageIdx < pages.length - 1) {
        pageIdx++;
        renderPage();
      }
    });
  }

  renderPage();
}

// Library page (covers + search + rubric/author filters)
function initLibraryPage() {
  const coversGrid = document.getElementById("libraryCoversGrid");
  const searchInput = document.getElementById("libSearchInput");
  const rubricSelect = document.getElementById("libRubricSelect");
  const authorSelect = document.getElementById("libAuthorSelect");
  const entriesList = document.getElementById("libraryEntriesList");

  if (!coversGrid || !entriesList) return;

  coversGrid.innerHTML = ISSUES_DATA.map((issue) => `
    <article class="issue-card">
      <a class="cover-link" href="${issue.slug}">
        <img src="${issue.cover}" alt="Обложка ${issue.title}" loading="lazy" />
        <span class="cover-badge">${issue.title}</span>
      </a>
      <div class="issue-body">
        <h3>${issue.title}</h3>
        <div class="issue-meta">${issue.pagesCount} страниц</div>
        <div class="issue-actions">
          <a class="btn" href="${issue.slug}">Читать флипбук</a>
          <a class="btn btn-secondary" href="${issue.pdf}" download>PDF</a>
        </div>
      </div>
    </article>
  `).join("");

  if (rubricSelect) {
    const rubrics = [...new Set(LIBRARY_ENTRIES.map((e) => e.rubric))];
    rubricSelect.innerHTML = `<option value="all">Все рубрики</option>` +
      rubrics.map((r) => `<option value="${r}">${r}</option>`).join("");
  }

  if (authorSelect) {
    const authors = [...new Set(LIBRARY_ENTRIES.map((e) => e.author))];
    authorSelect.innerHTML = `<option value="all">Все авторы</option>` +
      authors.map((a) => `<option value="${a}">${a}</option>`).join("");
  }

  function applyFilters() {
    const q = (searchInput?.value || "").trim().toLowerCase();
    const rubric = rubricSelect?.value || "all";
    const author = authorSelect?.value || "all";

    const filtered = LIBRARY_ENTRIES.filter((item) => {
      const matchRubric = rubric === "all" || item.rubric === rubric;
      const matchAuthor = author === "all" || item.author === author;
      const matchQuery = !q ||
        item.title.toLowerCase().includes(q) ||
        item.rubric.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.note.toLowerCase().includes(q);
      return matchRubric && matchAuthor && matchQuery;
    });

    if (!filtered.length) {
      entriesList.innerHTML = `<p class="muted">По вашему запросу ничего не найдено.</p>`;
      return;
    }

    entriesList.innerHTML = filtered.map((item) => `
      <article class="entry-card">
        <span class="entry-tag">${item.rubric}</span>
        <h3>${item.title}</h3>
        <div class="issue-meta">Автор: ${item.author} · ${item.issueTitle}</div>
        <p class="muted" style="margin:0 0 12px;">${item.note}</p>
        <a class="btn btn-secondary" href="${item.issueUrl}">Открыть выпуск</a>
      </article>
    `).join("");
  }

  searchInput?.addEventListener("input", applyFilters);
  rubricSelect?.addEventListener("change", applyFilters);
  authorSelect?.addEventListener("change", applyFilters);
  applyFilters();
}

// Order page form + Telegram
function initOrderPage() {
  const offerSelect = document.getElementById("offerSelect");
  const deliverySelect = document.getElementById("deliverySelect");
  const estimateTotal = document.getElementById("estimateTotal");
  const estimateHint = document.getElementById("estimateHint");
  const addressLabel = document.getElementById("addressLabel");
  const customerAddress = document.getElementById("customerAddress");
  const orderForm = document.getElementById("orderForm");
  const formStatus = document.getElementById("formStatus");

  if (!offerSelect || !deliverySelect || !orderForm) return;

  function calculateEstimate() {
    const offerOpt = offerSelect.options[offerSelect.selectedIndex];
    const basePrice = Number(offerOpt.dataset.price || 0);
    const balticFree = offerOpt.dataset.balticFree === "true";
    const offerKey = offerSelect.value;
    const deliveryKey = deliverySelect.value;

    let deliveryEst = 0;
    let deliveryText = "0 €";
    let hintText = "Сумма примерная: точные условия и реквизиты подтвердим после заявки.";

    if (offerKey === "custom") {
      estimateTotal.textContent = "Ориентировочная сумма: по согласованию";
      estimateHint.textContent = "Опишите в комментарии нужные выпуски или количество — рассчитаем индивидуально.";
      return { summaryText: "По согласованию" };
    }

    if (deliveryKey === "friends") {
      deliveryEst = 0;
      deliveryText = "0 € (через знакомых)";
      addressLabel.textContent = "С кем или где удобно передать (имя / город)";
      customerAddress.placeholder = "Например: передать через знакомых или указать город";
      hintText = "Передача через знакомых — бесплатно (0 €). Укажите детали в комментарии.";
    } else if (deliveryKey === "baltic") {
      addressLabel.textContent = "Страна Прибалтики, город и пакомат (Omniva, DPD и др.)";
      customerAddress.placeholder = "Например: Латвия, Лиепая, пакомат Omniva...";
      if (balticFree) {
        deliveryEst = 0;
        deliveryText = "0 € (включена в цену абонемента / опта)";
        hintText = "Для подписки и оптовых предложений доставка по Прибалтике уже включена в стоимость.";
      } else {
        deliveryEst = 3;
        deliveryText = "~3 € (ориентировочно)";
        hintText = "Для 1 экземпляра доставка по Прибалтике ориентировочно ~3 €.";
      }
    } else if (deliveryKey === "europe") {
      deliveryEst = 5;
      deliveryText = "~5 € (ориентировочно)";
      addressLabel.textContent = "Страна в Европе, город и адрес / индекс";
      customerAddress.placeholder = "Например: Польша, город, почтовый индекс...";
      hintText = "Ориентир по отправке в Европу — около ~5 €; точный тариф уточним.";
    } else {
      deliveryEst = 0;
      deliveryText = "уточняется";
      addressLabel.textContent = "Город / страна и пожелания по доставке";
      customerAddress.placeholder = "Укажите город или удобный способ получения";
      hintText = "Нестандартный способ или направление согласуем лично после отправки заявки.";
    }

    const totalEst = basePrice + deliveryEst;
    const summaryText = deliveryKey === "other"
      ? `от ${basePrice} € + доставка уточняется`
      : `~${totalEst} € (товар: ${basePrice} €, доставка: ${deliveryText})`;

    estimateTotal.textContent = `Ориентировочная сумма: ${summaryText}`;
    estimateHint.textContent = hintText;
    return { summaryText };
  }

  offerSelect.addEventListener("change", calculateEstimate);
  deliverySelect.addEventListener("change", calculateEstimate);
  calculateEstimate();

  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { summaryText } = calculateEstimate();
    const offerLabel = offerSelect.options[offerSelect.selectedIndex].dataset.label;
    const deliveryLabel = deliverySelect.options[deliverySelect.selectedIndex].dataset.label;
    const fullName = document.getElementById("customerFullName").value.trim();
    const contact = document.getElementById("customerContact").value.trim();
    const address = customerAddress.value.trim() || "не указан";
    const notes = document.getElementById("customerNotes").value.trim() || "нет";

    const message = [
      "Новая заявка — журнал «Псалом 150»",
      `Вариант: ${offerLabel}`,
      `Доставка: ${deliveryLabel}`,
      `Ориентир: ${summaryText}`,
      `Имя и фамилия: ${fullName}`,
      `Контакты: ${contact}`,
      `Адрес / передача: ${address}`,
      `Комментарий: ${notes}`
    ].join("\n");

    const token = TELEGRAM_CONFIG.botToken.trim();
    const chatId = TELEGRAM_CONFIG.chatId.trim();

    if (!token || !chatId) {
      formStatus.textContent = "Не указаны botToken или chatId в TELEGRAM_CONFIG.";
      return;
    }

    formStatus.textContent = "Отправляем заявку...";
    try {
      const res = await fetch(`https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || !data.ok) {
        throw new Error(data?.description || `HTTP ${res.status}`);
      }
      formStatus.textContent = "Заявка отправлена! Мы свяжемся с вами для подтверждения деталей.";
      orderForm.reset();
      calculateEstimate();
    } catch (err) {
      formStatus.textContent = `Ошибка отправки в Telegram (${err.message}).`;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initDrawer();
  initHomeIssues();
  initLibraryPage();
  initOrderPage();
});