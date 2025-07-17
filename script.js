        // --- APPLICATION STATE ---
        let activeCategory = 'all';
        const grid = document.getElementById('content-grid');
        const searchInput = document.getElementById('search-input');
        const noResults = document.getElementById('no-results');
        const filterButtons = document.querySelectorAll('.filter-btn');

        // --- FUNCTIONS ---

        /**
         * Filters and renders the data based on the active category and search term.
         */
        function filterAndRender() {
            const searchTerm = searchInput.value.toLowerCase().trim();

            const filteredData = allData.filter(item => {
                const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
                const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                                      item.scientific_name.toLowerCase().includes(searchTerm);
                return matchesCategory && matchesSearch;
            });

            renderCards(filteredData);
        }

        /**
         * Renders the animal cards to the page.
         * @param {Array} data - An array of animal objects to display.
         */
        function renderCards(data) {
            noResults.classList.toggle('hidden', data.length > 0);
            grid.innerHTML = data.map(item => `
                <div class="card-container h-96">
                    <div class="card w-full h-full rounded-lg shadow-lg bg-white overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300" onclick="this.classList.toggle('is-flipped')">
                        <!-- Card Front -->
                        <div class="card-face">
                            <img src="${item.photo_url}" alt="Photo of ${item.name}" class="w-full h-48 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/600x400/e2e8f0/4a5568?text=Image+Not+Available';">
                            <div class="p-4 flex-grow flex flex-col">
                                <h2 class="text-xl font-bold text-emerald-600">${item.name}</h2>
                                <p class="text-sm text-gray-500 italic mb-2">${item.scientific_name}</p>
                                <p class="text-gray-700 text-sm flex-grow">${item.description}</p>
                                <p class="text-xs text-gray-400 mt-2">Photo: ${item.photo_credit}</p>
                            </div>
                        </div>
                        <!-- Card Back -->
                        <div class="card-face card-back w-full h-full bg-emerald-700 text-white p-6 flex flex-col justify-center items-center text-center rounded-lg">
                            <h3 class="text-2xl font-bold">${item.name}</h3>
                            <div class="mt-4">
                                <p class="font-semibold">Details:</p>
                                <p>${item.details}</p>
                            </div>
                            <div class="mt-4">
                                <p class="font-semibold">Status:</p>
                                <span class="mt-1 inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gray-800 bg-opacity-25">
                                    ${item.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // --- EVENT LISTENERS ---

        // Add event listener for the search input.
        searchInput.addEventListener('input', filterAndRender);

        // Add event listeners for the filter buttons.
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Set the new active category from the button's 'data-category' attribute.
                activeCategory = button.dataset.category;

                // Update button styles
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Re-render the content.
                filterAndRender();
            });
        });

        // --- INITIALIZATION ---
        // Initial render of all animals when the page loads.
        window.onload = () => {
            filterAndRender();
        };
