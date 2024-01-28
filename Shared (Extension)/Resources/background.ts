/// <reference types="webextension-polyfill" />

import { runtime, tabs } from "webextension-polyfill";

interface Message {
  id: string;
  url: string;
}

async function handleOpenLink(message: Message) {
  if (message.id === "open_link" && message.url) {
    await tabs.create({ url: message.url });
  } else {
    console.error(`Invalid message received from content script: ${message}`);
  }
}

runtime.onMessage.addListener(handleOpenLink);
