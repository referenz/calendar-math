function intervalToPast(damalsObj) {
  if (!(damalsObj instanceof Date) || isNaN(damalsObj)) {
    throw new TypeError("Parameter muss ein gültiges Date-Objekt sein");
  }

  if (damalsObj > new Date()) {
    throw new Error("Das Datum liegt in der Zukunft.");
  }

  const jetztObj = new Date();

  const jetzt = {
    year: jetztObj.getFullYear(),
    month: jetztObj.getMonth() + 1,
    day: jetztObj.getDate(),
  };

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

export function intervalToPastString(damalsObj) {
  const [jahre, monate, tage] = intervalToPast(damalsObj);

  let result = [];
  result.push(jahre > 1 ? `${jahre} Jahre` : `1 Jahr`);
  result.push(monate > 1 ? `${monate} Monate` : "1 Monat");
  result.push(tage > 1 ? `${tage} Tage` : "1 Tag");

  return result.length !== 0 ? result.join(", ") : "heute";
}
