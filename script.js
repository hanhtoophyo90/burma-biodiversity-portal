let currentCategory = 'birds';
let currentData = birdData;
let debounceTimeout;

function renderGrid(data) {
  const grid = document.getElementById('result-grid');
  grid.innerHTML = '';
  if (data.length === 0) {
    document.getElementById('no-results').classList.remove('hidden');
    return;
  }
  document.getElementById('no-results').classList.add('hidden');
  data.forEach(item => {
    grid.innerHTML += `<div class="bg-white rounded shadow p-4">
      <img src="${item.photo_url}" class="w-full h-48 object-cover rounded" alt="${item.name}" />
      <h3 class="text-xl font-bold text-emerald-700 mt-2">${item.name}</h3>
      <p class="text-sm text-gray-500 italic">${item.scientific_name}</p>
      <p class="text-sm mt-2">${item.description}</p></div>`;
  });
}

function showCategory(cat) {
  currentCategory = cat;
  currentData = cat === 'birds' ? birdData : cat === 'fishes' ? fishData : plantData;
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('tab-active'));
  document.getElementById(`tab-${cat}`).classList.add('tab-active');
  renderGrid(currentData);
}

function debouncedSearch() {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(handleSearch, 300);
}

function handleSearch() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const filtered = currentData.filter(item => item.name.toLowerCase().includes(searchTerm));
  renderGrid(filtered);
}

async function setLanguage(lang) {
  const langData = await fetch(`lang/${lang}.json`).then(res => res.json());
  document.getElementById('title').innerText = langData.title;
  document.getElementById('subtitle').innerText = langData.subtitle;
  document.getElementById('tab-birds').innerText = langData.birds;
  document.getElementById('tab-fishes').innerText = langData.fishes;
  document.getElementById('tab-plants').innerText = langData.plants;
  document.getElementById('search-input').placeholder = langData.search;
}

window.onload = () => {
  renderGrid(currentData);
};
