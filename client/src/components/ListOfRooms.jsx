import React, { useEffect, useState } from "react";
import { getRoomsArr } from "../utils/getRoomsArr";
import { floorNameChecker, floorTypeChecker, roomNumbersChecker} from "../utils/checkers";
import { List, Typography } from "antd";
import {v4 as uuidv4} from 'uuid';
import '../App.css'

const { Text } = Typography;

const ListOfRooms = ({ text }) => {
  const [floors, setFloors] = useState([]);
  const formattedText = text ? text.split("Floor Area") : "";

  useEffect(() => {
    setFloors([]);
    getRoomsArr(formattedText, setFloors);
  }, [text]);

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
              key={uuidv4()}
                style={{ width: `${100 / floorsNumber}%`, maxWidth: '300px'}}
                header={
                  <div >
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
