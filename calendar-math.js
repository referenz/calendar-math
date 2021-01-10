function intervalToNow(damalsObj) {
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
  