console.log("SafariSneak initialized");

let isListening = false;
let shouldOpenInNewTab = false;

function getAllLinks() {
  const links = document.querySelectorAll("a");
  let linksUrls = [];
  links.forEach((link) => {
    linksUrls.push(link.href);
  });
  return linksUrls;
}

async function handleSelection(url) {
  if (shouldOpenInNewTab) {
    await browser.runtime.sendMessage({ id: "open_link", url });
  } else {
    window.location.href = url;
  }
  isListening = false;
  shouldOpenInNewTab = false;
}

document.addEventListener("keydown", async function (event) {
  const links = getAllLinks();
  if (isListening) {
    const linkToOpen = links.find((link) => link.includes(event.key));
    if (!!linkToOpen) {
      await handleSelection(linkToOpen);
    }
  } else if (event.key === "s" || event.key === "S") {
    console.log("The 's' key was pressed.");
    isListening = true;
    shouldOpenInNewTab = event.shiftKey;
    console.log(`Should open in new tab: ${shouldOpenInNewTab}`);
  }
});
