// C Studio – published course information page (student view)
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let toastTimer;
  function toast(msg) {
    $("#toastText").textContent = msg;
    $("#toast").hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => ($("#toast").hidden = true), 3200);
  }

  // ---------- Embedded mode (inside the Course Planner's Course Details panel) ----------
  // ?embed=1 → single-column layout; #d=<base64 JSON> → show another course's basic info.
  const EMBED = document.documentElement.classList.contains("embed");
  if (EMBED) {
    const head = $(".course-head-main");
    // Typical class size joins the info row; dates and tags move under it; syllabus becomes the first band
    const size = document.createElement("p");
    size.id = "classSizeLine";
    size.textContent = "Typical Class Size: 18";
    $(".course-info").appendChild(size);
    const dates = $(".course-dates"); head.appendChild(dates);
    const tags = $(".side-col .tags"); head.appendChild(tags);
    const syllabus = $(".side-col .card"); syllabus.classList.add("band-syllabus");
    $(".course-head").after(syllabus);
    // Related links move into the Description band
    const linksCard = $$(".side-col .card").find((c) => /Related Links/.test(c.textContent));
    const desc = $(".main-col .card");
    const wrap = document.createElement("div");
    wrap.className = "related-inline";
    wrap.append($("h2", linksCard), $("a", linksCard));
    desc.appendChild(wrap);
    // Course cards open in the full window (not inside the panel)
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a.course"); if (!a) return;
      e.preventDefault(); window.top.location.href = a.href;
    });
  }
  const override = (() => {
    const m = location.hash.match(/#d=([^&]+)/);
    if (!m) return null;
    try { return JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(m[1]))))); } catch { return null; }
  })();
  if (override) {
    const o = override;
    const setP = (els, vals) => els.forEach((el, i) => { if (vals[i] == null) el.remove(); else el.textContent = vals[i]; });
    setP($$(".course-meta p"), [o.semester, o.code, o.school, `${o.units} credits`, o.mode]);
    $(".course-title").textContent = o.title;
    document.title = `${o.title} – Course Information`;
    setP($$(".course-info p:not(#classSizeLine)"), [o.instructor, o.days, o.time, o.city, o.building, o.room]);
    const size = $("#classSizeLine"); if (size) size.textContent = `Typical Class Size: ${o.classSize}`;
    $(".page-header .h4").textContent = o.title;
    $$(".course-dates p")[0].textContent = "Updated: 09/14/2026 10:12am";
    $$(".course-dates p")[1].textContent = "Created: 08/02/2022 03:40pm";
    $(".tags").innerHTML = o.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("");
    const syl = $("[data-file$='Syllabus.pdf']");
    syl.textContent = syl.dataset.file = `${o.code.replace(/\s+/g, "_")}-Syllabus.pdf`;
    $(".main-col .card .body-m").textContent = o.description;
    $(".level-tag").textContent = o.level;
    const who = $$(".card").find((c) => /Who is this class for/.test(c.textContent));
    $(".body-m", who).textContent = `This course is intended for ${o.level.toLowerCase()} students. Reach out to the instructor if you have questions about eligibility.`;
    $$(".reqs .body-m", who)[0].textContent = o.prereq;
    $$(".reqs .body-m", who)[1].textContent = "N/A";
    $$(".reqs .body-m", who)[2].textContent = "N/A";
    // Sections we only have content for on the sample course are hidden
    const HIDE = /^(Workload|Course Deliverables|Evaluation Metrics|Rubric|Learning Outcomes|Examples of Student Work|Degree Contributions|Testimonials|Faculty Course Evaluations|FAQs)$/;
    $$(".card").forEach((c) => { const h = $("h2", c); if (h && HIDE.test(h.textContent.trim())) c.hidden = true; });
    $$(".pair").forEach((p) => { if ($$(".card", p).every((c) => c.hidden)) p.hidden = true; });
    window.__COURSE_OVERRIDE__ = o;
  }

  // ---------- Workload (read only) ----------
  const TOTAL = 16, IN_CLASS = 5;
  $("#marks").innerHTML = Array.from({ length: TOTAL + 1 }, (_, i) =>
    `<div class="mark${i <= IN_CLASS ? " on" : ""}${i === IN_CLASS ? " current" : ""}" style="left:${(i / TOTAL) * 100}%"><i></i><span>${i}</span></div>`).join("");
  $("#trackIn").style.width = `${(IN_CLASS / TOTAL) * 100}%`;
  $("#handle").style.left = `calc(8px + (100% - 16px) * ${IN_CLASS / TOTAL})`;
  $("#bracketIn").style.flex = `0 0 calc((100% - 2px) * ${IN_CLASS / TOTAL})`;
  $("#inLabel").textContent = `${IN_CLASS}hrs in class`;
  $("#outLabel").textContent = `${TOTAL - IN_CLASS} hrs studio work and research`;

  // ---------- Examples of Student Work ----------
  const works = [
    { title: "Moi Moi", semester: "Spring 2026", students: "Darcy, Crystal, Jiyeong", img: "assets/work-moimoi.png", h: 237.03, top: 18.08 },
    { title: "Exploring Minds", semester: "Spring 2026", students: "Jamie, Pragya, Cheawon", img: "assets/work-exploring.png", h: 213.76, top: 0.16 },
    { title: "Creative Horizons", semester: "Spring 2025", students: "Mel, Ella, Pooja", img: "assets/work-creative.png", h: 195.11, top: -45.14 },
    { title: "Tech Innovators", semester: "Spring 2025", students: "Sujn Keyi, Vivian", img: "assets/work-tech.png", h: 177.7, top: -47.63 },
    { title: "Cultural Connections", semester: "Spring 2025", students: "Chris, Doris, Minjee", img: "assets/work-cultural.png", h: 204.55, top: -64.38 },
  ];
  $("#workRow").innerHTML = works.map((w) => `
    <article class="work-card">
      <div class="work-img"><img src="${w.img}" alt="${esc(w.title)}" style="height:${w.h}%;top:${w.top}%"></div>
      <div class="work-body">
        <p class="work-title">${esc(w.title)}</p>
        <p class="work-sub">${esc(w.semester)}</p>
        <p class="work-sub">${esc(w.students)}</p>
      </div>
    </article>`).join("");
  let workOffset = 0;
  function scrollWorks(dir) {
    const row = $("#workRow"), view = $("#workCarousel");
    const max = Math.max(0, row.scrollWidth - view.clientWidth);
    workOffset = Math.max(0, Math.min(max, workOffset + dir * 256));
    row.style.transform = `translateX(${-workOffset}px)`;
    $('[data-work="-1"]').disabled = workOffset === 0;
    $('[data-work="1"]').disabled = workOffset >= max;
  }
  $$("[data-work]").forEach((b) => b.addEventListener("click", () => scrollWorks(+b.dataset.work)));
  window.addEventListener("resize", () => scrollWorks(0));

  // ---------- Testimonials ----------
  const testimonials = [
    { quote: "“This course helped me think beyond how a design looks and focus on how people actually understand it. I became much more intentional about my design decisions.”", name: "Maya Chen", who: "MDes 1, Spring 2025" },
    { quote: "“Be prepared to spend time developing and documenting projects outside of class. Keeping track of my process took effort, but it helped me understand why some ideas worked better than others.”", name: "Alex Morgan", who: "MPS, Fall 2024" },
    { quote: "“The critiques were the most valuable part. Hearing how classmates read my work showed me where my message was getting lost.”", name: "Jordan Lee", who: "MDes 1, Spring 2024" },
    { quote: "“Sketching every idea before going digital felt slow at first, but it made my final pieces much clearer.”", name: "Priya Nair", who: "MPS, Fall 2023" },
  ];
  let tIndex = 0;
  function renderTestimonials() {
    $("#testimonialRow").innerHTML = testimonials.slice(tIndex, tIndex + 2).map((t) => `
      <figure class="testimonial" style="margin:0">
        <blockquote>${esc(t.quote)}</blockquote>
        <figcaption><p>${esc(t.name)}</p><p class="who" style="margin-top:10px">${esc(t.who)}</p></figcaption>
      </figure>`).join("");
    $('[data-testi="-1"]').disabled = tIndex === 0;
    $('[data-testi="1"]').disabled = tIndex + 2 >= testimonials.length;
  }
  $$("[data-testi]").forEach((b) => b.addEventListener("click", () => {
    tIndex = Math.max(0, Math.min(testimonials.length - 2, tIndex + 2 * +b.dataset.testi));
    renderTestimonials();
  }));

  // ---------- FAQs ----------
  const faqs = [
    { q: "Will I need to work on projects outside of class?", a: "Yes. You’ll develop, produce, and document your course projects outside scheduled class time." },
    { q: "How will my work be assessed?", a: "Assessment focuses primarily on course projects, alongside process documentation, written reflections, class participation, and team contributions." },
    { q: "Can I take this course if I’m not an MDes or MPS Design student?", a: "The course is intended for MDes and MPS students in Design. Students from other programs need the instructor’s permission to enroll." },
  ];
  $("#faqList").innerHTML = faqs.map((f, i) => `
    <div class="faq">
      <div class="faq-box"><p class="h5-serif">Question #${i + 1}</p><p class="body-m">${esc(f.q)}</p></div>
      <img src="assets/icon-arrow-right.svg" alt="" width="36" height="36">
      <div class="faq-box"><p class="h5-serif">Answer #${i + 1}</p><p class="body-m">${esc(f.a)}</p></div>
    </div>`).join("");

  // ---------- Course lists ----------
  const course = (c) => `
    <a class="course" href="../student/" title="Open in Course Planner">
      <p class="course-code">${esc(c.code)}</p>
      <p class="course-title-sm">${esc(c.title)}</p>
      ${c.rows.map((r) => `<div class="course-row">${r.map((x) => `<span>${esc(x)}</span>`).join("")}</div>`).join("")}
    </a>`;
  const other = [
    { code: "DES 51486", title: "Designing Experiences for Learning", rows: [["Stacie Rohrbach", "MM 215"], ["T, Th - 02:00-4:00pm", "12 units"]] },
    { code: "DES 51703", title: "Graduate Design Colloquium", rows: [["Stacie Rohrbach", "MM 107"], ["F - 10:20-11:50am", "3 units"]] },
    { code: "DES 51228", title: "Communications Studio II: Designing Communications for Interaction", rows: [["Stacie Rohrbach", "MM 215"], ["M, W - 10:00-12:10pm", "12 units"]] },
  ];
  const related = [
    { code: "DES 51711", title: "MDES/MPS Studio 1: Designing for Interactions", rows: [["Andrew Twigg", "MM 215"], ["T, Tu - 02:00-4:00pm", "12 units"]] },
    { code: "DES 51701", title: "MDES/MPS Seminar: Interaction & Service Design Concepts", rows: [["Daniel Rosenberg Munoz", "MM 215"], ["M, W - 9:30-10:50am", "9 units"]] },
    { code: "DES 51725", title: "MDes/MPS Design Lab", rows: [["Daphne Peters Firos", "MM 215"], ["T, Th - 10:00-11:20am", "4 units"]] },
    { code: "DES 51705", title: "Thesis Prep I", rows: [["Bruce Hanington", "MM 215"], ["F - 9:00-10:20am", "3 units"]] },
  ];
  const suggested = [
    { code: "DES 51-365", title: "Creative Technology Sprints", rows: [["Josh Horowitz", "F - 9:00-11:50am", "10 units", "MM  B4"]], topics: ["Technology", "Interaction Design"] },
    { code: "ARC 48-646", title: "Urban Moss Interstitial Space as Micro Infrastructure", rows: [["Kristina Fisher", "M, W - 9:30-10:50am", "9 units", "MM 315"]], topics: ["Environments", "Sustainability"] },
    { code: "DES 51-648", title: "Design Fusion: Design Anthropology", rows: [["Annalisa Pao", "T,Th - 7:00-8:50pm", "6 units", "MM 215"]], topics: ["Research", "Communication"] },
    { code: "DES 51-265", title: "Environments Studio I: Understanding Form & Context", rows: [["Peter Scupelli", "T,Th - 8:00-9:50am", "9 units", "MM 215"]], topics: ["Environments", "Interaction Design"] },
  ];
  const o = window.__COURSE_OVERRIDE__;
  if (o) {
    $$(".pair-top .card h2")[0].textContent = `Other Classes taught by ${o.instructor}`;
    $("#otherList").innerHTML = o.other.length ? o.other.map(course).join("") : `<p class="empty">No other classes this semester.</p>`;
    $("#relatedList").innerHTML = o.related.length ? o.related.map(course).join("") : `<p class="empty">No related courses found.</p>`;
  } else {
    $("#otherList").innerHTML = other.map(course).join("");
    $("#relatedList").innerHTML = related.map(course).join("");
  }

  const TOPICS = ["Interaction Design", "Communication", "Technology", "Environments", "Research", "Sustainability"];
  let interests = new Set(TOPICS);
  function renderSuggested() {
    const list = suggested.filter((c) => c.topics.some((t) => interests.has(t)));
    $("#suggestedList").innerHTML = list.map(course).join("")
      || `<p class="empty">No suggestions match your interests yet. Try adding more topics.</p>`;
  }

  // ---------- Modals ----------
  function openModal(id) { $(id).hidden = false; }
  $$(".overlay").forEach((o) => o.addEventListener("click", (e) => {
    if (e.target === o || e.target.closest("[data-close]")) o.hidden = true;
  }));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") $$(".overlay").forEach((o) => (o.hidden = true)); });

  // Submit a question
  $("#askBtn").addEventListener("click", () => {
    $("#askText").value = ""; $("#askText").classList.remove("is-invalid");
    openModal("#askOverlay"); $("#askText").focus();
  });
  $("#askForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!$("#askText").value.trim()) { $("#askText").classList.add("is-invalid"); $("#askText").focus(); return; }
    $("#askOverlay").hidden = true;
    toast("Your question was sent to Stacie Rohrbach.");
  });
  $("#askText").addEventListener("input", (e) => e.target.classList.remove("is-invalid"));

  // Update interests
  let draft;
  function renderChips() {
    $("#interestChips").innerHTML = TOPICS.map((t) => `<button class="chip" aria-pressed="${draft.has(t)}" data-topic="${esc(t)}">${esc(t)}</button>`).join("");
  }
  $("#interestsBtn").addEventListener("click", () => { draft = new Set(interests); renderChips(); openModal("#interestOverlay"); });
  $("#interestChips").addEventListener("click", (e) => {
    const b = e.target.closest("[data-topic]"); if (!b) return;
    draft.has(b.dataset.topic) ? draft.delete(b.dataset.topic) : draft.add(b.dataset.topic);
    renderChips();
  });
  $("#saveInterests").addEventListener("click", () => {
    interests = draft; $("#interestOverlay").hidden = true; renderSuggested();
    toast("Your interests were updated.");
  });

  // Files (sample prototype – no real files attached)
  $$("[data-file]").forEach((b) => b.addEventListener("click", () => toast(`${b.dataset.file} isn’t attached in this prototype.`)));

  // ---------- Header ----------
  $("#shareBtn").addEventListener("click", async () => {
    const url = location.href.split("?")[0];
    try { await navigator.clipboard.writeText(url); toast("Link copied. Share it with classmates."); }
    catch { toast(`Copy this link to share: ${url}`); }
  });
  const moreBtn = $("#moreBtn"), moreMenu = $("#moreMenu");
  moreBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    moreMenu.hidden = !moreMenu.hidden;
    moreBtn.setAttribute("aria-expanded", String(!moreMenu.hidden));
  });
  document.addEventListener("click", () => { moreMenu.hidden = true; moreBtn.setAttribute("aria-expanded", "false"); });
  moreMenu.addEventListener("click", (e) => {
    const b = e.target.closest("[data-more]"); if (!b) return;
    if (b.dataset.more === "print") window.print();
    else toast("Communication_Studio-Syllabus.pdf isn’t attached in this prototype.");
  });

  // ---------- Init ----------
  renderTestimonials();
  renderSuggested();
  scrollWorks(0);
})();
