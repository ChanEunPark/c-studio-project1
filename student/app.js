// C Studio – student course planner prototype
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- Sample catalog ----------
  const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const DAY_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const MM = "Margaret Morrison Carnegie Hall";
  const PGH = "Pittsburgh, Pennsylvania";
  const COMM_DESC = "In this course students learn how the form of communication impacts the way people perceive and process messages by investigating communication theories and applying them to the design of messages. Students learn how to approach communication challenges through exercises and projects where they pose questions, observe and capture information through sketching and photographing, developing and iterating concepts, and evaluating their effectiveness. This course is intended for MDES & MPS students in Design; all other students by permission of the instructor.";
  const MDES_PREREQ = "Required for MDes students in the School of Design.";

  const course = (o) => ({
    location: PGH, building: MM, college: "College of Fine Arts", dept: "Design", level: "Graduate",
    mode: "In-Person", tags: [], prereq: "None.", link: "https://www.design.cmu.edu/", ...o,
  });
  const catalog = [
    course({ id: "51-729", title: "Communication Design Studio: Theory and Practice", instructor: "Stacie Rohrbach", room: "MM 215", days: [0, 2], start: "14:00", end: "16:50", units: 15,
      tags: ["Communication Design", "Project-Based", "Design Theory"], description: COMM_DESC, prereq: MDES_PREREQ }),
    course({ id: "51-703", title: "Graduate Design Colloquium - Fall 2026", instructor: "Andrew Twigg", room: "MM 117", days: [0, 2], start: "11:00", end: "11:50", units: 3,
      tags: ["Speaker Series", "Research"], description: "Weekly talks and discussions with visiting designers, researchers and alumni. Students connect current design practice to their own studio work and thesis interests.", prereq: MDES_PREREQ }),
    course({ id: "51-725", title: "Design Lab", instructor: "Daphne Peters", room: "MM 215", days: [1, 3], start: "10:00", end: "11:50", units: 9,
      tags: ["Making", "Prototyping"], description: "Hands-on lab for prototyping physical and digital artifacts. Students build skills in fabrication, rapid prototyping and documentation that support their studio projects.", prereq: MDES_PREREQ }),
    course({ id: "51-701", title: "Seminar I: Interaction & Service Design Concepts", instructor: "Daniel Rosenberg Munoz", room: "MM 215", days: [0, 2], start: "09:30", end: "10:50", units: 9,
      tags: ["Interaction Design", "Service Design", "Theory"], description: "An introduction to the core concepts, histories and methods of interaction and service design, through readings, discussion and short analytical exercises.", prereq: MDES_PREREQ }),
    course({ id: "51-711", title: "Studio I: Designing for Interactions", instructor: "Peter Scupelli", room: "MM 215", days: [1, 3], start: "14:00", end: "16:50", units: 15,
      tags: ["Interaction Design", "Project-Based", "Studio"], description: "Studio course exploring how people interact with products, services and environments. Students research, concept and prototype interactive experiences in teams.", prereq: MDES_PREREQ }),
    course({ id: "51-706", title: "MDes Thesis Prep & Progress 2026-27", instructor: "Bruce Hanington", room: "MM 215", days: [4], start: "09:00", end: "10:50", units: 6,
      tags: ["Thesis", "Research"], description: "Prepares MDes students to frame, plan and begin their thesis projects, with regular progress reviews and peer critique.", prereq: "MDes students only." }),
    course({ id: "51-265", title: "Environments Studio I: Understanding Form & Context", instructor: "Peter Scupelli", room: "MM 213", days: [1, 3], start: "08:00", end: "09:50", units: 10, level: "Undergraduate",
      tags: ["Environments", "Studio"], description: "Students study how spaces shape experience, working from observation and mapping to proposals for small-scale environments.", prereq: "51-171 or permission of the instructor." }),
    course({ id: "51-365", title: "Creative Technology Sprints", instructor: "Josh Horowitz", room: "MM B4", days: [4], start: "13:00", end: "15:50", units: 9, level: "Undergraduate",
      tags: ["Creative Coding", "Physical Computing"], description: "Fast-paced sprints that pair design questions with emerging technologies, from microcontrollers to machine learning tools.", prereq: "None." }),
    course({ id: "51-341", title: "How Things are Made", instructor: "Wayne Chung", room: "MM 203", days: [0, 2], start: "12:00", end: "13:20", units: 9, level: "Undergraduate",
      tags: ["Manufacturing", "Materials"], description: "A survey of materials and manufacturing processes behind everyday products, with factory case studies and hands-on material explorations.", prereq: "None." }),
    course({ id: "51-671", title: "Design Principles & Practices", instructor: "Bruce Hanington", room: "MM 121", days: [0, 2], start: "14:00", end: "15:50", units: 15,
      tags: ["Communication", "Collaboration & Teamwork", "Presentation"],
      description: "A variety of design skills and approaches presented through a focused series of lectures and hands-on experiences, including visual thinking, craft modeling, research methods, human factors, teamwork, critique, presentation, writing, and preparation for professional design practice. Required for MA Design students; all other students only by permission of the instructor.",
      prereq: "Some reservations are for Masters in Design. No prior knowledge required." }),
    course({ id: "51-171", title: "Communications Studio I: Understanding Form & Context", instructor: "Stacie Rohrbach", room: "MM 203", days: [1, 3], start: "08:30", end: "09:50", units: 10, level: "Undergraduate",
      tags: ["Communication Design", "Typography"], description: "Foundational studio on visual communication: how form, typography and image work together in context." }),
    course({ id: "51-125", title: "Communication & Digital Design Fundamentals", instructor: "Andrew Twigg", room: "MM 121", days: [4], start: "10:00", end: "11:50", units: 9, level: "Undergraduate",
      tags: ["Communication Design", "Digital"], description: "Introduces the principles of communication design for screens, covering layout, hierarchy, type and interaction basics." }),
    course({ id: "51-373", title: "Communications Studio III: Designing for Complex Communication Systems", instructor: "Stacie Rohrbach", room: "MM 215", days: [1, 3], start: "13:00", end: "14:50", units: 10, level: "Undergraduate",
      tags: ["Communication Design", "Systems"], description: "Advanced studio on designing communication systems that span media, audiences and time." }),
    course({ id: "51-121", title: "Communication Design Fundamentals", instructor: "Daphne Peters", room: "MM 213", days: [0, 2], start: "08:30", end: "09:50", units: 9, level: "Undergraduate",
      tags: ["Communication Design"], description: "Core principles of visual communication through drawing, composition and typographic exercises." }),
    course({ id: "39-210", title: "Communication of EST&P Internship Experience", instructor: "Josh Horowitz", room: "ANSYS 101", building: "ANSYS", college: "Carnegie Institute of Technology", dept: "CIT Interdisciplinary", days: [3], start: "16:00", end: "16:50", units: 3, level: "Undergraduate",
      tags: ["Engineering", "Presentation"], description: "Students reflect on and present their engineering internship experience to peers and faculty." }),
    course({ id: "76-380", title: "Communication Support Tutoring Practicum", instructor: "Wayne Chung", room: "BH 140", building: "Baker Hall", college: "Dietrich College of Humanities and Social Sciences", dept: "English", days: [1], start: "16:00", end: "17:20", units: 6, level: "Undergraduate",
      tags: ["Writing", "Tutoring"], description: "Practicum for students tutoring in the communication support center, with training in feedback and coaching." }),
    course({ id: "03-260", title: "Communication Skills and Professional Development for Scientists", instructor: "Andrew Twigg", room: "MI 348", building: "Carnegie Mellon University", college: "Mellon College of Science", dept: "Biomedical Engineering", days: [4], start: "14:00", end: "15:20", units: 3, level: "Graduate",
      tags: ["Presentation", "Writing"], description: "Builds the writing, presenting and networking skills scientists need for research careers." }),
    course({ id: "17-621", title: "Communications for Software Leaders I", instructor: "Daniel Rosenberg Munoz", room: "TCS 358", building: "4615 Forbes", college: "School of Computer Science", dept: "Software Engineering", days: [1], start: "18:00", end: "19:20", units: 6, level: "Graduate",
      tags: ["Leadership", "Presentation"], description: "Communication skills for technical leaders: writing for decision makers, presenting and running effective meetings." }),
  ];
  const byId = Object.fromEntries(catalog.map((c) => [c.id, c]));

  const lists = {
    taken: { title: "Taken by students in the same program", ids: ["51-729", "51-703", "51-725"], more: ["51-701", "51-706"] },
    recommended: { title: "Recommended", ids: ["51-265", "51-365", "51-341"], more: ["51-671", "51-171"] },
  };
  const expanded = { taken: false, recommended: false };
  const saved = new Set(["51-729", "51-703", "51-725", "51-701", "51-706"]);
  let recents = ["Communication", "Stacie Rohrbach", "MDes"];

  const COLORS = ["blue", "magenta", "mustard", "green"];
  const initialPlan = () => [
    { id: "51-701", color: "mustard", status: "confirmed" },
    { id: "51-725", color: "magenta", status: "confirmed" },
    { id: "51-729", color: "blue", status: "confirmed" },
    { id: "51-711", color: "green", status: "confirmed" },
  ];
  const plans = [
    { name: "Plan 1", items: initialPlan() },
    { name: "Plan2", items: [] },
    { name: "2026 Fall", items: initialPlan() },
  ];
  let activePlan = 0;
  const plan = () => plans[activePlan];
  const inPlan = (id) => plan().items.find((i) => i.id === id);

  // ---------- Helpers ----------
  const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const fmt12 = (t) => { let [h, m] = t.split(":").map(Number); h = h % 12 || 12; return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`; };
  const ampm = (t) => (toMin(t) >= 720 ? "pm" : "am");
  const timeRange = (c, sep = "-") => `${fmt12(c.start)}${sep}${fmt12(c.end)}${ampm(c.end)}`;
  const dayList = (c) => c.days.map((d) => DAY_NAMES[d]).join(", ");
  const city = (c) => c.location.split(",")[0];
  const overlaps = (a, b) => a.days.some((d) => b.days.includes(d)) && toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end);

  let toastTimer;
  function toast(msg) {
    $("#toastText").textContent = msg;
    $("#toast").hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => ($("#toast").hidden = true), 3200);
  }

  // ---------- Course cards ----------
  let selectedId = null;      // course open in Course Details (from the lists)
  let calendarId = null;      // course open from the calendar (Register / Delete)
  const compareSel = [];      // up to 2 course ids in Compare
  let activeTab = "search";

  function cardHTML(c, { selected = false } = {}) {
    const isSaved = saved.has(c.id);
    return `<div class="course${selected ? " is-selected" : ""}" role="button" tabindex="0" data-id="${c.id}">
      <div class="course-top">
        <span class="course-code">${c.id}</span>
        <button class="bookmark" data-save="${c.id}" aria-pressed="${isSaved}" aria-label="${isSaved ? "Remove from saved" : "Save course"}">
          <img src="assets/${isSaved ? "icon-bookmark-filled" : "icon-bookmark"}.svg" alt="">
        </button>
      </div>
      <p class="course-title">${esc(c.title)}</p>
      <div class="course-meta"><span>${esc(c.instructor)}</span><span>${esc(c.room)}</span></div>
    </div>`;
  }

  // ---------- Search tab ----------
  let query = "";
  let filters = emptyFilters();
  function emptyFilters() {
    return { college: new Set(), dept: new Set(), level: new Set(), units: [0, 18], day: new Set(), time: "", location: new Set(), building: new Set() };
  }
  const filtersActive = (f) => f.college.size || f.dept.size || f.level.size || f.day.size || f.location.size || f.building.size || f.time || f.units[0] > 0 || f.units[1] < 18;

  function parseTime(v) {
    const m = v.trim().match(/^(\d{1,2}):?(\d{2})?\s*-\s*(\d{1,2}):?(\d{2})?$/);
    if (!m) return null;
    return [Number(m[1]) * 60 + Number(m[2] || 0), Number(m[3]) * 60 + Number(m[4] || 0)];
  }
  function matchesFilters(c, f) {
    if (f.college.size && !f.college.has(c.college)) return false;
    if (f.dept.size && !f.dept.has(c.dept)) return false;
    if (f.level.size && !f.level.has(c.level)) return false;
    if (c.units < f.units[0] || c.units > f.units[1]) return false;
    if (f.day.size && !c.days.some((d) => f.day.has(DAY_FULL[d]))) return false;
    if (f.time) {
      const r = parseTime(f.time);
      if (r && (toMin(c.start) < r[0] || toMin(c.end) > r[1])) return false;
    }
    if (f.location.size && !f.location.has("Any") && !f.location.has(c.location)) return false;
    if (f.building.size && !f.building.has(c.building)) return false;
    return true;
  }
  function matchesQuery(c, q) {
    if (!q) return true;
    const ql = q.toLowerCase();
    return [c.id, c.title, c.instructor].some((f) => f.toLowerCase().includes(ql))
      || (ql === "mdes" && c.level === "Graduate" && c.dept === "Design");
  }
  const results = (q, f) => catalog.filter((c) => matchesQuery(c, q) && matchesFilters(c, f));

  function renderSearchLists() {
    const box = $("#searchLists");
    $("#filterDot").hidden = !filtersActive(filters);
    if (query || filtersActive(filters)) {
      const found = results(query, filters);
      box.innerHTML = `<div class="course-list results">${found.map((c) => cardHTML(c, { selected: c.id === selectedId })).join("")
        || `<p class="list-empty">No courses match. Try another search or fewer filters.</p>`}</div>`;
      return;
    }
    box.innerHTML = Object.entries(lists).map(([key, l]) => {
      const ids = expanded[key] ? [...l.ids, ...l.more] : l.ids;
      return `<section class="list-section">
        <p class="h4">${esc(l.title)}</p>
        <div class="course-list">${ids.map((id) => cardHTML(byId[id], { selected: id === selectedId })).join("")}</div>
        ${expanded[key] ? "" : `<button class="text-btn" data-more="${key}">More</button>`}
      </section>`;
    }).join("");
  }

  function renderSaved() {
    $("#savedCount").textContent = saved.size;
    $("#savedList").innerHTML = [...saved].map((id) => cardHTML(byId[id], { selected: id === selectedId })).join("")
      || `<p class="list-empty">No saved courses yet. Use the bookmark icon on any course to save it.</p>`;
    $("#compareList").innerHTML = [...saved].map((id) => cardHTML(byId[id], { selected: compareSel.includes(id) })).join("")
      || `<p class="list-empty">Save courses first, then pick two here to compare.</p>`;
  }

  function renderLists() { renderSearchLists(); renderSaved(); }

  // Search box: recent searches + suggestions
  const input = $("#searchInput"), drop = $("#searchDrop");
  let dropIndex = -1;
  function renderDrop() {
    const q = input.value.trim();
    let items;
    if (!q) {
      items = recents.map((r) => ({ label: r, icon: "icon-clock.svg", value: r }));
    } else {
      const ql = q.toLowerCase();
      items = catalog.filter((c) => c.title.toLowerCase().includes(ql) || c.instructor.toLowerCase().includes(ql))
        .slice(0, 8).map((c) => ({ label: c.title, icon: "icon-search-blue.svg", value: c.title }));
    }
    dropIndex = -1;
    drop.innerHTML = items.length
      ? items.map((it, i) => `<button type="button" role="option" data-value="${esc(it.value)}" data-i="${i}"><img src="assets/${it.icon}" alt=""><span>${esc(it.label)}</span></button>`).join("")
      : `<p class="drop-empty">No matching courses</p>`;
    drop.hidden = false;
  }
  function runSearch(q) {
    query = q.trim();
    input.value = query;
    drop.hidden = true;
    if (query) recents = [query, ...recents.filter((r) => r.toLowerCase() !== query.toLowerCase())].slice(0, 5);
    renderSearchLists();
  }
  input.addEventListener("focus", renderDrop);
  input.addEventListener("input", () => {
    renderDrop();
    if (!input.value.trim() && query) { query = ""; renderSearchLists(); }
  });
  input.addEventListener("keydown", (e) => {
    const opts = $$("button", drop);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (drop.hidden || !opts.length) return;
      e.preventDefault();
      dropIndex = (dropIndex + (e.key === "ArrowDown" ? 1 : -1) + opts.length) % opts.length;
      opts.forEach((o, i) => o.classList.toggle("is-active", i === dropIndex));
    } else if (e.key === "Enter" && dropIndex >= 0 && opts[dropIndex]) {
      e.preventDefault();
      runSearch(opts[dropIndex].dataset.value);
    } else if (e.key === "Escape") {
      drop.hidden = true;
    }
  });
  drop.addEventListener("mousedown", (e) => {
    const b = e.target.closest("button[data-value]");
    if (!b) return;
    e.preventDefault();
    runSearch(b.dataset.value);
    input.blur();
  });
  input.addEventListener("blur", () => setTimeout(() => (drop.hidden = true), 120));
  $("#searchForm").addEventListener("submit", (e) => { e.preventDefault(); runSearch(input.value); input.blur(); });

  // ---------- List interactions (shared by all tabs) ----------
  document.addEventListener("click", (e) => {
    const save = e.target.closest("[data-save]");
    if (save) { e.stopPropagation(); toggleSave(save.dataset.save); return; }
    const more = e.target.closest("[data-more]");
    if (more) { expanded[more.dataset.more] = true; renderSearchLists(); return; }
    if (e.target.closest("#clearSearch")) { query = ""; input.value = ""; filters = emptyFilters(); renderSearchLists(); return; }
    const card = e.target.closest(".course[data-id]");
    if (card) openCourse(card.dataset.id);
  });
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".course[data-id]")) { e.preventDefault(); openCourse(e.target.dataset.id); }
  });

  function toggleSave(id) {
    if (saved.has(id)) {
      saved.delete(id);
      const k = compareSel.indexOf(id);
      if (k >= 0) compareSel.splice(k, 1);
      toast("Removed from Saved.");
    } else {
      saved.add(id);
      toast("Saved. Find it in the Saved tab.");
    }
    renderLists(); renderDetails(); renderCompare();
  }

  function openCourse(id) {
    if (activeTab === "compare") {
      const k = compareSel.indexOf(id);
      if (k >= 0) compareSel.splice(k, 1);
      else { compareSel.push(id); if (compareSel.length > 2) compareSel.shift(); }
      renderSaved(); renderCompare();
      return;
    }
    selectedId = selectedId === id ? null : id;
    if (selectedId) closeCalendarDetails();
    renderLists(); renderDetails();
  }

  // ---------- Course details & compare ----------
  function detailCardHTML(c, { fromCalendar = false } = {}) {
    const isSaved = saved.has(c.id);
    const item = inPlan(c.id);
    const planBtn = fromCalendar && item
      ? `${item.registered
          ? `<button class="btn btn-lg btn-primary plan-btn" disabled>Registered</button>`
          : `<button class="btn btn-lg btn-primary plan-btn" data-register="${c.id}">Register</button>`}
         <button class="btn btn-lg btn-secondary plan-btn" data-plan-delete="${c.id}">Delete</button>`
      : item
        ? `<button class="btn btn-lg btn-secondary blue plan-btn" data-plan-remove="${c.id}">Remove from plan</button>`
        : `<button class="btn btn-lg btn-primary plan-btn" data-plan-add="${c.id}">Add to plan</button>`;
    return `<div class="detail-card">
      <div class="detail-scroll">
      <div class="detail-top">
        <div class="course-top">
          <span class="course-code">${c.id}</span>
          <button class="bookmark" data-save="${c.id}" aria-pressed="${isSaved}" aria-label="${isSaved ? "Remove from saved" : "Save course"}"><img src="assets/${isSaved ? "icon-bookmark-filled" : "icon-bookmark"}.svg" alt=""></button>
        </div>
        <p class="detail-title">${esc(c.title)}</p>
        <div class="detail-meta"><span>${esc(c.instructor)}</span><span>${esc(c.room)}</span><span>${dayList(c)}</span><span>${timeRange(c)}</span><span>${esc(city(c))}</span></div>
      </div>
      <div class="detail-credits">${c.units} Credits  |  ${esc(c.mode)}</div>
      <div class="detail-tags">${c.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      <div class="detail-actions">
        <a class="btn btn-lg btn-secondary blue" href="../courseeditor/" target="_blank" rel="noopener">Visit Course Information Page</a>
        <button class="btn btn-lg btn-secondary blue" data-syllabus="${c.id}">Download Syllabus</button>
      </div>
      <div class="detail-sections">
        <div><h3>Description</h3><p>${esc(c.description)}</p></div>
        <div><h3>Prerequisites</h3><p>${esc(c.prereq)}</p></div>
        <div><h3>Related Links</h3><a href="${esc(c.link)}" target="_blank" rel="noopener">${esc(c.link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))}</a></div>
      </div>
      </div>
      <div class="detail-foot">${planBtn}</div>
    </div>`;
  }
  function renderDetails() {
    const panel = $("#details");
    const show = !!(selectedId && activeTab !== "compare");
    // keep the old content while it slides back behind the column
    if (show) $("#detailsBody").innerHTML = detailCardHTML(byId[selectedId]);
    panel.classList.toggle("is-open", show);
    panel.setAttribute("aria-hidden", String(!show));
    panel.inert = !show;
  }
  function renderCalendarDetails() {
    const panel = $("#calDetails");
    const show = !!(calendarId && inPlan(calendarId));
    if (!show) calendarId = null;
    // keep the old content while it slides out
    if (show) $("#calDetailsBody").innerHTML = detailCardHTML(byId[calendarId], { fromCalendar: true });
    panel.classList.toggle("is-open", show);
    panel.setAttribute("aria-hidden", String(!show));
    panel.inert = !show;
    renderPlan();
  }
  function closeCalendarDetails() { calendarId = null; renderCalendarDetails(); }
  $("#closeCalDetails").addEventListener("click", closeCalendarDetails);

  function renderCompare() {
    const box = $("#compare");
    const show = activeTab === "compare" && compareSel.length > 0;
    box.hidden = !show;
    if (!show) return;
    box.innerHTML = compareSel.map((id) => `<section class="compare-panel">
      <div class="panel-head"><p class="h4">Selected Course</p></div>
      ${detailCardHTML(byId[id])}
    </section>`).join("");
  }
  $("#closeDetails").addEventListener("click", () => { selectedId = null; renderLists(); renderDetails(); });

  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-plan-add]");
    if (add) return addToPlan(add.dataset.planAdd);
    const rm = e.target.closest("[data-plan-remove]");
    if (rm) return removeFromPlan(rm.dataset.planRemove);
    const reg = e.target.closest("[data-register]");
    if (reg) return register(reg.dataset.register);
    const del = e.target.closest("[data-plan-delete]");
    if (del) { const id = del.dataset.planDelete; closeCalendarDetails(); return removeFromPlan(id); }
    const syl = e.target.closest("[data-syllabus]");
    if (syl) return downloadSyllabus(byId[syl.dataset.syllabus]);
  });

  function downloadSyllabus(c) {
    const text = [
      `${c.id}  ${c.title}`, "",
      `Instructor: ${c.instructor}`, `Meets: ${dayList(c)} ${timeRange(c)}, ${c.room}, ${city(c)}`,
      `Units: ${c.units} (${c.mode})`, "", "Description", c.description, "", "Prerequisites", c.prereq, "",
      `More: ${c.link}`,
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    a.download = `${c.id}-syllabus.txt`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast("Syllabus downloaded.");
  }

  // ---------- Plan: add / confirm ----------
  function nextColor() {
    const used = plan().items.map((i) => i.color);
    return COLORS.slice().sort((a, b) => used.filter((u) => u === a).length - used.filter((u) => u === b).length)[0];
  }
  function addToPlan(id) {
    const c = byId[id];
    if (inPlan(id)) return;
    const clash = plan().items.map((i) => byId[i.id]).find((o) => overlaps(o, c));
    plan().items.push({ id, color: nextColor(), status: "tentative" });
    renderPlan(); renderDetails(); renderCompare(); renderCalendarDetails();
    toast(clash ? `Added to ${plan().name}. It overlaps with ${clash.title}.` : `Added to ${plan().name}. Click Confirm to finish.`);
  }
  function removeFromPlan(id) {
    plan().items = plan().items.filter((i) => i.id !== id);
    renderPlan(); renderDetails(); renderCompare();
    toast(`Removed from ${plan().name}.`);
  }
  function register(id) {
    const item = inPlan(id); if (!item) return;
    item.status = "confirmed";
    item.registered = true;
    renderPlan(); renderCalendarDetails(); renderDetails(); renderCompare();
    toast(`You're registered for ${byId[id].title}.`);
  }
  $("#confirmBtn").addEventListener("click", () => {
    const pending = plan().items.filter((i) => i.status === "tentative");
    pending.forEach((i) => (i.status = "confirmed"));
    renderPlan();
    toast(`${pending.length} course${pending.length === 1 ? "" : "s"} confirmed in ${plan().name}.`);
  });

  // ---------- Timetable ----------
  const DAY_START = 7 * 60;
  $("#ttRows").innerHTML = Array.from({ length: 15 }, (_, i) => {
    const h = 7 + i;
    return `<div class="tt-row">${h % 12 || 12} ${h < 12 ? "am" : "pm"}</div>`;
  }).join("");

  let previewId = null;
  function renderPlan() {
    $("#planTabs").innerHTML = plans.map((p, i) => `<button role="tab" class="tab${i === activePlan ? " is-active" : ""}" data-plan="${i}">${esc(p.name)}</button>`).join("");
    const pending = plan().items.filter((i) => i.status === "tentative").length;
    $("#confirmBtn").hidden = !pending;
    $("#confirmBtn").textContent = pending > 1 ? `Confirm (${pending})` : "Confirm";

    const events = [];
    plan().items.forEach((it) => byId[it.id].days.forEach((d) => events.push({ c: byId[it.id], d, color: it.color, kind: it.status })));
    if (previewId && !inPlan(previewId)) byId[previewId].days.forEach((d) => events.push({ c: byId[previewId], d, kind: "preview" }));

    // side-by-side layout for overlapping courses on the same day
    for (let d = 0; d < 5; d++) {
      const day = events.filter((e) => e.d === d && e.kind !== "preview").sort((a, b) => toMin(a.c.start) - toMin(b.c.start));
      let group = [], groupEnd = 0;
      const flush = () => {
        const cols = [];
        group.forEach((e) => {
          let k = cols.findIndex((end) => end <= toMin(e.c.start));
          if (k < 0) { k = cols.length; cols.push(0); }
          cols[k] = toMin(e.c.end); e.col = k;
        });
        group.forEach((e) => (e.cols = cols.length));
      };
      day.forEach((e) => {
        if (group.length && toMin(e.c.start) >= groupEnd) { flush(); group = []; groupEnd = 0; }
        group.push(e); groupEnd = Math.max(groupEnd, toMin(e.c.end));
      });
      if (group.length) flush();
    }

    $("#ttEvents").innerHTML = events.filter((e) => e.d < 5).map((e) => {
      const top = toMin(e.c.start) - DAY_START - 1;
      const height = toMin(e.c.end) - toMin(e.c.start) + 6;
      const n = e.cols || 1, k = e.col || 0;
      const left = `calc(${e.d * 20}% + ${k} * (20% - 8px) / ${n})`;
      const width = `calc((20% - 8px) / ${n} - ${n > 1 ? 2 : 0}px)`;
      const selected = e.kind !== "preview" && e.c.id === calendarId;
      const cls = ["slot", e.kind === "confirmed" ? e.color : "hatched", height < 100 ? "short" : "", e.kind === "preview" ? "preview" : "", selected ? "is-selected" : ""].join(" ");
      const label = e.kind === "tentative" ? `${e.c.title} (not confirmed)` : e.c.title;
      return `<button class="${cls}" style="top:${top}px;height:${height}px;left:${left};width:${width}" data-slot="${e.c.id}" aria-pressed="${selected}" aria-label="${esc(label)}, ${DAY_NAMES[e.d]} ${timeRange(e.c, " - ")}">
        <span class="slot-title">${esc(e.c.title)}</span>
        <span class="slot-line">${timeRange(e.c, " - ")}</span>
        <span class="slot-line">${esc(e.c.room)}</span>
      </button>`;
    }).join("");
  }
  $("#planTabs").addEventListener("click", (e) => {
    const t = e.target.closest("[data-plan]"); if (!t) return;
    activePlan = +t.dataset.plan; renderPlan(); renderDetails(); renderCompare(); renderCalendarDetails();
  });
  $("#addPageBtn").addEventListener("click", () => {
    plans.push({ name: `Plan ${plans.length + 1}`, items: [] });
    activePlan = plans.length - 1;
    renderPlan(); renderDetails(); renderCompare();
    toast(`${plan().name} added.`);
  });
  $("#ttEvents").addEventListener("click", (e) => {
    const s = e.target.closest("[data-slot]"); if (!s) return;
    selectedId = null; renderLists(); renderDetails();
    if (activeTab === "compare") switchTab("search");
    calendarId = s.dataset.slot; renderCalendarDetails();
  });
  // Scroll so 7 am – 5 pm is visible, like the design
  $("#ttScroll").scrollTop = 0;

  // Hovering a course previews it on the calendar (hatched)
  document.addEventListener("mouseover", (e) => {
    const card = e.target.closest(".side .course[data-id]");
    const id = card ? card.dataset.id : null;
    if (id !== previewId) { previewId = id; renderPlan(); }
  });

  // ---------- Tabs ----------
  function switchTab(tab) {
    activeTab = tab;
    if (tab === "compare") closeCalendarDetails();
    $$(".side-tabs .tab").forEach((t) => t.classList.toggle("is-active", t.dataset.tab === tab));
    $$(".tab-panel").forEach((p) => (p.hidden = p.dataset.panel !== tab));
    renderLists(); renderDetails(); renderCompare();
  }
  $$(".side-tabs .tab").forEach((t) => t.addEventListener("click", () => switchTab(t.dataset.tab)));

  // ---------- General information collapse ----------
  $("#collapseGeneral").addEventListener("click", (e) => {
    const g = $("#general");
    const collapsed = g.classList.toggle("is-collapsed");
    e.currentTarget.setAttribute("aria-expanded", String(!collapsed));
    e.currentTarget.setAttribute("aria-label", collapsed ? "Expand" : "Collapse");
  });

  // ---------- Filters drawer ----------
  const FILTER_GROUPS = [
    { key: "college", title: "College", options: ["Carnegie Institute of Technology", "Carnegie Mellon University", "College of Fine Arts", "Dietrich College of Humanities and Social Sciences", "Mellon College of Science", "School of Computer Science", "Tepper School of Business", "Heinz College", "Teaching Assistants"] },
    { key: "dept", title: "Department", options: ["Architecture", "Art", "CFA Interdisciplinary", "Design", "Drama", "Music", "Biomedical Engineering", "Chemical Engineering", "CIT Interdisciplinary", "Civil & Environmental Engineering", "English", "Software Engineering"] },
    { key: "level", title: "Level", options: ["Undergraduate", "Graduate"] },
    { key: "units", title: "Units", type: "range" },
    { key: "day", title: "Day", options: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
    { key: "time", title: "Time", type: "text" },
    { key: "location", title: "Teaching Location", options: ["Any", "Washington, District of Columbia", "Doha, Qatar", "Washington, District of Columbia: Dulles", "Kigali, Rwanda", "Los Angeles, California", "New York, New York", PGH, "San Jose, California"] },
    { key: "building", title: "Building", options: ["300 South Craig Street", "311 South Craig", "407 South Craig Street", "4615 Forbes", "477 Melwood", "ANSYS", "Baker Hall", "Carnegie Mellon University", "Cohon University Center", "Collaborative Innovation Center", MM] },
  ];
  let draft = null;
  const closed = new Set();
  const cloneFilters = (f) => ({ ...f, college: new Set(f.college), dept: new Set(f.dept), level: new Set(f.level), units: [...f.units], day: new Set(f.day), location: new Set(f.location), building: new Set(f.building) });

  function renderFilters() {
    $("#filtersBody").innerHTML = FILTER_GROUPS.map((g) => {
      let body;
      if (g.type === "range") {
        body = `<div class="range" id="unitRange">
          <div class="range-track"></div><div class="range-fill" id="rangeFill"></div>
          ${[0, 6, 12, 18].map((v) => `<div class="range-mark" data-v="${v}" style="left:${(v / 18) * 100}%"><i></i><span>${v}</span></div>`).join("")}
          <div class="range-handle" data-h="0" tabindex="0" role="slider" aria-label="Minimum units" aria-valuemin="0" aria-valuemax="18"><img src="assets/icon-handle.svg" alt=""></div>
          <div class="range-handle" data-h="1" tabindex="0" role="slider" aria-label="Maximum units" aria-valuemin="0" aria-valuemax="18"><img src="assets/icon-handle.svg" alt=""></div>
        </div>`;
      } else if (g.type === "text") {
        body = `<input class="text-input" id="timeInput" placeholder="14:00-17:00" value="${esc(draft.time)}" aria-label="Time range">`;
      } else {
        body = g.options.map((o) => `<label class="check"><input type="checkbox" data-group="${g.key}" value="${esc(o)}" ${draft[g.key].has(o) ? "checked" : ""}><span class="box"></span>${esc(o)}</label>`).join("");
      }
      return `<div class="collapse${closed.has(g.key) ? " is-closed" : ""}" data-key="${g.key}">
        <button class="collapse-head" aria-expanded="${!closed.has(g.key)}"><img src="assets/icon-chevron-down.svg" alt="">${g.title}</button>
        <div class="collapse-body">${body}</div>
      </div>`;
    }).join("");
    renderRange();
    updateCount();
  }
  function renderRange() {
    const r = $("#unitRange"); if (!r) return;
    const [a, b] = draft.units;
    $$(".range-handle", r).forEach((h, i) => { h.style.left = `${(draft.units[i] / 18) * 100}%`; h.setAttribute("aria-valuenow", draft.units[i]); });
    $("#rangeFill").style.left = `${(a / 18) * 100}%`;
    $("#rangeFill").style.width = `${((b - a) / 18) * 100}%`;
    $$(".range-mark", r).forEach((m) => m.classList.toggle("on", +m.dataset.v >= a && +m.dataset.v <= b));
  }
  function updateCount() {
    const n = results(query, draft).length;
    $("#filterCount").textContent = `${n} result${n === 1 ? "" : "s"}`;
  }
  function openFilters() {
    draft = cloneFilters(filters);
    renderFilters();
    setFiltersOpen(true);
    drop.hidden = true;
    $("#closeFilters").focus({ preventScroll: true });
  }
  function closeFilters() { setFiltersOpen(false); }
  function setFiltersOpen(open) {
    const panel = $("#filters"), scrim = $("#filterScrim");
    panel.classList.toggle("is-open", open);
    scrim.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", String(!open));
    panel.inert = !open;
  }
  const filtersOpen = () => $("#filters").classList.contains("is-open");
  $("#filterBtn").addEventListener("click", openFilters);
  $("#closeFilters").addEventListener("click", closeFilters);
  $("#filterScrim").addEventListener("click", closeFilters);
  $("#filtersBody").addEventListener("click", (e) => {
    const head = e.target.closest(".collapse-head"); if (!head) return;
    const key = head.parentElement.dataset.key;
    closed.has(key) ? closed.delete(key) : closed.add(key);
    head.parentElement.classList.toggle("is-closed");
    head.setAttribute("aria-expanded", String(!closed.has(key)));
  });
  $("#filtersBody").addEventListener("change", (e) => {
    const cb = e.target.closest("input[data-group]"); if (!cb) return;
    const set = draft[cb.dataset.group];
    cb.checked ? set.add(cb.value) : set.delete(cb.value);
    updateCount();
  });
  $("#filtersBody").addEventListener("input", (e) => {
    if (e.target.id !== "timeInput") return;
    const v = e.target.value.trim();
    const ok = !v || parseTime(v);
    e.target.classList.toggle("is-invalid", !ok);
    draft.time = ok ? v : "";
    updateCount();
  });
  // Units range handles
  let dragHandle = null;
  $("#filtersBody").addEventListener("pointerdown", (e) => {
    const h = e.target.closest(".range-handle"); if (!h) return;
    dragHandle = +h.dataset.h;
    try { h.setPointerCapture(e.pointerId); } catch {}
  });
  $("#filtersBody").addEventListener("pointermove", (e) => {
    if (dragHandle === null) return;
    const r = $(".range-track").getBoundingClientRect();
    let v = Math.round(((e.clientX - r.left) / r.width) * 18);
    v = Math.max(0, Math.min(18, v));
    if (dragHandle === 0) v = Math.min(v, draft.units[1]); else v = Math.max(v, draft.units[0]);
    if (v !== draft.units[dragHandle]) { draft.units[dragHandle] = v; renderRange(); updateCount(); }
  });
  document.addEventListener("pointerup", () => (dragHandle = null));
  $("#filtersBody").addEventListener("keydown", (e) => {
    const h = e.target.closest(".range-handle"); if (!h) return;
    const i = +h.dataset.h;
    const step = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    draft.units[i] = Math.max(i ? draft.units[0] : 0, Math.min(i ? 18 : draft.units[1], draft.units[i] + step));
    renderRange(); updateCount();
  });
  $("#clearFilters").addEventListener("click", () => { draft = emptyFilters(); renderFilters(); });
  $("#applyFilters").addEventListener("click", () => {
    filters = cloneFilters(draft);
    closeFilters();
    if (activeTab !== "search") switchTab("search");
    renderSearchLists();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (filtersOpen()) return closeFilters();
    if (calendarId) return closeCalendarDetails();
    if (selectedId) { selectedId = null; renderLists(); renderDetails(); }
  });

  // ---------- Init ----------
  renderLists();
  renderPlan();
})();
