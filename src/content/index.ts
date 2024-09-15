import "./index.css";

async function addElementToFilters() {
  const filtersWrap = document.querySelector('.video_search_filters_wrap');

  if (filtersWrap && !filtersWrap.querySelector('#video_fltr_adult')) {
    const storage = await chrome.storage.sync.get('adult');

    const filterElement = document.createElement('div');
    filterElement.id = 'video_fltr_adult';
    filterElement.textContent = 'Без ограничений';
    filterElement.className = 'checkbox vk-adult-custom-checkbox';

    if (storage.adult === '1') {
      filterElement.classList.add("on");
      filterElement.ariaChecked = "true";
    }

    filterElement.addEventListener("click", async function() { 
      const storage = await chrome.storage.sync.get('adult');

      if (storage.adult === '1') {
        chrome.storage.sync.set({ adult: "0" });
        chrome.runtime.sendMessage("disable");
      } else {
        chrome.storage.sync.set({ adult: "1" });
        chrome.runtime.sendMessage("enable");
      }

      chrome.runtime.sendMessage("reload");
    })

    filtersWrap.appendChild(filterElement);
  }
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      addElementToFilters();
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

addElementToFilters();
