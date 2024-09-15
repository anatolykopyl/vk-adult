import { Message } from "~/constants/messages"

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg !== Message.GetTab) return;

  sendResponse(sender.tab);
});
