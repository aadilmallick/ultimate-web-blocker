import { injectRoot } from "app/utils/ReactUtils";
import { App } from "./App";
import {
  blockChannel,
  focusModeChannel,
  receivePingFromBackground,
} from "app/background/controllers/messageController";

blockChannel.listenAsync(async ({ url }) => {
  console.log(`Blocking site: ${url}`);
  document.head.title = "Blocked Site";
  document.body.innerHTML = "";
  injectRoot(<App />, "block-sites-root");
});

focusModeChannel.listenAsync(async ({ url }) => {
  console.log(`Blocking site: ${url}`);
  document.head.title = "Blocked Site";
  document.body.innerHTML = "";
  injectRoot(<App />, "block-sites-root");
});

receivePingFromBackground();
