import type { TRequest } from "../types/request"

chrome.runtime.onMessage.addListener(function(msg, sender) {
  if (msg !== "enable") return;

  const { tab } = sender;
  if (!tab) return;

  chrome.debugger.attach({ tabId: tab.id }, "1.3", () => {
    console.log("VK Adult attached");

    chrome.debugger.sendCommand({ tabId: tab.id }, "Fetch.enable");

    chrome.debugger.onEvent.addListener((debuggeeId, message, params) => {
      if (message !== "Fetch.requestPaused") return

      const { requestId, request } = params as {
        requestId: string
        request?: TRequest
      };

      if (!request) return

      if (request.url.includes("/method/catalog.getVideoSearchWeb2")) {
        const postData = request.postData ? request.postData : '';
        let formData = new URLSearchParams();

        if (postData) {
          const existingData = postData.split('&');
          for (const entry of existingData) {
            const [key, value] = entry.split('=');
            formData.append(decodeURIComponent(key), decodeURIComponent(value));
          }
        }

        formData.append("adult", "1");

        chrome.debugger.sendCommand(debuggeeId, "Fetch.continueRequest", {
          requestId,
          postData: btoa(formData.toString())
        });
      } else {
        chrome.debugger.sendCommand(debuggeeId, "Fetch.continueRequest", {
          requestId
        });
      }
    });
  });
});


chrome.runtime.onMessage.addListener(function(msg, sender) {
  if (msg !== "disable") return;

  const { tab } = sender;
  if (!tab) return;

  chrome.debugger.detach({ tabId: tab.id });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.debugger.detach({ tabId });
});

chrome.runtime.onMessage.addListener(function(msg, sender) {
  if (msg !== "reload") return;

  const { tab } = sender;
  if (!tab || !tab.id) return;

  chrome.tabs.reload(tab.id)
});
