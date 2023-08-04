import {
  listOfDwellingRooms,
  listOfOtherStructureRooms,
} from "./constants";

export function floorNameChecker(floor) {
    const aboveFloorReg = /Dwelling \w\/NA\/Above Grade \w/;
    const belowFloorReg = /Dwelling \w\/NA\/Below Grade \w/;
    const OtheStructureFloorReg = /Other Structure \w\/NA\//;

    if (
      floor.match(OtheStructureFloorReg) ||
      floor.match(belowFloorReg) ||
      floor.match(aboveFloorReg)
    ) {
      return "default";
    }
    return "danger";
  };

  export function floorTypeChecker(floor, type) {
    if (floor.includes("Above Grade") && floor.includes("Dwelling")) {
      if (!type.includes("Above Grade")) return "danger";
    }
    if (floor.includes("Below Grade") && floor.includes("Dwelling")) {
      if (!type.includes("Below Grade")) return "danger";
    }
    if (floor.includes("Other Structure")) {
      if (!type.includes("Detached")) return "danger";
    }
    return "default";
  };

  export function roomNumbersChecker(room, arr, floorName) {
    let newArr = [];
    arr.map((floor) => {
      newArr.push(...floor);
    });

    let repeatedRooms = newArr.filter((item) => item === room);

    if (repeatedRooms.length > 1) {
      return "ВЖЕ IСНУЄ";
    }

    let prevRoom;
    const checkNumber = room.slice(-2) - 1;
    if (checkNumber > 0 && checkNumber < 10) {
      prevRoom = `${room.slice(0, -3)}-0${checkNumber}`;
      if (!newArr.includes(prevRoom)) {
        return "Неправильна нумерацiя";
      }
    }
    if (checkNumber > 9 && checkNumber < 10) {
      prevRoom = `${room.slice(0, -3)}-${checkNumber}`;
      console.log(room, prevRoom);
      if (!newArr.includes(prevRoom)) {
        return "Неправильна нумерацiя";
      }
    }
    if (
      floorName.includes("Dwelling") &&
      !listOfDwellingRooms.includes(room.slice(0, -3))
    ) {
      return "Невизначена назва";
    }
    if (
      floorName.includes("Other Structure") &&
      !listOfOtherStructureRooms.includes(room.slice(0, -3))
    ) {
      return "Невизначена назва";
    }
  }