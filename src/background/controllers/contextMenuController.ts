import ContextMenu from "app/utils/api/contextMenu";
import { StorageHandler } from "./storageController";

export const addUrlMenuFocus = new ContextMenu("add-url-to-focus-group");

export class ContextMenuHandler {
  static createAddUrlMenuFocus() {
    addUrlMenuFocus.create({
      documentUrlPatterns: ["https://*/*"],
      title: "Add Current Url to Focus Group",
      contexts: ["page", "page_action"],
    });
  }

  static listenForAddUrlMenuFocusClick() {
    addUrlMenuFocus.onClicked(async ({ pageUrl }) => {
      await StorageHandler.addFocusLink(pageUrl);
    });
  }
}
