import {
  BlockSite,
  blocksSitesStorage,
} from "app/background/controllers/storageController";
import { useChromeStorage } from "app/utils/ReactUtils";
import React from "react";

const useBlockList = () => {
  const {
    data: blocksites,
    loading,
    setValueAndStore,
  } = useChromeStorage(blocksSitesStorage, "blockSites");

  async function addBlockSite(url: string, schedule?: BlockSite["schedule"]) {
    if (
      blocksites &&
      blocksites.find((site) => new URL(url).hostname === site.url)
    ) {
      throw new Error("Site already blocked");
    }
    const newBlockSite: BlockSite = {
      id: crypto.randomUUID(),
      url: new URL(url).hostname,
      schedule,
    };
    const newData = blocksites ? [...blocksites, newBlockSite] : [newBlockSite];
    setValueAndStore(newData);
  }

  async function deleteBlockSite(id: string) {
    if (!blocksites) return;
    const newBlockSites = blocksites.filter((site) => site.id !== id);
    setValueAndStore(newBlockSites);
  }

  return { blocksites, loading, addBlockSite, deleteBlockSite };
};

export default useBlockList;
