function intervalToPast(damalsObj) {
    if (!(damalsObj instanceof Date)) return
    const jetztObj = new Date()
  
    const jetzt = { year: jetztObj.getFullYear(), month: jetztObj.getMonth() + 1, day: jetztObj.getDate() }
    const damals = { year: damalsObj.getFullYear(), month: damalsObj.getMonth() + 1, day: damalsObj.getDate() }
  
    let intervalDays = 0
    if (damals.day > jetzt.day) {
      const monthLength = new Date(damals.year, damals.month, 0).getDate()
      const daysTillMonthEnd = monthLength - damals.day
      intervalDays = daysTillMonthEnd + jetzt.day
      damals.month++
    } else {
      intervalDays = jetzt.day - damals.day
    }
  
    let intervalMonths = 0
    if (damals.month > jetzt.month) {
      const monthsTillYearEnd = 12 - damals.month
      intervalMonths = monthsTillYearEnd + jetzt.month
      damals.year++
    } else {
      intervalMonths = jetzt.month - damals.month
    }
  
    const intervalYears = jetzt.year - damals.year
  
    return [intervalYears, intervalMonths, intervalDays]
  }

  function intervalToPastString(damalsObj) {
    const [jahre, monate, tage] = intervalToPast(damalsObj)

    let result = []
    if (jahre > 1) {
      result.push(`${jahre} Jahre`)
    } else if (jahre === 1) {
      result.push("1 Jahr")
    }

    if (monate > 1) {
      result.push(`${monate} Monate`)
    } else if (monate === 1) {
      result.push("1 Monat")
    }

    if (tage > 1) {
      result.push(`${tage} Tage`)
    } else if (tage === 1) {
      result.push("1 Tag")
    }

    const resultstring = result.length !== 0 ? result.reduce((acc, cur) => acc + ", " + cur) : "heute"
    return resultstring
  }