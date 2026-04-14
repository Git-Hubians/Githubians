    const stories = [
      {
        id: 1,
        type: 'project',
        title: 'A tiny self-hosted issue board for side projects',
        description: 'An open source board focused on simplicity, markdown tasks, and no-login contributor flows.',
        tags: ['oss', 'productivity', 'self-hosted'],
        score: 182,
        comments: 31
      },
      {
        id: 2,
        type: 'blog',
        title: 'Why minimal web design still wins for developer communities',
        description: 'A practical argument for strong typography, neutral backgrounds, and fast-first interfaces.',
        tags: ['design', 'community', 'frontend'],
        score: 126,
        comments: 18
      },
      {
        id: 3,
        type: 'news',
        title: 'A new static search engine approach for personal blogs',
        description: 'Developers are experimenting with local-first indexing to keep personal sites fast and searchable.',
        tags: ['search', 'web', 'blogs'],
        score: 204,
        comments: 46
      },
      {
        id: 4,
        type: 'project',
        title: 'Markdown-first changelog tool with GitHub sync',
        description: 'Publish release notes from a repo, keep a public archive, and auto-generate issue summaries.',
        tags: ['github', 'tooling', 'release'],
        score: 97,
        comments: 11
      },
      {
        id: 5,
        type: 'blog',
        title: 'Building a community feed that feels human, not algorithmic',
        description: 'Lessons from curated ranking, visible moderation, and surfacing small contributors early.',
        tags: ['ux', 'ranking', 'social-web'],
        score: 173,
        comments: 29
      },
      {
        id: 6,
        type: 'news',
        title: 'Browser-native code sandboxes are getting dramatically lighter',
        description: 'New experiments reduce boot time and improve small-demo sharing for docs and tutorials.',
        tags: ['browser', 'javascript', 'dx'],
        score: 149,
        comments: 22
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

    function renderNews() {
      newsListEl.innerHTML = sidebarNews
        .map(
          (item) => `
            <article class="news-item" tabindex="0">
              <div class="meta">${item.source}</div>
              <div class="title">${item.title}</div>
              <div class="sub">${item.sub}</div>
            </article>
          `
        )
        .join('');
    }

    function escapeHtml(text) {
      return text
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
    }

    function getFilteredStories() {
      const query = searchInput.value.trim().toLowerCase();
      const type = filterType.value;
      const sort = sortBy.value;

      let result = stories.filter((story) => {
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
      const result = getFilteredStories();
      countLabel.textContent = `${result.length} item${result.length === 1 ? '' : 's'}`;

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
                <div class="stat"><strong>${story.type}</strong><span>category</span></div>
                <div class="stat"><strong>${story.score}</strong><span>points</span></div>
                <div class="stat"><strong>${story.comments}</strong><span>comments</span></div>
              </div>
            </article>
          `
        )
        .join('');
    }

    function openDrawer() {
      drawer.classList.add('open');
      overlay.classList.add('show');
      drawer.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('show');
      drawer.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
    }

    function toggleDrawer() {
      if (drawer.classList.contains('open')) closeDrawer();
      else openDrawer();
    }

    function shuffleStories() {
      for (let i = stories.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [stories[i], stories[j]] = [stories[j], stories[i]];
      }
      renderFeed();
      closeDrawer();
    }

    menuBtn.addEventListener('click', toggleDrawer);
    overlay.addEventListener('click', closeDrawer);
    shuffleBtn.addEventListener('click', shuffleStories);
    searchInput.addEventListener('input', renderFeed);
    filterType.addEventListener('change', renderFeed);
    sortBy.addEventListener('change', renderFeed);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeDrawer();
    });

    renderNews();
    renderFeed();
