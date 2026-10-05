// C Studio – professor course editor prototype
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- Sample data ----------
  const works = [
    { title: "Moi Moi", semester: "Spring 2026", students: "Darcy, Crystal, Jiyeong", link: "", img: "assets/work-moimoi.png", h: 237.03, top: 18.08 },
    { title: "Exploring Minds", semester: "Spring 2026", students: "Jamie, Pragya, Cheawon", link: "", img: "assets/work-exploring.png", h: 213.76, top: 0.16 },
    { title: "Creative Horizons", semester: "Spring 2025", students: "Mel, Ella, Pooja", link: "", img: "assets/work-creative.png", h: 195.11, top: -45.14 },
    { title: "Tech Innovators", semester: "Spring 2025", students: "Sujn Keyi, Vivian", link: "", img: "assets/work-tech.png", h: 177.7, top: -47.63 },
    { title: "Cultural Connections", semester: "Spring 2025", students: "Chris, Doris, Minjee", link: "", img: "assets/work-cultural.png", h: 204.55, top: -64.38 },
  ];
  const testimonials = [
    { quote: "“This course helped me think beyond how a design looks and focus on how people actually understand it. I became much more intentional about my design decisions.”", name: "Maya Chen", year: "MDes Class of 2027", shown: false },
    { quote: "“Be prepared to spend time developing and documenting projects outside of class. Keeping track of my process took effort, but it helped me understand why some ideas worked better than others.”", name: "Alex Morgan", year: "MDes Class of 2027", shown: false },
    { quote: "“The critiques were the most valuable part. Hearing how classmates read my work showed me where my message was getting lost.”", name: "Jordan Lee", year: "MDes Class of 2026", shown: false },
    { quote: "“Sketching every idea before going digital felt slow at first, but it made my final pieces much clearer.”", name: "Priya Nair", year: "MPS Class of 2026", shown: false },
  ];
  const faqs = [
    { q: "Will I need to work on projects outside of class?", a: "Yes. You’ll develop, produce, and document your course projects outside scheduled class time." },
    { q: "How will my work be assessed?", a: "Assessment focuses primarily on course projects, alongside process documentation, written reflections, class participation, and team contributions." },
    { q: "Can I take this course if I’m not an MDes or MPS Design student?", a: "The course is intended for MDes and MPS students in Design. Students from other programs need the instructor’s permission to enroll." },
  ];
  const tags = ["Communication Design", "Project-Based", "Design Theory"];
  const directory = [
    "jiyeongy@andrew.cmu.edu", "jiyeh@andrew.cmu.edu", "jiyleans@andrew.cmu.edu",
    "darcyk@andrew.cmu.edu", "crystalp@andrew.cmu.edu", "pragyas@andrew.cmu.edu",
    "srohrbach@andrew.cmu.edu", "mayac@andrew.cmu.edu", "alexm@andrew.cmu.edu",
  ];
  let totalHours = 16;    // weekly total (editable); also the slider scale
  let inClass = 5;

  // ---------- Toast ----------
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    $("#toastText").textContent = msg;
    t.hidden = false;
    t.style.animation = "none"; void t.offsetWidth; t.style.animation = "";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.hidden = true), 3000);
  }

  // ---------- Menus ----------
  const menus = [];
  function bindMenu(trigger, menu, onPick) {
    menus.push({ trigger, menu });
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = menu.hidden;
      closeMenus();
      menu.hidden = !open;
      trigger.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", (e) => {
      const item = e.target.closest("button");
      if (!item) return;
      closeMenus();
      onPick(item);
    });
  }
  function closeMenus() {
    menus.forEach(({ trigger, menu }) => { menu.hidden = true; trigger.setAttribute("aria-expanded", "false"); });
  }
  document.addEventListener("click", closeMenus);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeMenus();
    $$(".overlay").forEach((o) => (o.hidden = true));
  });

  // ---------- Header ----------
  function stamp() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    let h = d.getHours(); const ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12;
    const when = `${p(d.getMonth() + 1)}/${p(d.getDate())}/${d.getFullYear()} ${p(h)}:${p(d.getMinutes())}${ap}`;
    $("#lastUpdate").textContent = `Last Update: ${when}`;
    $("#updatedAt").textContent = `Updated: ${when}`;
  }
  $("#saveBtn").addEventListener("click", () => { stamp(); toast("Your changes have been saved."); });

  bindMenu($("#publishBtn"), $("#publishMenu"), (item) => {
    switch (item.dataset.action) {
      case "publish": stamp(); toast("Your course page has been published."); break;
      case "email": openEmail(); break;
      case "canvas": stamp(); toast("Your course information has been added to Canvas."); break;
      case "syllabus": toast("Your syllabus has been exported."); break;
      case "poster": toast("Your course poster has been exported."); break;
    }
  });

  // ---------- Banner ----------
  const bannerImg = $("#bannerImg");
  function setBanner(src) { bannerImg.src = src; bannerImg.hidden = false; }
  bindMenu($("#bannerEditBtn"), $("#bannerMenu"), (item) => {
    if (item.dataset.action === "upload") $("#bannerFile").click();
    else setBanner("assets/banner.jpg");
  });
  $("#bannerFile").addEventListener("change", (e) => {
    const f = e.target.files[0]; if (f) setBanner(URL.createObjectURL(f));
    e.target.value = "";
  });

  $("#dismissInfo").addEventListener("click", () => ($("#infoWrap").hidden = true));

  // ---------- Section completion state (dashed = empty, solid + green dot = filled) ----------
  function refreshSection(sec) {
    if (!sec || !sec.hasAttribute("data-section")) return;
    let filled;
    if (sec.hasAttribute("data-always-filled")) filled = true;
    else if (sec.id === "testimonialSection") filled = testimonials.some((t) => t.shown);
    else if (sec.id === "workSection") filled = works.length > 0;
    else if (sec.id === "faqSection") filled = faqs.some((f) => f.q.trim() || f.a.trim());
    else filled = $$("[data-field]", sec).some((el) => el.textContent.trim() !== "");
    sec.classList.toggle("is-empty", !filled);
  }
  const refreshAll = () => $$("[data-section]").forEach(refreshSection);

  document.addEventListener("input", (e) => {
    const ed = e.target.closest("[contenteditable]");
    if (!ed) return;
    // keep :empty placeholder working after the user deletes everything
    if (ed.textContent.trim() === "" && !ed.querySelector("li")) ed.innerHTML = "";
    refreshSection(ed.closest("[data-section]"));
  });
  // paste as plain text
  document.addEventListener("paste", (e) => {
    if (!e.target.closest("[contenteditable]")) return;
    e.preventDefault();
    document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
  });
  // click anywhere on an empty container to start typing
  document.addEventListener("click", (e) => {
    const sec = e.target.closest(".container.is-empty");
    if (!sec || e.target.closest("button, a, input, [contenteditable]")) return;
    const field = $("[data-field]", sec);
    if (field) field.focus();
  });

  // ---------- Evaluation segmented control ----------
  $$(".segmented").forEach((group) => {
    group.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      $$("button", group).forEach((x) => { x.classList.toggle("is-selected", x === b); x.setAttribute("aria-checked", String(x === b)); });
    });
  });

  // ---------- Workload ----------
  // Total hours is editable; the slider scale follows it. In-class hours come from the slider,
  // the rest of the week is studio work and research. The studio label text is editable too.
  const slider = $("#slider"), marks = $("#marks");
  let studioLabel = "studio work and research";
  function markStep(total) { return total <= 20 ? 1 : total <= 40 ? 2 : 5; }
  function renderMarks() {
    const step = markStep(totalHours);
    const values = [];
    for (let i = 0; i <= totalHours; i += step) values.push(i);
    if (values[values.length - 1] !== totalHours) values.push(totalHours);
    marks.innerHTML = values.map((i) =>
      `<div class="mark" data-v="${i}" style="left:${(i / totalHours) * 100}%"><i></i><span>${i}</span></div>`).join("");
    slider.setAttribute("aria-valuemax", totalHours);
  }
  function renderWorkload() {
    inClass = Math.min(inClass, totalHours);
    const studio = totalHours - inClass;
    const frac = totalHours ? inClass / totalHours : 0;
    $("#trackFill").style.width = frac * 100 + "%";
    $("#handle").style.left = `calc(8px + (100% - 16px) * ${frac})`;
    $$(".mark", marks).forEach((m) => {
      const v = +m.dataset.v;
      m.classList.toggle("on", v <= inClass);
      m.classList.toggle("current", v === inClass);
    });
    const inB = $("#bracketIn"), outB = $("#bracketOut");
    inB.hidden = inClass === 0; outB.hidden = studio === 0;
    inB.style.flex = studio === 0 ? "1 1 0" : `0 0 calc((100% - 2px) * ${frac})`;
    $("#inLabel").textContent = `${inClass}hrs in class`;
    if (!$("#outLabel input")) $("#outLabel").textContent = `${studio} hrs ${studioLabel}`;
    if (!$("#weeklyTotal input")) $("#weeklyTotal").textContent = `${totalHours} hrs`;
    slider.setAttribute("aria-valuenow", inClass);
    slider.setAttribute("aria-valuetext", `${inClass} hours in class, ${studio} hours ${studioLabel}`);
  }
  function valueFromPointer(x) {
    const r = $("#track").getBoundingClientRect();
    return Math.max(0, Math.min(totalHours, Math.round(((x - r.left) / r.width) * totalHours)));
  }
  slider.addEventListener("pointerdown", (e) => {
    slider.setPointerCapture(e.pointerId);
    slider.classList.add("is-dragging");
    inClass = valueFromPointer(e.clientX); renderWorkload();
  });
  slider.addEventListener("pointermove", (e) => {
    if (!slider.classList.contains("is-dragging")) return;
    const v = valueFromPointer(e.clientX);
    if (v !== inClass) { inClass = v; renderWorkload(); }
  });
  slider.addEventListener("pointerup", () => slider.classList.remove("is-dragging"));
  slider.tabIndex = 0;
  slider.setAttribute("role", "slider");
  slider.setAttribute("aria-label", "Hours in class per week");
  slider.setAttribute("aria-valuemin", 0);
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") inClass = Math.min(totalHours, inClass + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") inClass = Math.max(0, inClass - 1);
    else return;
    e.preventDefault(); renderWorkload();
  });

  // Inline edit helper: swaps an element's text for an input; Enter/blur saves, Esc cancels
  function inlineEdit(host, { html, onSave }) {
    if ($("input", host)) return;
    host.innerHTML = html;
    host.classList.add("is-editing");
    const inp = $("input", host);
    inp.focus(); inp.select();
    let done = false;
    const finish = (save) => {
      if (done) return; done = true;
      host.classList.remove("is-editing");
      if (save) onSave(inp.value);
      host.innerHTML = "";
      renderWorkload();
    };
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); finish(true); }
      if (e.key === "Escape") { e.stopPropagation(); finish(false); }
    });
    inp.addEventListener("blur", () => finish(true));
  }

  // Click "16 hrs" to type the weekly total
  const totalEl = $("#weeklyTotal");
  function editTotal() {
    inlineEdit(totalEl, {
      html: `<span class="edit-field total-field"><input type="number" min="1" max="60" step="1" value="${totalHours}" aria-label="Total hours per week"><span>hrs</span></span>`,
      onSave: (v) => {
        const n = Math.round(Number(v));
        if (Number.isFinite(n) && n >= 1) {
          totalHours = Math.min(60, n);
          renderMarks();
        }
      },
    });
  }
  totalEl.addEventListener("click", editTotal);
  totalEl.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target === totalEl) { e.preventDefault(); editTotal(); } });

  // Pencil: rename the studio label
  $("#editStudio").addEventListener("click", () => {
    const studio = totalHours - inClass;
    inlineEdit($("#outLabel"), {
      html: `<span class="label-prefix">${studio} hrs</span><span class="edit-field label-field"><input type="text" maxlength="40" value="${esc(studioLabel)}" aria-label="Label for the remaining hours"></span>`,
      onSave: (v) => { if (v.trim()) studioLabel = v.trim(); },
    });
  });

  // ---------- Rubric upload ----------
  const rubricFiles = [];
  function renderRubricFiles() {
    $("#rubricFiles").innerHTML = rubricFiles.map((f, i) => `
      <span class="rubric-file"><a class="link" href="${f.url}" target="_blank" rel="noopener">${esc(f.name)}</a>
      <button data-rubric-rm="${i}" aria-label="Remove ${esc(f.name)}"><img src="assets/icon-tag-close.svg" alt="" width="10" height="10"></button></span>`).join("");
    const sec = $("#rubricFiles").closest("[data-section]");
    sec.toggleAttribute("data-always-filled", rubricFiles.length > 0);
    refreshSection(sec);
  }
  $("#rubricUpload").addEventListener("click", () => $("#rubricFile").click());
  $("#rubricFile").addEventListener("change", (e) => {
    const f = e.target.files[0]; if (!f) return;
    rubricFiles.push({ name: f.name, url: URL.createObjectURL(f) });
    e.target.value = "";
    renderRubricFiles();
    toast("Rubric uploaded.");
  });
  $("#rubricFiles").addEventListener("click", (e) => {
    const b = e.target.closest("[data-rubric-rm]"); if (!b) return;
    rubricFiles.splice(+b.dataset.rubricRm, 1); renderRubricFiles();
  });

  // ---------- Prerequisites / Substitutes / Corequisites ----------
  const REQ_OPTIONS = ["N/A", "51-121 Communication Design Fundamentals", "51-171 Communications Studio I", "51-671 Design Principles & Practices", "51-701 Seminar I: Interaction & Service Design", "Permission of the instructor"];
  $$("#reqs .req").forEach((req, i) => {
    const title = req.dataset.req;
    req.innerHTML = `<p class="h5-serif">${title}</p>
      <div class="menu-anchor">
        <button class="dropdown-trigger" id="reqTrigger${i}" aria-haspopup="listbox" aria-label="${title}"><span>N/A</span><img src="assets/icon-dropdown.svg" alt="" width="10" height="11"></button>
        <div class="dropdown-menu req-menu" id="reqMenu${i}" role="listbox" hidden>${REQ_OPTIONS.map((o) => `<button role="option">${esc(o)}</button>`).join("")}</div>
      </div>`;
    bindMenu($(`#reqTrigger${i}`), $(`#reqMenu${i}`), (item) => ($(`#reqTrigger${i} span`).textContent = item.textContent));
  });

  // ---------- Examples of Student Work ----------
  let workOffset = 0;
  // Brand palette (Noir Light paint-chip colors) for cards without a preview image
  const PALETTE = ["#be1562", "#ebba34", "#86440f", "#104eaa", "#a09892", "#1a703e"];
  function colorFor(w) {
    let h = 0;
    for (const ch of w.title + w.link) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return PALETTE[h % PALETTE.length];
  }

  // Look up the link's preview image (og:image) and show it as the thumbnail
  function loadPreview(w) {
    w.thumb = null;
    if (!w.link) return;
    const token = (w.previewToken = {});
    const isImage = /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(w.link);
    const lookup = isImage
      ? Promise.resolve(w.link)
      : fetch(`https://api.microlink.io/?url=${encodeURIComponent(w.link)}`)
          .then((r) => r.json())
          .then((j) => j?.data?.image?.url || null);
    lookup
      .then((src) => new Promise((resolve, reject) => {
        if (!src) return reject();
        const probe = new Image();
        probe.onload = () => resolve(src);
        probe.onerror = reject;
        probe.src = src;
      }))
      .then((src) => {
        if (w.previewToken !== token || !works.includes(w)) return;
        w.thumb = src;
        renderWorks();
      })
      .catch(() => {});
  }

  function renderWorks() {
    $("#workRow").innerHTML = works.map((w, i) => {
      const href = w.link ? `href="${esc(w.link)}" target="_blank" rel="noopener"` : "";
      const img = w.img
        ? `<a class="card-img" ${href}><img src="${w.img}" alt="" style="height:${w.h}%;top:${w.top}%"></a>`
        : `<a class="card-img card-color" ${href} style="background:${colorFor(w)}">${w.thumb ? `<img class="thumb" src="${esc(w.thumb)}" alt="">` : ""}</a>`;
      return `<article class="card" data-i="${i}">
        ${img}
        <div class="card-body">
          <p class="card-title">${esc(w.title)}</p>
          <p class="card-sub">${esc(w.semester)}</p>
          <p class="card-sub">${esc(w.students)}</p>
        </div>
        <div class="card-actions">
          <button data-act="delete" aria-label="Delete ${esc(w.title)}"><img src="assets/icon-delete.svg" alt=""></button>
          <button data-act="edit" aria-label="Edit ${esc(w.title)}"><img src="assets/icon-edit.svg" alt=""></button>
          <button data-act="open" aria-label="Open link for ${esc(w.title)}"><img src="assets/icon-more.svg" alt=""></button>
        </div>
      </article>`;
    }).join("");
    scrollWorks(0);
    refreshSection($("#workSection"));
  }
  function scrollWorks(dir) {
    const row = $("#workRow"), view = $("#workCarousel");
    const maxOffset = Math.max(0, row.scrollWidth - view.clientWidth);
    workOffset = Math.max(0, Math.min(maxOffset, workOffset + dir * 256));
    row.style.transform = `translateX(${-workOffset}px)`;
  }
  $$("[data-scroll]").forEach((b) => b.addEventListener("click", () => scrollWorks(+b.dataset.scroll)));
  window.addEventListener("resize", () => scrollWorks(0));

  $("#workRow").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-act]"); if (!btn) return;
    const i = +btn.closest(".card").dataset.i;
    const w = works[i];
    if (btn.dataset.act === "delete") {
      works.splice(i, 1); renderWorks();
    } else if (btn.dataset.act === "edit") {
      openProject(i);
    } else if (w.link) {
      window.open(w.link, "_blank", "noopener");
    } else {
      openProject(i, "fLink");
    }
  });

  let editingIndex = null;
  function openProject(index = null, focusId = "fStudents") {
    editingIndex = index;
    const w = index === null ? null : works[index];
    $("#projectTitle").textContent = w ? "Edit project" : "Add project";
    $("#projectSubmit").textContent = w ? "Save" : "Add";
    $("#fSemester").value = w ? w.semester : "Spring 2026";
    $("#fStudents").value = w ? w.students : "";
    $("#fName").value = w ? w.title : "";
    $("#fLink").value = w ? w.link : "";
    $("#fName").classList.remove("is-invalid");
    $("#projectOverlay").hidden = false;
    $("#" + focusId).focus();
  }
  $("#addProjectBtn").addEventListener("click", () => openProject());
  $("#projectForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#fName").value.trim();
    if (!name) { $("#fName").classList.add("is-invalid"); $("#fName").focus(); return; }
    let link = $("#fLink").value.trim();
    if (link && !/^https?:\/\//i.test(link)) link = "https://" + link;
    const data = { title: name, semester: $("#fSemester").value, students: $("#fStudents").value.trim(), link };
    if (editingIndex === null) {
      const w = { ...data, img: null };
      works.unshift(w);
      workOffset = 0;
      loadPreview(w);
    } else {
      const w = works[editingIndex];
      const linkChanged = w.link !== data.link;
      Object.assign(w, data);
      if (linkChanged) { w.img = null; loadPreview(w); }
    }
    $("#projectOverlay").hidden = true;
    renderWorks();
  });
  $("#fName").addEventListener("input", (e) => e.target.classList.remove("is-invalid"));

  // ---------- Testimonials ----------
  let tIndex = 0;
  function renderTestimonials() {
    const visible = testimonials.slice(tIndex, tIndex + 2);
    $("#testimonialRow").innerHTML = visible.map((t, k) => `
      <div class="testimonial">
        <blockquote>${esc(t.quote)}</blockquote>
        <div class="testimonial-foot">
          <div class="testimonial-meta"><span>${esc(t.name)}</span><span>${esc(t.year || "")}</span></div>
          <button class="btn ${t.shown ? "btn-primary" : "btn-secondary"}" data-t="${tIndex + k}" aria-pressed="${t.shown}">${t.shown ? "Displayed" : "Display This"}</button>
        </div>
      </div>`).join("");
    $('[data-tscroll="-1"]').disabled = tIndex === 0;
    $('[data-tscroll="1"]').disabled = tIndex + 2 >= testimonials.length;
    refreshSection($("#testimonialSection"));
  }
  $("#testimonialRow").addEventListener("click", (e) => {
    const b = e.target.closest("[data-t]"); if (!b) return;
    const t = testimonials[+b.dataset.t]; t.shown = !t.shown; renderTestimonials();
  });
  $$("[data-tscroll]").forEach((b) => b.addEventListener("click", () => {
    tIndex = Math.max(0, Math.min(testimonials.length - 2, tIndex + +b.dataset.tscroll));
    renderTestimonials();
  }));

  // ---------- FAQs ----------
  function renderFaqs() {
    $("#faqList").innerHTML = faqs.map((f, i) => `
      <div class="faq">
        <div class="faq-box">
          <p class="h5-serif">Question #${i + 1}</p>
          <div class="body-text" contenteditable="true" data-faq="${i}" data-k="q" data-placeholder="Type a question students often ask.">${esc(f.q)}</div>
        </div>
        <img src="assets/icon-arrow-right.svg" alt="">
        <div class="faq-box">
          <p class="h5-serif">Answer #${i + 1}</p>
          <div class="body-text" contenteditable="true" data-faq="${i}" data-k="a" data-placeholder="Type your answer.">${esc(f.a)}</div>
        </div>
      </div>`).join("");
    refreshSection($("#faqSection"));
  }
  $("#faqList").addEventListener("input", (e) => {
    const el = e.target.closest("[data-faq]"); if (!el) return;
    faqs[+el.dataset.faq][el.dataset.k] = el.textContent;
    refreshSection($("#faqSection"));
  });
  $("#addFaqBtn").addEventListener("click", () => {
    faqs.push({ q: "", a: "" });
    renderFaqs();
    $(`[data-faq="${faqs.length - 1}"][data-k="q"]`).focus();
  });

  // ---------- Tags ----------
  function renderTags() {
    $("#tags").innerHTML = tags.map((t, i) => `
      <span class="tag">${esc(t)}<button data-tag="${i}" aria-label="Remove ${esc(t)}"><img src="assets/icon-tag-close.svg" alt=""></button></span>`).join("") +
      `<button class="tag tag-plus" id="newTag"><img src="assets/icon-tag-plus.svg" alt="">New Tag</button>`;
  }
  $("#tags").addEventListener("click", (e) => {
    const rm = e.target.closest("[data-tag]");
    if (rm) { tags.splice(+rm.dataset.tag, 1); renderTags(); return; }
    const plus = e.target.closest("#newTag");
    if (!plus) return;
    const holder = document.createElement("span");
    holder.className = "tag tag-plus";
    holder.innerHTML = `<input class="tag-input" placeholder="New tag" maxlength="32">`;
    plus.replaceWith(holder);
    const input = $("input", holder);
    input.focus();
    let done = false;
    const commit = (save) => {
      if (done) return; done = true;
      const v = input.value.trim();
      if (save && v && !tags.includes(v)) tags.push(v);
      renderTags();
    };
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") commit(true);
      if (ev.key === "Escape") { ev.stopPropagation(); commit(false); }
    });
    input.addEventListener("blur", () => commit(true));
  });

  // ---------- Class size & syllabus ----------
  bindMenu($("#sizeTrigger"), $("#sizeMenu"), (item) => ($("#sizeValue").textContent = item.textContent));
  $("#syllabusLink").addEventListener("click", () => $("#syllabusFile").click());
  $("#syllabusFile").addEventListener("change", (e) => {
    const f = e.target.files[0]; if (!f) return;
    $("#syllabusLink").textContent = f.name;
    e.target.value = "";
  });

  // ---------- Send as Email ----------
  const recipients = [];
  let activeSuggestion = 0;
  const emailInput = $("#emailInput"), suggestMenu = $("#suggestMenu");
  function openEmail() {
    recipients.length = 0; renderRecipients();
    emailInput.value = ""; suggestMenu.hidden = true;
    $("#emailOverlay").hidden = false;
    emailInput.focus();
  }
  function renderRecipients() {
    $("#emailTags").innerHTML = recipients.map((r, i) => `
      <span class="tag">${esc(r)}<button data-r="${i}" aria-label="Remove ${esc(r)}"><img src="assets/icon-email-tag-close.svg" alt=""></button></span>`).join("");
  }
  function addRecipient(value) {
    const v = (value ?? emailInput.value).trim().toLowerCase();
    if (!v) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { emailInput.classList.add("is-invalid"); return false; }
    if (!recipients.includes(v)) recipients.push(v);
    emailInput.value = ""; emailInput.classList.remove("is-invalid");
    suggestMenu.hidden = true;
    renderRecipients();
    return true;
  }
  function renderSuggestions() {
    const q = emailInput.value.trim().toLowerCase();
    const list = q ? directory.filter((d) => d.startsWith(q) && !recipients.includes(d)) : [];
    activeSuggestion = 0;
    suggestMenu.innerHTML = list.map((d, i) => `<button role="option" class="${i === 0 ? "is-active" : ""}" data-email="${d}">${d}</button>`).join("");
    suggestMenu.hidden = list.length === 0;
  }
  emailInput.addEventListener("input", () => { emailInput.classList.remove("is-invalid"); renderSuggestions(); });
  emailInput.addEventListener("keydown", (e) => {
    const items = $$("button", suggestMenu);
    if (!suggestMenu.hidden && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      activeSuggestion = (activeSuggestion + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items.forEach((b, i) => b.classList.toggle("is-active", i === activeSuggestion));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (!suggestMenu.hidden && items[activeSuggestion]) addRecipient(items[activeSuggestion].dataset.email);
      else addRecipient();
    }
  });
  suggestMenu.addEventListener("mousedown", (e) => {
    const b = e.target.closest("[data-email]"); if (!b) return;
    e.preventDefault(); addRecipient(b.dataset.email); emailInput.focus();
  });
  emailInput.addEventListener("blur", () => setTimeout(() => (suggestMenu.hidden = true), 100));
  $("#emailAdd").addEventListener("click", () => { addRecipient(); emailInput.focus(); });
  $("#emailTags").addEventListener("click", (e) => {
    const b = e.target.closest("[data-r]"); if (!b) return;
    recipients.splice(+b.dataset.r, 1); renderRecipients();
  });
  $("#emailSend").addEventListener("click", () => {
    if (emailInput.value.trim() && !addRecipient()) return;
    if (!recipients.length) { emailInput.classList.add("is-invalid"); emailInput.focus(); return; }
    $("#emailOverlay").hidden = true;
    toast("Your course information has been sent.");
  });

  // ---------- Modals: close ----------
  $$(".overlay").forEach((o) => {
    o.addEventListener("click", (e) => { if (e.target === o || e.target.closest("[data-close]")) o.hidden = true; });
  });

  // ---------- Drag to reorder sections ----------
  const mainCol = $("#mainCol");
  const placeholder = document.createElement("div");
  placeholder.className = "drop-placeholder";
  let drag = null;

  // Animate the other sections sliding into their new spots (FLIP)
  function moveWithAnimation(mutate) {
    const blocks = $$(".block:not(.is-dragging)", mainCol);
    const before = new Map(blocks.map((b) => [b, b.getBoundingClientRect().top]));
    mutate();
    blocks.forEach((b) => {
      const dy = before.get(b) - b.getBoundingClientRect().top;
      if (!dy) return;
      b.style.transition = "none";
      b.style.transform = `translateY(${dy}px)`;
      requestAnimationFrame(() => {
        b.style.transition = "transform .18s ease";
        b.style.transform = "";
      });
    });
  }

  function updateDrag() {
    if (!drag) return;
    const { block, offsetY, pointerY } = drag;
    block.style.top = pointerY - offsetY + "px";
    const others = $$(".block:not(.is-dragging)", mainCol);
    const next = others.find((b) => {
      const r = b.getBoundingClientRect();
      return pointerY < r.top + r.height / 2;
    });
    const target = next || null;
    if (placeholder.nextElementSibling !== target || (!target && mainCol.lastElementChild !== placeholder)) {
      moveWithAnimation(() => mainCol.insertBefore(placeholder, target));
    }
  }

  // Scroll the page while dragging near the top or bottom edge
  function autoScroll() {
    if (!drag) return;
    const edge = 120, y = drag.pointerY, h = window.innerHeight;
    let dy = 0;
    if (y < edge + 86) dy = -Math.ceil((edge + 86 - y) / 6);
    else if (y > h - edge) dy = Math.ceil((y - (h - edge)) / 6);
    if (dy) { window.scrollBy(0, dy); updateDrag(); }
    drag.raf = requestAnimationFrame(autoScroll);
  }

  $$(".block", mainCol).forEach((block) => {
    const tool = document.createElement("div");
    tool.className = "tool";
    tool.innerHTML = `<button aria-label="Drag to reorder section"><img src="assets/icon-drag.svg" alt="" width="14" height="14"></button>`;
    block.prepend(tool);
    const handle = $("button", tool);

    handle.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      try { handle.setPointerCapture(e.pointerId); } catch {}
      const r = block.getBoundingClientRect();
      placeholder.style.height = r.height + "px";
      block.before(placeholder);
      Object.assign(block.style, { position: "fixed", left: r.left + "px", top: r.top + "px", width: r.width + "px" });
      block.classList.add("is-dragging");
      document.body.classList.add("is-reordering");
      drag = { block, offsetY: e.clientY - r.top, pointerY: e.clientY };
      drag.raf = requestAnimationFrame(autoScroll);
    });
    handle.addEventListener("pointermove", (e) => {
      if (!drag || drag.block !== block) return;
      drag.pointerY = e.clientY;
      updateDrag();
    });
    const finish = () => {
      if (!drag || drag.block !== block) return;
      cancelAnimationFrame(drag.raf);
      drag = null;
      block.classList.remove("is-dragging");
      document.body.classList.remove("is-reordering");
      block.style.position = block.style.left = block.style.top = block.style.width = "";
      placeholder.replaceWith(block);
    };
    handle.addEventListener("pointerup", finish);
    handle.addEventListener("pointercancel", finish);
  });

  // ---------- Init ----------
  renderMarks();
  renderWorkload();
  renderWorks();
  renderTestimonials();
  renderFaqs();
  renderTags();
  refreshAll();
})();
