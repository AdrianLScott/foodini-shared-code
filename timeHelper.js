const moment = require("moment"); //RETURN OBJECT AT THE END

//document.getElementById("root").innerHTML = JSON.stringify(schdle);
function isOpen(schdle) {
  let restInfo = {};
  let todayIndex = moment().day();
  let found = false; //puede dictar secuencia y terminacion de todo el process
  let glider = false;
  const currentTime = parseInt(moment().format("HH:mm").replace(":", ""));

  if (schdle[todayIndex].act) {
    const startTime = parseInt(schdle[todayIndex].hrs[0].replace(":", ""));
    const endTime = parseInt(schdle[todayIndex].hrs[1].replace(":", ""));
    if (startTime <= currentTime && endTime > currentTime) {
      found = true;
      const openTIME = formatTime(schdle[todayIndex].hrs[0]); 
      const closeTIME = formatTime(schdle[todayIndex].hrs[1]);
        restInfo = {
          open: true,
          numWeekDay: todayIndex,
          weekDay: numberToDayString(todayIndex),
          openTime: openTIME,
          since: `Abierto desde hoy ${openTIME}`,//abierto desde
          closeTime: closeTIME,
          nextAt: `Cierra a las ${closeTIME}`
        }
    }
    if (startTime > currentTime) {
      glider = true;
    }
  }

  let yesterdayIndex = todayIndex == 0 ? 6 : todayIndex - 1;
  if (schdle[yesterdayIndex].act && !found) {
    const yStart = parseInt(schdle[yesterdayIndex].hrs[0].replace(":", ""));
    const yEnd = parseInt(schdle[yesterdayIndex].hrs[1].replace(":", ""));
    if (yStart >= yEnd) {
      if (currentTime < yEnd) {
        found = true;
        const openTIME = formatTime(schdle[yesterdayIndex].hrs[0]); 
        const closeTIME = formatTime(schdle[yesterdayIndex].hrs[1]);
        restInfo = {
          open: true,
          numWeekDay: yesterdayIndex,
          weekDay: numberToDayString(yesterdayIndex),
          openTime: openTIME,
          since: `Abierto desde ayer ${openTIME}`,//abierto desde //cerrado desde
          closeTime: closeTIME,
          nextAt: `Cierra a las ${closeTIME}`
        }
      }
    }
  }

  if (!found) {
    if (glider) {
      const openTIME = formatTime(schdle[todayIndex].hrs[0]); 
      const closeTIME = formatTime(schdle[todayIndex].hrs[1]);
      const sinceDay = getLastOpeningDaySchdle(todayIndex)
      console.log(todayIndex)
        restInfo = {
          open: false,
          numWeekDay: todayIndex,
          weekDay: numberToDayString(todayIndex),
          openTime: openTIME,
          since: `Cerrado desde ${numberToDayString(sinceDay.day)} ${formatTime(sinceDay.hrs[1])}`,
          closeTime: closeTIME,
          nextAt: `Abre a las ${openTIME}`
        }
    } else {
      let nextOpenDay = getNextOpeningDaySchdle(todayIndex);
      if(nextOpenDay !== "Hasta nuevo aviso"){
        const openTIME = formatTime(nextOpenDay.hrs[0]); 
        const closeTIME = formatTime(nextOpenDay.hrs[1]);
        const sinceDay = getLastOpeningDaySchdle(todayIndex)
        const sinceDayString = numberToDayString(sinceDay.day)
        restInfo = {
          open: false,
          numWeekDay: nextOpenDay.day,
          weekDay: sinceDayString,
          openTime: openTIME,
          since: `Cerrado desde ${numberToDayString(sinceDay.day)} ${formatTime(sinceDay.hrs[1])}`,
          closeTime: nextOpenDay.hrs[1],
          nextAt: `Abre ${sinceDayString} a las ${openTIME}`
        }
      }
    }
  }
  
  return restInfo;
}

function getNextOpeningDaySchdle(todayDay){
  let day = todayDay + 1;
  do {
    if (schdle[day].act) {
      return schdle[day]
    }
    if (day === 6) {
      day = 0;
    } else day++;
  } while (day != todayDay + 1);
  return "Hasta nuevo aviso";
}

function getLastOpeningDaySchdle(todayDay){
  let day = todayDay - 1;
  do {
    if (schdle[day].act) {
      return schdle[day]
    }
    if (day === 0) {
      day = 6;
    } else day--;
  } while (day != todayDay - 1);
  return "Hasta nuevo aviso";
}

function formatTime(time) {
  return moment(time, "HH:mm").format("h:mm a");
}

function numberToDayString(n) {
  switch (n) {
    case 0:
      return "Domingo";
    case 1:
      return "Lunes";
    case 2:
      return "Martes";
    case 3:
      return "Miércoles";
    case 4:
      return "Jueves";
    case 5:
      return "Viernes";
    case 6:
      return "Sábado";
  }
}
module.exports.isOpen = isOpen;
module.exports.getNextOpeningDaySchdle = getNextOpeningDaySchdle;
module.exports.getLastOpeningDaySchdle = getLastOpeningDaySchdle;
module.exports.getLastOpeningDaySchdle = formatTime;
module.exports.numberToDayString = numberToDayString;