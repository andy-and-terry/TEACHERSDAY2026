const form = document.getElementById('form');
const input = document.getElementById('code');
const errorEl = document.getElementById('error');
const iframe = document.getElementById('viewer');

let catalog = null;

async function loadCatalog() {
  try {
    const res = await fetch('catalog.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    catalog = await res.json();
  } catch (e) {
    errorEl.textContent = 'Could not load catalog.json: ' + e.message;
  }
}
loadCatalog();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorEl.textContent = '';
  iframe.style.display = 'none';

  if (!catalog) {
    errorEl.textContent = 'Catalog not loaded yet, try again in a moment.';
    return;
  }

  const raw = input.value.trim();
  if (!raw) return;

  // exact match first, then case-insensitive fallback
  let target = catalog[raw];
  if (target === undefined) {
    const lower = raw.toLowerCase();
    const matchKey = Object.keys(catalog).find(k => k.toLowerCase() === lower);
    if (matchKey) target = catalog[matchKey];
  }

  if (target === undefined) {
    errorEl.textContent = 'Code not found.';
    return;
  }

  iframe.src = target;
  iframe.style.display = 'block';
});
