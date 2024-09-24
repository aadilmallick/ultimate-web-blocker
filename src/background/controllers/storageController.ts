import { LocalStorage, SyncStorage } from "app/utils/api/storage";

export interface BlockSite {
  id: string;
  url: string;
  schedule?: {
    startTime: string;
    endTime: string;
  };
}

export interface FocusGroup {
  links: {
    url: string;
    id: string;
  }[];
  isFocusing: boolean;
}

export const blocksSitesStorage = new LocalStorage({
  blockSites: [] as BlockSite[],
});

export const focusModeStorage = new LocalStorage({
  focusGroup: {
    links: [],
    isFocusing: false,
  } as FocusGroup,
});
export const appSettingsStorage = new SyncStorage({});

// define static methods here
export class StorageHandler {
  static async getScheduledBlockSites() {
    return (await blocksSitesStorage.get("blockSites")).filter(
      (site) => site.schedule
    );
  }

  static async getPermanentlyBlockedSites() {
    return (await blocksSitesStorage.get("blockSites")).filter(
      (site) => !site.schedule
    );
  }

  static async addFocusLink(url: string) {
    const focusGroup = await focusModeStorage.get("focusGroup");
    const newLink = { url, id: crypto.randomUUID() };
    const newLinks = focusGroup ? [...focusGroup.links, newLink] : [newLink];
    const newFocusGroup: FocusGroup = {
      ...focusGroup,
      links: newLinks,
    };
    await focusModeStorage.set("focusGroup", newFocusGroup);
  }
}

export class URLHandler {
  static containsURL(url: string, urls: string[]) {
    return urls.some((u) => new URL(url).hostname.includes(u));
  }

  static containsURLIDK(url: string, urls: string[]) {
    if (urls.length === 0) {
      return true;
    }
    return urls.some((u) =>
      new URL(url).hostname.includes(new URL(u).hostname)
    );
  }
}
