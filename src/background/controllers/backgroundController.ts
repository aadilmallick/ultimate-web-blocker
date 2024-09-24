export function isValidUrl(url: string) {
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

export class BlockScheduler {
  constructor(private startTime: Date, private endTime: Date) {}

  shouldBlock(currentTime: Date) {
    // Extract hours from dates
    const startHour =
      this.startTime.getHours() + this.startTime.getMinutes() / 60;
    const endHour = this.endTime.getHours() + this.endTime.getMinutes() / 60;
    const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;

    console.log(startHour, endHour, currentHour);

    // Check if current hour is within the interval, if so, then don't block
    if (currentHour >= startHour && currentHour < endHour) {
      return false;
    }
    return true;
  }
}
