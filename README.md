# C Studio – Prototypes

Live site: https://chaneunpark.github.io/c-studio-project1/

Each page of the project lives in its own folder:

| Folder | Page | Live link |
| --- | --- | --- |
| `courseeditor/` | Course Editor (professor side) | https://chaneunpark.github.io/c-studio-project1/courseeditor/ |
| `student/` | Course Planner (student side) | https://chaneunpark.github.io/c-studio-project1/student/ |
| `courseinfo/` | Course Information (published, student view) | https://chaneunpark.github.io/c-studio-project1/courseinfo/ |

To add a page: create a new folder with its own `index.html`, then add a card for it in the top-level `index.html`.

---

## Course Planner (`student/`)

Prototype of the **student side**: students find courses, compare them and build a weekly plan.

1. **Suggestions** – "Taken by students in the same program" and "Recommended". Hover a course to preview it on the calendar (hatched).
2. **Search & filters** – recent searches and live suggestions; the filter button opens the Filters drawer (college, department, level, units, day, time, location, building).
3. **View course info** – click a course for Course Details: visit the course information page, download the syllabus, save it.
4. **Add course** – *Add to Plan* in Course Details places it on the calendar as hatched (not confirmed).
5. **Compare** – in the Compare tab, pick two saved courses to see them side by side.
6. **Confirm** – *Confirm* (next to *Add Pages*) turns added courses into solid blocks.

Also: Saved tab with bookmark toggles, plan tabs and *Add Pages*, collapsible greeting panel.

---

## Course Editor (`courseeditor/`)

A working prototype of the **professor side** of C Studio: a page where professors upload and edit course information for students. Built from the Figma design board ("C Studio – Design Board", Professor side screens).

Plain HTML, CSS and JavaScript — no build step or install.

## Run it

Open `courseeditor/index.html` in a browser, or serve the repo locally:

```bash
python3 -m http.server 5173
```

then visit http://localhost:5173/courseeditor/.

## What you can do

1. **Add a banner image** – pencil button on the banner → *Upload from computer* or *Make Image with AI*. The pencil on the course avatar uploads a course image.
2. **Examples of Student Work** – *Add project* (semester, students, project name, link). The card thumbnail uses the link's preview image; links without one get a color from the palette. Edit (pencil), delete (trash), open link (⋯), and scroll with the arrows.
3. **Edit text** – click any text to edit in place. Empty sections are dashed; once filled they turn solid and show the green check.
4. **Reorder sections** – hover a section, then drag the handle on its left.
5. **Canvas integration** – *Publish → Set up in Canvas*.
6. **Send** – *Publish → Send as Email* with address autocomplete.

Also interactive: workload slider, grading format, class size, audience checkboxes, testimonials (*Display This*), FAQs (*Add FAQ*), tags, and *Save*.

## Files (in `courseeditor/`)

- `index.html` – page structure
- `styles.css` – styles and design tokens from Figma
- `app.js` – interactions
- `assets/` – images and icons exported from Figma

## Notes

- This is a prototype: edits are not saved and are reset when the page reloads.
- Link preview images are looked up with the free [Microlink](https://microlink.io) API (about 50 lookups per day), so entered project links are sent to that service.
