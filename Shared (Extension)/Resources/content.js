console.log("Hello from content.js!");
let isListening = false;
let shouldOpenInNewTab = false;
const links = getAllLinks();

async function handleSelection(key) {
  if (shouldOpenInNewTab) {
    await browser.runtime.sendMessage({ id: "open_link", url: links[key] });
  } else {
    window.location.href = links[key];
  }
  isListening = false;
  shouldOpenInNewTab = false;
}

function getAllLinks() {
  const links = document.querySelectorAll("a");
  let linksUrls = [];
  for (const link of links) {
    linksUrls.push(link.href);
  }
  return linksUrls;
}
console.log(JSON.stringify(links));

document.addEventListener("keydown", async function (event) {
  if (isListening) {
    await handleSelection(event.key);
    return;
  }

  if (event.key === "s" || event.key === "S") {
    console.log("The 's' key was pressed.");
    isListening = true;
    shouldOpenInNewTab = event.shiftKey;
    console.log(`Should open in new tab: ${shouldOpenInNewTab}`);
  }
});

browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
  console.log("Received response: ", response);
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received request: ", request);
});
