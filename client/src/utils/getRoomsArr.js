export function getRoomsArr(formattedText, setFloors) {
    let floorsArr = [];
    let floorNameOtherReg = /Other Structure \d\/(.*)(?= RoomFloor)/;
    let floorTypeOtherReg = /\D{11} (?=Other Structure \d\/(.*)(?= RoomFloor))/;
    let floorNameDwellingReg = /Dwelling \d.NA\/(.*\s)(?=RoomFloor)/g
    let floorTypeDwellingReg = /\D{12} (?=Dwelling \d.NA\/)/g;
    let floorNameRoofReg = /Dwelling \d.NA\/(.*\s)(?=RoomFloor)/g
    let floorTypeRoofReg = /Roof/;
    let floorNameAtticReg = /Dwelling \d.NA\/(.*\s)(?=RoomFloor)/g
    let floorTypeAtticReg = /\D{20} (?=Dwelling \d.NA\/)/g;
    let roomsReg = /\D{1,16}-\d\d/gm;
    let floorName;
    let floorType;
    for (let i = 1; i < formattedText.length - 1; i++) {
      if (formattedText[i].includes("Other Structure")) {
        floorName = formattedText[i].match(floorNameOtherReg);
        floorType = formattedText[i].match(floorTypeOtherReg);
      } else if (formattedText[i].includes("Attic")) {
        floorName = formattedText[i].match(floorNameAtticReg);
        floorType = formattedText[i].match(floorTypeAtticReg);
      }else if (formattedText[i].includes("Roof")) {
        floorName = formattedText[i].match(floorNameRoofReg);
        floorType = formattedText[i].match(floorTypeRoofReg);
        console.log(floorName, floorType);
      }
       else {
        floorName = formattedText[i].match(floorNameDwellingReg);
        floorType = formattedText[i].match(floorTypeDwellingReg);
      }
      const rooms = formattedText[i].match(roomsReg);
      try {
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
      } catch (err) {
        console.log('Неправильний тип репорту');
      }
    }
    setFloors((floors) => [...floors, ...floorsArr]);
    return floorsArr;
  }