import { useEffect, useRef, useState } from "react";
import ListOfRooms from "./components/ListOfRooms";
import { URL } from "./utils/constants";
import "./App.css";
import MainInfo from "./components/MainInfo";
import { Button, Col, Row, Upload } from "antd";
import {
  UploadOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";

function App() {
  const [resultText, setResultText] = useState();
  const [fileList, setFileList] = useState([]);
  const inputPdf = useRef();

  const handleUpload = () => {
    setFileList([]);
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("pdfFile", fileList[0]);
    });
    fetch(URL, {
      method: "post",
      body: formData,
    })
      .then((res) => {
        return res.text();
      })
      .then((extractedText) => {
        setResultText(extractedText.replace(/(\r\n|\n|\r)/gm, " "));
        textformatter(extractedText);
      });
  };

  const textformatter = (text) => {
    if (!text) {
      return "...";
    }
    const mainInfoObj = {};
    const formattedText = text.replace(/(\r\n|\n|\r)/gm, " ");
    // шапка репорта
    let addressReg = /(?<=Property Report - )(.*)(?= Report Generated)/gm;
    let areaReg = /Living Area: \d{2,7}ft./gm;
    let floorReg = /\d{1,2}.Floors/gm;
    let bedroomsReg = /\d{1,2}.Bedrooms/gm;
    let bathesReg = /(?<=Bedrooms)(.*)Bathrooms/gm;
    mainInfoObj.address = formattedText
      .split("Floor Area")[0]
      .match(addressReg);
    mainInfoObj.area = formattedText.split("Floor Area")[0].match(areaReg);
    mainInfoObj.floors = formattedText.split("Floor Area")[0].match(floorReg);
    mainInfoObj.bedrooms = formattedText
      .split("Floor Area")[0]
      .match(bedroomsReg);
    mainInfoObj.bathes = formattedText.split("Floor Area")[0].match(bathesReg);

    // первый этаж
    let floorNameOtherReg = /Other Structure \d\/(.*)(?= RoomFloor)/;
    let floorNameDwellingReg = /Dwelling \d\/(.*)(?= RoomFloor)/;
    let roomsReg = /\D{1,15}-\d\d/gm;
    let floorName;
    if (formattedText.includes("Structure - Other Structure")) {
      floorName = formattedText.split("Floor Area")[1].match(floorNameOtherReg);
    }
    if (formattedText.includes("Structure - Dwelling")) {
      floorName = formattedText
        .split("Floor Area")[1]
        .match(floorNameDwellingReg);
    }
    const rooms = formattedText.split("Floor Area")[1].match(roomsReg);
    return mainInfoObj;
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  // const borderStyle = resultText
  //   ? { borderBottom: "1px solid gray", paddingBottom: "20px" }
  //   : {};
  const borderStyle = { paddingBottom: "20px" };
  return (
    <div className="wrapper">
      <div className="sidebar">
        <div className="uploadField">
        <Upload
          {...props}
          listType="picture-card"
          className="avatar-uploader"
          name="avatar"
        >
          <div>
            <PlusOutlined />
            <div
              style={{
                marginTop: 8,
              }}
            >
              PDF File
            </div>
          </div>
        </Upload>
        <Button
          type="primary"
          onClick={handleUpload}
          style={{ width: "102px" }}
        >
          Upload
        </Button>
        </div>
        <div className="info"><MainInfo text={resultText} /></div>
      </div>
      <div className="content">
      <ListOfRooms text={resultText} />
      </div>
    </div>
    // <div>
    //   <div style={{ margin: "10px 10px", display: "flex"}}>
    //     <div style={{ position: "absolute", left: "20px" }}>
    //       <Upload
    //         {...props}
    //         listType="picture-card"
    //         className="avatar-uploader"
    //         name="avatar"
    //       >
    //         <div>
    //           <PlusOutlined />
    //           <div
    //             style={{
    //               marginTop: 8,
    //             }}
    //           >
    //             PDF File
    //           </div>
    //         </div>
    //       </Upload>
    //       <Button
    //         type="primary"
    //         onClick={handleUpload}
    //         style={{ width: "102px" }}
    //       >
    //         Upload
    //       </Button>
    //     </div>
    //       <MainInfo text={resultText} />
    //     <div>

    //     </div>
    //   </div>
    //   <div>
    //     <ListOfRooms text={resultText} />
    //   </div>
    // </div>
  );
}

export default App;
