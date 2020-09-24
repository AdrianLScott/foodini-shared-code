import moment from "moment";//RETURN OBJECT AT THE END
var schdle = [
  {
    hrs: ["23:49", "23:58"],
    _id: "5f20a6c25aa27217e00a3c57",
    day: 0,
    act: true,
  },
  {
    hrs: ["20:00", "02:00"],
    _id: "5f20a6c25aa27217e00a2c57",
    day: 1,
    act: true,
  },
  {
    hrs: [
      "23:50",
      "23:50", //50, 51, 49
    ],
    _id: "5f20a6c25aa27217e00a2c58",
    day: 2,
    act: true,
  },
  {
    hrs: [
      "23:15",
      "23:18", //14, 20
    ],
    _id: "5f20a6c25aa27217e00a2c59",
    day: 3,
    act: true,
  },
  {
    hrs: ["19:00", "23:00"],
    _id: "5f20a6c25aa27217e00a2c5a",
    day: 4,
    act: true,
  },
  {
    hrs: ["08:00", "23:59"],
    _id: "5f20a6c25aa27217e00a2c5b",
    day: 5,
    act: true,
  },
  {
    hrs: ["13:00", "23:00"],
    _id: "5f20a6c25aa27217e00a2c5c",
    day: 6,
    act: true,
  },
];

//document.getElementById("root").innerHTML = JSON.stringify(schdle);
export function isOpen(schdle){

let todayIndex = moment().day();
let found = false; //puede dictar secuencia y terminacion de todo el process
const currentTime = parseInt(moment().format("HH:mm").replace(":", ""));

if (schdle[todayIndex].act) {
  const startTime = parseInt(schdle[todayIndex].hrs[0].replace(":", ""));
  const endTime = parseInt(schdle[todayIndex].hrs[1].replace(":", ""));
  if (startTime <= currentTime && endTime >= currentTime) {
    found = true;
    let restStat = {
        isOpen: true,
        closesAt: `Cierra a las ${formatTime(schdle[todayIndex].hrs[1])}` 
    }
    // console.log("Abierto");
    // console.log(`Cierra a las ${formatTime(schdle[todayIndex].hrs[1])}`);
  }
}

let yesterdayIndex = todayIndex == 0 ? 6 : todayIndex - 1;
if (schdle[yesterdayIndex].act && !found) {
  const yStart = parseInt(schdle[yesterdayIndex].hrs[0].replace(":", ""));
  const yEnd = parseInt(schdle[yesterdayIndex].hrs[1].replace(":", ""));
  if (yStart >= yEnd) {
    if (currentTime <= yEnd) {
      found = true;
      let restStat = {
        isOpen: true,
        closesAt: `Cierra a las ${formatTime(schdle[yesterdayIndex].hrs[1])}` 
    }
    //   console.log("Abierto");
    //   console.log(`Cierra a las ${formatTime(schdle[yesterdayIndex].hrs[1])}`);
    }
  }
}

if (!found) {
  console.log("Cerrado");
  console.log(getNextOpeningDay(todayIndex));
}

return restStat

function getNextOpeningDay(todayDay) {
  let day = todayDay + 1;
  do {
    if (schdle[day].act) {
      return `Abre ${numberToDayString(day)} a las ${formatTime(
        schdle[day].hrs[0]
      )}`;
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
}