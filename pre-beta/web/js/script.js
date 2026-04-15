const stories = [
  {
    id: 1,
    type: 'project',
    title: 'A tiny self-hosted issue board for side projects',
    description: 'An open source board focused on simplicity, markdown tasks, and no-login contributor flows.',
    tags: ['oss', 'productivity', 'self-hosted'],
  },
  {
    id: 2,
    type: 'blog',
    title: 'Why minimal web design still wins for developer communities',
    description: 'A practical argument for strong typography, neutral backgrounds, and fast-first interfaces.',
    tags: ['design', 'community', 'frontend'],
  },
  {
    id: 3,
    type: 'news',
    title: 'A new static search engine approach for personal blogs',
    description: 'Developers are experimenting with local-first indexing to keep personal sites fast and searchable.',
    tags: ['search', 'web', 'blogs'],
  },
  {
    id: 4,
    type: 'project',
    title: 'Markdown-first changelog tool with GitHub sync',
    description: 'Publish release notes from a repo, keep a public archive, and auto-generate issue summaries.',
    tags: ['github', 'tooling', 'release'],
  },
  {
    id: 5,
    type: 'blog',
    title: 'Building a community feed that feels human, not algorithmic',
    description: 'Lessons from curated ranking, visible moderation, and surfacing small contributors early.',
    tags: ['ux', 'ranking', 'social-web'],
  },
  {
    id: 6,
    type: 'news',
    title: 'Browser-native code sandboxes are getting dramatically lighter',
    description: 'New experiments reduce boot time and improve small-demo sharing for docs and tutorials.',
    tags: ['browser', 'javascript', 'dx'],
  }
];

const sidebarNews = [
  {
    source: 'indie builders',
    title: 'Tiny communities are outperforming bigger feeds in engagement',
    sub: 'Smaller curated spaces are keeping signal high and moderation costs low.'
  },
  {
    source: 'open source',
    title: 'Maintainers are rethinking documentation homepages',
    sub: 'Docs are getting more editorial, more visual, and easier for first-time contributors.'
  },
  {
    source: 'frontend',
    title: 'Vanilla JS micro-sites are trending again',
    sub: 'Fast, dependency-light pages are regaining popularity for experiments and showcases.'
  },
  {
    source: 'design systems',
    title: 'Rounded brutalism continues to show up in indie tech UIs',
    sub: 'Hard borders plus soft radii are common in product launches and community pages.'
  }
];

const feedEl = document.getElementById('feed');
const newsListEl = document.getElementById('newsList');
const searchInput = document.getElementById('searchInput');
const filterType = document.getElementById('filterType');
const sortBy = document.getElementById('sortBy');
const countLabel = document.getElementById('countLabel');
const menuBtn = document.getElementById('menuBtn');
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
const shuffleBtn = document.getElementById('shuffleBtn');
const themeToggle = document.getElementById('themeToggle');

function renderNews() {
  if (!newsListEl) return;

  newsListEl.innerHTML = sidebarNews
    .map(
      (item) => `
        <article class="news-item" tabindex="0">
          <div class="meta">${escapeHtml(item.source)}</div>
          <div class="title">${escapeHtml(item.title)}</div>
          <div class="sub">${escapeHtml(item.sub)}</div>
        </article>
      `
    )
    .join('');
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getFilteredStories() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const type = filterType ? filterType.value : 'all';
  const sort = sortBy ? sortBy.value : 'score';

  const result = stories.filter((story) => {
    const matchesType = type === 'all' || story.type === type;
    const haystack = [story.title, story.description, ...story.tags].join(' ').toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    return matchesType && matchesQuery;
  });

  result.sort((a, b) => {
    if (sort === 'comments') return b.comments - a.comments;
    if (sort === 'title') return a.title.localeCompare(b.title);
    return b.score - a.score;
  });

  return result;
}

function renderFeed() {
  if (!feedEl) return;

  const result = getFilteredStories();

  if (countLabel) {
    countLabel.textContent = `${result.length} item${result.length === 1 ? '' : 's'}`;
  }

  if (!result.length) {
    feedEl.innerHTML = '<div class="empty">No stories match your current filter.</div>';
    return;
  }

  feedEl.innerHTML = result
    .map(
      (story, index) => `
        <article class="stream-card" tabindex="0">
          <div class="stream-rank">#${index + 1}</div>
          <div class="stream-body">
            <h4>${escapeHtml(story.title)}</h4>
            <p>${escapeHtml(story.description)}</p>
            <div class="stream-tags">
              ${story.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
          </div>
        <div class="stream-stats">
  <div class="stat"><strong>${escapeHtml(story.type)}</strong><span>category</span></div>
</div>
          </article>
      `
    )
    .join('');
}

function openDrawer() {
  if (!drawer || !overlay || !menuBtn) return;

  drawer.classList.add('open');
  overlay.classList.add('show');
  drawer.setAttribute('aria-hidden', 'false');
  menuBtn.setAttribute('aria-expanded', 'true');
}

function closeDrawer() {
  if (!drawer || !overlay || !menuBtn) return;

  drawer.classList.remove('open');
  overlay.classList.remove('show');
  drawer.setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
}

function toggleDrawer() {
  if (!drawer) return;

  if (drawer.classList.contains('open')) {
    closeDrawer();
  } else {
    openDrawer();
  }
}

function shuffleStories() {
  for (let i = stories.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [stories[i], stories[j]] = [stories[j], stories[i]];
  }

  renderFeed();
  closeDrawer();
}

function applyTheme(theme) {
  const safeTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', safeTheme);

  if (themeToggle) {
    themeToggle.textContent = safeTheme === 'dark' ? 'Light mode' : 'Dark mode';
    themeToggle.setAttribute('aria-pressed', safeTheme === 'dark' ? 'true' : 'false');
  }

  localStorage.setItem('site-theme', safeTheme);
}

function initTheme() {
  const savedTheme = localStorage.getItem('site-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

if (menuBtn) menuBtn.addEventListener('click', toggleDrawer);
if (overlay) overlay.addEventListener('click', closeDrawer);
if (shuffleBtn) shuffleBtn.addEventListener('click', shuffleStories);
if (searchInput) searchInput.addEventListener('input', renderFeed);
if (filterType) filterType.addEventListener('change', renderFeed);
if (sortBy) sortBy.addEventListener('change', renderFeed);
if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeDrawer();
});

initTheme();
renderNews();
renderFeed();