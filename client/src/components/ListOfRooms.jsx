import React, { useEffect, useState } from "react";
import { Col, List, Row, Typography } from "antd";
import {
  listOfDwellingRooms,
  listOfOtherStructureRooms,
} from "../utils/constants";
import '../App.css'

const { Text } = Typography;

const ListOfRooms = ({ text }) => {
  const [floors, setFloors] = useState([]);
  const formattedText = text ? text.split("Floor Area") : "";

  useEffect(() => {
    setFloors([]);
    getAllRooms();
  }, [text]);

  function getAllRooms() {
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

  function floorNameChecker(floor) {
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
  }

  function floorTypeChecker(floor, type) {
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
  }

  function roomNumbersChecker(room, arr, floorName) {
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

  return (
    <div className="listOfFloors">
        {floors.map((item, i) => {
          const floorName = item[0];
          const floorType = item[1];
          const floorNameChecked = floorNameChecker(floorName);
          const floorTypeChecked = floorTypeChecker(floorName, floorType);
          const floorsNumber = floors.length;
          return (
              <List
                style={{ width: `${100 / floorsNumber}%`, maxWidth: '300px'}}
                header={
                  <div>
                    <div>
                      <Text strong type={floorNameChecked}>
                        {floorName}
                      </Text>
                    </div>
                    <div>
                      <Text strong type={floorTypeChecked}>
                        {floorType}
                      </Text>
                    </div>
                  </div>
                }
                bordered
                size="small"
                dataSource={item.filter(
                  (value, index) => index !== 0 && index !== 1
                )}
                renderItem={(room) => {
                  const isIssue = roomNumbersChecker(room, floors, floorName);
                  let color = "black";
                  if (isIssue !== undefined) {
                    room = `${room} (${roomNumbersChecker(
                      room,
                      floors,
                      floorName
                    )})`;
                    color = "red";
                  }
                  return <List.Item style={{ color: color }}>{room}</List.Item>;
                }}
              ></List>
          );
        })}
    </div>
  );
};

export default ListOfRooms;
