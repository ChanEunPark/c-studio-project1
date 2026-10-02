# C Studio – Course Editor Prototype

A working prototype of the **professor side** of C Studio: a page where professors upload and edit course information for students. Built from the Figma design board ("C Studio – Design Board", Professor side screens).

Plain HTML, CSS and JavaScript — no build step or install.

## Run it

Open `index.html` in a browser, or serve the folder locally:

```bash
python3 -m http.server 5173
```

then visit http://localhost:5173.

## What you can do

1. **Add a banner image** – pencil button on the banner → *Upload from computer* or *Make Image with AI*. The pencil on the course avatar uploads a course image.
2. **Examples of Student Work** – *Add project* (semester, students, project name, link). The card thumbnail uses the link's preview image; links without one get a color from the palette. Edit (pencil), delete (trash), open link (⋯), and scroll with the arrows.
3. **Edit text** – click any text to edit in place. Empty sections are dashed; once filled they turn solid and show the green check.
4. **Reorder sections** – hover a section, then drag the handle on its left.
5. **Canvas integration** – *Publish → Set up in Canvas*.
6. **Send** – *Publish → Send as Email* with address autocomplete.

Also interactive: workload slider, grading format, class size, audience checkboxes, testimonials (*Display This*), FAQs (*Add FAQ*), tags, and *Save*.

## Files

- `index.html` – page structure
- `styles.css` – styles and design tokens from Figma
- `app.js` – interactions
- `assets/` – images and icons exported from Figma

## Notes

- This is a prototype: edits are not saved and are reset when the page reloads.
- Link preview images are looked up with the free [Microlink](https://microlink.io) API (about 50 lookups per day), so entered project links are sent to that service.
