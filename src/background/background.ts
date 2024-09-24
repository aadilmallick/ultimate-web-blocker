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
import { ContextMenuHandler } from "./controllers/contextMenuController";
import Tabs, { TabAPI, TabModel } from "app/utils/api/tabs";
import { BlockScheduler, isValidUrl } from "./controllers/backgroundController";

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

    const blocklist = await blocksSitesStorage.getAll();
    blocklist.blockSites.forEach((site) => {
      if (site.schedule) {
        console.log(site.schedule);
        console.log("start time", site.schedule.startTime);
        console.log("end time", site.schedule.endTime);
        console.log(
          DateModel.convertTimeToDate(site.schedule.startTime).toTimeString()
        );
        console.log(
          DateModel.convertTimeToDate(site.schedule.endTime).toTimeString()
        );
      }
    });
    ContextMenuHandler.createAddUrlMenuFocus();
  },
});

ContextMenuHandler.listenForAddUrlMenuFocusClick();

// when user navigates to a different tab
chrome.tabs.onHighlighted.addListener(({ tabIds, windowId }) => {
  const currentTabId = tabIds[0];
  async function doStuff() {
    const tab = await Tabs.getTabById(currentTabId);
    if (!tab.url) return;
    if (!isValidUrl(tab.url)) {
      console.log("invalid tab", tab.url);
      return;
    }
    handleFocusMode(currentTabId, tab.url);
    onUpdated(currentTabId, tab.url!);
  }

  doStuff();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    if (!isValidUrl(tab.url!)) {
      console.log("invalid tab", tab.url);
      return;
    }

    handleFocusMode(tabId, tab.url!);
    onUpdated(tabId, tab.url!);
  }
});

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === "complete") {
//     if (!isValidUrl(tab.url!)) {
//       console.log("invalid tab", tab.url);
//       return;
//     }
//     onUpdated(tabId, tab.url!);
//   }
// });

async function handleFocusMode(tabId: number, url: string) {
  const focusGroup = await focusModeStorage.get("focusGroup");
  const notInFocusGroup = !URLHandler.containsURLIDK(
    url,
    focusGroup.links.map((link) => link.url)
  );
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
  console.log(
    "should block",
    URLHandler.containsURL(url!, permanetlyBlockedUrls) ||
      URLHandler.containsURL(url!, scheduledUrls)
  );
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
    const site = scheduledSites.find((site) =>
      new URL(url!).hostname.includes(site.url)
    );
    if (!site) {
      console.error("Site not found in scheduled sites");
      console.log(site, scheduledSites, url);
      return;
    }
    const { startTime, endTime } = site.schedule!;
    const blockScheduler = new BlockScheduler(
      DateModel.convertTimeToDate(startTime),
      DateModel.convertTimeToDate(endTime)
    );
    console.log("should block", blockScheduler.shouldBlock(new Date()));
    if (blockScheduler.shouldBlock(new Date())) {
      console.log("should block schedule");
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
