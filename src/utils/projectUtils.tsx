export function getButtonAccessibilityProps<T>(cb: () => void) {
  return {
    onClick: cb,
    onKeyDown: (e: React.KeyboardEvent<T>) => {
      if (e.key === "Enter") {
        cb();
      }
    },
    tabIndex: 0,
    role: "button",
  };
}

export function withTryCatch<T>({
  catchFn,
  tryFn,
  finallyFn,
}: {
  tryFn: () => T;
  catchFn: (error: any) => void;
  finallyFn?: () => void;
}) {
  try {
    return tryFn();
  } catch (e) {
    catchFn(e);
  } finally {
    finallyFn?.();
  }
}

export class DateModel {
  /**
   *
   * @param time the timestring like 20:35 to convert into a date
   */
  static convertTimeToDate(time: string) {
    const date = new Date();
    const [hours, minutes] = time.split(":");
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    return date;
  }

  /**
   *
   * @param dateMillis the date in milliseconds to convert into a time string
   */
  static convertDateToTime(dateMillis: number) {
    const date = new Date(dateMillis);
    const hours = `${date.getHours()}`.padStart(2, "0");
    const minutes = `${date.getMinutes()}`.padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  static militaryToStandardTime(militaryTime: string) {
    const [hours, minutes] = militaryTime.split(":");
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hour = hour % 12 || 12;

    // Format the time string
    const formattedTime = `${hour}:${minutes.padStart(2, "0")} ${ampm}`;
    return formattedTime;
  }
}
