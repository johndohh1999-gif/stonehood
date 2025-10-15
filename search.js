document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchWrapper = document.getElementById('searchWrapper');
  
  let searchContainer = document.getElementById('searchSuggestionsContainer');
  
  if (!searchContainer && searchInput) {
    searchContainer = document.createElement('div');
    searchContainer.id = 'searchSuggestionsContainer';
    searchContainer.className = 'search-suggestions-container';
    searchWrapper.appendChild(searchContainer);
  }

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length === 0) {
      searchContainer.innerHTML = '';
      searchContainer.classList.remove('active');
      return;
    }

    const results = searchProducts(query);
    displaySuggestions(results, query);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();
      if (query.length > 0) {
        showSearchResults(query);
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchWrapper.contains(e.target)) {
      searchContainer.innerHTML = '';
      searchContainer.classList.remove('active');
    }
  });

  function searchProducts(query) {
    if (!window.allProducts) return [];
    
    return window.allProducts.filter(product => {
      const searchText = `${product.name} ${product.description} ${product.category} ${product.subcategory} ${product.keywords.join(' ')}`.toLowerCase();
      return searchText.includes(query);
    }).slice(0, 8);
  }

  function displaySuggestions(results, query) {
    if (results.length === 0) {
      searchContainer.innerHTML = `
        <div class="search-no-results">
          <i class="fas fa-search"></i>
          <p>No products found for "${query}"</p>
        </div>
      `;
      searchContainer.classList.add('active');
      return;
    }

    const suggestionsHTML = results.map(product => {
      const highlightedName = highlightMatch(product.name, query);
      const priceDisplay = product.originalPrice 
        ? `<span class="suggestion-price">${product.price} <del>${product.originalPrice}</del></span>`
        : `<span class="suggestion-price">${product.price}</span>`;
      
      return `
        <div class="search-suggestion-item" onclick="navigateToProduct('${product.url}')">
          <div class="suggestion-image">
            <img src="${getImagePath(product.image)}" alt="${product.name}" onerror="this.style.display='none'">
          </div>
          <div class="suggestion-details">
            <div class="suggestion-name">${highlightedName}</div>
            <div class="suggestion-category">${product.category} - ${product.subcategory}</div>
            ${priceDisplay}
          </div>
        </div>
      `;
    }).join('');

    searchContainer.innerHTML = `
      ${suggestionsHTML}
      <div class="search-view-all" onclick="showAllResults('${query}')">
        <i class="fas fa-arrow-right"></i> View all ${window.allProducts.filter(p => {
          const searchText = `${p.name} ${p.description} ${p.category} ${p.subcategory} ${p.keywords.join(' ')}`.toLowerCase();
          return searchText.includes(query);
        }).length} results
      </div>
    `;
    searchContainer.classList.add('active');
  }

  function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  function getImagePath(imagePath) {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/men/') || currentPath.includes('/women/') || currentPath.includes('/juniors/')) {
      return '../' + imagePath;
    }
    return imagePath;
  }

  window.navigateToProduct = function(url) {
    const currentPath = window.location.pathname;
    let finalUrl = url;
    
    if (currentPath.includes('/men/') || currentPath.includes('/women/') || currentPath.includes('/juniors/')) {
      finalUrl = '../' + url;
    }
    
    window.location.href = finalUrl;
  };

  window.showAllResults = function(query) {
    showSearchResults(query);
  };

  function showSearchResults(query) {
    const results = window.allProducts.filter(product => {
      const searchText = `${product.name} ${product.description} ${product.category} ${product.subcategory} ${product.keywords.join(' ')}`.toLowerCase();
      return searchText.includes(query);
    });

    const modalHTML = `
      <div class="search-results-modal" id="searchResultsModal">
        <div class="search-results-content">
          <div class="search-results-header">
            <h2>Search Results for "${query}"</h2>
            <button class="close-search-results" onclick="closeSearchResults()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="search-results-body">
            ${results.length === 0 ? `
              <div class="search-no-results-full">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try different keywords or browse our categories</p>
              </div>
            ` : `
              <div class="search-results-grid">
                ${results.map(product => `
                  <div class="search-result-card" onclick="navigateToProduct('${product.url}')">
                    <div class="result-image">
                      <img src="${getImagePath(product.image)}" alt="${product.name}" onerror="this.style.display='none'">
                    </div>
                    <div class="result-info">
                      <div class="result-category">${product.category} - ${product.subcategory}</div>
                      <h3 class="result-name">${product.name}</h3>
                      <p class="result-description">${product.description}</p>
                      <div class="result-price">
                        ${product.originalPrice 
                          ? `<span class="current">${product.price}</span> <span class="original">${product.originalPrice}</span>`
                          : `<span class="current">${product.price}</span>`
                        }
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    let existingModal = document.getElementById('searchResultsModal');
    if (existingModal) {
      existingModal.remove();
    }

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    searchContainer.innerHTML = '';
    searchContainer.classList.remove('active');
    searchInput.value = query;
  }

  window.closeSearchResults = function() {
    const modal = document.getElementById('searchResultsModal');
    if (modal) {
      modal.remove();
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeSearchResults();
      searchContainer.innerHTML = '';
      searchContainer.classList.remove('active');
    }
  });
});
