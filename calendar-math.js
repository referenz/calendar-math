/**
 * @typedef {Object} PlainDateParts
 * @property {number} year
 * @property {number} month
 * @property {number} day
 */

/**
 * @param {Date} damalsObj - Vergangenes Datum, das ausgewertet werden soll.
 * @returns {[number, number, number]} Zeitspanne in Jahren, Monaten und Tagen
 * @throws {TypeError} Wenn `damalsObj` kein gültiges `Date` ist.
 * @throws {Error} Wenn `damalsObj` in der Zukunft liegt.
 */
function intervalToPastLegacy(damalsObj) {
  if (!(damalsObj instanceof Date) || isNaN(damalsObj)) {
    throw new TypeError("Parameter muss ein gültiges Date-Objekt sein");
  }

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

  return [intervalYears, intervalMonths, intervalDays];
}

/**
 * @param {Date} damalsObj - Vergangenes Datum, das ausgewertet werden soll.
 * @returns {string}
 */
export function intervalToPastString(damalsObj) {
  try {
    const temporal = globalThis.Temporal;
    if (!temporal?.PlainDate || !temporal?.Now) {
      throw new Error("Temporal API not available");
    }

    console.log("Using Temporal API");

    const damals = Temporal.PlainDate.from({
      year: damalsObj.getFullYear(),
      month: damalsObj.getMonth() + 1,
      day: damalsObj.getDate(),
    });
    const jetzt =  Temporal.Now.plainDateISO()
    if (damals.equals(jetzt)) return "heute";

    const interval = jetzt.since(damals, { largestUnit: 'year', smallestUnit: 'day' });
    return interval.toLocaleString('de', { style: 'long', roundingMode: 'trunc' });
  } catch (error) {
    console.error(error);
    console.log('Falling back to legacy implementation');

    const [jahre, monate, tage] = intervalToPastLegacy(damalsObj);

    /** @type {string[]} */
    let result = [];
    result.push(jahre > 1 ? `${jahre} Jahre` : `1 Jahr`);
    result.push(monate > 1 ? `${monate} Monate` : "1 Monat");
    result.push(tage > 1 ? `${tage} Tage` : "1 Tag");

    return result.length !== 0 ? result.join(", ") : "heute";
  }
}
