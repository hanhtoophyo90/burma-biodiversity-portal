// === LANGUAGE TOGGLE ===
let currentLang = 'en';

function updateTexts() {
  const t = translations[currentLang];
  document.title = t.page_title;
  document.querySelector('h1').textContent = t.page_title;
  document.querySelector('p').textContent = t.tagline;
  document.getElementById('search-input').placeholder = t.search_placeholder;
  document.getElementById('no-results').querySelector('h3').textContent = t.no_results_title;
  document.getElementById('no-results').querySelector('p').textContent = t.no_results_desc;

  document.getElementById('lang-toggle').textContent =
    currentLang === 'en' ? 'မြန်မာ' : 'English';

  // Update active tab label colors if necessary
}

// === TABS ===
let currentTab = 'birds';

// === RENDER FUNCTION ===
function renderSpecies(data) {
  const grid = document.getElementById('bird-grid');
  const t = translations[currentLang];
  const noResults = document.getElementById('no-results');

  grid.innerHTML = '';

  if (data.length === 0) {
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');
  }

  data.forEach(item => {
    const cardHTML = `
      <div class="card-container">
        <div class="card w-full h-full rounded-lg shadow-lg bg-white overflow-hidden transform hover:scale-105 transition-transform duration-300">
          <div class="card-face w-full h-full">
            <img src="${item.photo_url}" alt="${item.name}" class="w-full h-48 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/600x400/e2e8f0/4a5568?text=No+Image';">
            <div class="p-4">
              <h2 class="text-xl font-bold text-emerald-600">${item.name}</h2>
              <p class="text-sm text-gray-500 italic mb-2">${item.scientific_name}</p>
              <p class="text-gray-700 text-sm">${item.description}</p>
            </div>
            <div class="p-4 pt-0 text-xs text-gray-400">${t.photo_by} ${item.photo_credit}</div>
            <div class="absolute bottom-4 right-4 text-xs text-emerald-600 font-semibold">${t.flip}</div>
          </div>
          <div class="card-face card-back w-full h-full bg-emerald-600 text-white p-6 flex flex-col justify-center items-center">
            <h3 class="text-2xl font-bold">${item.name}</h3>
            <div class="mt-4 text-center">
              <p><strong>${t.habitat}:</strong> ${item.habitat}</p>
              <p class="mt-2"><strong>${t.status}:</strong>
                <span class="px-2 py-1 rounded-full text-sm ${getConservationStatusColor(item.conservation_status)}">
                  ${item.conservation_status}
                </span>
              </p>
            </div>
            <div class="absolute bottom-4 right-4 text-xs text-emerald-200 font-semibold">${t.flip}</div>
          </div>
        </div>
      </div>
    `;
    grid.innerHTML += cardHTML;
  });

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('is-flipped'));
  });
}

// === STATUS COLOR UTILITY ===
function getConservationStatusColor(status) {
  switch (status) {
    case 'Endangered':
      return 'bg-red-500 text-white';
    case 'Vulnerable':
      return 'bg-orange-500 text-white';
    case 'Near Threatened':
      return 'bg-yellow-400 text-black';
    case 'Least Concern':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-400 text-white';
  }
}

// === SEARCH FILTER ===
const searchInput = document.getElementById('search-input');
let debounceTimeout;

searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(handleSearch, 200);
});

function handleSearch() {
  const query = searchInput.value.toLowerCase();
  let dataSet = birdData;
  if (currentTab === 'fish') dataSet = fishData;
  else if (currentTab === 'plants') dataSet = plantData;

  const filtered = dataSet.filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.scientific_name.toLowerCase().includes(query)
  );

  renderSpecies(filtered);
}

// === TAB BUTTONS ===
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(btn =>
      btn.classList.remove('bg-emerald-600', 'text-white')
    );
    button.classList.add('bg-emerald-600', 'text-white');

    currentTab = button.getAttribute('data-tab');
    searchInput.value = '';
    handleSearch();
  });
});

// === LANGUAGE TOGGLE BUTTON ===
document.getElementById('lang-toggle').addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'mm' : 'en';
  updateTexts();
  handleSearch(); // re-render with translated labels
});

// === INIT ===
window.onload = () => {
  updateTexts();
  renderSpecies(birdData);
};
