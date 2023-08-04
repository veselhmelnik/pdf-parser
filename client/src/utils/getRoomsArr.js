export function getRoomsArr(formattedText, setFloors) {
    let floorsArr = [];
    let floorNameOtherReg = /Other Structure \d\/(.*)(?= RoomFloor)/;
    let floorTypeOtherReg = /\D{11} (?=Other Structure \d\/(.*)(?= RoomFloor))/;
    let floorNameDwellingReg = /Dwelling \d.NA\/(.*\s)(?=RoomFloor)/g
    let floorTypeDwellingReg = /\D{12} (?=Dwelling \d.NA\/)/g;
    let roomsReg = /\D{1,16}-\d\d/gm;
    let floorName;
    let floorType;
    for (let i = 1; i < formattedText.length - 1; i++) {
      if (formattedText[i].includes("Other Structure")) {
        floorName = formattedText[i].match(floorNameOtherReg);
        floorType = formattedText[i].match(floorTypeOtherReg);
      } else {
        floorName = formattedText[i].match(floorNameDwellingReg);
        floorType = formattedText[i].match(floorTypeDwellingReg);
      }
      const rooms = formattedText[i].match(roomsReg);
      if (floorName[0] !== null && floorType[0] !== null) {
        floorsArr.push([
          floorName[0],
          floorType[0],
          ...rooms.map((item) => {
            if (item.includes("ft")) {
              const reg = /[A-Z]\D{1,15}\d\d/;
              return item.match(reg)[0].trim();
            } else {
              return item.trim();
            }
          }),
        ]);
      }
    }
    setFloors((floors) => [...floors, ...floorsArr]);
    return floorsArr;
  }