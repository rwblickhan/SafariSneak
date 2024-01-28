console.log("SafariSneak initialized");

let isListening = false;
let shouldOpenInNewTab = false;
let links = [];
let prefixString = "";

// TODO allow for smartcase etc

function getAllLinks() {
  const links = document.querySelectorAll("a");
  let linksUrls = [];
  for (const link of links) {
    const text =
      !!link.textContent && link.textContent.length > 0
        ? link.textContent
        : !!link.getAttribute("title") && link.getAttribute("title").length > 0
        ? link.getAttribute("title")
        : !!link.getAttribute("aria-label") &&
          link.getAttribute("aria-label").length > 0
        ? link.getAttribute("aria-label")
        : "";
    linksUrls.push({
      url: link.href,
      text: text.toLocaleLowerCase().replace(/\s/g, "").trim(),
    });
  }
  console.log(JSON.stringify(linksUrls));
  return linksUrls;
}

function findUniquePrefixLink() {
  const prefixLinks = [];
  for (const link of links) {
    if (link.text.startsWith(prefixString)) {
      prefixLinks.push(link);
    }
  }
  console.log(`SafariSneak: Matching URLs ${JSON.stringify(prefixLinks)}`);
  return prefixLinks.length === 1 ? prefixLinks[0] : null;
}

function appendPrefixCharacter(c) {
  prefixString += c;
  console.log(`SafariSneak: Current prefix ${prefixString}`);
  if (prefixString.length >= 2) {
    const uniquePrefixLink = findUniquePrefixLink();
    if (!!uniquePrefixLink) {
      handleSelection(uniquePrefixLink.url);
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
      "SafariSneak: Canceled listening due to Escape or CommandOrControl"
    );
    reset();
  } else if (isListening) {
    console.log(`SafariSneak: Appending ${event.key} to prefix`);
    appendPrefixCharacter(event.key);
  } else if (event.key === "s" || event.key === "S") {
    console.log("SafariSneak: Listening...");
    isListening = true;
    shouldOpenInNewTab = event.shiftKey;
    links = getAllLinks();
  }
});
