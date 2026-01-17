/**
 * @typedef {Object} PlainDateParts
 * @property {number} year
 * @property {number} month
 * @property {number} day
 */

/**
 * @param {Date} damalsObj - Vergangenes Datum, das ausgewertet werden soll.
 * @returns {string} Zeitspanne in Jahren, Monaten und Tagen
 * @throws {Error} Wenn `damalsObj` in der Zukunft liegt.
 */
function intervalToPastLegacy(damalsObj) {
  console.log("Falling back to legacy implementation");

  if (damalsObj > new Date()) {
    throw new Error("Das Datum liegt in der Zukunft.");
  }

  const jetztObj = new Date();

  /** @type {PlainDateParts} */
  const jetzt = {
    year: jetztObj.getFullYear(),
    month: jetztObj.getMonth() + 1,
    day: jetztObj.getDate(),
  };

  /** @type {PlainDateParts} */
  const damals = {
    year: damalsObj.getFullYear(),
    month: damalsObj.getMonth() + 1,
    day: damalsObj.getDate(),
  };

  let intervalDays = 0;
  if (damals.day > jetzt.day) {
    const monthLength = new Date(damals.year, damals.month, 0).getDate();
    const daysTillMonthEnd = monthLength - damals.day;
    intervalDays = daysTillMonthEnd + jetzt.day;
    damals.month++;
  } else {
    intervalDays = jetzt.day - damals.day;
  }

  let intervalMonths = 0;
  if (damals.month > jetzt.month) {
    const monthsTillYearEnd = 12 - damals.month;
    intervalMonths = monthsTillYearEnd + jetzt.month;
    damals.year++;
  } else {
    intervalMonths = jetzt.month - damals.month;
  }

  const intervalYears = jetzt.year - damals.year;

  /** @type {string[]} */
  let result = [];
  if (intervalYears > 0) {
    result.push(intervalYears === 1 ? "1 Jahr" : `${intervalYears} Jahre`);
  }
  if (intervalMonths > 0) {
    result.push(intervalMonths === 1 ? "1 Monat" : `${intervalMonths} Monate`);
  }
  if (intervalDays > 0) {
    result.push(intervalDays === 1 ? "1 Tag" : `${intervalDays} Tage`);
  }

  return result.length !== 0 ? result.join(", ") : "heute";
}

/**
 * @param {Date} damalsObj - Vergangenes Datum, das ausgewertet werden soll.
 * @returns {string}
 * @throws {TypeError} Wenn `damalsObj` kein gültiges `Date` ist.
 * @throws {Error} Wenn `damalsObj` in der Zukunft liegt.
 */
export function intervalToPastString(damalsObj) {
  if (!(damalsObj instanceof Date) || Number.isNaN(damalsObj.getTime())) {
    throw new TypeError("Parameter muss ein gültiges Date-Objekt sein");
  }

  const temporal = globalThis.Temporal;
  if (!temporal?.PlainDate || !temporal?.Now)
    return intervalToPastLegacy(damalsObj);

  const damals = temporal.PlainDate.from({
    year: damalsObj.getFullYear(),
    month: damalsObj.getMonth() + 1,
    day: damalsObj.getDate(),
  });

  const jetzt = Temporal.Now.plainDateISO();

  if (damals.equals(jetzt)) return "heute";
  if (Temporal.PlainDate.compare(damals, jetzt) > 0) {
    throw new Error("Das Datum liegt in der Zukunft.");
  }

  const interval = jetzt.since(damals, {
    largestUnit: "year",
    smallestUnit: "day",
  });
  return interval.toLocaleString("de", {
    style: "long",
    roundingMode: "trunc",
  });
}
