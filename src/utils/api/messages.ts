type Listener = (
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => void;
export class MessagesOneWay<PayloadType = undefined, ResponseType = undefined> {
  private listener: Listener | null = null;
  static channels: string[] = [];
  constructor(private channel: string) {
    if (MessagesOneWay.channels.includes(channel)) {
      throw new Error(`Channel ${channel} already exists`);
    }
    MessagesOneWay.channels.push(channel);
  }

  /**
   * for sending message from process to another process
   *
   */
  sendP2P(payload: PayloadType) {
    chrome.runtime.sendMessage({ type: this.channel, ...payload });
  }

  /**
   * for sending message from a content script to another process
   *
   */
  sendC2P(payload: PayloadType) {
    chrome.runtime.sendMessage({ type: this.channel, ...payload });
  }

  /**
   * for sending message from a process to a content script
   */
  sendP2C(tabId: number, payload: PayloadType) {
    chrome.tabs.sendMessage(tabId, { type: this.channel, ...payload });
  }

  /**
   * for sending message from process to another process
   *
   */
  async sendP2PAsync(payload: PayloadType) {
    return (await chrome.runtime.sendMessage({
      type: this.channel,
      ...payload,
    })) as ResponseType;
  }

  /**
   * for sending message from a content script to another process
   *
   */
  async sendC2PAsync(payload: PayloadType) {
    return (await chrome.runtime.sendMessage({
      type: this.channel,
      ...payload,
    })) as ResponseType;
  }

  /**
   * for sending message from a process to a content script
   */
  async sendP2CAsync(tabId: number, payload: PayloadType) {
    return (await chrome.tabs.sendMessage(tabId, {
      type: this.channel,
      ...payload,
    })) as ResponseType;
  }

  listen(callback: (payload: PayloadType) => void) {
    const listener: Listener = (
      message: PayloadType & { type: string },
      sender: any,
      sendResponse: any
    ) => {
      if (message.type === this.channel) {
        callback(message);
      }
    };
    this.listener = listener;
    chrome.runtime.onMessage.addListener(this.listener);
  }

  static listenToMessages(
    callback: (
      message: any,
      sender?: any,
      sendResponse?: (t: any) => void
    ) => void
  ) {
    chrome.runtime.onMessage.addListener(callback);
    return callback;
  }

  listenAsync(callback: (payload: PayloadType) => Promise<ResponseType>) {
    const listener: Listener = async (
      message: PayloadType & { type: string },
      sender: any,
      sendResponse: any
    ) => {
      if (message.type === this.channel) {
        const response = await callback(message);
        sendResponse(response);
        return true;
      }
      return true;
    };
    this.listener = listener;
    chrome.runtime.onMessage.addListener(this.listener);
  }

  removeListener() {
    if (this.listener) {
      chrome.runtime.onMessage.removeListener(this.listener);
    }
  }

  parseMessage(message: any) {
    if (!message.type) {
      return { messageBelongsToChannel: false, payload: undefined };
    }
    if (message.type === this.channel) {
      return {
        messageBelongsToChannel: true,
        payload: message as PayloadType & { type: string },
      };
    } else {
      return { messageBelongsToChannel: false, payload: undefined };
    }
  }
}
