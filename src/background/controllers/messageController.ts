import { MessagesOneWay } from "app/utils/api/messages";

export const blockChannel = new MessagesOneWay<{
  url: string;
}>("block");

export const focusModeChannel = new MessagesOneWay<{
  url: string;
}>("focus");

export function pingContentScript(
  tabId: number,
  maxRetries = 10,
  interval = 1000
): Promise<string> {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    function sendPing() {
      attempts++;
      chrome.tabs.sendMessage(tabId, { type: "PING" }, (response) => {
        if (chrome.runtime.lastError) {
          if (attempts < maxRetries) {
            setTimeout(sendPing, interval); // Retry after a delay
          } else {
            reject("Content script not responding.");
          }
        } else if (response && response.status === "PONG") {
          resolve("Content script is ready.");
        } else {
          reject("Unexpected response from content script.");
        }
      });
    }

    sendPing();
  });
}

export function receivePingFromBackground() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "PING") {
      sendResponse({ status: "PONG" });
    }
  });
}

export async function pingContentScriptWithCb(
  tabId: number,
  {
    successCb,
    errorCb,
  }: {
    successCb: (message?: string) => void;
    errorCb?: () => void;
  }
) {
  try {
    const message = await pingContentScript(tabId);
    successCb(message);
  } catch (error) {
    console.error("Error pinging content script", error);
    errorCb?.();
  }
}

// define static methods here
export class MessageHandler {
  static askContentScriptToBlockSite(tabId: number, url: string, delay = 500) {
    // a timeout is necessary to ensure content script loads.
    setTimeout(() => {
      blockChannel.sendP2C(tabId, { url });
    }, delay);
  }

  static askContentScriptToBlockSiteFocusMode(
    tabId: number,
    url: string,
    delay = 500
  ) {
    // a timeout is necessary to ensure content script loads.
    setTimeout(() => {
      blockChannel.sendP2C(tabId, { url });
    }, delay);
  }
}
