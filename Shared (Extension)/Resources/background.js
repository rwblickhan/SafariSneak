async function handleOpenLink(message, sender, sendResponse) {
  if (message.id === "open_link" && message.url) {
    await browser.tabs.create({ url: message.url });
  } else {
    console.error(`Invalid message received from content script: ${message}`);
  }
}

browser.runtime.onMessage.addListener(handleOpenLink);
