const fileInput = document.querySelector('#video-files');
const grid = document.querySelector('#video-grid');
const emptyState = document.querySelector('#empty-state');
const noResults = document.querySelector('#no-results');
const searchInput = document.querySelector('#search-input');
const toast = document.querySelector('#toast');
const sidebar = document.querySelector('#sidebar');
const videos = [];
let activeFilter = 'all';
let toastTimer;

function openPicker() { fileInput.click(); }
document.querySelector('#upload-trigger').addEventListener('click', openPicker);
document.querySelector('#welcome-upload').addEventListener('click', openPicker);
document.querySelector('#empty-upload').addEventListener('click', openPicker);
document.querySelector('#menu-toggle').addEventListener('click', () => sidebar.classList.toggle('open'));
document.querySelectorAll('.side-link').forEach(link => link.addEventListener('click', event => {
  if (link.getAttribute('href') === '#') event.preventDefault();
  document.querySelectorAll('.side-link').forEach(item => item.classList.remove('active'));
  link.classList.add('active');
  sidebar.classList.remove('open');
}));

document.querySelector('#search-form').addEventListener('submit', event => event.preventDefault());
searchInput.addEventListener('input', renderVideos);
document.querySelectorAll('.filter-chip').forEach(chip => chip.addEventListener('click', () => {
  document.querySelectorAll('.filter-chip').forEach(item => item.classList.remove('selected'));
  chip.classList.add('selected');
  activeFilter = chip.dataset.filter;
  renderVideos();
}));
fileInput.addEventListener('change', () => {
  const selected = [...fileInput.files].filter(file => file.type.startsWith('video/'));
  selected.forEach(file => videos.unshift({ file, url: URL.createObjectURL(file), addedAt: Date.now() }));
  if (selected.length) showToast(`${selected.length} video${selected.length === 1 ? '' : 's'} added to this session`);
  else if (fileInput.files.length) showToast('Please choose video files.');
  fileInput.value = '';
  renderVideos();
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
function readableSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return 'Video';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}
function makeCard(item) {
  const card = document.createElement('article');
  card.className = 'video-card';
  const frame = document.createElement('div');
  frame.className = 'video-frame';
  const player = document.createElement('video');
  player.src = item.url;
  player.preload = 'metadata';
  player.playsInline = true;
  player.controls = true;
  player.addEventListener('loadedmetadata', () => { duration.textContent = formatDuration(player.duration); });
  const duration = document.createElement('span');
  duration.className = 'video-length';
  duration.textContent = 'Video';
  frame.append(player, duration);
  const meta = document.createElement('div');
  meta.className = 'video-meta';
  const avatar = document.createElement('span');
  avatar.className = 'video-avatar';
  avatar.textContent = '▶';
  const copy = document.createElement('div');
  copy.className = 'video-copy';
  const title = document.createElement('h2');
  title.className = 'video-title';
  title.textContent = item.file.name.replace(/\.[^.]+$/, '');
  const subtitle = document.createElement('p');
  subtitle.className = 'video-subtitle';
  subtitle.textContent = `Your videos · ${readableSize(item.file.size)}`;
  copy.append(title, subtitle);
  const remove = document.createElement('button');
  remove.className = 'video-menu';
  remove.type = 'button';
  remove.title = 'Remove video';
  remove.setAttribute('aria-label', `Remove ${item.file.name}`);
  remove.textContent = '×';
  remove.addEventListener('click', () => {
    const index = videos.indexOf(item);
    if (index !== -1) videos.splice(index, 1);
    URL.revokeObjectURL(item.url);
    renderVideos();
    showToast('Video removed from this session');
  });
  meta.append(avatar, copy, remove);
  card.append(frame, meta);
  return card;
}
function renderVideos() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = videos.filter(item => {
    const matchesSearch = item.file.name.toLowerCase().includes(query);
    const matchesFilter = activeFilter === 'all' || activeFilter === 'recent' || (activeFilter === 'large' && item.file.size > 100 * 1024 * 1024);
    return matchesSearch && matchesFilter;
  });
  grid.replaceChildren(...filtered.map(makeCard));
  if (filtered.length >= 3 && activeFilter === 'all' && !query) {
    const adCard = document.createElement('section');
    adCard.className = 'ad-placement ad-card';
    adCard.setAttribute('aria-label', 'Advertisement');
    const tag = document.createElement('span');
    tag.className = 'ad-tag';
    tag.textContent = 'ADVERTISEMENT';
    const content = document.createElement('div');
    content.className = 'ad-content';
    content.dataset.adSlot = 'library';
    const label = document.createElement('strong');
    label.textContent = 'Ad space';
    const detail = document.createElement('span');
    detail.textContent = 'Connect an approved AdSense account to show ads here.';
    content.append(label, detail);
    adCard.append(tag, content);
    grid.insertBefore(adCard, grid.children[3] || null);
    if (window.initializeLoopAds) window.initializeLoopAds(adCard);
  }
  emptyState.hidden = videos.length > 0;
  noResults.hidden = videos.length === 0 || filtered.length > 0;
}
window.addEventListener('beforeunload', () => videos.forEach(item => URL.revokeObjectURL(item.url)));


