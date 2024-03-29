console.log("SafariSneak: initialized");

let isListening = false;
let shouldOpenInNewTab = false;
let links = [];
let prefixString = "";

// TODO allow for smartcase etc
// TODO uniquify links

function getAllLinks() {
  const links = document.querySelectorAll("a");
  let linksUrls = [];
  for (const link of links) {
    const textContent = (link.textContent ?? "").trim();
    const title = (link.getAttribute("title") ?? "").trim();
    const ariaLabel = (link.getAttribute("aria-label") ?? "").trim();
    const text =
      textContent.length > 0
        ? link.textContent
        : title.length > 0
        ? title
        : ariaLabel.length > 0
        ? ariaLabel
        : "";
    linksUrls.push({
      url: link.href,
      text: text.toLocaleLowerCase().replace(/\s/g, ""),
    });
  }
  console.log(JSON.stringify(linksUrls));
  return linksUrls;
}

function findPrefixLinks() {
  const prefixLinks = [];
  for (const link of links) {
    if (link.text.startsWith(prefixString)) {
      prefixLinks.push(link);
    }
  }
  console.log(`SafariSneak: Matching URLs ${JSON.stringify(prefixLinks)}`);
  return prefixLinks;
}

function appendPrefixCharacter(c) {
  prefixString += c;
  console.log(`SafariSneak: Current prefix ${prefixString}`);
  if (prefixString.length >= 2) {
    const prefixLinks = findPrefixLinks();
    switch (prefixLinks.length) {
      case 0:
        console.log("SafariSneak: No matches.");
        reset();
        break;
      case 1:
        handleSelection(prefixLinks[0].url);
        break;
      default:
        break;
    }
  }
}

async function handleSelection(url) {
  if (shouldOpenInNewTab) {
    await browser.runtime.sendMessage({ id: "open_link", url });
  } else {
    window.location.href = url;
  }
  reset();
}

function reset() {
  console.log("SafariSneak: Resetting...");
  isListening = false;
  shouldOpenInNewTab = false;
  prefixString = "";
  links = [];
}

document.addEventListener("keydown", async function (event) {
  if (!!document.activeElement && document.activeElement !== document.body) {
    console.log("SafariSneak: Ignoring keydown event due to active element.");
    return;
  }

  if (event.key === "Escape" || event.key === "CommandOrControl") {
    console.log(
      "SafariSneak: Canceled listening due to Escape or CommandOrControl."
    );
    reset();
  } else if (isListening) {
    appendPrefixCharacter(event.key);
  } else if (
    (event.key === "s" || event.key === "S") &&
    !event.ctrlKey &&
    !event.metaKey
  ) {
    console.log("SafariSneak: Listening...");
    isListening = true;
    shouldOpenInNewTab = event.shiftKey;
    links = getAllLinks();
  }
});
