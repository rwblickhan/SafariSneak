async function handleOpenLink(request, sender, sendResponse) {
  if (request.id === "open_link" && request.url) {
    browser.tabs.create({ url: request.url });
    await browser.tabs.create({ url });
  } else {
    console.error(`Invalid message received from content script: ${request}`);
  }
}

browser.runtime.onMessage.addListener(handleOpenLink);
