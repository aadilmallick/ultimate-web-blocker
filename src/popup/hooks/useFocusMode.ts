import {
  BlockSite,
  blocksSitesStorage,
  focusModeStorage,
} from "app/background/controllers/storageController";
import { useChromeStorage } from "app/utils/ReactUtils";
import { useCallback } from "react";

const useFocusMode = () => {
  const {
    data: focusGroup,
    loading,
    setValueAndStore,
  } = useChromeStorage(focusModeStorage, "focusGroup");

  const setFocusing = useCallback(
    async function (shouldFocus: boolean) {
      if (!focusGroup) return;
      await setValueAndStore({
        links: focusGroup.links,
        isFocusing: shouldFocus,
      });
    },
    [focusGroup]
  );

  const addLink = useCallback(
    async function (url: string) {
      if (!focusGroup) return;
      const newLink = { url, id: crypto.randomUUID() };
      const newData = focusGroup ? [...focusGroup.links, newLink] : [newLink];
      await setValueAndStore({
        links: newData,
        isFocusing: focusGroup.isFocusing,
      });
    },
    [focusGroup]
  );

  const deleteLink = useCallback(
    async function deleteLink(id: string) {
      if (!focusGroup) return;
      const newLinks = focusGroup.links.filter((link) => link.id !== id);
      await setValueAndStore({
        links: newLinks,
        isFocusing: focusGroup.isFocusing,
      });
    },
    [focusGroup]
  );

  return { focusGroup, loading, addLink, deleteLink, setFocusing };
};

export default useFocusMode;
