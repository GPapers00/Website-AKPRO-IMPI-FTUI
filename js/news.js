import { supabase } from './supabase.js';

let currentNewsPage = 0;
const NEWS_PER_PAGE = 9;
let isFetching = false;

// DOM Elements
const homeNewsContainer = document.getElementById('home-news-container');
const newsTabContainer = document.getElementById('news-tab-container');
const loadMoreBtn = document.getElementById('load-more-news-btn');

// Modal Elements
const newsModal = document.getElementById('news-modal');
const newsModalCloseBtn = document.getElementById('news-modal-close');
const newsModalImage = document.getElementById('news-modal-image');
const newsModalDate = document.getElementById('news-modal-date');
const newsModalTitle = document.getElementById('news-modal-title');
const newsModalText = document.getElementById('news-modal-text');

// Store all fetched news globally so we can look them up by index when a card is clicked
const allNewsData = [];

/**
 * Creates the HTML for a single news card based on the Bento Grid design.
 */
function createNewsCardHTML(newsItem, index, isHome = false) {
  // Save the item to the global array so we can access it on click
  const globalIndex = allNewsData.length;
  allNewsData.push(newsItem);

  const isLarge = (index === 0) ? 'large-card' : '';
  const displayDate = newsItem.date || '';

  if (newsItem.image_url) {
    return `
      <div class="bento-card with-image ${isLarge}" style="background-image: url('${newsItem.image_url}');" onclick="openNewsModal(${globalIndex})">
        <div class="bento-content">
          <span class="news-date">${displayDate}</span>
          <h3>${newsItem.title}</h3>
          <p>${newsItem.content}</p>
        </div>
      </div>
    `;
  } else {
    const bgColor = index % 2 === 0 ? 'cerulean-bg' : 'brown-bg';
    return `
      <div class="bento-card text-only ${bgColor} ${isLarge}" onclick="openNewsModal(${globalIndex})">
        <div class="bento-content">
          <span class="news-date">${displayDate}</span>
          <h3>${newsItem.title}</h3>
          <p>${newsItem.content}</p>
        </div>
      </div>
    `;
  }
}

/**
 * Opens the news modal and populates it with data
 */
window.openNewsModal = function(globalIndex) {
  const item = allNewsData[globalIndex];
  if (!item) return;

  newsModalTitle.textContent = item.title;
  newsModalDate.textContent = item.date || '';
  newsModalText.textContent = item.content; // Use textContent for safety, or innerHTML if you allow rich text

  if (item.image_url) {
    newsModalImage.src = item.image_url;
    newsModalImage.style.display = 'block';
  } else {
    newsModalImage.style.display = 'none';
    newsModalImage.src = '';
  }

  // Show modal
  newsModal.style.display = 'flex';
  // Small timeout to allow display: flex to apply before transitioning opacity
  setTimeout(() => {
    newsModal.style.opacity = '1';
  }, 10);
};

function closeNewsModal() {
  newsModal.style.opacity = '0';
  setTimeout(() => {
    newsModal.style.display = 'none';
  }, 300); // Matches transition duration
}

if (newsModalCloseBtn) {
  newsModalCloseBtn.addEventListener('click', closeNewsModal);
}

// Close if clicking outside the modal content
if (newsModal) {
  newsModal.addEventListener('click', (e) => {
    if (e.target === newsModal) {
      closeNewsModal();
    }
  });
}

/**
 * Fetches the top 3 news for the Home tab preview
 */
async function fetchHomeNews() {
  if (!homeNewsContainer || !supabase) return;

  try {
    const { data, error } = await supabase
      .from('akpro_news')
      .select('*')
      .order('date', { ascending: false })
      .limit(3);

    if (error) throw error;

    if (!data || data.length === 0) {
      homeNewsContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1 / -1;">No news found. Add some to the database!</p>';
      return;
    }

    let html = '';
    data.forEach((item, index) => {
      html += createNewsCardHTML(item, index, true);
    });
    homeNewsContainer.innerHTML = html;

  } catch (err) {
    console.error("Error fetching home news:", err);
    homeNewsContainer.innerHTML = '<p style="color: red; text-align: center; grid-column: 1 / -1;">Failed to load news.</p>';
  }
}

/**
 * Fetches the next page of news for the full News Tab
 */
async function fetchNewsTab() {
  if (!newsTabContainer || !supabase || isFetching) return;
  
  isFetching = true;
  if (currentNewsPage === 0) {
      newsTabContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1 / -1;">Loading news...</p>';
  }

  try {
    const from = currentNewsPage * NEWS_PER_PAGE;
    const to = from + NEWS_PER_PAGE - 1;

    const { data, error, count } = await supabase
      .from('akpro_news')
      .select('*', { count: 'exact' })
      .order('date', { ascending: false })
      .range(from, to);

    if (error) throw error;

    if (currentNewsPage === 0) {
        newsTabContainer.innerHTML = '';
    }

    if (!data || data.length === 0) {
      if (currentNewsPage === 0) {
          newsTabContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1 / -1;">No news published yet.</p>';
      }
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      isFetching = false;
      return;
    }

    let html = '';
    data.forEach((item, index) => {
      // We pass (from + index) so only the absolute first item gets 'large-card'
      html += createNewsCardHTML(item, from + index);
    });
    
    // Append to existing HTML
    newsTabContainer.insertAdjacentHTML('beforeend', html);

    currentNewsPage++;

    // Hide load more button if we fetched everything
    if (loadMoreBtn) {
      if (from + data.length >= count) {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'inline-block';
      }
    }

  } catch (err) {
    console.error("Error fetching news tab:", err);
    if (currentNewsPage === 0) {
        newsTabContainer.innerHTML = '<p style="color: red; text-align: center; grid-column: 1 / -1;">Error loading news.</p>';
    }
  } finally {
    isFetching = false;
  }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  fetchHomeNews();
  fetchNewsTab();

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      loadMoreBtn.textContent = 'Loading...';
      fetchNewsTab().then(() => {
          loadMoreBtn.textContent = 'Load More';
      });
    });
  }
});
