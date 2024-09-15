import "./style.css";
import { Message } from "~/constants/messages";

async function addElementToFilters() {
  const filtersWrap = document.querySelector('.video_search_filters_wrap');

  if (filtersWrap && !document.querySelector('#video_fltr_adult')) {
    const tab = await chrome.runtime.sendMessage(Message.GetTab);
    const storageKey = `adult-${tab.id}`;
    const storage = await chrome.storage.session.get(storageKey);

    const filterElement = document.createElement('div');
    filterElement.id = 'video_fltr_adult';
    filterElement.textContent = 'Без ограничений';
    filterElement.className = 'checkbox vk-adult-custom-checkbox';

    if (storage[storageKey] === '1') {
      filterElement.classList.add("on");
      filterElement.ariaChecked = "true";
    }

    filterElement.addEventListener("click", async function() { 
      const storage = await chrome.storage.session.get(storageKey);

      if (storage[storageKey] === '1') {
        chrome.storage.session.set({ [storageKey]: "0" });
        chrome.runtime.sendMessage(Message.Disable);
      } else {
        chrome.storage.session.set({ [storageKey]: "1" });
        chrome.runtime.sendMessage(Message.Enable);
      }

      chrome.runtime.sendMessage(Message.Reload);
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
