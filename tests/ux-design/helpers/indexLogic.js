/**
 * Pure logic functions extracted from design-mockups/index.html.
 *
 * These are the testable, side-effect-free functions that drive the
 * filter/search state and HTML rendering on the homepage mockup.
 * They are kept in sync with the originals in index.html — any change
 * to the mockup logic should be reflected here.
 */

// ── Tag helpers ──────────────────────────────────────────────────────────────

/**
 * Convert a tag display name to its CSS class name.
 * e.g. "Fat Loss" → "tag tag-fat-loss"
 * @param {string} tag
 * @returns {string}
 */
export function tagClass(tag) {
  return "tag tag-" + tag.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Build the HTML string for a set of tag badge <span> elements.
 * @param {string[]} tags
 * @returns {string}
 */
export function buildTagBadges(tags) {
  return tags.map((t) => `<span class="${tagClass(t)}">${t}</span>`).join("");
}

// ── Filter + search ──────────────────────────────────────────────────────────

/**
 * Return the subset of peptides that match both the active filter category
 * and the search query.  Both conditions are ANDed — neither resets the other.
 *
 * @param {object[]} peptides   - Full peptide array (from peptides.json)
 * @param {string}   activeFilter - "All" | "Fat Loss" | "Anti-Aging" |
 *                                  "Youthful Skin" | "Muscle Recovery"
 * @param {string}   searchQuery  - Raw text from the search input (may be empty)
 * @returns {object[]}
 */
export function filteredPeptides(peptides, activeFilter, searchQuery) {
  return peptides.filter((p) => {
    const matchFilter = activeFilter === "All" || p.tags.includes(activeFilter);
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });
}

// ── Card render ──────────────────────────────────────────────────────────────

/**
 * Build the inner HTML string for a single peptide card <article>.
 * Mirrors the template literal used inside renderCards() in index.html.
 *
 * @param {object} peptide
 * @returns {string}
 */
export function buildCardHTML(peptide) {
  const p = peptide;
  return `
    <article class="peptide-card" data-id="${p.id}" tabindex="0" role="button" aria-label="View details for ${p.name}">
      <img class="card-img" src="${p.imagePlaceholderUrl}" alt="${p.name}" loading="lazy" />
      <div class="card-body">
        <h2 class="card-name">${p.name}</h2>
        <p class="card-tagline">${p.shortDescription}</p>
        <div class="card-tags">${buildTagBadges(p.tags)}</div>
      </div>
    </article>
  `;
}

// ── Detail render ────────────────────────────────────────────────────────────

/**
 * Build the shared detail body HTML string used by both the desktop modal
 * and the mobile full-page detail view.
 * Mirrors buildDetailHTML() in index.html exactly.
 *
 * @param {object} peptide
 * @returns {string}
 */
export function buildDetailHTML(peptide) {
  const p = peptide;
  return `
    <div class="modal-tags">${buildTagBadges(p.tags)}</div>
    <h2 class="modal-name">${p.name}</h2>
    <p class="modal-desc">${p.shortDescription}</p>
    <div class="modal-section">
      <div class="modal-section-title">Key Benefits</div>
      <ul class="modal-benefits">${p.benefits.map((b) => `<li>${b}</li>`).join("")}</ul>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">Research Notes</div>
      <div class="modal-notes">${p.researchNotes.map((n) => `<div class="modal-note">${n}</div>`).join("")}</div>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">Suggested Dosage</div>
      <div class="modal-dosage">${p.suggestedDosage}</div>
    </div>
  `;
}
