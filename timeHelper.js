const moment = require("moment"); //RETURN OBJECT AT THE END

function isOpen(schdle) {
  let restInfo = {};
  let todayIndex = moment().day();
  let found = false; //puede dictar secuencia y terminacion de todo el process
  let glider = false;
  const currentTime = parseInt(moment().format("HH:mm").replace(":", ""));

  if (schdle[todayIndex].active) {
    const startTime = parseInt(schdle[todayIndex].opentime.replace(":", ""));
    const endTime = parseInt(schdle[todayIndex].closetime.replace(":", ""));
    if (
      (startTime <= currentTime && endTime > currentTime) ||
      (startTime > endTime && startTime <= currentTime)
    ) {
      found = true;
      const openTIME = formatTime(schdle[todayIndex].opentime);
      const closeTIME = formatTime(schdle[todayIndex].closetime);
      restInfo = {
        open: true,
        numWeekDay: todayIndex,
        weekDay: numberToDayString(todayIndex),
        openTime: openTIME,
        closeTime: closeTIME,
        nextAt: `Cierra a las ${closeTIME}`,
      };
    }
    if (startTime > currentTime) {
      glider = true;
    }
  }

  let yesterdayIndex = todayIndex == 0 ? 6 : todayIndex - 1;
  if (schdle[yesterdayIndex].active && !found) {
    const yStart = parseInt(schdle[yesterdayIndex].opentime.replace(":", ""));
    const yEnd = parseInt(schdle[yesterdayIndex].closetime.replace(":", ""));
    if (yStart >= yEnd) {
      if (currentTime < yEnd) {
        found = true;
        const openTIME = formatTime(schdle[yesterdayIndex].opentime);
        const closeTIME = formatTime(schdle[yesterdayIndex].closetime);
        restInfo = {
          open: true,
          numWeekDay: yesterdayIndex,
          weekDay: numberToDayString(yesterdayIndex),
          openTime: openTIME,
          closeTime: closeTIME,
          nextAt: `Cierra a las ${closeTIME}`,
        };
      }
    }
  }

  if (!found) {
    if (glider) {
      const openTIME = formatTime(schdle[todayIndex].opentime);
      const closeTIME = formatTime(schdle[todayIndex].closetime);
      restInfo = {
        open: false,
        numWeekDay: todayIndex,
        weekDay: numberToDayString(todayIndex),
        openTime: openTIME,
        closeTime: closeTIME,
        nextAt: `Abre a las ${openTIME}`,
      };
    } else {
      let nextOpenDay = getNextOpeningDaySchdle(schdle, todayIndex);
      if (nextOpenDay !== "Hasta nuevo aviso") {
        const openTIME = formatTime(nextOpenDay.opentime);
        const closeTIME = formatTime(nextOpenDay.closetime);
        const nextOpenDayString = numberToDayString(nextOpenDay.weekday);
        restInfo = {
          open: false,
          numWeekDay: nextOpenDay.weekday,
          weekDay: nextOpenDayString,
          openTime: openTIME,
          closeTime: closeTIME,
          nextAt: `Abre ${nextOpenDayString} a las ${openTIME}`,
        };
      } else
        restInfo = {
          open: false,
          numWeekDay: todayIndex,
          weekDay: numberToDayString(todayIndex),
          openTime: "Hasta nuevo aviso",
          closeTime: "No abre",
          nextAt: `Hasta nuevo aviso`,
        };
    }
  }

  return restInfo;
}

function getNextOpeningDaySchdle(schdle, todayDay) {
  let day = todayDay + 1;
  if (day > 6) day = 0;
  do {
    if (schdle[day].active) {
      return schdle[day];
    }
    if (day === 6) {
      day = 0;
    } else day++;
  } while (day != todayDay + 1);
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
module.exports.formatTime = formatTime;
module.exports.numberToDayString = numberToDayString;
module.exports.getNextOpeningDaySchdle = getNextOpeningDaySchdle;
