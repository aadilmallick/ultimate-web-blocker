import { Runtime } from "app/utils/api/runtime";
import {
  blocksSitesStorage,
  focusModeStorage,
  StorageHandler,
  URLHandler,
} from "./controllers/storageController";
import { DateModel } from "app/utils/projectUtils";
import {
  blockChannel,
  focusModeChannel,
  MessageHandler,
  pingContentScript,
  pingContentScriptWithCb,
} from "./controllers/messageController";

Runtime.onInstall({
  // runs first time you download the extension
  installCb: async () => {
    console.log("Extension installed");
  },
  // runs every time you update the extension or refresh it
  updateCb: async () => {
    console.log("Extension updated");
  },
  onAll: async () => {
    console.log("Extension loaded");
    await blocksSitesStorage.setup();
    await focusModeStorage.setup();
    console.log(await blocksSitesStorage.getAll());
    console.log(await focusModeStorage.getAll());
  },
});

function isValidUrl(url: string) {
  const manifest = chrome.runtime.getManifest();
  if (!manifest.content_scripts) throw new Error("No content scripts found");
  const matches = manifest.content_scripts[0].matches;
  if (!matches) throw new Error("No matches found in manifest");
  let isValid = true;
  matches.forEach((match) => {
    if (!url.match(match)) {
      isValid = false;
    }
  });
  return isValid;
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    if (!isValidUrl(tab.url!)) {
      console.log("invalid tab", tab.url);
      return;
    }

    handleFocusMode(tabId, tab.url!);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    if (!isValidUrl(tab.url!)) {
      console.log("invalid tab", tab.url);
      return;
    }
    onUpdated(tabId, tab.url!);
  }
});

async function handleFocusMode(tabId: number, url: string) {
  const focusGroup = await focusModeStorage.get("focusGroup");
  const notInFocusGroup = !URLHandler.containsURLIDK(
    url,
    focusGroup.links.map((link) => link.url)
  );
  console.log(focusGroup);
  console.log(`not in focus group ${new URL(url).hostname}`, notInFocusGroup);
  if (focusGroup.isFocusing && notInFocusGroup) {
    await pingContentScriptWithCb(tabId, {
      successCb: (message) => {
        console.log(message);
        focusModeChannel.sendP2C(tabId, { url });
        console.log("sending focusmode message", url);
      },
    });
  }
}

async function onUpdated(tabId: number, url: string) {
  const permanentlyBlockedSites =
    await StorageHandler.getPermanentlyBlockedSites();
  const scheduledSites = await StorageHandler.getScheduledBlockSites();
  const permanetlyBlockedUrls = permanentlyBlockedSites.map((site) => site.url);
  const scheduledUrls = scheduledSites.map((site) => site.url);
  if (URLHandler.containsURL(url!, permanetlyBlockedUrls)) {
    // block site
    await pingContentScriptWithCb(tabId, {
      successCb: (message) => {
        console.log(message);
        blockChannel.sendP2C(tabId, { url });
        console.log("sending blocking message", url);
      },
    });
  }
  if (URLHandler.containsURL(url!, scheduledUrls)) {
    const currentTime = Date.now();
    const site = scheduledSites.find((site) => site.url === url);
    if (!site) {
      console.error("Site not found in scheduled sites");
      console.log(site, scheduledSites);
      return;
    }
    const { startTime, endTime } = site.schedule!;
    if (
      currentTime >= DateModel.convertTimeToDate(startTime).getTime() &&
      currentTime <= DateModel.convertTimeToDate(endTime).getTime()
    ) {
      await pingContentScriptWithCb(tabId, {
        successCb: (message) => {
          console.log(message);
          blockChannel.sendP2C(tabId, { url });
          console.log("sending blocking message", url);
        },
      });
      // block site
    }
  }
}
