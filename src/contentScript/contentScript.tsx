import { injectRoot } from "app/utils/ReactUtils";
import { App } from "./App";
import {
  blockChannel,
  focusModeChannel,
  receivePingFromBackground,
} from "app/background/controllers/messageController";
import { MessagesOneWay } from "app/utils/api/messages";

// MessagesOneWay.listenToMessages((message) => {
//   const { messageBelongsToChannel: messageBelongsToBlockChannel } =
//     blockChannel.parseMessage(message);
//   const { messageBelongsToChannel: messageBelongsToFocusChannel } =
//     focusModeChannel.parseMessage(message);
//   if (messageBelongsToBlockChannel) {
//     document.head.title = "Blocked Site - Block Mode";
//     document.body.innerHTML = "";
//     injectRoot(<App />, "block-sites-root");
//     return;
//   }
//   if (messageBelongsToFocusChannel) {
//     document.head.title = "Blocked Site - Focus Mode";
//     document.body.innerHTML = "";
//     injectRoot(<App />, "block-sites-root");
//     return;
//   }
// });

blockChannel.listen(({ url }) => {
  console.log(`Blocking site: ${url}`);
  document.head.title = "Blocked Site";
  document.body.innerHTML = "";
  injectRoot(<App />, "block-sites-root");
});

focusModeChannel.listen(({ url }) => {
  console.log(`Blocking site: ${url}`);
  document.head.title = "Blocked Site";
  document.body.innerHTML = "";
  injectRoot(<App />, "block-sites-root");
});

receivePingFromBackground();
